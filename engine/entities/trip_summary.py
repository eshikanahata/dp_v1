"""
TripSummary entity — aggregate metrics for a single trip.

Immutable data contract: Never remove or rename fields. Only append new fields.
"""

from dataclasses import dataclass


@dataclass
class TripSummary:
    """Aggregate summary of a single trip including safety and earnings metrics.

    Each field maps directly to a column in trip_summaries.csv.
    """

    trip_id: str
    driver_id: str
    date: str
    duration_min: float
    distance_km: float
    fare: float
    motion_events_count: int
    audio_events_count: int
    flagged_moments_count: int
    max_severity: str        # LOW | MEDIUM | HIGH | NONE
    stress_score: float      # 0–100 aggregate
    earnings_velocity: float # ₹/hr at time of trip
    goal_status: str         # ON_TRACK | AT_RISK | OFF_TRACK
    trip_quality_rating: str # SMOOTH | MODERATE | STRESSFUL
    schema_version: str = "v1"
    system_version: str = "v1.0"
    generated_at: str = ""
