"""
Drivers router — delegates to DriverService.
Routes:
  GET /api/v1/drivers               → List[DriverListItem]
  GET /api/v1/drivers/{driver_id}/dashboard → DriverDashboard
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from backend.services.driver_service import DriverService
from backend.repositories.data_repository import DataRepository
from backend.repositories.output_repository import OutputRepository
from backend.schemas.event_schema import DriverDashboard, DriverListItem

router = APIRouter(prefix="/drivers", tags=["drivers"])


def get_driver_service() -> DriverService:
    return DriverService(
        data_repo=DataRepository(),
        output_repo=OutputRepository(),
    )


@router.get("", response_model=List[DriverListItem])
def list_drivers(service: DriverService = Depends(get_driver_service)):
    """List all drivers with summary info."""
    return service.list_drivers()


@router.get("/{driver_id}/dashboard", response_model=DriverDashboard)
def get_dashboard(driver_id: str, service: DriverService = Depends(get_driver_service)):
    """Get full dashboard data for a specific driver."""
    result = service.get_dashboard(driver_id)
    if result is None:
        raise HTTPException(status_code=404, detail=f"Driver {driver_id} not found")
    return result
