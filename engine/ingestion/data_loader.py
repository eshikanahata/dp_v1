"""
DataLoader — loads and normalizes all CSV data files for the Driver Pulse pipeline.

Single Responsibility: Load raw CSVs, normalize column names, handle timestamps,
deduplicate, winsorize outliers, and produce clean DataFrames.
"""

import os
import json
import logging
import warnings
from datetime import datetime

import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Column alias map — maps known variant names to canonical names
# ---------------------------------------------------------------------------
COLUMN_ALIASES = {
    # accelerometer
    "x": "ax", "accel_x": "ax", "acceleration_x": "ax",
    "y": "ay", "accel_y": "ay", "acceleration_y": "ay",
    "z": "az", "accel_z": "az", "acceleration_z": "az",
    # audio
    "db": "audio_level_db", "level": "audio_level_db",
    "intensity": "audio_level_db", "audio_db": "audio_level_db",
    # timestamps
    "time": "timestamp", "ts": "timestamp", "datetime": "timestamp",
    # trips
    "start_time": "pickup_time", "end_time": "drop_time",
    "start_ts": "pickup_time", "end_ts": "drop_time",
}

# ---------------------------------------------------------------------------
# Files to load with their expected names
# ---------------------------------------------------------------------------
FILE_MAP = {
    "trips": "trips.csv",
    "drivers": "drivers.csv",
    "accel": "accelerometer_data.csv",
    "audio": "audio_intensity_data.csv",
    "earnings": "earnings_velocity_log.csv",
    "goals": "driver_goals.csv",
}

# Columns used for deduplication per sensor file
DEDUP_KEYS = {
    "accel": ["trip_id", "timestamp"],
    "audio": ["trip_id", "timestamp"],
}

# Timestamp columns to parse in each file
TIMESTAMP_COLS = {
    "trips": ["date"],
    "accel": ["timestamp"],
    "audio": ["timestamp"],
    "earnings": ["timestamp", "date"],
    "goals": ["date"],
}


def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Map variant column names to canonical names."""
    df.columns = [
        COLUMN_ALIASES.get(c.lower().strip(), c.lower().strip())
        for c in df.columns
    ]
    return df


class DataLoader:
    """Loads all 6 CSV data files, normalizes, cleans, and returns a dict of DataFrames."""

    def load_all(self, data_dir: str) -> dict:
        """Load and clean every CSV.

        Returns dict with keys: trips, drivers, accel, audio, earnings, goals.
        Also writes outputs/data_quality_report.json.
        """
        quality_report: dict = {}
        result: dict = {}

        for key, filename in FILE_MAP.items():
            path = os.path.join(data_dir, filename)
            if not os.path.exists(path):
                logger.warning("File not found: %s — returning empty DataFrame for '%s'", path, key)
                result[key] = pd.DataFrame()
                quality_report[key] = {"rows_loaded": 0, "file_missing": True}
                continue

            df = pd.read_csv(path)
            rows_loaded = len(df)
            df = normalize_columns(df)

            # --- Parse timestamps ---
            nulls_found = 0
            for col in TIMESTAMP_COLS.get(key, []):
                if col in df.columns:
                    df[col] = pd.to_datetime(df[col], errors="coerce")
                    nulls_found += int(df[col].isna().sum())
                    # Convert timezone-naive to UTC
                    if df[col].dt.tz is None:
                        df[col] = df[col].dt.tz_localize("UTC", ambiguous="NaT", nonexistent="NaT")

            # --- Deduplicate ---
            dups_dropped = 0
            dedup_cols = DEDUP_KEYS.get(key)
            if dedup_cols:
                valid_cols = [c for c in dedup_cols if c in df.columns]
                if valid_cols:
                    before = len(df)
                    df = df.drop_duplicates(subset=valid_cols)
                    dups_dropped = before - len(df)

            # --- Sort by timestamp ---
            if "timestamp" in df.columns:
                df = df.sort_values("timestamp").reset_index(drop=True)

            # --- Winsorize accelerometer outliers at 99.5th percentile ---
            outliers_clipped = 0
            if key == "accel":
                for axis in ["ax", "ay", "az"]:
                    if axis in df.columns:
                        cap = df[axis].quantile(0.995)
                        floor = df[axis].quantile(0.005)
                        clipped = ((df[axis] > cap) | (df[axis] < floor)).sum()
                        outliers_clipped += int(clipped)
                        df[axis] = df[axis].clip(lower=floor, upper=cap)

            result[key] = df
            quality_report[key] = {
                "rows_loaded": rows_loaded,
                "duplicates_dropped": dups_dropped,
                "nulls_found": nulls_found,
                "outliers_clipped": outliers_clipped,
            }
            logger.info("Loaded %s: %d rows (%d dups dropped, %d nulls, %d outliers clipped)",
                        key, rows_loaded, dups_dropped, nulls_found, outliers_clipped)

        # Write quality report
        output_dir = os.path.join(os.path.dirname(data_dir.rstrip("/\\")), "outputs")
        os.makedirs(output_dir, exist_ok=True)
        report_path = os.path.join(output_dir, "data_quality_report.json")
        with open(report_path, "w") as f:
            json.dump(quality_report, f, indent=2)
        logger.info("Data quality report written to %s", report_path)

        return result
