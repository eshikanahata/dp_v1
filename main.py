"""
Driver Pulse — main pipeline orchestrator.

Runs the full analytics pipeline end-to-end:
  1. Load & clean data
  2. Map sensors → trips
  3. Detect motion events
  4. Detect audio events
  5. Fuse into StressMoments
  6. Compute earnings velocity & goal status
  7. Build trip summaries
  8. Write output CSVs
"""

import os
import sys
import logging
from datetime import datetime
from typing import List, Dict

from engine.ingestion.data_loader import DataLoader
from engine.ingestion.trip_mapper import TripMapper
from engine.detection.motion_detector import MotionDetector
from engine.detection.audio_detector import AudioDetector
from engine.fusion.fusion_engine import FusionEngine
from engine.analytics.earnings_engine import EarningsEngine
from engine.output.csv_writer import CSVWriter
from engine.entities.stress_moment import StressMoment
from engine.entities.trip_summary import TripSummary

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
)
logger = logging.getLogger("driverpulse")


def build_trip_summaries(
    trips_df,
    stress_moments: List[StressMoment],
    motion_events: List[Dict],
    audio_events: List[Dict],
    velocity_data: Dict,
    goal_data: Dict,
) -> List[TripSummary]:
    """Aggregate per-trip summaries from all pipeline outputs."""
    now_iso = datetime.utcnow().isoformat()
    summaries = []

    if trips_df.empty:
        return summaries

    # Index moments by trip
    moments_by_trip: Dict[str, List[StressMoment]] = {}
    for m in stress_moments:
        moments_by_trip.setdefault(m.trip_id, []).append(m)

    # Index motion and audio events by trip
    motion_by_trip: Dict[str, int] = {}
    for ev in motion_events:
        tid = ev.get("trip_id", "")
        if ev.get("event_label") != "UNSTABLE_SEGMENT":
            motion_by_trip[tid] = motion_by_trip.get(tid, 0) + 1

    audio_by_trip: Dict[str, int] = {}
    for ev in audio_events:
        tid = ev.get("trip_id", "")
        audio_by_trip[tid] = audio_by_trip.get(tid, 0) + 1

    for _, row in trips_df.iterrows():
        trip_id = row.get("trip_id", "")
        driver_id = row.get("driver_id", "UNKNOWN")
        date_val = row.get("date", "")
        if hasattr(date_val, "strftime"):
            date_str = date_val.strftime("%Y-%m-%d")
        else:
            date_str = str(date_val)

        duration_min = float(row.get("duration_min", 0))
        distance_km = float(row.get("distance_km", 0))
        fare = float(row.get("fare", 0))

        moments_for_trip = moments_by_trip.get(trip_id, [])
        motion_count = motion_by_trip.get(trip_id, 0)
        audio_count = audio_by_trip.get(trip_id, 0)
        flagged_count = len(moments_for_trip)

        # Max severity
        severity_order = {"HIGH": 3, "MEDIUM": 2, "LOW": 1, "NONE": 0}
        if moments_for_trip:
            max_sev = max(moments_for_trip, key=lambda m: severity_order.get(m.severity, 0)).severity
        else:
            max_sev = "NONE"

        # Stress score (mean combined_score)
        if moments_for_trip:
            stress_score = sum(m.combined_score for m in moments_for_trip) / len(moments_for_trip)
        else:
            stress_score = 0.0

        # Trip quality rating
        if stress_score >= 60 or flagged_count >= 3:
            quality = "STRESSFUL"
        elif stress_score >= 30 or flagged_count >= 1:
            quality = "MODERATE"
        else:
            quality = "SMOOTH"

        # Earnings velocity & goal status for this driver
        vel = velocity_data.get(driver_id, {})
        goal = goal_data.get(driver_id, {})
        earnings_velocity = vel.get("pace_now", 0.0)
        g_status = goal.get("goal_status", "ON_TRACK")

        summaries.append(TripSummary(
            trip_id=trip_id,
            driver_id=driver_id,
            date=date_str,
            duration_min=round(duration_min, 1),
            distance_km=round(distance_km, 1),
            fare=round(fare, 2),
            motion_events_count=motion_count,
            audio_events_count=audio_count,
            flagged_moments_count=flagged_count,
            max_severity=max_sev,
            stress_score=round(stress_score, 2),
            earnings_velocity=round(earnings_velocity, 2),
            goal_status=g_status,
            trip_quality_rating=quality,
            generated_at=now_iso,
        ))

    return summaries


