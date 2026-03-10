"""
MotionDetector — detects harsh braking, acceleration, and sharp maneuver events
from accelerometer data using threshold-based rules.

Single Responsibility: Analyse accelerometer magnitude & jerk to flag motion events.
"""

import logging
from typing import List, Dict

import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Detection thresholds — named constants (never use magic numbers inline)
# ---------------------------------------------------------------------------
HARSH_BRAKE_JERK_THRESHOLD = -15.0       # m/s³ (negative = deceleration)
HARSH_ACCEL_JERK_THRESHOLD = 15.0        # m/s³
SHARP_MANEUVER_MAG_THRESHOLD = 18.0      # m/s² (high total magnitude)
MIN_EVENT_DURATION_SEC = 0.5
MERGE_WINDOW_SEC = 2.0                   # merge events within 2 s of each other
CLUSTER_WINDOW_SEC = 60.0                # near-miss cluster window
CLUSTER_MIN_EVENTS = 3                   # min events for a cluster


class MotionDetector:
    """Detects motion stress events from accelerometer data using rule-based thresholds."""

    def detect(self, accel_df: pd.DataFrame) -> List[Dict]:
        """Return a list of detected motion event dicts.

        Each dict has: trip_id, driver_id, start_ts, end_ts, peak_ts,
        event_label, raw_peak_value, threshold_used, severity_score.
        Also produces cluster data (UNSTABLE_SEGMENT) appended to the list.
        """
        if accel_df.empty:
            logger.warning("Empty accelerometer dataframe — no motion events detected")
            return []

        df = accel_df.copy()

        # Ensure numeric columns
        for col in ["ax", "ay", "az"]:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0.0)

        # Ensure timestamp is datetime
        if "timestamp" in df.columns:
            df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")

        # Feature engineering: acceleration magnitude
        if all(c in df.columns for c in ["ax", "ay", "az"]):
            df["a_mag"] = np.sqrt(df["ax"] ** 2 + df["ay"] ** 2 + df["az"] ** 2)
        else:
            logger.warning("Accelerometer columns ax/ay/az missing — cannot compute magnitude")
            return []

        # Compute time delta in seconds
        if "elapsed_seconds" in df.columns:
            df["t_sec"] = pd.to_numeric(df["elapsed_seconds"], errors="coerce").fillna(0.0)
        elif "timestamp" in df.columns:
            df["t_sec"] = (df["timestamp"] - df["timestamp"].iloc[0]).dt.total_seconds()
        else:
            df["t_sec"] = range(len(df))

        # Compute jerk (rate of change of magnitude)
        df["dt"] = df.groupby("trip_id")["t_sec"].diff().fillna(1.0).replace(0, 1.0)
        df["d_mag"] = df.groupby("trip_id")["a_mag"].diff().fillna(0.0)
        df["jerk"] = df["d_mag"] / df["dt"]

        # Rolling smooth (approximate 1-second window)
        df["a_mag_smooth"] = df.groupby("trip_id")["a_mag"].transform(
            lambda s: s.rolling(window=max(1, 2), min_periods=1).mean()
        )

        # Detect events per trip
        all_events: List[Dict] = []
        trip_groups = df.groupby("trip_id")

        for trip_id, group in trip_groups:
            if trip_id == "UNMAPPED":
                continue

            driver_id = group["driver_id"].iloc[0] if "driver_id" in group.columns else "UNKNOWN"
            events = self._detect_in_group(group, trip_id, driver_id)
            events = self._merge_events(events)
            all_events.extend(events)

        # Near-miss cluster detection
        clusters = self._detect_clusters(all_events)
        all_events.extend(clusters)

        logger.info("MotionDetector: %d events detected (%d clusters)",
                    len(all_events) - len(clusters), len(clusters))
        return all_events

    # ------------------------------------------------------------------
    def _detect_in_group(self, group: pd.DataFrame, trip_id: str, driver_id: str) -> List[Dict]:
        """Detect events within a single trip group."""
        events = []

        for idx, row in group.iterrows():
            jerk = row.get("jerk", 0.0)
            a_mag = row.get("a_mag", 0.0)
            ts = row.get("timestamp", None)
            elapsed = row.get("t_sec", 0.0)

            event = None

            if jerk <= HARSH_BRAKE_JERK_THRESHOLD:
                severity = min(100.0, abs(jerk / HARSH_BRAKE_JERK_THRESHOLD) * 50)
                event = {
                    "trip_id": trip_id,
                    "driver_id": driver_id,
                    "start_ts": ts,
                    "end_ts": ts,
                    "peak_ts": ts,
                    "event_label": "HARSH_BRAKE",
                    "raw_peak_value": float(jerk),
                    "threshold_used": HARSH_BRAKE_JERK_THRESHOLD,
                    "severity_score": round(severity, 2),
                    "elapsed_seconds": float(elapsed),
                }
            elif jerk >= HARSH_ACCEL_JERK_THRESHOLD:
                severity = min(100.0, (jerk / HARSH_ACCEL_JERK_THRESHOLD) * 50)
                event = {
                    "trip_id": trip_id,
                    "driver_id": driver_id,
                    "start_ts": ts,
                    "end_ts": ts,
                    "peak_ts": ts,
                    "event_label": "HARSH_ACCEL",
                    "raw_peak_value": float(jerk),
                    "threshold_used": HARSH_ACCEL_JERK_THRESHOLD,
                    "severity_score": round(severity, 2),
                    "elapsed_seconds": float(elapsed),
                }

            if a_mag >= SHARP_MANEUVER_MAG_THRESHOLD:
                severity = min(100.0, (a_mag / SHARP_MANEUVER_MAG_THRESHOLD) * 50)
                maneuver_event = {
                    "trip_id": trip_id,
                    "driver_id": driver_id,
                    "start_ts": ts,
                    "end_ts": ts,
                    "peak_ts": ts,
                    "event_label": "SHARP_MANEUVER",
                    "raw_peak_value": float(a_mag),
                    "threshold_used": SHARP_MANEUVER_MAG_THRESHOLD,
                    "severity_score": round(severity, 2),
                    "elapsed_seconds": float(elapsed),
                }
                events.append(maneuver_event)

            if event:
                events.append(event)

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

            if gap <= MERGE_WINDOW_SEC and ev["event_label"] == last["event_label"]:
                # Merge: extend window, keep higher severity
                last["end_ts"] = ev["end_ts"]
                if ev["severity_score"] > last["severity_score"]:
                    last["severity_score"] = ev["severity_score"]
                    last["raw_peak_value"] = ev["raw_peak_value"]
                    last["peak_ts"] = ev["peak_ts"]
            else:
                merged.append(ev)

        return merged

    # ------------------------------------------------------------------
    def _detect_clusters(self, events: List[Dict]) -> List[Dict]:
        """Detect near-miss clusters: ≥3 motion events within 60 s."""
        clusters = []
        if len(events) < CLUSTER_MIN_EVENTS:
            return clusters

        # Group by trip
        trip_events: Dict[str, list] = {}
        for ev in events:
            tid = ev.get("trip_id", "")
            trip_events.setdefault(tid, []).append(ev)

        cluster_counter = 0
        for trip_id, evts in trip_events.items():
            evts = sorted(evts, key=lambda e: e["peak_ts"] if e["peak_ts"] is not None else pd.Timestamp.min)
            for i in range(len(evts)):
                window = [evts[i]]
                for j in range(i + 1, len(evts)):
                    try:
                        gap = (evts[j]["peak_ts"] - evts[i]["peak_ts"]).total_seconds()
                    except (TypeError, AttributeError):
                        break
                    if gap <= CLUSTER_WINDOW_SEC:
                        window.append(evts[j])
                    else:
                        break

                if len(window) >= CLUSTER_MIN_EVENTS:
                    cluster_counter += 1
                    clusters.append({
                        "trip_id": trip_id,
                        "driver_id": window[0].get("driver_id", "UNKNOWN"),
                        "start_ts": window[0]["peak_ts"],
                        "end_ts": window[-1]["peak_ts"],
                        "peak_ts": max(window, key=lambda e: e["severity_score"])["peak_ts"],
                        "event_label": "UNSTABLE_SEGMENT",
                        "raw_peak_value": max(e["severity_score"] for e in window),
                        "threshold_used": CLUSTER_MIN_EVENTS,
                        "severity_score": round(max(e["severity_score"] for e in window), 2),
                        "elapsed_seconds": window[0].get("elapsed_seconds", 0.0),
                        "cluster_id": f"CLUST-{trip_id}-{cluster_counter:03d}",
                        "event_count": len(window),
                        "max_severity_score": round(max(e["severity_score"] for e in window), 2),
                    })
                    break  # one cluster per starting event group

        return clusters
