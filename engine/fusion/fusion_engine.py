"""
FusionEngine — fuses motion and audio events into StressMoments with
fairness filtering, causality detection, and human-readable explanations.

Single Responsibility: Combine motion + audio detections into unified,
scored, and explained stress moments.
"""

import logging
from datetime import datetime
from typing import List, Dict, Optional

import pandas as pd

from engine.entities.stress_moment import StressMoment

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Fusion parameters — named constants
# ---------------------------------------------------------------------------
TEMPORAL_OVERLAP_SEC = 10.0          # events within 10 s are considered overlapping
MOTION_WEIGHT = 0.6
AUDIO_WEIGHT = 0.4

# Confidence bases
CONF_COMBINED = 0.85
CONF_MOTION_ONLY = 0.70
CONF_AUDIO_ONLY = 0.60

# Fairness filters
BOUNDARY_SEC = 30.0                  # first/last 30 s of trip
BOUNDARY_CONF_MULT = 0.7
SHORT_TRIP_SEC = 120.0               # trips under 2 min
SHORT_TRIP_CONF_MULT = 0.8
LOW_AUDIO_THRESHOLD = 20.0           # if audio_score < 20, reduce confidence
LOW_AUDIO_CONF_REDUCTION = 0.15

# Severity thresholds
SEVERITY_HIGH = 70.0
SEVERITY_MEDIUM = 40.0