def run_pipeline(data_dir: str = "data/", output_dir: str = "outputs/"):
    """Execute the full Driver Pulse pipeline."""
    logger.info("=" * 60)
    logger.info("Driver Pulse pipeline starting")
    logger.info("=" * 60)

    # 1. Load data
    loader = DataLoader()
    data = loader.load_all(data_dir)
    logger.info("Data loaded: %s", {k: len(v) for k, v in data.items()})

    # 2. Map sensors to trips
    mapper = TripMapper()
    accel_mapped, audio_mapped = mapper.map_sensors_to_trips(
        data["accel"], data["audio"], data["trips"]
    )

    # 3. Detect motion events
    motion_detector = MotionDetector()
    motion_events = motion_detector.detect(accel_mapped)
    logger.info("Motion events detected: %d", len(motion_events))

    # 4. Detect audio events
    audio_detector = AudioDetector()
    audio_events = audio_detector.detect(audio_mapped)
    logger.info("Audio events detected: %d", len(audio_events))

    # 5. Fuse into stress moments
    fusion = FusionEngine()
    stress_moments = fusion.fuse(motion_events, audio_events, data["trips"])
    logger.info("Stress moments created: %d", len(stress_moments))

    # 6. Compute earnings
    earnings_engine = EarningsEngine()
    velocity_data = earnings_engine.compute_velocity(data["earnings"], data["goals"])
    goal_data = earnings_engine.compute_goal_status(velocity_data, data["goals"])

    # 7. Build trip summaries
    trip_summaries = build_trip_summaries(
        data["trips"], stress_moments, motion_events, audio_events,
        velocity_data, goal_data,
    )
    logger.info("Trip summaries built: %d", len(trip_summaries))

    # 8. Write outputs
    # Collect decision log from all stages
    log_entries = []
    # Motion detection decisions
    for ev in motion_events:
        log_entries.append({
            "timestamp": datetime.utcnow().isoformat(),
            "trip_id": ev.get("trip_id", ""),
            "driver_id": ev.get("driver_id", ""),
            "signal_type": "MOTION",
            "raw_value": ev.get("raw_peak_value", 0),
            "threshold": ev.get("threshold_used", 0),
            "rule_id": "MOTION_DETECT",
            "event_label": ev.get("event_label", ""),
            "notes": f"severity_score={ev.get('severity_score', 0)}",
        })
    # Audio detection decisions
    for ev in audio_events:
        log_entries.append({
            "timestamp": datetime.utcnow().isoformat(),
            "trip_id": ev.get("trip_id", ""),
            "driver_id": ev.get("driver_id", ""),
            "signal_type": "AUDIO",
            "raw_value": ev.get("peak_db", 0),
            "threshold": ev.get("threshold_db", 0),
            "rule_id": "AUDIO_DETECT",
            "event_label": ev.get("audio_type", ""),
            "notes": f"intensity_score={ev.get('intensity_score', 0)}",
        })
    # Fusion decisions
    log_entries.extend(fusion.decision_log)

    writer = CSVWriter()
    writer.write_flagged_moments(stress_moments, output_dir)
    writer.write_trip_summaries(trip_summaries, output_dir)
    writer.write_structured_log(log_entries, output_dir)

    logger.info("=" * 60)
    logger.info(
        "Pipeline complete. %d moments flagged across %d trips.",
        len(stress_moments), len(trip_summaries),
    )
    logger.info("=" * 60)

    return stress_moments, trip_summaries


if __name__ == "__main__":
    run_pipeline()
