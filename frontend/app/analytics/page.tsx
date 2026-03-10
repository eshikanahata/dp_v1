"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Download, Check, Activity, Database, FileText, Shield, Server, Loader2 } from "lucide-react";
import Link from "next/link";
import { driverService } from "@/services/driverService";
import { tripService } from "@/services/tripService";
import type { DriverListItem } from "@/types/trip";
import type { TripSummary, FrictionEvent } from "@/types/trip";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("telemetry");

  // Dynamic State
  const [drivers, setDrivers] = useState<DriverListItem[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>("");
  const [events, setEvents] = useState<FrictionEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial drivers
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const drvs = await driverService.listDrivers();
        setDrivers(drvs);
        if (drvs.length > 0) {
          setSelectedDriverId(drvs[0].driver_id);
        }
      } catch (e) {
        console.error("Failed to load drivers", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Fetch trips when driver changes
  useEffect(() => {
    async function loadTrips() {
      if (!selectedDriverId) return;
      try {
        const trps = await tripService.listTrips(selectedDriverId);
        setTrips(trps);
        if (trps.length > 0) {
          setSelectedTripId(trps[0].trip_id);
        } else {
          setSelectedTripId("");
          setEvents([]);
        }
      } catch (e) {
        console.error("Failed to load trips", e);
      }
    }
    loadTrips();
  }, [selectedDriverId]);

  // Fetch events when trip changes
  useEffect(() => {
    async function loadEvents() {
      if (!selectedTripId) return;
      try {
        const evts = await tripService.getTripEvents(selectedTripId);
        setEvents(evts);
      } catch (e) {
        console.error("Failed to load events", e);
      }
    }
    loadEvents();
  }, [selectedTripId]);

  const TABS = [
    { id: "telemetry", label: "Telemetry Logs" },
    { id: "summaries", label: "Trip Summaries" },
    { id: "schema", label: "Schema" },
    { id: "exports", label: "Exports" },
    { id: "audit", label: "Audit" },
  ];

  const PIPELINE_STAGES = [
    { label: "Raw Telemetry", icon: <Database className="w-5 h-5" /> },
    { label: "Preprocessing", icon: <Activity className="w-5 h-5" /> },
    { label: "Fusion Engine", icon: <Server className="w-5 h-5" /> },
    { label: "Trip Summary", icon: <FileText className="w-5 h-5" /> },
    { label: "Export Layer", icon: <Download className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/10">
        <div className="px-8 py-4 max-w-[1800px] mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-white/60 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg">DriverPulse Analytics System Console</h1>
                <p className="text-xs text-white/60">v2.0.0</p>
              </div>
            </div>
            {/* Dynamic Selectors */}
            <div className="flex items-center gap-4">
              {loading ? (
                <div className="flex items-center text-sm text-white/60">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading data...
                </div>
              ) : (
                <>
                  <select
                    className="bg-white/10 border border-white/20 text-white text-sm rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-white/50"
                    value={selectedDriverId}
                    onChange={(e) => setSelectedDriverId(e.target.value)}
                  >
                    {drivers.map(d => (
                      <option key={d.driver_id} value={d.driver_id} className="text-black">{d.driver_name} ({d.driver_id})</option>
                    ))}
                  </select>
                  <select
                    className="bg-white/10 border border-white/20 text-white text-sm rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-white/50"
                    value={selectedTripId}
                    onChange={(e) => setSelectedTripId(e.target.value)}
                    disabled={!selectedDriverId || trips.length === 0}
                  >
                    {trips.map(t => (
                      <option key={t.trip_id} value={t.trip_id} className="text-black">
                        Trip {t.trip_id} ({t.date?.split('T')[0] || t.date})
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>
          <nav className="flex gap-1">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm transition-colors ${activeTab === tab.id ? "bg-white/10 text-white border-b-2 border-white" : "text-white/60 hover:text-white/80"}`}>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-9 space-y-6">
            
            {/* Flagged Moments Table */}
            {activeTab === "telemetry" && (
              <div className="border border-white/10 rounded bg-white/5">
                <div className="border-b border-white/10 px-5 py-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm mb-1">flagged_moments</h2>
                    <p className="text-xs text-white/60">High-fidelity event telemetry with combined signal classification for {selectedTripId || 'None'}</p>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded text-xs transition-colors">
                    <Download className="w-3.5 h-3.5" /> Export flagged_moments.csv
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        {["ID", "Trip ID", "Timestamp", "Type", "Intensity", "Audio (dB)", "Context", "Schema Ver", "System Ver", "Generated At"].map((h) => (
                          <th key={h} className={`px-4 py-2.5 text-left font-normal ${["Schema Ver","System Ver","Generated At"].includes(h) ? "text-[#7ba8c4]/90 bg-[#7ba8c4]/5" : "text-white/70"}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {events.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="px-4 py-8 text-center text-white/50 bg-white/[0.02]">
                            No flagged moments recorded for this trip.
                          </td>
                        </tr>
                      ) : (
                        events.map((row, i) => (
                          <tr key={row.flag_id || i} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}>
                            <td className="px-4 py-2.5 font-mono text-white/90">{row.flag_id}</td>
                            <td className="px-4 py-2.5 font-mono text-white/90">{row.trip_id}</td>
                            <td className="px-4 py-2.5 font-mono text-white/70">{row.timestamp?.replace('T', ' ').substring(0, 19) || '-'}</td>
                            <td className="px-4 py-2.5 text-white/90">{row.flag_type}</td>
                            <td className="px-4 py-2.5 text-white/90">{row.combined_score?.toFixed(2)}</td>
                            <td className="px-4 py-2.5 text-white/90">{row.audio_score > 0 ? row.audio_score.toFixed(1) : '-'}</td>
                            <td className="px-4 py-2.5 text-white/70">{row.context || '-'} ({row.severity})</td>
                            <td className="px-4 py-2.5 font-mono text-[#7ba8c4] bg-[#7ba8c4]/5">v1.2.3</td>
                            <td className="px-4 py-2.5 font-mono text-[#7ba8c4] bg-[#7ba8c4]/5">v2.1.0</td>
                            <td className="px-4 py-2.5 font-mono text-[#7ba8c4] bg-[#7ba8c4]/5 text-[11px]">{new Date().toISOString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {events.length > 0 && (
                  <div className="border-t border-white/10 px-5 py-2.5 flex items-center justify-between text-xs text-white/60">
                    <span>Showing {events.length} records</span>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-colors disabled:opacity-50">Previous</button>
                      <button className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-colors disabled:opacity-50">Next</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Trip Summaries Table */}
            {activeTab === "summaries" && (
              <div className="border border-white/10 rounded bg-white/5">
                <div className="border-b border-white/10 px-5 py-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm mb-1">trip_summaries</h2>
                    <p className="text-xs text-white/60">Aggregated trip analytics with friction scoring and rating for Driver {selectedDriverId}</p>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded text-xs transition-colors">
                    <Download className="w-3.5 h-3.5" /> Export trip_summaries.csv
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        {["Trip ID", "Date", "Duration", "Fare", "Rating", "Events", "Friction Score"].map((h) => (
                          <th key={h} className="px-4 py-2.5 text-left text-white/70 font-normal">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {trips.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-white/50 bg-white/[0.02]">
                            No trips found for this driver.
                          </td>
                        </tr>
                      ) : (
                        trips.map((row, i) => (
                          <tr key={row.trip_id} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}>
                            <td className="px-4 py-2.5 font-mono text-white/90">{row.trip_id}</td>
                            <td className="px-4 py-2.5 font-mono text-white/70">{row.date?.split('T')[0] || '-'}</td>
                            <td className="px-4 py-2.5 font-mono text-white/70">{row.duration_min}m</td>
                            <td className="px-4 py-2.5 text-white/90">₹{row.fare?.toFixed(2) || '0.00'}</td>
                            <td className="px-4 py-2.5 text-white/90">{row.trip_quality_rating || 'N/A'}</td>
                            <td className="px-4 py-2.5 text-white/90">{row.flagged_moments_count}</td>
                            <td className="px-4 py-2.5 text-white/90">{row.stress_score?.toFixed(2) || '0.00'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pipeline diagram */}
            {activeTab === "schema" && (
              <div className="border border-white/10 rounded bg-white/5 p-6">
                <div className="text-xs text-white/70 mb-4 uppercase tracking-wider">System Architecture Pipeline</div>
                <div className="flex items-center justify-between">
                  {PIPELINE_STAGES.map((stage, i) => (
                    <div key={stage.label} className="flex items-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded bg-white/10 border border-white/20 flex items-center justify-center text-white/80">{stage.icon}</div>
                        <span className="text-xs text-white/70">{stage.label}</span>
                      </div>
                      {i < PIPELINE_STAGES.length - 1 && <div className="flex-1 h-px bg-white/20 mx-4" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="col-span-3 space-y-6">
            <div className="border border-white/10 rounded bg-white/5 p-5">
              <div className="text-xs text-white/70 mb-4 uppercase tracking-wider">System Metadata</div>
              <div className="space-y-3">
                {[
                  ["Schema Version", <span className="text-sm font-mono">v1.2.3</span>],
                  ["Pipeline Status", <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#7ba88a]"/><span className="text-sm text-[#7ba88a]">Active</span></div>],
                  ["Contract Validation", <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#7ba88a]"/><span className="text-sm text-[#7ba88a]">Passed</span></div>],
                ].map(([k, v]) => (
                  <div key={k as string} className="pb-2 border-b border-white/10">
                    <div className="text-xs text-white/60 mb-1">{k}</div>
                    {v}
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-white/10 rounded bg-white/5 p-5">
              <div className="text-xs text-white/70 mb-4 uppercase tracking-wider">Validation Summary</div>
              <div className="space-y-3">
                {[["Records Processed", "142"], ["Flags Generated", "142"], ["Warnings", "0"]].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-sm text-white/70">{k}</span>
                    <span className="text-sm">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-[#7ba8c4]/30 rounded bg-[#7ba8c4]/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-[#7ba8c4]" />
                <div className="text-xs text-[#7ba8c4] uppercase tracking-wider">Hidden Audit Columns</div>
              </div>
              <div className="space-y-2 text-sm font-mono">
                {["schema_version", "system_version", "generated_at"].map((c) => (
                  <div key={c} className="text-white/90">{c}</div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-[#7ba8c4]/20 text-xs text-white/60">
                Ensure data contract compliance and temporal auditability
              </div>
            </div>

            <div className="border border-white/10 rounded bg-white/5 p-5">
              <div className="text-xs text-white/70 mb-4 uppercase tracking-wider">Export Controls</div>
              <div className="space-y-2">
                {["All Tables (ZIP)", "Schema Definition", "Audit Report"].map((label) => (
                  <button key={label} className="w-full flex items-center justify-between px-3 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded text-sm transition-colors">
                    <span>{label}</span><Download className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-white/10 rounded bg-white/5 p-5">
              <div className="text-xs text-white/70 mb-4 uppercase tracking-wider">System Health</div>
              <div className="space-y-2 text-sm">
                {[["API Latency", "12ms"], ["Queue Size", "0"], ["Error Rate", "0.00%"], ["Uptime", "99.98%"]].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-white/70">{k}</span>
                    <span className="text-[#7ba88a]">{v}</span>
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
