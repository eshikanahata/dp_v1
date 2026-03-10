"""
TripService — business logic for trip-level analytics.

Orchestration flow:
  OutputRepository (trip_summaries, flagged_moments)
  → TripSummary / TripDetail schemas (consumed by FastAPI routes)

Design: SRP — only handles trip-scoped queries.
"""
import sys
import os
from typing import List, Optional

_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if _ROOT not in sys.path:
    sys.path.insert(0, _ROOT)

from backend.repositories.output_repository import OutputRepository
from backend.schemas.trip_schema import TripSummary, TripDetail
from backend.schemas.event_schema import FrictionEvent


class TripService:
    """
    Handles trip-level business logic: listing trips, trip detail, friction events.
    """

    def __init__(self, output_repo: OutputRepository):
        self.output_repo = output_repo

    def list_trips(self, driver_id: str) -> List[TripSummary]:
        """Return all trip summaries for a driver."""
        df = self.output_repo.get_trip_summaries()
        if df.empty:
            return []
        driver_df = df[df["driver_id"] == driver_id]
        return [self._row_to_summary(row) for _, row in driver_df.iterrows()]

    def get_trip(self, trip_id: str) -> Optional[TripDetail]:
        """Return trip detail for a specific trip."""
        df = self.output_repo.get_trip_summaries()
        if df.empty:
            return None
        row = df[df["trip_id"] == trip_id]
        if row.empty:
            return None
        r = row.iloc[0]
        return TripDetail(
            trip_id=str(r["trip_id"]),
            driver_id=str(r["driver_id"]),
            date=str(r.get("date", "")),
            duration_min=float(r.get("duration_min", 0)),
            distance_km=float(r.get("distance_km", 0)),
            fare=float(r.get("fare", 0)),
            stress_score=float(r.get("stress_score", 0)),
            trip_quality_rating=str(r.get("trip_quality_rating", "SMOOTH")),
            flagged_moments_count=int(r.get("flagged_moments_count", 0)),
        )

    def get_trip_events(self, trip_id: str) -> List[FrictionEvent]:
        """Return all flagged moments for a specific trip."""
        df = self.output_repo.get_flagged_moments()
        if df.empty:
            return []
        trip_df = df[df["trip_id"] == trip_id]
        events = []
        for _, r in trip_df.iterrows():
            events.append(FrictionEvent(
                flag_id=str(r.get("flag_id", "")),
                trip_id=str(r["trip_id"]),
                driver_id=str(r.get("driver_id", "")),
                timestamp=str(r.get("timestamp", "")),
                elapsed_seconds=float(r.get("elapsed_seconds", 0)),
                flag_type=str(r.get("flag_type", "")),
                severity=str(r.get("severity", "LOW")),
                motion_score=float(r.get("motion_score", 0)),
                audio_score=float(r.get("audio_score", 0)),
                combined_score=float(r.get("combined_score", 0)),
                explanation=str(r.get("explanation", "")),
                context=str(r.get("context", "")) if r.get("context") else None,
            ))
        return events

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _row_to_summary(self, r) -> TripSummary:
        return TripSummary(
            trip_id=str(r["trip_id"]),
            driver_id=str(r["driver_id"]),
            date=str(r.get("date", "")),
            duration_min=float(r.get("duration_min", 0)),
            distance_km=float(r.get("distance_km", 0)),
            fare=float(r.get("fare", 0)),
            earnings_velocity=float(r.get("earnings_velocity", 0)),
            motion_events_count=int(r.get("motion_events_count", 0)),
            audio_events_count=int(r.get("audio_events_count", 0)),
            flagged_moments_count=int(r.get("flagged_moments_count", 0)),
            max_severity=str(r.get("max_severity", "NONE")),
            stress_score=float(r.get("stress_score", 0)),
            goal_status=str(r.get("goal_status", "ON_TRACK")),
            trip_quality_rating=str(r.get("trip_quality_rating", "SMOOTH")),
        )
