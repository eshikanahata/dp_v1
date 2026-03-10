"use client";
import { useState } from "react";
import { ArrowLeft, Activity, AlertTriangle, Volume2, Navigation, AlertCircle, MapPin, Coffee, Flag, Settings } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Link from "next/link";
import { Header } from "@/components/shared/Header";

export default function LiveShiftPage() {
  const [nudgeAcknowledged, setNudgeAcknowledged] = useState(false);

  const currentVelocity = 68;
  const requiredVelocity = 75;
  const progress = (currentVelocity / requiredVelocity) * 100;

  const COLORS = ["#d4a574", "#e5e5e5"];
  const data = [
    { name: "Complete", value: progress },
    { name: "Remaining", value: 100 - progress },
  ];

  const messages = [
    "You're doing great! Stay focused and safe.",
    "Every journey counts. Keep up the excellent work!",
    "Stay calm, stay safe. You've got this!",
  ];

  const events = [
    { time: "14:32:18", type: "Harsh Braking", icon: <AlertTriangle className="w-4 h-4" />, severity: "high" },
    { time: "14:31:45", type: "Sustained Cabin Audio", icon: <Volume2 className="w-4 h-4" />, severity: "medium" },
    { time: "14:30:12", type: "Sudden Maneuver", icon: <Navigation className="w-4 h-4" />, severity: "medium" },
    { time: "14:28:03", type: "Overlap Detected", icon: <AlertCircle className="w-4 h-4" />, severity: "high" },
    { time: "14:25:20", type: "Traffic Congestion", icon: <Activity className="w-4 h-4" />, severity: "low" },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-8 h-16 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-black transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">DriverPulse Live Shift</h1>
              <p className="text-xs text-gray-600">Real-time monitoring of earnings pace, trip friction, and driver wellbeing</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#7ba88a] animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Live Monitoring Active</span>
            </div>
            <Link href="/settings" className="text-gray-400 hover:text-black transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-8 space-y-6">
            {/* Financial Pacing */}
            <div className="border border-[#d4a574]/30 rounded-md p-8 bg-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wider">Financial Pacing</div>
                  <div className="text-sm font-semibold text-[#d4a574]">Velocity Lagging</div>
                </div>
                <div className="px-3 py-1 bg-[#d4a574]/10 border border-[#d4a574]/30 rounded text-xs font-medium text-[#d4a574]">
                  Attention Required
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="relative" style={{ width: 180, height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data} cx="50%" cy="50%" innerRadius={68} outerRadius={90}
                        startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                        {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl font-semibold text-gray-900">{progress.toFixed(0)}%</div>
                    <div className="text-xs font-medium text-gray-600">of target</div>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded p-4 bg-gray-50">
                      <div className="text-xs font-medium text-gray-600 mb-1">Current Velocity</div>
                      <div className="text-2xl font-semibold text-[#d4a574]">₹{currentVelocity}/hr</div>
                    </div>
                    <div className="border border-gray-200 rounded p-4 bg-gray-50">
                      <div className="text-xs font-medium text-gray-600 mb-1">Required Velocity</div>
                      <div className="text-2xl font-semibold text-gray-900">₹{requiredVelocity}/hr</div>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded p-4 bg-gray-50">
                    <div className="text-xs font-medium text-gray-600 mb-1">Goal Progress</div>
                    <div className="text-lg font-semibold text-gray-900">₹1,240 of ₹1,800 daily target</div>
                    <div className="text-xs font-medium text-gray-500 mt-1">₹560 remaining, ~3.2 hrs needed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Friction Status */}
            <div className="border border-gray-200 rounded-md p-6 bg-white">
              <div className="text-xs font-medium text-gray-600 mb-4 uppercase tracking-wider">Friction Status</div>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-[#d4a574]/10 border-2 border-[#d4a574] flex items-center justify-center">
                    <Activity className="w-10 h-10 text-[#d4a574]" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#d4a574] animate-pulse" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900 mb-2">Elevated Friction Detected</div>
                  <div className="text-sm font-medium text-gray-700 mb-3">Multiple stress indicators active in current shift</div>
                  <div className="flex gap-2">
                    {["Cabin Audio", "Motion Events", "Traffic Context"].map((tag) => (
                      <div key={tag} className="px-3 py-1 bg-[#d4a574]/10 border border-[#d4a574]/30 rounded text-xs font-medium text-[#d4a574]">{tag}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Event Stream */}
            <div className="border border-gray-200 rounded-md p-6 bg-white">
              <div className="text-xs font-medium text-gray-600 mb-4 uppercase tracking-wider">Real-Time Event Stream</div>
              <div className="space-y-2">
                {events.map((ev, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={ev.severity === "high" ? "text-black" : ev.severity === "medium" ? "text-[#d4a574]" : "text-gray-400"}>
                        {ev.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{ev.type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-600 font-mono">{ev.time}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${ev.severity === "high" ? "bg-black" : ev.severity === "medium" ? "bg-[#d4a574]" : "bg-gray-400"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Trip Context */}
            <div className="border border-gray-200 rounded-md p-6 bg-white">
              <div className="text-xs font-medium text-gray-600 mb-4 uppercase tracking-wider">Current Trip Context</div>
              <div className="relative h-32 bg-gray-100 rounded overflow-hidden">
                <div className="absolute top-1/2 left-1/4">
                  <MapPin className="w-5 h-5 text-[#7ba88a]" fill="currentColor" />
                </div>
                <div className="absolute top-1/2 right-1/4">
                  <MapPin className="w-5 h-5 text-black" />
                </div>
                <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-black/20">
                  <div className="absolute left-0 top-0 h-full w-3/5 bg-black/50" />
                </div>
                <div className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 rounded text-xs font-medium border border-gray-200 shadow-sm text-gray-900">
                  Trip in progress: 8.2 km
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-4 space-y-6">
            {/* Wellness Alert */}
            <div className="border border-[#d4a574]/30 rounded-md p-5 bg-[#d4a574]/5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#d4a574]/20 border border-[#d4a574]/40 flex items-center justify-center flex-shrink-0">
                  <Coffee className="w-5 h-5 text-[#d4a574]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-1">Wellness Alert</div>
                  {nudgeAcknowledged ? (
                    <div className="text-sm font-medium text-[#7ba88a]">{messages[0]}</div>
                  ) : (
                    <div className="text-xs font-medium text-gray-700">Consider a wellness pause in 5 minutes</div>
                  )}
                </div>
              </div>
              {!nudgeAcknowledged && (
                <div className="space-y-2 mb-4">
                  {[["Fatigue Index", "3.2"], ["Friction Signals", "4 recent"], ["Last Break", "2h 18m ago"]].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-xs">
                      <span className="font-medium text-gray-600">{k}</span><span className="font-semibold text-gray-900">{v}</span>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => setNudgeAcknowledged(!nudgeAcknowledged)}
                className={`w-full py-2.5 font-medium rounded text-sm transition-colors ${nudgeAcknowledged ? "bg-[#7ba88a] text-white" : "bg-black text-white hover:bg-black/80"}`}
              >
                {nudgeAcknowledged ? "Reset Nudge" : "Acknowledge Nudge"}
              </button>
            </div>

            {/* Trip Status */}
            <div className="border border-gray-200 rounded-md p-5 bg-white">
              <div className="text-xs font-medium text-gray-600 mb-4 uppercase tracking-wider">Trip Status</div>
              <div className="space-y-3">
                {[["Shift Duration", "3h 42m"], ["Trips Completed", "9"], ["Active Trip ID", "#247"], ["Last Flagged", "14:32:18"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm font-medium text-gray-600">{k}</span>
                    <span className="text-sm font-semibold text-gray-900">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Report Issue */}
            <div className="border-2 border-[#d4a574] rounded-md p-6 bg-gradient-to-br from-[#d4a574]/5 to-transparent">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#d4a574]/20 border-2 border-[#d4a574] flex items-center justify-center flex-shrink-0">
                  <Flag className="w-6 h-6 text-[#d4a574]" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Report Issue</div>
                  <div className="text-xs font-medium text-gray-700">Flagged events detected this shift</div>
                </div>
              </div>
              <div className="bg-white/50 rounded p-3 border border-[#d4a574]/20 mb-4">
                <div className="text-xs font-medium text-gray-600 mb-2">Recent Flags:</div>
                {[["Harsh Braking", "14:32:18"], ["Cabin Audio Event", "14:31:45"], ["Sudden Maneuver", "14:30:12"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs py-0.5">
                    <span className="font-medium text-gray-800">{k}</span><span className="font-medium text-[#d4a574]">{v}</span>
                  </div>
                ))}
              </div>
              <Link href="/debrief" className="w-full bg-[#d4a574] font-medium text-white rounded py-3 text-sm flex items-center justify-center gap-2 hover:bg-[#d4a574]/90 transition-colors">
                <Flag className="w-4 h-4" /> Review & Provide Feedback
              </Link>
            </div>

            {/* Active Sensors */}
            <div className="border border-gray-200 rounded-md p-5 bg-white">
              <div className="text-xs font-medium text-gray-600 mb-4 uppercase tracking-wider">Active Sensors</div>
              <div className="space-y-2 text-sm">
                {["Motion Detection", "Audio Analysis", "GPS Tracking", "ML Inference"].map((s) => (
                  <div key={s} className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{s}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#7ba88a]" />
                      <span className="text-xs font-semibold text-[#7ba88a]">Active</span>
                    </div>
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
