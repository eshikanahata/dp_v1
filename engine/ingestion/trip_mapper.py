"""
TripMapper — maps sensor rows to their corresponding trips by time range.

Single Responsibility: For each sensor reading, determine which trip it belongs to
by matching driver_id and checking if the sensor timestamp falls within the trip window.
"""

import logging

import pandas as pd

logger = logging.getLogger(__name__)


class TripMapper:
    """Maps accelerometer and audio readings to trips using time-range matching."""

    def map_sensors_to_trips(
        self,
        accel_df: pd.DataFrame,
        audio_df: pd.DataFrame,
        trips_df: pd.DataFrame,
    ) -> tuple:
        """Assign trip_id to each sensor row based on time overlap.

        Returns (accel_mapped_df, audio_mapped_df).
        Unmatched rows get trip_id = 'UNMAPPED'.
        """
        # Build trip lookup: list of (trip_id, driver_id, start_ts, end_ts)
        trip_windows = self._build_trip_windows(trips_df)

        accel_mapped = self._map_df(accel_df, trip_windows, "accelerometer")
        audio_mapped = self._map_df(audio_df, trip_windows, "audio")

        return accel_mapped, audio_mapped

    # ------------------------------------------------------------------
    def _build_trip_windows(self, trips_df: pd.DataFrame) -> list:
        """Build a list of trip time windows for matching."""
        windows = []
        if trips_df.empty:
            return windows

        # Determine start/end column names
        start_col = None
        end_col = None
        for c in ["pickup_time", "start_time"]:
            if c in trips_df.columns:
                start_col = c
                break
        for c in ["drop_time", "end_time"]:
            if c in trips_df.columns:
                end_col = c
                break

        # Build combined datetime from date + time columns
        for _, row in trips_df.iterrows():
            trip_id = row.get("trip_id", "UNKNOWN")
            driver_id = row.get("driver_id", "UNKNOWN")

            try:
                date_val = row.get("date", None)
                start_val = row.get(start_col) if start_col else None
                end_val = row.get(end_col) if end_col else None

                # If date is a Timestamp, format it; otherwise use as-is
                if isinstance(date_val, pd.Timestamp):
                    date_str = date_val.strftime("%Y-%m-%d")
                else:
                    date_str = str(date_val) if date_val else ""

                start_ts = pd.to_datetime(f"{date_str} {start_val}", errors="coerce")
                end_ts = pd.to_datetime(f"{date_str} {end_val}", errors="coerce")

                if pd.isna(start_ts) or pd.isna(end_ts):
                    continue

                windows.append({
                    "trip_id": trip_id,
                    "driver_id": driver_id,
                    "start_ts": start_ts,
                    "end_ts": end_ts,
                })
            except Exception as e:
                logger.warning("Could not build window for trip %s: %s", trip_id, e)

        logger.info("Built %d trip windows for sensor mapping", len(windows))
        return windows

    # ------------------------------------------------------------------
    def _map_df(self, sensor_df: pd.DataFrame, trip_windows: list, label: str) -> pd.DataFrame:
        """Map a sensor DataFrame to trips.  Uses existing trip_id column if present."""
        if sensor_df.empty:
            return sensor_df

        df = sensor_df.copy()

        # If the sensor data already has trip_id, keep it (data already mapped)
        if "trip_id" in df.columns:
            existing = df["trip_id"].notna() & (df["trip_id"] != "")
            unmapped = (~existing).sum()
            logger.info("%s: %d rows already have trip_id, %d unmapped", label, existing.sum(), unmapped)
            # Fill missing trip_ids with UNMAPPED
            df.loc[~existing, "trip_id"] = "UNMAPPED"

            # Attach driver_id from trips if not present
            if "driver_id" not in df.columns and trip_windows:
                trip_to_driver = {w["trip_id"]: w["driver_id"] for w in trip_windows}
                df["driver_id"] = df["trip_id"].map(trip_to_driver).fillna("UNKNOWN")

            return df

        # Otherwise, map by time range
        # Ensure timestamp is datetime
        if "timestamp" in df.columns:
            df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")

        mapped_trip_ids = ["UNMAPPED"] * len(df)
        mapped_driver_ids = ["UNKNOWN"] * len(df)
        matched = 0

        for idx, row in df.iterrows():
            ts = row.get("timestamp")
            driver = row.get("driver_id", None)
            if pd.isna(ts):
                continue

            for w in trip_windows:
                time_match = w["start_ts"] <= ts <= w["end_ts"]
                driver_match = (driver is None) or (driver == w["driver_id"])
                if time_match and driver_match:
                    mapped_trip_ids[idx] = w["trip_id"]
                    mapped_driver_ids[idx] = w["driver_id"]
                    matched += 1
                    break

        df["trip_id"] = mapped_trip_ids
        if "driver_id" not in df.columns:
            df["driver_id"] = mapped_driver_ids

        unmapped_count = mapped_trip_ids.count("UNMAPPED")
        logger.info("%s: mapped %d/%d rows to trips (%d unmapped)",
                    label, matched, len(df), unmapped_count)

        return df
