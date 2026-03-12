"use client";
import { useState } from "react";
import { ArrowLeft, Download, Check, Activity, Database, FileText, Server, Settings, Shield } from "lucide-react";
import Link from "next/link";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("telemetry");

  const TABS = [
    { id: "telemetry", label: "Telemetry Logs" },
    { id: "summaries", label: "Trip Summaries" },
    { id: "schema", label: "Schema" },
    { id: "exports", label: "Exports" },
    { id: "audit", label: "Audit" },
  ];

  const PIPELINE_STAGES = [
    { label: "Raw Telemetry", icon: <Database className="w-5 h-5 mb-3" /> },
    { label: "Preprocessing", icon: <Activity className="w-5 h-5 mb-3" /> },
    { label: "Fusion Engine", icon: <Server className="w-5 h-5 mb-3" /> },
    { label: "Trip Summary", icon: <FileText className="w-5 h-5 mb-3" /> },
    { label: "Export Layer", icon: <Download className="w-5 h-5 mb-3" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <header className="border-b border-white/10 pt-4">
        <div className="px-8 max-w-[1800px] mx-auto">
          <div className="flex items-center justify-between xl:-ml-[2.5rem] xl:pl-0 mb-6 relative">
            <div className="flex items-start gap-4">
              <Link href="/dashboard" className="text-white/60 hover:text-white transition-colors mt-1">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-lg font-medium leading-none">DriverPulse Analytics System Console</h1>
                <p className="text-xs text-white/50 mt-1.5">v1.2.3</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="text-white/60 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <nav className="flex gap-6 -mb-[1px]">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-[13px] font-medium transition-colors border-b-2 ${activeTab === tab.id ? "text-white border-white" : "text-white/50 border-transparent hover:text-white/80"}`}>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-6">
            
            {/* Flagged Moments Table */}
            <div className="border border-white/10 rounded-lg bg-[#111111]">
              <div className="border-b border-white/10 px-5 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-[13px] font-semibold mb-1">flagged_moments</h2>
                  <p className="text-[11px] text-white/50">High-fidelity event telemetry with combined signal classification</p>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[11px] font-medium transition-colors">
                  <Download className="w-3.5 h-3.5" /> Export flagged_moments.csv
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                      <th className="px-5 py-3 text-left font-medium text-white/50">ID</th>
                      <th className="px-5 py-3 text-left font-medium text-white/50">Trip ID</th>
                      <th className="px-5 py-3 text-left font-medium text-white/50">Timestamp</th>
                      <th className="px-5 py-3 text-left font-medium text-white/50">Type</th>
                      <th className="px-5 py-3 text-left font-medium text-white/50">Intensity</th>
                      <th className="px-5 py-3 text-left font-medium text-white/50">Audio (dB)</th>
                      <th className="px-5 py-3 text-left font-medium text-white/50">Context</th>
                      <th className="px-5 py-3 text-left font-medium text-white/50">Schema Ver</th>
                      <th className="px-5 py-3 text-left font-medium text-white/50">System Ver</th>
                      <th className="px-5 py-3 text-left font-medium text-white/50">Generated At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {id: "FM_001", trip: "TRIP028", ts: "2024-03-09T14:32:18", type: "harsh_brake", int: "6.2", audio: "95", ctx: "heavy_traffic", gen: "2024-03-09T14:32:19.234Z"},
                      {id: "FM_002", trip: "TRIP028", ts: "2024-03-09T14:20:45", type: "sustained_audio", int: "2.1", audio: "88", ctx: "passenger_conflict", gen: "2024-03-09T14:20:46.124Z"},
                      {id: "FM_003", trip: "TRIP027", ts: "2024-03-09T13:15:32", type: "sudden_maneuver", int: "4.8", audio: "72", ctx: "traffic_avoid", gen: "2024-03-09T13:15:33.456Z"},
                      {id: "FM_004", trip: "TRIP026", ts: "2024-03-09T12:42:11", type: "combined_event", int: "5.3", audio: "91", ctx: "intersection", gen: "2024-03-09T12:42:12.789Z"},
                      {id: "FM_005", trip: "TRIP025", ts: "2024-03-09T11:58:29", type: "harsh_brake", int: "7.1", audio: "68", ctx: "pedestrian", gen: "2024-03-09T11:58:30.123Z"},
                    ].map((row, i) => (
                      <tr key={row.id} className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3 font-mono text-white/90">{row.id}</td>
                        <td className="px-5 py-3 font-mono text-white/90">{row.trip}</td>
                        <td className="px-5 py-3 font-mono text-white/70">{row.ts}</td>
                        <td className="px-5 py-3 text-white/80">{row.type}</td>
                        <td className="px-5 py-3 text-white/80">{row.int}</td>
                        <td className="px-5 py-3 text-white/80">{row.audio}</td>
                        <td className="px-5 py-3 text-white/60">{row.ctx}</td>
                        <td className="px-5 py-3 text-white/50 font-mono">v1.2.3</td>
                        <td className="px-5 py-3 text-white/50 font-mono">v2.1.0</td>
                        <td className="px-5 py-3 text-white/40 font-mono text-[10px]">{row.gen}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 flex items-center justify-between bg-white/[0.02] border-t border-white/10 rounded-b-lg">
                <span className="text-[11px] text-white/50">Showing 5 of 142 records</span>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 rounded text-[11px] font-medium transition-colors">Previous</button>
                  <button className="px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 rounded text-[11px] font-medium transition-colors">Next</button>
                </div>
              </div>
            </div>

            {/* Trip Summaries Table */}
            <div className="border border-white/10 rounded-lg bg-[#111111]">
              <div className="border-b border-white/10 px-5 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-[13px] font-semibold mb-1">trip_summaries</h2>
                  <p className="text-[11px] text-white/50">Aggregated trip analytics with friction scoring and rating</p>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[11px] font-medium transition-colors">
                  <Download className="w-3.5 h-3.5" /> Export trip_summaries.csv
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                      <th className="px-5 py-3 text-left font-medium text-white/50">Trip ID</th>
                      <th className="px-5 py-3 text-left font-medium text-white/50">Start Time</th>
                      <th className="px-5 py-3 text-left font-medium text-white/50">Duration</th>
                      <th className="px-5 py-3 text-left font-medium text-white/50">Fare</th>
                      <th className="px-5 py-3 text-left font-medium text-white/50">Rating</th>
                      <th className="px-5 py-3 text-left font-medium text-white/50">Events</th>
                      <th className="px-5 py-3 text-left font-medium text-white/50">Friction Score</th>
                      <th className="px-5 py-3 text-left font-medium text-white/50">Schema Ver</th>
                      <th className="px-5 py-3 text-left font-medium text-white/50">System Ver</th>
                      <th className="px-5 py-3 text-left font-medium text-white/50">Generated At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {id: "TRIP028", ts: "14:05:12", dur: "26m", fare: "₹145", rat: "smooth", ev: "3", score: "2.4", gen: "2024-03-09T14:31:45.234Z"},
                      {id: "TRIP027", ts: "13:02:18", dur: "18m", fare: "₹98", rat: "smooth", ev: "1", score: "1.2", gen: "2024-03-09T13:20:32.456Z"},
                      {id: "TRIP026", ts: "12:20:45", dur: "32m", fare: "₹187", rat: "moderate", ev: "5", score: "3.8", gen: "2024-03-09T12:52:18.789Z"},
                      {id: "TRIP025", ts: "11:35:22", dur: "22m", fare: "₹124", rat: "smooth", ev: "2", score: "1.8", gen: "2024-03-09T11:57:45.123Z"},
                      {id: "TRIP024", ts: "10:48:33", dur: "15m", fare: "₹76", rat: "smooth", ev: "0", score: "0.6", gen: "2024-03-09T11:03:48.234Z"},
                    ].map((row, i) => (
                      <tr key={row.id} className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3 font-mono text-white/90">{row.id}</td>
                        <td className="px-5 py-3 font-mono text-white/70">{row.ts}</td>
                        <td className="px-5 py-3 text-white/80">{row.dur}</td>
                        <td className="px-5 py-3 text-white/80">{row.fare}</td>
                        <td className="px-5 py-3 text-white/80">{row.rat}</td>
                        <td className="px-5 py-3 text-white/80">{row.ev}</td>
                        <td className="px-5 py-3 text-white/80">{row.score}</td>
                        <td className="px-5 py-3 text-white/50 font-mono">v1.2.3</td>
                        <td className="px-5 py-3 text-white/50 font-mono">v2.1.0</td>
                        <td className="px-5 py-3 text-white/40 font-mono text-[10px]">{row.gen}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 flex items-center justify-between bg-white/[0.02] border-t border-white/10 rounded-b-lg">
                <span className="text-[11px] text-white/50">Showing 5 of 28 records</span>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 rounded text-[11px] font-medium transition-colors">Previous</button>
                  <button className="px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 rounded text-[11px] font-medium transition-colors">Next</button>
                </div>
              </div>
            </div>

            {/* Pipeline diagram */}
            <div className="border border-white/10 rounded-lg bg-[#111111] p-6 lg:p-8">
              <div className="text-[10px] text-white/50 mb-8 uppercase tracking-[0.15em] font-medium">System Architecture Pipeline</div>
              <div className="flex flex-wrap items-center justify-between px-4 lg:px-12">
                {PIPELINE_STAGES.map((stage, i) => (
                  <div key={stage.label} className="flex flex-col items-center gap-1">
                    <div className="w-16 h-16 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center text-white/70 hover:bg-white/[0.05] hover:text-white transition-all cursor-pointer">
                      {stage.icon}
                    </div>
                    <span className="text-[11px] text-white/50 mt-2">{stage.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="border border-white/10 rounded-lg bg-[#111111] p-5">
              <div className="text-[10px] text-white/50 mb-5 uppercase tracking-[0.15em]">System Metadata</div>
              <div className="space-y-5">
                {[
                  ["Schema Version", <span key="schema" className="text-sm font-semibold tracking-wide">v1.2.3</span>],
                  ["Pipeline Status", <div key="status" className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#34d399] drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"/><span className="text-[13px] font-medium text-white/90">Active</span></div>],
                  ["Ingestion State", <span key="ingest" className="text-[13px] font-medium text-white/90">Real-time</span>],
                  ["Last Generation", <span key="gen" className="text-[13px] font-medium text-white/90">14:32:19</span>],
                  ["Contract Validation", <div key="valid" className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#34d399]"/><span className="text-[13px] font-medium text-white/90">Passed</span></div>],
                ].map(([k, v]) => (
                  <div key={k as string} className="pb-4 border-b border-white/[0.05] last:border-0 last:pb-0">
                    <div className="text-[11px] text-white/50 mb-1.5">{k}</div>
                    {v}
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-white/10 rounded-lg bg-[#111111] p-5">
              <div className="text-[10px] text-white/50 mb-5 uppercase tracking-[0.15em]">Validation Summary</div>
              <div className="space-y-4">
                {[["Records Processed", "142"], ["Flags Generated", "142"], ["Export Ready", <div key="r" className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#34d399]"/>Yes</div>], ["Warnings", "0"]].map(([k, v]) => (
                  <div key={k as string} className="flex items-center justify-between">
                    <span className="text-[12px] text-white/70">{k}</span>
                    <span className="text-[13px] font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border border-white/10 rounded-lg bg-[#111111] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-white/40" />
                <span className="text-[10px] text-white/50 uppercase tracking-[0.15em]">Hidden Audit Columns</span>
              </div>
              <div className="space-y-2.5 font-mono text-[11px] text-white/70">
                <p>schema_version</p>
                <p>system_version</p>
                <p>generated_at</p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.05]">
                <p className="text-[10px] text-white/40 leading-relaxed">Ensure data contract compliance and temporal auditability</p>
              </div>
            </div>

            <div className="border border-white/10 rounded-lg bg-[#111111] p-5">
              <div className="text-[10px] text-white/50 mb-4 uppercase tracking-[0.15em]">Export Controls</div>
              <div className="space-y-2">
                {["All Tables (ZIP)", "Schema Definition", "Audit Report"].map(label => (
                  <button key={label} className="w-full flex items-center justify-between rounded-md bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 px-4 py-2.5 transition-colors text-[12px] font-medium text-white/80 group">
                    {label}
                    <Download className="w-3.5 h-3.5 text-white/40 group-hover:text-white/80 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-white/10 rounded-lg bg-[#111111] p-5">
              <div className="text-[10px] text-white/50 uppercase tracking-[0.15em]">System Health</div>
              {/* Added placeholder for partially visible card */}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
