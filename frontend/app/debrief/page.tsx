"use client";
import { ArrowLeft, MapPin, Star, AlertTriangle, Volume2, Activity } from "lucide-react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, Area, ComposedChart } from "recharts";

const tripData = [
  { time: 0, motion: 2.1, audio: 45 }, { time: 2, motion: 2.8, audio: 48 },
  { time: 4, motion: 3.2, audio: 52 }, { time: 6, motion: 2.5, audio: 50 },
  { time: 8, motion: 4.1, audio: 68 }, { time: 10, motion: 3.8, audio: 72 },
  { time: 12, motion: 6.8, audio: 88 }, { time: 14, motion: 9.2, audio: 95 },
  { time: 16, motion: 5.2, audio: 78 }, { time: 18, motion: 3.1, audio: 62 },
  { time: 20, motion: 2.6, audio: 54 }, { time: 22, motion: 2.3, audio: 49 },
  { time: 24, motion: 2.0, audio: 46 }, { time: 26, motion: 1.8, audio: 44 },
];

const TOOLTIP_STYLE = {
  backgroundColor: "#ffffff", border: "1px solid #e5e5e5", borderRadius: "4px", fontSize: "12px",
};

export default function DebriefPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-8 h-16 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-black transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Trip Debrief</h1>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Trip Summary Strip */}
        <div className="border border-gray-200 rounded-md p-6 bg-white mb-8">
          <div className="flex items-center gap-8">
            {[["Trip ID", "TRIP028", "font-mono text-lg"], ["Fare", "₹145", "text-lg"], ["Rating", "Smooth", "text-lg text-[#7ba88a]"], ["Duration", "26 min", "text-lg"], ["Driver Condition", "Stable after event recovery", "text-sm"]].map(([label, val, cls]) => (
              <div key={label as string} className="flex flex-col">
                <div className="text-xs font-medium text-gray-600 mb-1">{label}</div>
                <div className={`font-semibold text-gray-900 ${cls as string}`}>{val}</div>
              </div>
            )).reduce((acc, el, i) => i === 0 ? [el] : [...acc, <div key={`sep${i}`} className="h-10 w-px bg-gray-200" />, el], [] as React.ReactNode[])}
          </div>
        </div>

        {/* Heat Signature Charts */}
        <div className="border border-gray-200 rounded-md bg-white mb-8">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">Trip Friction Heat-Signature</h2>
            <p className="text-xs text-gray-600 mt-1">Synchronized kinematic and environmental signals with conflict detection</p>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-6 mb-6">
              {[["bg-gray-200 border border-gray-300", "Motion-Only"], ["bg-white border border-gray-300", "Audio-Only"], ["bg-[#d4a574]", "Combined Conflict"]].map(([bg, label]) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 ${bg}`} />
                  <span className="text-xs font-medium text-gray-700">{label}</span>
                </div>
              ))}
            </div>

            {/* Motion chart */}
            <div className="mb-4">
              <div className="text-xs font-medium text-gray-600 mb-3 uppercase tracking-wider">Kinematic (Motion) Intensity</div>
              <div style={{ height: 140 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={tripData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#737373" }} axisLine={{ stroke: "#e5e5e5" }} label={{ value: "Time (minutes)", position: "insideBottom", offset: -5, fontSize: 11, fill: "#737373" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#737373" }} axisLine={{ stroke: "#e5e5e5" }} domain={[0, 10]} label={{ value: "m/s²", angle: -90, position: "insideLeft", fontSize: 11, fill: "#737373" }} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Area type="monotone" dataKey="motion" stroke="#171717" strokeWidth={2} fill="#f5f5f5" fillOpacity={0.6} />
                    <ReferenceDot x={14} y={9.2} r={6} fill="#d4a574" stroke="#d4a574" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Audio chart */}
            <div className="mb-6">
              <div className="text-xs font-medium text-gray-600 mb-3 uppercase tracking-wider">Environmental (Audio) Levels</div>
              <div style={{ height: 140 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={tripData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#737373" }} axisLine={{ stroke: "#e5e5e5" }} label={{ value: "Time (minutes)", position: "insideBottom", offset: -5, fontSize: 11, fill: "#737373" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#737373" }} axisLine={{ stroke: "#e5e5e5" }} domain={[40, 100]} label={{ value: "dB", angle: -90, position: "insideLeft", fontSize: 11, fill: "#737373" }} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Area type="monotone" dataKey="audio" stroke="#525252" strokeWidth={2} fill="#fafafa" fillOpacity={0.6} />
                    <ReferenceDot x={14} y={95} r={6} fill="#d4a574" stroke="#d4a574" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Combined conflict annotation */}
            <div className="border border-[#d4a574]/30 rounded-md p-5 bg-[#d4a574]/5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#d4a574]/20 border border-[#d4a574]/40 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-[#d4a574]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-2">Combined Conflict Moment</div>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    {[["Harsh Brake", "6.2 m/s²"], ["Sustained Audio", "95 dB"], ["Context", "Heavy Traffic"]].map(([k, v]) => (
                      <div key={k}><div className="text-xs font-medium text-gray-600 mb-1">{k}</div><div className="text-sm font-semibold text-gray-900">{v}</div></div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-700 border-t border-[#d4a574]/20 pt-3">We hope you are okay</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Trip Insights */}
          <div className="col-span-8 border border-gray-200 rounded-md p-6 bg-white">
            <div className="text-xs font-medium text-gray-600 mb-4 uppercase tracking-wider">Trip Insights & Recommendations</div>
            <div className="space-y-4">
              {[
                { icon: <Activity className="w-5 h-5 text-gray-600" />, title: "Friction Clustering", body: "Friction mostly clustered near traffic bottleneck at minute 12-16. Environmental factors contributed to elevated stress signature." },
                { icon: <Star className="w-5 h-5 text-[#7ba88a]" />, title: "Recovery Pattern", body: "Driver recovered pacing after event. Motion intensity normalized within 4 minutes, indicating good adaptive response." },
                { icon: <AlertTriangle className="w-5 h-5 text-gray-600" />, title: "Risk Pattern Analysis", body: "No repeated high-risk pattern after minute 14. Single isolated incident with successful de-escalation." },
                { icon: <Volume2 className="w-5 h-5 text-gray-600" />, title: "Audio Context", body: "Sustained audio levels detected during conflict window aligned with traffic density data. No anomalous cabin interaction patterns." },
              ].map(({ icon, title, body }) => (
                <div key={title} className="flex items-start gap-3 p-4 border border-gray-200 rounded bg-gray-50">
                  <div className="flex-shrink-0 mt-0.5">{icon}</div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">{title}</div>
                    <div className="text-xs text-gray-700">{body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Route Context */}
          <div className="col-span-4 space-y-6">
            <div className="border border-gray-200 rounded-md p-5 bg-white">
              <div className="text-xs font-medium text-gray-600 mb-4 uppercase tracking-wider">Trip Context</div>
              <div className="relative h-48 bg-gray-100 rounded mb-4 overflow-hidden">
                <div className="absolute top-1/4 left-1/4"><MapPin className="w-4 h-4 text-[#7ba88a]" fill="currentColor" /></div>
                <div className="absolute bottom-1/4 right-1/4"><MapPin className="w-4 h-4 text-black" /></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 rounded-full bg-[#d4a574] animate-pulse" />
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {[["Distance", "8.2 km"], ["Avg Speed", "18 km/h"], ["Traffic Condition", "Heavy", "text-[#d4a574]"], ["Time of Day", "Evening Rush"]].map(([k, v, cls]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-600">{k}</span>
                    <span className={`font-semibold text-gray-900 ${cls as string ?? ""}`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-gray-200 rounded-md p-5 bg-white">
              <div className="text-xs font-medium text-gray-600 mb-4 uppercase tracking-wider">Event Summary</div>
              <div className="space-y-3">
                {[["Motion Events", "3"], ["Audio Events", "2"], ["Combined Events", "1", "text-[#d4a574]"], ["Overall Trip Score", "Good", "text-[#7ba88a]"]].map(([k, v, cls], i) => (
                  <div key={k} className={`flex items-center justify-between ${i === 3 ? "pt-3 border-t border-gray-200" : ""}`}>
                    <span className="text-sm text-gray-600">{k}</span>
                    <span className={`text-sm font-semibold text-gray-900 ${cls ?? ""}`}>{v}</span>
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
