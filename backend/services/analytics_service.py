"""
AnalyticsService — on-demand analytics computation.

Orchestration flow:
  DataRepository (raw CSVs)
  → analytics engine (motion/audio/fusion)
  → fresh flagged moments (consumed by the pipeline or API)

Design: separates on-demand re-computation from serving pre-computed results.
Use this when the frontend needs to trigger a fresh pipeline run.
"""
import sys
import os
from typing import List, Dict, Any

_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if _ROOT not in sys.path:
    sys.path.insert(0, _ROOT)

from engine.ingestion.data_loader import DataLoader
from engine.ingestion.trip_mapper import TripMapper
from engine.detection.motion_detector import MotionDetector
from engine.detection.audio_detector import AudioDetector
from engine.fusion.fusion_engine import FusionEngine
from backend.repositories.data_repository import DataRepository


class AnalyticsService:
    """
    On-demand analytics computation service.
    Wraps the core engine to detect motion/audio events and fuse stress moments.
    """

    def __init__(self, data_repo: DataRepository):
        self.data_repo = data_repo

    def run_for_driver(self, driver_id: str) -> Dict[str, Any]:
        """
        Recompute stress moments for a specific driver in real-time.
        Returns:
            {
              "motion_events": [...],
              "audio_events": [...],
              "stress_moments": [...],
            }
        """
        loader = DataLoader()
        # Use DataRepository's resolved data dir
        data = loader.load_all(self.data_repo.data_dir)

        mapper = TripMapper()
        accel_mapped, audio_mapped = mapper.map_sensors_to_trips(
            data["accel"], data["audio"], data["trips"]
        )

        # Filter to driver
        accel_drv = accel_mapped[accel_mapped["driver_id"] == driver_id] if "driver_id" in accel_mapped.columns else accel_mapped
        audio_drv = audio_mapped[audio_mapped["driver_id"] == driver_id] if "driver_id" in audio_mapped.columns else audio_mapped
        trips_drv = data["trips"][data["trips"]["driver_id"] == driver_id] if "driver_id" in data["trips"].columns else data["trips"]

        motion_events = MotionDetector().detect(accel_drv)
        audio_events = AudioDetector().detect(audio_drv)
        stress_moments = FusionEngine().fuse(motion_events, audio_events, trips_drv)

        return {
            "motion_events": motion_events,
            "audio_events": audio_events,
            "stress_moments": [
                {
                    "trip_id": m.trip_id,
                    "driver_id": m.driver_id,
                    "timestamp": m.timestamp,
                    "severity": m.severity,
                    "combined_score": m.combined_score,
                    "explanation": m.explanation,
                }
                for m in stress_moments
            ],
        }
