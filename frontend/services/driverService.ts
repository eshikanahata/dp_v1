import { api } from "./apiClient";
import type { DriverDashboard, DriverListItem } from "@/types/trip";

/**
 * driverService — all calls related to driver data.
 * Mirrors DriverService on the backend.
 */
export const driverService = {
    /** List all drivers (lightweight). */
    listDrivers: (): Promise<DriverListItem[]> =>
        api.fetchJSON<DriverListItem[]>("/drivers"),

    /** Get full dashboard data for a driver. */
    getDashboard: (driverId: string): Promise<DriverDashboard> =>
        api.fetchJSON<DriverDashboard>(`/drivers/${driverId}/dashboard`),
};
