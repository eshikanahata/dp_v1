"""
Event and Driver Dashboard Pydantic schemas.
Central data contracts for API layer.
"""
from pydantic import BaseModel
from typing import Optional, List


class FrictionEvent(BaseModel):
    flag_id: str
    trip_id: str
    driver_id: str
    timestamp: str
    elapsed_seconds: float
    flag_type: str
    severity: str          # LOW | MEDIUM | HIGH
    motion_score: float
    audio_score: float
    combined_score: float
    explanation: str
    context: Optional[str] = None


class DriverDashboard(BaseModel):
    driver_id: str
    driver_name: str
    # Earnings
    current_earnings: float
    trips_completed: int
    # Goal tracking
    goal_amount: float
    goal_progress_pct: float   # 0-100
    goal_remaining: float
    goal_status: str           # ON_TRACK | AT_RISK | OFF_TRACK
    # Velocity
    current_velocity: float    # ₹/hr
    required_velocity: float   # ₹/hr
    velocity_variance: float   # positive = ahead
    pace_trend: str            # IMPROVING | STABLE | DECLINING
    # Fatigue/stress (derived from stress moments)
    stress_score: float        # avg combined_score
    fatigue_status: str        # Very Low | Low | Medium | High
    active_hours: float
    # Risk
    risk_events_total: int
    risk_low: int
    risk_medium: int
    risk_high: int
    # Driver status
    performance_status: str    # Excellent | Good | On Track | At Risk
    performance_desc: str
    velocity_label: str
    stress_level: str          # Very Low | Low | Medium | High
    cabin_state: str           # Calm | Stable | Elevated
    # Shift info
    avg_trip_time_min: float


class DriverListItem(BaseModel):
    driver_id: str
    driver_name: str
    goal_status: str
    performance_status: str
