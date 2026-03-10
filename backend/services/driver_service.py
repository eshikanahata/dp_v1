"""
DriverService — business logic for driver dashboard metrics.

Orchestration flow:
  DataRepository (raw CSVs) + OutputRepository (analytics outputs)
  → EarningsEngine (velocity, goal status)
  → DriverDashboard schema (consumed by FastAPI route)

Design Principles Applied:
  - Single Responsibility: only assembles driver-level dashboard data
  - Dependency Injection: repos injected, not created internally
  - Open/Closed: adding new metrics doesn't change the calling API
"""
import sys
import os
from typing import List, Optional

# Make engine importable from repo root
_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if _ROOT not in sys.path:
    sys.path.insert(0, _ROOT)

from engine.analytics.earnings_engine import EarningsEngine
from backend.repositories.data_repository import DataRepository
from backend.repositories.output_repository import OutputRepository
from backend.schemas.event_schema import DriverDashboard, DriverListItem


class DriverService:
    """
    Orchestrates driver-level analytics.
    Handles: earnings velocity, goal tracking, stress metrics, risk events.
    """

    _FATIGUE_MAP = {
        (0, 20): "Very Low",
        (20, 40): "Low",
        (40, 60): "Medium",
        (60, float("inf")): "High",
    }

    def __init__(
        self,
        data_repo: DataRepository,
        output_repo: OutputRepository,
    ):
        self.data_repo = data_repo
        self.output_repo = output_repo
        self.earnings_engine = EarningsEngine()

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def get_dashboard(self, driver_id: str) -> Optional[DriverDashboard]:
        """Return the full dashboard payload for a given driver."""
        drivers_df = self.data_repo.get_drivers()
        earnings_df = self.data_repo.get_earnings()
        goals_df = self.data_repo.get_goals()
        trips_df = self.data_repo.get_trips()
        summaries_df = self.output_repo.get_trip_summaries()
        moments_df = self.output_repo.get_flagged_moments()

        # --- driver name ---
        drv_row = drivers_df[drivers_df["driver_id"] == driver_id]
        if drv_row.empty:
            return None
        driver_name = str(drv_row.iloc[0].get("name", driver_id))

        # --- earnings & goal engine ---
        velocity_data = self.earnings_engine.compute_velocity(earnings_df, goals_df)
        goal_data = self.earnings_engine.compute_goal_status(velocity_data, goals_df)

        vel = velocity_data.get(driver_id, {})
        goal = goal_data.get(driver_id, {})

        current_earnings = vel.get("current_earnings", 0.0)
        trips_completed = vel.get("trips_completed", 0)
        elapsed_hours = vel.get("elapsed_hours", 0.0)
        pace_now = vel.get("pace_now", 0.0)
        pace_trend = vel.get("pace_trend", "STABLE")

        goal_amount = goal.get("goal_amount", 0.0)
        goal_remaining = goal.get("gap_to_goal", 0.0)
        goal_status = goal.get("goal_status", "ON_TRACK")
        required_pace = goal.get("required_pace", 0.0)
        goal_progress_pct = (current_earnings / goal_amount * 100) if goal_amount > 0 else 0.0

        # --- trip-level metrics ---
        drv_summaries = summaries_df[summaries_df["driver_id"] == driver_id] if not summaries_df.empty else summaries_df
        drv_moments = moments_df[moments_df["driver_id"] == driver_id] if not moments_df.empty else moments_df

        avg_stress = 0.0
        if not drv_summaries.empty and "stress_score" in drv_summaries.columns:
            avg_stress = float(drv_summaries["stress_score"].mean())

        avg_trip_min = 0.0
        drv_trips = trips_df[trips_df["driver_id"] == driver_id] if not trips_df.empty else trips_df
        if not drv_trips.empty and "duration_min" in drv_trips.columns:
            avg_trip_min = float(drv_trips["duration_min"].mean())

        # --- risk event counts ---
        risk_low = risk_med = risk_high = 0
        if not drv_moments.empty and "severity" in drv_moments.columns:
            sev = drv_moments["severity"].str.upper()
            risk_low = int((sev == "LOW").sum())
            risk_med = int((sev == "MEDIUM").sum())
            risk_high = int((sev == "HIGH").sum())
        risk_total = risk_low + risk_med + risk_high

        # --- derived labels ---
        fatigue_status = self._score_to_label(avg_stress)
        stress_level = fatigue_status
        cabin_state = "Calm" if avg_stress < 20 else ("Stable" if avg_stress < 50 else "Elevated")

        if goal_progress_pct >= 80:
            perf_status, perf_desc, vel_label = "Excellent", "Performance excellent, maintaining high velocity", "Excellent"
        elif goal_progress_pct >= 60:
            perf_status, perf_desc, vel_label = "Good", "Good progress, steady pace", "Optimal"
        else:
            perf_status, perf_desc, vel_label = "On Track", "Performance nominal, monitoring velocity", "Below Target"

        return DriverDashboard(
            driver_id=driver_id,
            driver_name=driver_name,
            current_earnings=round(current_earnings, 2),
            trips_completed=trips_completed,
            goal_amount=round(goal_amount, 2),
            goal_progress_pct=round(goal_progress_pct, 1),
            goal_remaining=round(goal_remaining, 2),
            goal_status=goal_status,
            current_velocity=round(pace_now, 2),
            required_velocity=round(required_pace, 2),
            velocity_variance=round(pace_now - required_pace, 2),
            pace_trend=pace_trend,
            stress_score=round(avg_stress, 2),
            fatigue_status=fatigue_status,
            active_hours=round(elapsed_hours, 2),
            risk_events_total=risk_total,
            risk_low=risk_low,
            risk_medium=risk_med,
            risk_high=risk_high,
            performance_status=perf_status,
            performance_desc=perf_desc,
            velocity_label=vel_label,
            stress_level=stress_level,
            cabin_state=cabin_state,
            avg_trip_time_min=round(avg_trip_min, 1),
        )

    def list_drivers(self) -> List[DriverListItem]:
        """Return a lightweight list of all drivers."""
        drivers_df = self.data_repo.get_drivers()
        earnings_df = self.data_repo.get_earnings()
        goals_df = self.data_repo.get_goals()

        velocity_data = self.earnings_engine.compute_velocity(earnings_df, goals_df)
        goal_data = self.earnings_engine.compute_goal_status(velocity_data, goals_df)

        items = []
        for _, row in drivers_df.iterrows():
            did = str(row["driver_id"])
            goal = goal_data.get(did, {})
            goal_status = goal.get("goal_status", "UNKNOWN")
            vel = velocity_data.get(did, {})
            earnings = vel.get("current_earnings", 0)
            goal_amt = goal.get("goal_amount", 1)
            pct = earnings / goal_amt * 100 if goal_amt else 0
            perf = "Excellent" if pct >= 80 else ("Good" if pct >= 60 else "On Track")
            items.append(DriverListItem(
                driver_id=did,
                driver_name=str(row.get("name", did)),
                goal_status=goal_status,
                performance_status=perf,
            ))
        return items

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _score_to_label(self, score: float) -> str:
        for (lo, hi), label in self._FATIGUE_MAP.items():
            if lo <= score < hi:
                return label
        return "Unknown"
