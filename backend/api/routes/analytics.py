"""
Analytics router — delegates to AnalyticsService for on-demand computation.
Routes:
  POST /api/v1/analytics/run/{driver_id} → runs pipeline for driver
"""
from fastapi import APIRouter, Depends
from backend.services.analytics_service import AnalyticsService
from backend.repositories.data_repository import DataRepository

router = APIRouter(prefix="/analytics", tags=["analytics"])


def get_analytics_service() -> AnalyticsService:
    return AnalyticsService(data_repo=DataRepository())


@router.post("/run/{driver_id}")
def run_analytics(driver_id: str, service: AnalyticsService = Depends(get_analytics_service)):
    """Trigger on-demand analytics computation for a driver."""
    result = service.run_for_driver(driver_id)
    return {
        "driver_id": driver_id,
        "stress_moments_count": len(result["stress_moments"]),
        "motion_events_count": len(result["motion_events"]),
        "audio_events_count": len(result["audio_events"]),
        "stress_moments": result["stress_moments"][:20],  # Return first 20 for preview
    }
