"""
EarningsEngine — computes earnings velocity, goal status, and forecasting for drivers.

Single Responsibility: Analyse earnings logs and driver goals to produce velocity metrics
and goal status predictions.
"""

import logging
from typing import Dict, Any

import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Trend thresholds
# ---------------------------------------------------------------------------
TREND_IMPROVING_SLOPE = 0.5
TREND_DECLINING_SLOPE = -0.5


class EarningsEngine:
    """Computes earnings velocity and goal forecasting per driver."""

    def compute_velocity(
        self, earnings_df: pd.DataFrame, goals_df: pd.DataFrame
    ) -> Dict[str, Dict[str, Any]]:
        """Compute velocity metrics per driver.

        Returns dict keyed by driver_id with:
        current_earnings, elapsed_hours, pace_now, pace_trend.
        """
        result: Dict[str, Dict] = {}

        if earnings_df.empty:
            logger.warning("Empty earnings dataframe — cannot compute velocity")
            return result

        # Normalize column names
        df = earnings_df.copy()

        # Ensure numeric
        for col in ["cumulative_earnings", "elapsed_hours", "current_velocity"]:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0.0)

        grouped = df.groupby("driver_id") if "driver_id" in df.columns else []

        for driver_id, group in grouped:
            group = group.sort_values("timestamp" if "timestamp" in group.columns else "elapsed_hours")

            current_earnings = group["cumulative_earnings"].iloc[-1] if "cumulative_earnings" in group.columns else 0.0
            elapsed_hours = group["elapsed_hours"].iloc[-1] if "elapsed_hours" in group.columns else 0.0

            pace_now = current_earnings / elapsed_hours if elapsed_hours > 0 else 0.0

            # Pace trend: rolling slope over last 5 entries
            pace_trend = "STABLE"
            if "current_velocity" in group.columns and len(group) >= 2:
                recent = group["current_velocity"].tail(5).values
                if len(recent) >= 2:
                    x = np.arange(len(recent))
                    slope = np.polyfit(x, recent, 1)[0] if len(recent) > 1 else 0.0
                    if slope > TREND_IMPROVING_SLOPE:
                        pace_trend = "IMPROVING"
                    elif slope < TREND_DECLINING_SLOPE:
                        pace_trend = "DECLINING"

            result[driver_id] = {
                "current_earnings": round(current_earnings, 2),
                "elapsed_hours": round(elapsed_hours, 2),
                "pace_now": round(pace_now, 2),
                "pace_trend": pace_trend,
                "trips_completed": int(group["trips_completed"].iloc[-1]) if "trips_completed" in group.columns else 0,
            }

        logger.info("EarningsEngine: computed velocity for %d drivers", len(result))
        return result

    def compute_goal_status(
        self,
        velocity_data: Dict[str, Dict],
        goals_df: pd.DataFrame,
    ) -> Dict[str, Dict[str, Any]]:
        """Compute goal status and forecast per driver.

        Returns dict keyed by driver_id.
        """
        result: Dict[str, Dict] = {}

        if goals_df.empty:
            logger.warning("Empty goals dataframe — cannot compute goal status")
            return result

        df = goals_df.copy()

        # Ensure numeric
        for col in ["target_earnings", "target_hours", "current_earnings", "current_hours"]:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0.0)

        for _, row in df.iterrows():
            driver_id = row.get("driver_id", "UNKNOWN")
            vel = velocity_data.get(driver_id, {})

            goal_amount = row.get("target_earnings", 0.0)
            target_hours = row.get("target_hours", 8.0)

            # Use velocity data if available, else fall back to goal row
            current_earnings = vel.get("current_earnings", row.get("current_earnings", 0.0))
            elapsed_hours = vel.get("elapsed_hours", row.get("current_hours", 0.0))
            pace_now = vel.get("pace_now", 0.0)

            remaining_time_hours = max(0.0, target_hours - elapsed_hours)
            gap_to_goal = max(0.0, goal_amount - current_earnings)

            # Projected end earnings
            projected_end = current_earnings + (pace_now * remaining_time_hours)

            # Goal status
            if projected_end >= goal_amount * 0.95:
                goal_status = "ON_TRACK"
            elif projected_end >= goal_amount * 0.80:
                goal_status = "AT_RISK"
            else:
                goal_status = "OFF_TRACK"

            # Required pace
            required_pace = gap_to_goal / remaining_time_hours if remaining_time_hours > 0 else 0.0

            # Trips away estimate
            trips_completed = vel.get("trips_completed", 0)
            avg_fare = current_earnings / trips_completed if trips_completed > 0 else 0.0
            trips_away = gap_to_goal / avg_fare if avg_fare > 0 else 0.0

            # Estimated finish time (hours from now at current pace)
            estimated_finish_hours = gap_to_goal / pace_now if pace_now > 0 else float("inf")

            result[driver_id] = {
                "goal_amount": round(goal_amount, 2),
                "current_earnings": round(current_earnings, 2),
                "remaining_time_hours": round(remaining_time_hours, 2),
                "gap_to_goal": round(gap_to_goal, 2),
                "projected_end_earnings": round(projected_end, 2),
                "goal_status": goal_status,
                "required_pace": round(required_pace, 2),
                "trips_away_estimate": round(trips_away, 1),
                "estimated_finish_hours": round(estimated_finish_hours, 2) if estimated_finish_hours != float("inf") else None,
                "pace_now": round(pace_now, 2),
                "pace_trend": vel.get("pace_trend", "STABLE"),
            }

        logger.info("EarningsEngine: computed goal status for %d drivers", len(result))
        return result
