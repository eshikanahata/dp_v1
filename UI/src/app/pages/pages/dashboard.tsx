import React from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../components/header';
import { WelcomeBanner } from '../components/welcome-banner';
import { MetricCard } from '../components/metric-card';
import { DriverStatusPanel } from '../components/driver-status-panel';
import { FinancialPacing } from '../components/financial-pacing';
import { TripFrictionSummary } from '../components/trip-friction-summary';
import { RecentEvents } from '../components/recent-events';
import { TripActivityMap } from '../components/trip-activity-map';
import { WellnessNudge } from '../components/wellness-nudge';
import { PersonaProfiles } from '../components/persona-profiles';

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      <WelcomeBanner />
      
      <main className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-6 gap-4 mb-8">
          <MetricCard
            label="Today's Earnings"
            value="₹1,242.50"
            subtitle="9 trips completed"
          />
          <MetricCard
            label="Goal Progress"
            value="62%"
            subtitle="₹757.50 remaining"
            variant="info"
          />
          <MetricCard
            label="Current Velocity"
            value="₹720/hr"
            subtitle="vs ₹750/hr required"
            variant="warning"
          />
          <MetricCard
            label="Fatigue Status"
            value="Low"
            subtitle="3.2 hrs active"
            variant="success"
          />
          <MetricCard
            label="Trips Completed"
            value="9"
            subtitle="Avg 21 min/trip"
          />
          <MetricCard
            label="Risk Events"
            value="4"
            subtitle="2 medium, 2 low"
            variant="warning"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-8 space-y-6">
            <DriverStatusPanel />
            <FinancialPacing />
            
            <div className="grid grid-cols-2 gap-6">
              <TripFrictionSummary />
              <RecentEvents />
            </div>
            
            <TripActivityMap />
          </div>

          {/* Right Column */}
          <div className="col-span-4 space-y-6">
            <WellnessNudge />
            <PersonaProfiles />
            
            {/* Additional Stats */}
            <div className="border border-border rounded-md p-6 bg-white">
              <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
                Shift Summary
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Start Time</span>
                  <span className="text-sm">11:15 AM</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="text-sm">3h 17m</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Acceptance Rate</span>
                  <span className="text-sm">87%</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-muted-foreground">Avg Rating</span>
                  <span className="text-sm">4.92</span>
                </div>
              </div>
            </div>

            {/* Context Summary */}
            <div className="border border-border rounded-md p-6 bg-white">
              <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
                Context Awareness
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Motion Sensors</span>
                  <span className="text-[#7ba88a]">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Audio Monitoring</span>
                  <span className="text-[#7ba88a]">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">GPS Tracking</span>
                  <span className="text-[#7ba88a]">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pattern Analysis</span>
                  <span className="text-[#7ba88a]">Running</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}