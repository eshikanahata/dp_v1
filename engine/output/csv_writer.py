"""
CSVWriter — writes output CSVs for flagged moments, trip summaries, and decision logs.

Single Responsibility: Serialize dataclass instances and dict lists to correctly-shaped CSV files.
"""

import os
import logging
from datetime import datetime
from dataclasses import asdict
from typing import List, Dict

import pandas as pd

from engine.entities.stress_moment import StressMoment
from engine.entities.trip_summary import TripSummary

logger = logging.getLogger(__name__)


class CSVWriter:
    """Writes structured output CSVs with schema metadata."""

    def write_flagged_moments(self, moments: List[StressMoment], output_dir: str) -> str:
        """Write flagged_moments.csv with all StressMoment fields."""
        os.makedirs(output_dir, exist_ok=True)
        path = os.path.join(output_dir, "flagged_moments.csv")

        now = datetime.utcnow().isoformat()
        records = []
        for m in moments:
            d = asdict(m)
            d["schema_version"] = "v1"
            d["system_version"] = "v1.0"
            if not d.get("generated_at"):
                d["generated_at"] = now
            records.append(d)

        if records:
            df = pd.DataFrame(records)
        else:
            # Empty but correct schema
            df = pd.DataFrame(columns=[
                "flag_id", "trip_id", "driver_id", "timestamp", "elapsed_seconds",
                "event_type", "severity", "motion_score", "audio_score",
                "combined_score", "confidence", "explanation", "context",
                "schema_version", "system_version", "generated_at",
            ])

        df.to_csv(path, index=False)
        logger.info("Wrote %d flagged moments to %s", len(df), path)
        return path

    def write_trip_summaries(self, summaries: List[TripSummary], output_dir: str) -> str:
        """Write trip_summaries.csv with all TripSummary fields."""
        os.makedirs(output_dir, exist_ok=True)
        path = os.path.join(output_dir, "trip_summaries.csv")

        now = datetime.utcnow().isoformat()
        records = []
        for s in summaries:
            d = asdict(s)
            d["schema_version"] = "v1"
            d["system_version"] = "v1.0"
            if not d.get("generated_at"):
                d["generated_at"] = now
            records.append(d)

        if records:
            df = pd.DataFrame(records)
        else:
            df = pd.DataFrame(columns=[
                "trip_id", "driver_id", "date", "duration_min", "distance_km",
                "fare", "motion_events_count", "audio_events_count",
                "flagged_moments_count", "max_severity", "stress_score",
                "earnings_velocity", "goal_status", "trip_quality_rating",
                "schema_version", "system_version", "generated_at",
            ])

        df.to_csv(path, index=False)
        logger.info("Wrote %d trip summaries to %s", len(df), path)
        return path

    def write_structured_log(self, log_entries: List[Dict], output_dir: str) -> str:
        """Write decision_log.csv — one row per detection decision for traceability."""
        os.makedirs(output_dir, exist_ok=True)
        path = os.path.join(output_dir, "decision_log.csv")

        columns = [
            "timestamp", "trip_id", "driver_id", "signal_type",
            "raw_value", "threshold", "rule_id", "event_label", "notes",
        ]

        if log_entries:
            df = pd.DataFrame(log_entries)
            # Ensure all columns present
            for col in columns:
                if col not in df.columns:
                    df[col] = ""
            df = df[columns]
        else:
            df = pd.DataFrame(columns=columns)

        df.to_csv(path, index=False)
        logger.info("Wrote %d decision log entries to %s", len(df), path)
        return path
