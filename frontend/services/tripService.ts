import { api } from "./apiClient";
import type { TripSummary, TripDetail, FrictionEvent } from "@/types/trip";

/**
 * tripService — all calls related to trip data.
 * Mirrors TripService on the backend.
 */
export const tripService = {
    /** List all trips for a driver. */
    listTrips: (driverId: string): Promise<TripSummary[]> =>
        api.fetchJSON<TripSummary[]>(`/trips?driver_id=${driverId}`),

    /** Get detail for a specific trip. */
    getTrip: (tripId: string): Promise<TripDetail> =>
        api.fetchJSON<TripDetail>(`/trips/${tripId}`),

    /** Get all friction/stress events for a trip. */
    getTripEvents: (tripId: string): Promise<FrictionEvent[]> =>
        api.fetchJSON<FrictionEvent[]>(`/trips/${tripId}/events`),
};
