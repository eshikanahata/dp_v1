import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Download, Check, Activity, Database, FileText, Shield, AlertCircle, Server, Settings } from 'lucide-react';

export function AnalyticsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('telemetry');
  
  // Refs for scrolling
  const telemetryRef = useRef<HTMLDivElement>(null);
  const summariesRef = useRef<HTMLDivElement>(null);
  const schemaRef = useRef<HTMLDivElement>(null);
  const exportsRef = useRef<HTMLDivElement>(null);
  const auditRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    let ref = null;
    switch(tabId) {
      case 'telemetry':
        ref = telemetryRef;
        break;
      case 'summaries':
        ref = summariesRef;
        break;
      case 'schema':
        ref = schemaRef;
        break;
      case 'exports':
        ref = exportsRef;
        break;
      case 'audit':
        ref = auditRef;
        break;
    }
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Highlight effect
      ref.current.style.transition = 'all 0.3s ease';
      ref.current.style.boxShadow = '0 0 0 3px rgba(123, 168, 138, 0.3)';
      setTimeout(() => {
        if (ref && ref.current) {
          ref.current.style.boxShadow = '';
        }
      }, 1500);
    }
  };

  const flaggedMoments = [
    { id: 'FM_001', trip_id: 'TRIP028', timestamp: '2024-03-09T14:32:18', type: 'harsh_brake', intensity: 6.2, audio_db: 95, context: 'heavy_traffic', schema_version: 'v1.2.3', system_version: 'v2.1.0', generated_at: '2024-03-09T14:32:19.234Z' },
    { id: 'FM_002', trip_id: 'TRIP028', timestamp: '2024-03-09T14:20:45', type: 'sustained_audio', intensity: 2.1, audio_db: 88, context: 'passenger_conflict', schema_version: 'v1.2.3', system_version: 'v2.1.0', generated_at: '2024-03-09T14:20:46.124Z' },
    { id: 'FM_003', trip_id: 'TRIP027', timestamp: '2024-03-09T13:15:32', type: 'sudden_maneuver', intensity: 4.8, audio_db: 72, context: 'traffic_avoid', schema_version: 'v1.2.3', system_version: 'v2.1.0', generated_at: '2024-03-09T13:15:33.456Z' },
    { id: 'FM_004', trip_id: 'TRIP026', timestamp: '2024-03-09T12:42:11', type: 'combined_event', intensity: 5.3, audio_db: 91, context: 'intersection', schema_version: 'v1.2.3', system_version: 'v2.1.0', generated_at: '2024-03-09T12:42:12.789Z' },
    { id: 'FM_005', trip_id: 'TRIP025', timestamp: '2024-03-09T11:58:29', type: 'harsh_brake', intensity: 7.1, audio_db: 68, context: 'pedestrian', schema_version: 'v1.2.3', system_version: 'v2.1.0', generated_at: '2024-03-09T11:58:30.123Z' },
  ];

  const tripSummaries = [
    { trip_id: 'TRIP028', start_time: '14:05:12', duration_min: 26, fare: 145, rating: 'smooth', events: 3, friction_score: 2.4, schema_version: 'v1.2.3', system_version: 'v2.1.0', generated_at: '2024-03-09T14:31:45.234Z' },
    { trip_id: 'TRIP027', start_time: '13:02:18', duration_min: 18, fare: 98, rating: 'smooth', events: 1, friction_score: 1.2, schema_version: 'v1.2.3', system_version: 'v2.1.0', generated_at: '2024-03-09T13:20:32.456Z' },
    { trip_id: 'TRIP026', start_time: '12:20:45', duration_min: 32, fare: 187, rating: 'moderate', events: 5, friction_score: 3.8, schema_version: 'v1.2.3', system_version: 'v2.1.0', generated_at: '2024-03-09T12:52:18.789Z' },
    { trip_id: 'TRIP025', start_time: '11:35:22', duration_min: 22, fare: 124, rating: 'smooth', events: 2, friction_score: 1.8, schema_version: 'v1.2.3', system_version: 'v2.1.0', generated_at: '2024-03-09T11:57:45.123Z' },
    { trip_id: 'TRIP024', start_time: '10:48:33', duration_min: 15, fare: 76, rating: 'smooth', events: 0, friction_score: 0.6, schema_version: 'v1.2.3', system_version: 'v2.1.0', generated_at: '2024-03-09T11:03:48.234Z' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg">DriverPulse Analytics System Console</h1>
                <p className="text-xs text-white/60">v1.0</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/settings')}
              className="text-white/60 hover:text-white transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Technical Navigation Tabs */}
          <nav className="flex gap-1">
            {[
              { id: 'telemetry', label: 'Telemetry Logs' },
              { id: 'summaries', label: 'Trip Summaries' },
              { id: 'schema', label: 'Schema' },
              { id: 'exports', label: 'Exports' },
              { id: 'audit', label: 'Audit' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-4 py-2 text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white border-b-2 border-white'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Data Tables */}
          <div className="col-span-9 space-y-6">
            {/* Flagged Moments Table */}
            <div className="border border-white/10 rounded bg-white/5 backdrop-blur-sm" ref={telemetryRef}>
              <div className="border-b border-white/10 px-5 py-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm mb-1">flagged_moments</h2>
                  <p className="text-xs text-white/60">High-fidelity event telemetry with combined signal classification</p>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded text-xs transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  Export flagged_moments.csv
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-4 py-2.5 text-left text-white/70 font-normal">ID</th>
                      <th className="px-4 py-2.5 text-left text-white/70 font-normal">Trip ID</th>
                      <th className="px-4 py-2.5 text-left text-white/70 font-normal">Timestamp</th>
                      <th className="px-4 py-2.5 text-left text-white/70 font-normal">Type</th>
                      <th className="px-4 py-2.5 text-left text-white/70 font-normal">Intensity</th>
                      <th className="px-4 py-2.5 text-left text-white/70 font-normal">Audio (dB)</th>
                      <th className="px-4 py-2.5 text-left text-white/70 font-normal">Context</th>
                      <th className="px-4 py-2.5 text-left text-[#7ba8c4]/90 font-normal bg-[#7ba8c4]/5">Schema Ver</th>
                      <th className="px-4 py-2.5 text-left text-[#7ba8c4]/90 font-normal bg-[#7ba8c4]/5">System Ver</th>
                      <th className="px-4 py-2.5 text-left text-[#7ba8c4]/90 font-normal bg-[#7ba8c4]/5">Generated At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flaggedMoments.map((row, index) => (
                      <tr key={row.id} className={`border-b border-white/5 ${index % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                        <td className="px-4 py-2.5 font-mono text-white/90">{row.id}</td>
                        <td className="px-4 py-2.5 font-mono text-white/90">{row.trip_id}</td>
                        <td className="px-4 py-2.5 font-mono text-white/70">{row.timestamp}</td>
                        <td className="px-4 py-2.5 text-white/90">{row.type}</td>
                        <td className="px-4 py-2.5 text-white/90">{row.intensity}</td>
                        <td className="px-4 py-2.5 text-white/90">{row.audio_db}</td>
                        <td className="px-4 py-2.5 text-white/70">{row.context}</td>
                        <td className="px-4 py-2.5 font-mono text-[#7ba8c4] bg-[#7ba8c4]/5">{row.schema_version}</td>
                        <td className="px-4 py-2.5 font-mono text-[#7ba8c4] bg-[#7ba8c4]/5">{row.system_version}</td>
                        <td className="px-4 py-2.5 font-mono text-[#7ba8c4] bg-[#7ba8c4]/5 text-[11px]">{row.generated_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-white/10 px-5 py-2.5 flex items-center justify-between text-xs text-white/60">
                <span>Showing 5 of 142 records</span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-colors">Previous</button>
                  <button className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-colors">Next</button>
                </div>
              </div>
            </div>

            {/* Trip Summaries Table */}
            <div className="border border-white/10 rounded bg-white/5 backdrop-blur-sm" ref={summariesRef}>
              <div className="border-b border-white/10 px-5 py-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm mb-1">trip_summaries</h2>
                  <p className="text-xs text-white/60">Aggregated trip analytics with friction scoring and rating</p>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded text-xs transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  Export trip_summaries.csv
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-4 py-2.5 text-left text-white/70 font-normal">Trip ID</th>
                      <th className="px-4 py-2.5 text-left text-white/70 font-normal">Start Time</th>
                      <th className="px-4 py-2.5 text-left text-white/70 font-normal">Duration</th>
                      <th className="px-4 py-2.5 text-left text-white/70 font-normal">Fare</th>
                      <th className="px-4 py-2.5 text-left text-white/70 font-normal">Rating</th>
                      <th className="px-4 py-2.5 text-left text-white/70 font-normal">Events</th>
                      <th className="px-4 py-2.5 text-left text-white/70 font-normal">Friction Score</th>
                      <th className="px-4 py-2.5 text-left text-[#7ba8c4]/90 font-normal bg-[#7ba8c4]/5">Schema Ver</th>
                      <th className="px-4 py-2.5 text-left text-[#7ba8c4]/90 font-normal bg-[#7ba8c4]/5">System Ver</th>
                      <th className="px-4 py-2.5 text-left text-[#7ba8c4]/90 font-normal bg-[#7ba8c4]/5">Generated At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tripSummaries.map((row, index) => (
                      <tr key={row.trip_id} className={`border-b border-white/5 ${index % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                        <td className="px-4 py-2.5 font-mono text-white/90">{row.trip_id}</td>
                        <td className="px-4 py-2.5 font-mono text-white/70">{row.start_time}</td>
                        <td className="px-4 py-2.5 text-white/90">{row.duration_min}m</td>
                        <td className="px-4 py-2.5 text-white/90">₹{row.fare}</td>
                        <td className="px-4 py-2.5 text-white/90">{row.rating}</td>
                        <td className="px-4 py-2.5 text-white/90">{row.events}</td>
                        <td className="px-4 py-2.5 text-white/90">{row.friction_score}</td>
                        <td className="px-4 py-2.5 font-mono text-[#7ba8c4] bg-[#7ba8c4]/5">{row.schema_version}</td>
                        <td className="px-4 py-2.5 font-mono text-[#7ba8c4] bg-[#7ba8c4]/5">{row.system_version}</td>
                        <td className="px-4 py-2.5 font-mono text-[#7ba8c4] bg-[#7ba8c4]/5 text-[11px]">{row.generated_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-white/10 px-5 py-2.5 flex items-center justify-between text-xs text-white/60">
                <span>Showing 5 of 28 records</span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-colors">Previous</button>
                  <button className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-colors">Next</button>
                </div>
              </div>
            </div>

            {/* System Architecture Pipeline */}
            <div className="border border-white/10 rounded bg-white/5 backdrop-blur-sm p-6">
              <div className="text-xs text-white/70 mb-4 uppercase tracking-wider">
                System Architecture Pipeline
              </div>

              <div className="flex items-center justify-between">
                {[
                  { label: 'Raw Telemetry', icon: <Database className="w-5 h-5" /> },
                  { label: 'Preprocessing', icon: <Activity className="w-5 h-5" /> },
                  { label: 'Fusion Engine', icon: <Server className="w-5 h-5" /> },
                  { label: 'Trip Summary', icon: <FileText className="w-5 h-5" /> },
                  { label: 'Export Layer', icon: <Download className="w-5 h-5" /> }
                ].map((stage, index, arr) => (
                  <div key={stage.label} className="flex items-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-14 h-14 rounded bg-white/10 border border-white/20 flex items-center justify-center text-white/80">
                        {stage.icon}
                      </div>
                      <span className="text-xs text-white/70">{stage.label}</span>
                    </div>
                    {index < arr.length - 1 && (
                      <div className="flex-1 h-px bg-white/20 mx-4" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Metadata & Validation */}
          <div className="col-span-3 space-y-6">
            {/* System Metadata */}
            <div className="border border-white/10 rounded bg-white/5 backdrop-blur-sm p-5">
              <div className="text-xs text-white/70 mb-4 uppercase tracking-wider">
                System Metadata
              </div>

              <div className="space-y-3">
                <div className="pb-2 border-b border-white/10">
                  <div className="text-xs text-white/60 mb-1">Schema Version</div>
                  <div className="text-sm font-mono">v1.2.3</div>
                </div>
                <div className="pb-2 border-b border-white/10">
                  <div className="text-xs text-white/60 mb-1">Pipeline Status</div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#7ba88a]" />
                    <span className="text-sm text-[#7ba88a]">Active</span>
                  </div>
                </div>
                <div className="pb-2 border-b border-white/10">
                  <div className="text-xs text-white/60 mb-1">Ingestion State</div>
                  <div className="text-sm">Real-time</div>
                </div>
                <div className="pb-2 border-b border-white/10">
                  <div className="text-xs text-white/60 mb-1">Last Generation</div>
                  <div className="text-sm font-mono">14:32:19</div>
                </div>
                <div className="pb-2">
                  <div className="text-xs text-white/60 mb-1">Contract Validation</div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#7ba88a]" />
                    <span className="text-sm text-[#7ba88a]">Passed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Status */}
            <div className="border border-white/10 rounded bg-white/5 backdrop-blur-sm p-5">
              <div className="text-xs text-white/70 mb-4 uppercase tracking-wider">
                Validation Summary
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Records Processed</span>
                  <span className="text-sm">142</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Flags Generated</span>
                  <span className="text-sm">142</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Export Ready</span>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#7ba88a]" />
                    <span className="text-sm text-[#7ba88a]">Yes</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Warnings</span>
                  <span className="text-sm">0</span>
                </div>
              </div>
            </div>

            {/* Hidden Audit Columns Info */}
            <div className="border border-[#7ba8c4]/30 rounded bg-[#7ba8c4]/5 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-[#7ba8c4]" />
                <div className="text-xs text-[#7ba8c4] uppercase tracking-wider">
                  Hidden Audit Columns
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="text-white/90 font-mono">schema_version</div>
                <div className="text-white/90 font-mono">system_version</div>
                <div className="text-white/90 font-mono">generated_at</div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#7ba8c4]/20 text-xs text-white/60">
                Ensure data contract compliance and temporal auditability
              </div>
            </div>

            {/* Export Controls */}
            <div className="border border-white/10 rounded bg-white/5 backdrop-blur-sm p-5">
              <div className="text-xs text-white/70 mb-4 uppercase tracking-wider">
                Export Controls
              </div>

              <div className="space-y-2">
                <button className="w-full flex items-center justify-between px-3 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded text-sm transition-colors">
                  <span>All Tables (ZIP)</span>
                  <Download className="w-4 h-4" />
                </button>
                <button className="w-full flex items-center justify-between px-3 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded text-sm transition-colors">
                  <span>Schema Definition</span>
                  <Download className="w-4 h-4" />
                </button>
                <button className="w-full flex items-center justify-between px-3 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded text-sm transition-colors">
                  <span>Audit Report</span>
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* System Health */}
            <div className="border border-white/10 rounded bg-white/5 backdrop-blur-sm p-5">
              <div className="text-xs text-white/70 mb-4 uppercase tracking-wider">
                System Health
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">API Latency</span>
                  <span className="text-[#7ba88a]">12ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Queue Size</span>
                  <span className="text-[#7ba88a]">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Error Rate</span>
                  <span className="text-[#7ba88a]">0.00%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Uptime</span>
                  <span className="text-[#7ba88a]">99.98%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}