import { api } from "./apiClient";

/**
 * analyticsService — trigger on-demand pipeline runs.
 */
export const analyticsService = {
    /** Run analytics pipeline for a driver and return fresh results. */
    runForDriver: (driverId: string) =>
        api.fetchJSON<{
            driver_id: string;
            stress_moments_count: number;
            motion_events_count: number;
            audio_events_count: number;
            stress_moments: unknown[];
        }>(`/analytics/run/${driverId}`, { method: "POST" }),
};
