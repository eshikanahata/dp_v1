"""
BaseDetector — abstract interface for all sensor detectors.

Defines the contract that MotionDetector, AudioDetector, and any future
detectors (e.g. SpeedDetector) must follow.  This enables the Strategy
pattern and Dependency Inversion: the pipeline and fusion engine depend
on this protocol, not on concrete detector implementations.
"""

from typing import List, Dict, Protocol, runtime_checkable

import pandas as pd


@runtime_checkable
class BaseDetector(Protocol):
    """Protocol for sensor-event detectors.

    Every detector receives a DataFrame of sensor readings (already
    mapped to trips) and returns a flat list of event dicts.

    Required keys in each returned dict:
        trip_id, driver_id, start_ts, end_ts, peak_ts, event_label,
        raw_peak_value, threshold_used, severity_score, elapsed_seconds.
    """

    def detect(self, df: pd.DataFrame) -> List[Dict]:
        """Analyse *df* and return detected events."""
        ...
