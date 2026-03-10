"""
Trip-related Pydantic schemas.
Data contract between service layer and API consumers.
"""
from pydantic import BaseModel
from typing import Optional


class TripSummary(BaseModel):
    trip_id: str
    driver_id: str
    date: str
    duration_min: float
    distance_km: float
    fare: float
    earnings_velocity: float
    motion_events_count: int
    audio_events_count: int
    flagged_moments_count: int
    max_severity: str
    stress_score: float
    goal_status: str
    trip_quality_rating: str


class TripDetail(BaseModel):
    trip_id: str
    driver_id: str
    date: str
    duration_min: float
    distance_km: float
    fare: float
    stress_score: float
    trip_quality_rating: str
    flagged_moments_count: int
