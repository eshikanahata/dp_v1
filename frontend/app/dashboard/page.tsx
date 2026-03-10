"use client";
import { useEffect, useState } from "react";
import { Header } from "@/components/shared/Header";
import { WelcomeBanner } from "@/components/shared/WelcomeBanner";
import { MetricCard } from "@/components/shared/MetricCard";
import { DriverStatusPanel } from "@/components/dashboard/DriverStatusPanel";
import { FinancialPacing } from "@/components/dashboard/FinancialPacing";
import { TripFrictionSummary } from "@/components/dashboard/TripFrictionSummary";
import { RecentEvents } from "@/components/dashboard/RecentEvents";
import { WellnessNudge } from "@/components/dashboard/WellnessNudge";
import { CSVUploadPanel } from "@/components/dashboard/CSVUploadPanel";
import { driverService } from "@/services/driverService";
import { tripService } from "@/services/tripService";
import type { DriverDashboard, FrictionEvent } from "@/types/trip";

// Default driver ID — in a real app, from auth session
const DEFAULT_DRIVER = "DRV003";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DriverDashboard | null>(null);
  const [events, setEvents] = useState<FrictionEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {  // eslint-disable-line react-hooks/exhaustive-deps
    async function load() {
      try {
        setLoading(true);
        const dash = await driverService.getDashboard(DEFAULT_DRIVER);
        setDashboard(dash);

        // Load friction events for the most recent trip context
        const trips = await tripService.listTrips(DEFAULT_DRIVER);
        if (trips.length > 0) {
          const recentEvents = await tripService.getTripEvents(trips[0].trip_id);
          setEvents(recentEvents);
        }
      } catch (e) {
        setError("Could not reach the backend. Make sure FastAPI is running on port 8000.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [refreshKey]); // re-fetch when CSV upload completes

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Header />
        <div className="flex items-center justify-center h-96 font-medium text-gray-700 text-sm">
          Loading dashboard…
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-gray-900 mb-2 font-semibold">Backend not connected</div>
            <div className="text-sm font-medium text-gray-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  const riskDetail = `${dashboard.risk_low} low, ${dashboard.risk_medium} medium${dashboard.risk_high > 0 ? `, ${dashboard.risk_high} high` : ""}`;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      <WelcomeBanner name={dashboard.driver_name} />

      <main className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-6 gap-4 mb-8">
          <MetricCard
            label="Today's Earnings"
            value={`₹${dashboard.current_earnings.toLocaleString()}`}
            subtitle={`${dashboard.trips_completed} trips completed`}
          />
          <MetricCard
            label="Goal Progress"
            value={`${dashboard.goal_progress_pct}%`}
            subtitle={`₹${dashboard.goal_remaining.toLocaleString()} remaining`}
            variant="info"
          />
          <MetricCard
            label="Current Velocity"
            value={`₹${dashboard.current_velocity}/hr`}
            subtitle={`vs ₹${dashboard.required_velocity}/hr required`}
            variant={dashboard.velocity_variance >= 0 ? "success" : "warning"}
          />
          <MetricCard
            label="Fatigue Status"
            value={dashboard.fatigue_status}
            subtitle={`${dashboard.active_hours} hrs active`}
            variant="success"
          />
          <MetricCard
            label="Trips Completed"
            value={dashboard.trips_completed.toString()}
            subtitle={`Avg ${dashboard.avg_trip_time_min} min/trip`}
          />
          <MetricCard
            label="Risk Events"
            value={dashboard.risk_events_total.toString()}
            subtitle={riskDetail}
            variant={dashboard.risk_high > 0 ? "warning" : "default"}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-8 space-y-6">
            <DriverStatusPanel data={dashboard} />
            <FinancialPacing data={dashboard} />
            <div className="grid grid-cols-2 gap-6">
              <TripFrictionSummary events={events} />
              <RecentEvents events={events} />
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-4 space-y-6">
            <CSVUploadPanel onSuccess={() => setRefreshKey((k) => k + 1)} />
            <WellnessNudge />

            {/* Shift Summary */}
            <div className="border border-gray-200 rounded-md p-6 bg-white">
              <div className="text-xs font-medium text-gray-600 mb-4 uppercase tracking-wider">Shift Summary</div>
              <div className="space-y-3">
                {[
                  ["Goal Status", dashboard.goal_status.replace("_", " ")],
                  ["Pace Trend", dashboard.pace_trend],
                  ["Active Hours", `${dashboard.active_hours} hrs`],
                  ["Goal Amount", `₹${dashboard.goal_amount.toLocaleString()}`],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-600">{label}</span>
                    <span className="text-sm font-semibold text-gray-900">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Context Awareness */}
            <div className="border border-gray-200 rounded-md p-6 bg-white">
              <div className="text-xs font-medium text-gray-600 mb-4 uppercase tracking-wider">Context Awareness</div>
              <div className="space-y-3 text-sm">
                {["Motion Sensors", "Audio Monitoring", "GPS Tracking", "Pattern Analysis"].map((sensor) => (
                  <div key={sensor} className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{sensor}</span>
                    <span className="text-[#7ba88a] font-semibold flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#7ba88a] inline-block"></span>Active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
