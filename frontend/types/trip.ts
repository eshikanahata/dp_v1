// Trip and Event TypeScript types
// These mirror the backend Pydantic schemas exactly

export interface TripSummary {
    trip_id: string;
    driver_id: string;
    date: string;
    duration_min: number;
    distance_km: number;
    fare: number;
    earnings_velocity: number;
    motion_events_count: number;
    audio_events_count: number;
    flagged_moments_count: number;
    max_severity: string;
    stress_score: number;
    goal_status: string;
    trip_quality_rating: string; // SMOOTH | MODERATE | STRESSFUL
}

export interface TripDetail extends TripSummary {
    stress_score: number;
    trip_quality_rating: string;
    flagged_moments_count: number;
}

export interface FrictionEvent {
    flag_id: string;
    trip_id: string;
    driver_id: string;
    timestamp: string;
    elapsed_seconds: number;
    flag_type: string;
    severity: "LOW" | "MEDIUM" | "HIGH";
    motion_score: number;
    audio_score: number;
    combined_score: number;
    explanation: string;
    context?: string;
}

export interface DriverDashboard {
    driver_id: string;
    driver_name: string;
    // Earnings
    current_earnings: number;
    trips_completed: number;
    // Goal
    goal_amount: number;
    goal_progress_pct: number;
    goal_remaining: number;
    goal_status: "ON_TRACK" | "AT_RISK" | "OFF_TRACK";
    // Velocity
    current_velocity: number;
    required_velocity: number;
    velocity_variance: number;
    pace_trend: "IMPROVING" | "STABLE" | "DECLINING";
    // Fatigue / stress
    stress_score: number;
    fatigue_status: string;
    active_hours: number;
    // Risk
    risk_events_total: number;
    risk_low: number;
    risk_medium: number;
    risk_high: number;
    // Status labels
    performance_status: string;
    performance_desc: string;
    velocity_label: string;
    stress_level: string;
    cabin_state: string;
    avg_trip_time_min: number;
}

export interface DriverListItem {
    driver_id: string;
    driver_name: string;
    goal_status: string;
    performance_status: string;
}