class FusionEngine:
    """Fuses motion and audio detections into StressMoments with scoring and explanations."""

    def __init__(self):
        self._decision_log: List[Dict] = []

    @property
    def decision_log(self) -> List[Dict]:
        """Return accumulated decision log entries."""
        return self._decision_log

    def fuse(
        self,
        motion_events: List[Dict],
        audio_events: List[Dict],
        trips_df: pd.DataFrame,
    ) -> List[StressMoment]:
        """Fuse motion + audio events into a list of StressMoments."""
        now_iso = datetime.utcnow().isoformat()
        self._decision_log = []

        # Build trip duration lookup
        trip_durations = self._get_trip_durations(trips_df)

        # Group events by trip
        motion_by_trip: Dict[str, List[Dict]] = {}
        audio_by_trip: Dict[str, List[Dict]] = {}

        for ev in motion_events:
            tid = ev.get("trip_id", "")
            if tid and tid != "UNMAPPED":
                motion_by_trip.setdefault(tid, []).append(ev)

        for ev in audio_events:
            tid = ev.get("trip_id", "")
            if tid and tid != "UNMAPPED":
                audio_by_trip.setdefault(tid, []).append(ev)

        all_trip_ids = set(list(motion_by_trip.keys()) + list(audio_by_trip.keys()))
        moments: List[StressMoment] = []
        idx_counter = 0

        for trip_id in sorted(all_trip_ids):
            m_events = motion_by_trip.get(trip_id, [])
            a_events = audio_by_trip.get(trip_id, [])
            trip_dur = trip_durations.get(trip_id, 9999.0)

            # Match overlapping pairs
            used_audio = set()
            used_motion = set()
            combined_pairs = []

            for mi, mev in enumerate(m_events):
                for ai, aev in enumerate(a_events):
                    if ai in used_audio:
                        continue
                    if self._events_overlap(mev, aev):
                        combined_pairs.append((mi, ai, mev, aev))
                        used_audio.add(ai)
                        used_motion.add(mi)
                        break

            # COMBINED moments
            for mi, ai, mev, aev in combined_pairs:
                idx_counter += 1
                moment = self._create_combined_moment(
                    trip_id, mev, aev, idx_counter, trip_dur, now_iso
                )
                moments.append(moment)

            # MOTION_ONLY moments
            for mi, mev in enumerate(m_events):
                if mi in used_motion:
                    continue
                # Skip cluster labels for moment creation
                if mev.get("event_label") == "UNSTABLE_SEGMENT":
                    continue
                idx_counter += 1
                moment = self._create_motion_only_moment(
                    trip_id, mev, idx_counter, trip_dur, now_iso
                )
                moments.append(moment)

            # AUDIO_ONLY moments
            for ai, aev in enumerate(a_events):
                if ai in used_audio:
                    continue
                idx_counter += 1
                moment = self._create_audio_only_moment(
                    trip_id, aev, idx_counter, trip_dur, now_iso
                )
                moments.append(moment)

        logger.info("FusionEngine: %d StressMoments created", len(moments))
        return moments

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------
    def _events_overlap(self, ev1: Dict, ev2: Dict) -> bool:
        """Check if two events overlap or are within TEMPORAL_OVERLAP_SEC."""
        try:
            s1 = pd.Timestamp(ev1.get("start_ts") or ev1.get("peak_ts"))
            e1 = pd.Timestamp(ev1.get("end_ts") or ev1.get("peak_ts"))
            s2 = pd.Timestamp(ev2.get("start_ts") or ev2.get("peak_ts"))
            e2 = pd.Timestamp(ev2.get("end_ts") or ev2.get("peak_ts"))

            # Direct overlap
            if s1 <= e2 and s2 <= e1:
                return True

            # Within tolerance
            gap = min(abs((s1 - e2).total_seconds()), abs((s2 - e1).total_seconds()))
            return gap <= TEMPORAL_OVERLAP_SEC
        except Exception:
            return False

    def _get_trip_durations(self, trips_df: pd.DataFrame) -> Dict[str, float]:
        """Extract trip durations in seconds from trips DataFrame."""
        durations = {}
        if trips_df.empty:
            return durations

        for _, row in trips_df.iterrows():
            tid = row.get("trip_id", "")
            dur_min = row.get("duration_min", 0)
            try:
                durations[tid] = float(dur_min) * 60.0
            except (ValueError, TypeError):
                durations[tid] = 9999.0
        return durations

    def _classify_severity(self, score: float) -> str:
        if score >= SEVERITY_HIGH:
            return "HIGH"
        elif score >= SEVERITY_MEDIUM:
            return "MEDIUM"
        else:
            return "LOW"

    def _apply_fairness(
        self, confidence: float, elapsed: float, trip_dur: float,
        audio_score: float, event_type: str
    ) -> tuple:
        """Apply fairness filters. Returns (adjusted_confidence, context_parts)."""
        context_parts = []

        # Near trip boundary
        if elapsed <= BOUNDARY_SEC or (trip_dur - elapsed) <= BOUNDARY_SEC:
            confidence *= BOUNDARY_CONF_MULT
            context_parts.append("near_trip_boundary")

        # Short trip
        if trip_dur < SHORT_TRIP_SEC:
            confidence *= SHORT_TRIP_CONF_MULT
            context_parts.append("short_trip")

        # Motion detected but low audio
        if event_type in ("MOTION_ONLY", "COMBINED") and audio_score < LOW_AUDIO_THRESHOLD:
            confidence -= LOW_AUDIO_CONF_REDUCTION
            context_parts.append("low_audio_likely_traffic")

        confidence = max(0.0, min(1.0, confidence))
        return confidence, context_parts

    def _causality(self, motion_peak_ts, audio_peak_ts) -> str:
        """Determine causality type for COMBINED events."""
        try:
            mts = pd.Timestamp(motion_peak_ts)
            ats = pd.Timestamp(audio_peak_ts)
            diff = (mts - ats).total_seconds()

            if abs(diff) <= 1.0:
                return "SIMULTANEOUS"
            elif diff < 0:
                return "TRAFFIC_FIRST"
            else:
                return "CABIN_FIRST"
        except Exception:
            return "UNKNOWN"

    def _create_combined_moment(
        self, trip_id: str, mev: Dict, aev: Dict,
        idx: int, trip_dur: float, now_iso: str
    ) -> StressMoment:
        motion_score = mev.get("severity_score", 0.0)
        audio_score = aev.get("intensity_score", 0.0)
        combined_score = MOTION_WEIGHT * motion_score + AUDIO_WEIGHT * audio_score
        severity = self._classify_severity(combined_score)
        elapsed = mev.get("elapsed_seconds", 0.0)

        confidence = CONF_COMBINED
        confidence, ctx_parts = self._apply_fairness(
            confidence, elapsed, trip_dur, audio_score, "COMBINED"
        )

        # Causality
        causality = self._causality(mev.get("peak_ts"), aev.get("peak_ts"))
        ctx_parts.append(causality)
        context_str = "; ".join(ctx_parts) if ctx_parts else "normal"

        # Explanation
        motion_val = mev.get("raw_peak_value", 0.0)
        audio_db = aev.get("peak_db", 0.0)
        if causality == "TRAFFIC_FIRST":
            explanation = (
                f"Combined stress moment: sharp motion (jerk {motion_val:.1f}) "
                f"followed by elevated audio ({audio_db:.0f}dB). Pattern: Traffic-first escalation."
            )
        elif causality == "CABIN_FIRST":
            explanation = (
                f"Combined stress moment: audio spike ({audio_db:.0f}dB) "
                f"followed by sharp motion (jerk {motion_val:.1f}). Pattern: Cabin-first escalation."
            )
        else:
            explanation = (
                f"Combined stress moment: simultaneous motion (jerk {motion_val:.1f}) "
                f"and audio ({audio_db:.0f}dB) detected."
            )

        if "near_trip_boundary" in ctx_parts:
            explanation += " Confidence reduced: event near trip boundary."

        peak_ts = mev.get("peak_ts", aev.get("peak_ts"))
        ts_str = str(peak_ts) if peak_ts else ""
        driver_id = mev.get("driver_id", aev.get("driver_id", "UNKNOWN"))

        self._log_decision(trip_id, driver_id, "COMBINED", combined_score, severity, confidence)

        return StressMoment(
            flag_id=f"FM-{trip_id}-{idx:03d}",
            trip_id=trip_id,
            driver_id=driver_id,
            timestamp=ts_str,
            elapsed_seconds=elapsed,
            event_type="COMBINED",
            severity=severity,
            motion_score=round(motion_score, 2),
            audio_score=round(audio_score, 2),
            combined_score=round(combined_score, 2),
            confidence=round(confidence, 4),
            explanation=explanation,
            context=context_str,
            generated_at=now_iso,
        )

    def _create_motion_only_moment(
        self, trip_id: str, mev: Dict, idx: int,
        trip_dur: float, now_iso: str
    ) -> StressMoment:
        motion_score = mev.get("severity_score", 0.0)
        combined_score = motion_score  # no audio component
        severity = self._classify_severity(combined_score)
        elapsed = mev.get("elapsed_seconds", 0.0)
        driver_id = mev.get("driver_id", "UNKNOWN")

        confidence = CONF_MOTION_ONLY
        confidence, ctx_parts = self._apply_fairness(
            confidence, elapsed, trip_dur, 0.0, "MOTION_ONLY"
        )
        context_str = "; ".join(ctx_parts) if ctx_parts else "normal"

        raw_val = mev.get("raw_peak_value", 0.0)
        threshold = mev.get("threshold_used", 0.0)
        label = mev.get("event_label", "MOTION")

        if label == "HARSH_BRAKE":
            explanation = (
                f"Harsh braking detected: peak jerk {raw_val:.1f} m/s³ "
                f"exceeded threshold {threshold:.1f}. Duration: {0.5:.1f}s."
            )
        elif label == "HARSH_ACCEL":
            explanation = (
                f"Harsh acceleration detected: peak jerk {raw_val:.1f} m/s³ "
                f"exceeded threshold {threshold:.1f}."
            )
        else:
            explanation = (
                f"Sharp maneuver detected: magnitude {raw_val:.1f} m/s² "
                f"exceeded threshold {threshold:.1f}."
            )

        if "near_trip_boundary" in ctx_parts:
            explanation += " Confidence reduced: event near trip boundary."

        peak_ts = mev.get("peak_ts")
        ts_str = str(peak_ts) if peak_ts else ""

        self._log_decision(trip_id, driver_id, "MOTION_ONLY", combined_score, severity, confidence)

        return StressMoment(
            flag_id=f"FM-{trip_id}-{idx:03d}",
            trip_id=trip_id,
            driver_id=driver_id,
            timestamp=ts_str,
            elapsed_seconds=elapsed,
            event_type="MOTION_ONLY",
            severity=severity,
            motion_score=round(motion_score, 2),
            audio_score=0.0,
            combined_score=round(combined_score, 2),
            confidence=round(confidence, 4),
            explanation=explanation,
            context=context_str,
            generated_at=now_iso,
        )

    def _create_audio_only_moment(
        self, trip_id: str, aev: Dict, idx: int,
        trip_dur: float, now_iso: str
    ) -> StressMoment:
        audio_score = aev.get("intensity_score", 0.0)
        combined_score = audio_score
        severity = self._classify_severity(combined_score)
        elapsed = aev.get("elapsed_seconds", 0.0)
        driver_id = aev.get("driver_id", "UNKNOWN")

        confidence = CONF_AUDIO_ONLY
        confidence, ctx_parts = self._apply_fairness(
            confidence, elapsed, trip_dur, audio_score, "AUDIO_ONLY"
        )
        context_str = "; ".join(ctx_parts) if ctx_parts else "normal"

        peak_db = aev.get("peak_db", 0.0)
        threshold_db = aev.get("threshold_db", 0.0)
        audio_type = aev.get("audio_type", "SPIKE")

        if audio_type == "SPIKE":
            explanation = (
                f"Audio spike detected: {peak_db:.0f}dB exceeded threshold {threshold_db:.0f}dB."
            )
        else:
            explanation = (
                f"Sustained high audio: {peak_db:.0f}dB maintained above "
                f"{threshold_db:.0f}dB for extended period."
            )

        if "near_trip_boundary" in ctx_parts:
            explanation += " Confidence reduced: event near trip boundary."

        peak_ts = aev.get("peak_ts")
        ts_str = str(peak_ts) if peak_ts else ""

        self._log_decision(trip_id, driver_id, "AUDIO_ONLY", combined_score, severity, confidence)

        return StressMoment(
            flag_id=f"FM-{trip_id}-{idx:03d}",
            trip_id=trip_id,
            driver_id=driver_id,
            timestamp=ts_str,
            elapsed_seconds=elapsed,
            event_type="AUDIO_ONLY",
            severity=severity,
            motion_score=0.0,
            audio_score=round(audio_score, 2),
            combined_score=round(combined_score, 2),
            confidence=round(confidence, 4),
            explanation=explanation,
            context=context_str,
            generated_at=now_iso,
        )

    def _log_decision(self, trip_id, driver_id, signal_type, score, severity, confidence):
        self._decision_log.append({
            "timestamp": datetime.utcnow().isoformat(),
            "trip_id": trip_id,
            "driver_id": driver_id,
            "signal_type": signal_type,
            "raw_value": round(score, 2),
            "threshold": f"H≥{SEVERITY_HIGH},M≥{SEVERITY_MEDIUM}",
            "rule_id": "FUSION_CLASSIFY",
            "event_label": severity,
            "notes": f"confidence={confidence:.4f}",
        })
