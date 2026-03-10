"""
AudioDetector — detects audio spikes and sustained high-noise events from cabin audio data.

Single Responsibility: Analyse audio intensity levels to flag noise-related stress events.
"""

import logging
from typing import List, Dict

import pandas as pd

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Detection thresholds — named constants
# ---------------------------------------------------------------------------
SPIKE_DB_THRESHOLD = 75.0            # dB above this = spike
SUSTAINED_DB_THRESHOLD = 70.0        # dB above this for sustained period
SUSTAINED_DURATION_SEC = 3.0         # must stay above threshold for this long
MERGE_WINDOW_SEC = 5.0               # merge audio windows within 5 s


class AudioDetector:
    """Detects audio stress events (spikes & sustained noise) from audio intensity data."""

    def detect(self, audio_df: pd.DataFrame) -> List[Dict]:
        """Return a list of detected audio event dicts.

        Each dict has: trip_id, driver_id, start_ts, end_ts, peak_ts,
        audio_type, peak_db, threshold_db, intensity_score.
        """
        if audio_df.empty:
            logger.warning("Empty audio dataframe — no audio events detected")
            return []

        df = audio_df.copy()

        # Ensure numeric
        if "audio_level_db" in df.columns:
            df["audio_level_db"] = pd.to_numeric(df["audio_level_db"], errors="coerce").fillna(0.0)
        else:
            logger.warning("audio_level_db column not found — cannot detect audio events")
            return []

        # Ensure timestamp
        if "timestamp" in df.columns:
            df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")

        # Elapsed seconds
        if "elapsed_seconds" in df.columns:
            df["elapsed_sec"] = pd.to_numeric(df["elapsed_seconds"], errors="coerce").fillna(0.0)
        else:
            df["elapsed_sec"] = 0.0

        # Sustained duration from data
        if "sustained_duration_sec" in df.columns:
            df["sustained_dur"] = pd.to_numeric(df["sustained_duration_sec"], errors="coerce").fillna(0.0)
        else:
            df["sustained_dur"] = 0.0

        all_events: List[Dict] = []
        trip_groups = df.groupby("trip_id")

        for trip_id, group in trip_groups:
            if trip_id == "UNMAPPED":
                continue

            driver_id = group["driver_id"].iloc[0] if "driver_id" in group.columns else "UNKNOWN"
            events = self._detect_in_group(group, trip_id, driver_id)
            events = self._merge_events(events)
            all_events.extend(events)

        logger.info("AudioDetector: %d events detected", len(all_events))
        return all_events

    # ------------------------------------------------------------------
    def _detect_in_group(self, group: pd.DataFrame, trip_id: str, driver_id: str) -> List[Dict]:
        """Detect spike and sustained events within a single trip."""
        events = []

        for _, row in group.iterrows():
            db = row.get("audio_level_db", 0.0)
            ts = row.get("timestamp", None)
            elapsed = row.get("elapsed_sec", 0.0)
            sustained_dur = row.get("sustained_dur", 0.0)

            # SPIKE check
            if db >= SPIKE_DB_THRESHOLD:
                intensity = min(100.0, ((db - SPIKE_DB_THRESHOLD) / SPIKE_DB_THRESHOLD) * 100 + 50)
                events.append({
                    "trip_id": trip_id,
                    "driver_id": driver_id,
                    "start_ts": ts,
                    "end_ts": ts,
                    "peak_ts": ts,
                    "audio_type": "SPIKE",
                    "peak_db": float(db),
                    "threshold_db": SPIKE_DB_THRESHOLD,
                    "intensity_score": round(min(intensity, 100.0), 2),
                    "elapsed_seconds": float(elapsed),
                })

            # SUSTAINED check
            elif db >= SUSTAINED_DB_THRESHOLD and sustained_dur >= SUSTAINED_DURATION_SEC:
                intensity = min(100.0, ((db - SUSTAINED_DB_THRESHOLD) / SUSTAINED_DB_THRESHOLD) * 100 + 30)
                events.append({
                    "trip_id": trip_id,
                    "driver_id": driver_id,
                    "start_ts": ts,
                    "end_ts": ts,
                    "peak_ts": ts,
                    "audio_type": "SUSTAINED",
                    "peak_db": float(db),
                    "threshold_db": SUSTAINED_DB_THRESHOLD,
                    "intensity_score": round(min(intensity, 100.0), 2),
                    "elapsed_seconds": float(elapsed),
                })

        return events

    # ------------------------------------------------------------------
    def _merge_events(self, events: List[Dict]) -> List[Dict]:
        """Merge events within MERGE_WINDOW_SEC of each other."""
        if len(events) <= 1:
            return events

        events = sorted(events, key=lambda e: e["peak_ts"] if e["peak_ts"] is not None else pd.Timestamp.min)
        merged = [events[0]]

        for ev in events[1:]:
            last = merged[-1]
            try:
                gap = (ev["peak_ts"] - last["peak_ts"]).total_seconds()
            except (TypeError, AttributeError):
                gap = float("inf")

            if gap <= MERGE_WINDOW_SEC and ev["audio_type"] == last["audio_type"]:
                last["end_ts"] = ev["end_ts"]
                if ev["peak_db"] > last["peak_db"]:
                    last["peak_db"] = ev["peak_db"]
                    last["peak_ts"] = ev["peak_ts"]
                    last["intensity_score"] = ev["intensity_score"]
            else:
                merged.append(ev)

        return merged
