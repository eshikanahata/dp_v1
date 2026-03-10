"""
Trips router — delegates to TripService.
Routes:
  GET /api/v1/trips?driver_id=...   → List[TripSummary]
  GET /api/v1/trips/{trip_id}       → TripDetail
  GET /api/v1/trips/{trip_id}/events → List[FrictionEvent]
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from backend.services.trip_service import TripService
from backend.repositories.output_repository import OutputRepository
from backend.schemas.trip_schema import TripSummary, TripDetail
from backend.schemas.event_schema import FrictionEvent

router = APIRouter(prefix="/trips", tags=["trips"])


def get_trip_service() -> TripService:
    return TripService(output_repo=OutputRepository())


@router.get("", response_model=List[TripSummary])
def list_trips(driver_id: str, service: TripService = Depends(get_trip_service)):
    """List all trips for a driver."""
    return service.list_trips(driver_id)


@router.get("/{trip_id}", response_model=TripDetail)
def get_trip(trip_id: str, service: TripService = Depends(get_trip_service)):
    """Get detail for a specific trip."""
    result = service.get_trip(trip_id)
    if result is None:
        raise HTTPException(status_code=404, detail=f"Trip {trip_id} not found")
    return result


@router.get("/{trip_id}/events", response_model=List[FrictionEvent])
def get_trip_events(trip_id: str, service: TripService = Depends(get_trip_service)):
    """Get all friction/stress events for a specific trip."""
    return service.get_trip_events(trip_id)
