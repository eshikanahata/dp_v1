import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, MapPin, Clock, Star, AlertTriangle, Volume2, Activity, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, Area, ComposedChart } from 'recharts';

export function DebriefPage() {
  const navigate = useNavigate();

  // Generate trip timeline data
  const tripData = [
    { time: 0, motion: 2.1, audio: 45 },
    { time: 2, motion: 2.8, audio: 48 },
    { time: 4, motion: 3.2, audio: 52 },
    { time: 6, motion: 2.5, audio: 50 },
    { time: 8, motion: 4.1, audio: 68 },
    { time: 10, motion: 3.8, audio: 72 },
    { time: 12, motion: 6.8, audio: 88 }, // Spike moment
    { time: 14, motion: 9.2, audio: 95 }, // Peak combined conflict
    { time: 16, motion: 5.2, audio: 78 }, // Recovery start
    { time: 18, motion: 3.1, audio: 62 },
    { time: 20, motion: 2.6, audio: 54 },
    { time: 22, motion: 2.3, audio: 49 },
    { time: 24, motion: 2.0, audio: 46 },
    { time: 26, motion: 1.8, audio: 44 },
  ];

  const events = [
    { time: 14, type: 'combined', label: 'Combined Conflict' }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="flex items-center justify-between px-8 h-16">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg">Trip Debrief</h1>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Trip Summary Strip */}
        <div className="border border-border rounded-md p-6 bg-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div>
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                  Trip ID
                </div>
                <div className="text-lg font-mono">TRIP028</div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <div className="text-xs text-muted-foreground mb-1">Fare</div>
                <div className="text-lg">₹145</div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <div className="text-xs text-muted-foreground mb-1">Rating</div>
                <div className="text-lg text-[#7ba88a]">Smooth</div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <div className="text-xs text-muted-foreground mb-1">Duration</div>
                <div className="text-lg">26 min</div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <div className="text-xs text-muted-foreground mb-1">Driver Condition</div>
                <div className="text-sm">Stable after event recovery</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Heat Signature Section */}
        <div className="border border-border rounded-md bg-white mb-8">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-base">Trip Friction Heat-Signature</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Synchronized kinematic and environmental signals with conflict detection
            </p>
          </div>

          <div className="p-6">
            {/* Event Classification Legend */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-border bg-muted" />
                <span className="text-xs text-muted-foreground">Motion-Only</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-border bg-white" />
                <span className="text-xs text-muted-foreground">Audio-Only</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#d4a574]" />
                <span className="text-xs text-muted-foreground">Combined Conflict</span>
              </div>
            </div>

            {/* Kinematic (Motion) Intensity Chart */}
            <div className="mb-1">
              <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
                Kinematic (Motion) Intensity
              </div>
              <div style={{ width: '100%', height: 140 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={tripData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 11, fill: '#737373' }}
                      axisLine={{ stroke: '#e5e5e5' }}
                      label={{ value: 'Time (minutes)', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#737373' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: '#737373' }}
                      axisLine={{ stroke: '#e5e5e5' }}
                      label={{ value: 'm/s²', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#737373' }}
                      domain={[0, 10]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e5e5e5',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="motion" 
                      stroke="#171717" 
                      strokeWidth={2}
                      fill="#f5f5f5"
                      fillOpacity={0.6}
                    />
                    {/* Highlight conflict region */}
                    <ReferenceDot 
                      x={14} 
                      y={9.2} 
                      r={6} 
                      fill="#d4a574" 
                      stroke="#d4a574" 
                      strokeWidth={2}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Environmental (Audio) Levels Chart */}
            <div className="mb-6">
              <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
                Environmental (Audio) Levels
              </div>
              <div style={{ width: '100%', height: 140 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={tripData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 11, fill: '#737373' }}
                      axisLine={{ stroke: '#e5e5e5' }}
                      label={{ value: 'Time (minutes)', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#737373' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: '#737373' }}
                      axisLine={{ stroke: '#e5e5e5' }}
                      label={{ value: 'dB', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#737373' }}
                      domain={[40, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e5e5e5',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="audio" 
                      stroke="#525252" 
                      strokeWidth={2}
                      fill="#fafafa"
                      fillOpacity={0.6}
                    />
                    {/* Highlight conflict region */}
                    <ReferenceDot 
                      x={14} 
                      y={95} 
                      r={6} 
                      fill="#d4a574" 
                      stroke="#d4a574" 
                      strokeWidth={2}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Combined Event Annotation */}
            <div className="border border-[#d4a574]/30 rounded-md p-5 bg-[#d4a574]/5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#d4a574]/20 border border-[#d4a574]/40 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-[#d4a574]" />
                </div>
                <div className="flex-1">
                  <div className="text-sm mb-2">Combined Conflict Moment</div>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Harsh Brake</div>
                      <div className="text-sm">6.2 m/s²</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Sustained Audio</div>
                      <div className="text-sm">95 dB</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Context</div>
                      <div className="text-sm">Heavy Traffic</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground border-t border-[#d4a574]/20 pt-3">
                    We hope you are okay
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Trip Insights */}
          <div className="col-span-8 border border-border rounded-md p-6 bg-white">
            <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
              Trip Insights & Recommendations
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 border border-border rounded bg-muted/30">
                <Activity className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm mb-1">Friction Clustering</div>
                  <div className="text-xs text-muted-foreground">
                    Friction mostly clustered near traffic bottleneck at minute 12-16. Environmental factors contributed to elevated stress signature.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 border border-border rounded bg-muted/30">
                <Star className="w-5 h-5 text-[#7ba88a] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm mb-1">Recovery Pattern</div>
                  <div className="text-xs text-muted-foreground">
                    Driver recovered pacing after event. Motion intensity normalized within 4 minutes, indicating good adaptive response.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 border border-border rounded bg-muted/30">
                <AlertTriangle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm mb-1">Risk Pattern Analysis</div>
                  <div className="text-xs text-muted-foreground">
                    No repeated high-risk pattern after minute 14. Single isolated incident with successful de-escalation.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 border border-border rounded bg-muted/30">
                <Volume2 className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm mb-1">Audio Context</div>
                  <div className="text-xs text-muted-foreground">
                    Sustained audio levels detected during conflict window aligned with traffic density data. No anomalous cabin interaction patterns.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Route Context Panel */}
          <div className="col-span-4 space-y-6">
            <div className="border border-border rounded-md p-5 bg-white">
              <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
                Trip Context
              </div>

              <div className="relative h-48 bg-muted rounded overflow-hidden mb-4">
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid-debrief" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#000000" strokeWidth="0.5" opacity="0.1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-debrief)" />
                  </svg>
                </div>

                <div className="absolute top-1/4 left-1/4">
                  <MapPin className="w-4 h-4 text-[#7ba88a]" fill="currentColor" />
                </div>
                <div className="absolute bottom-1/4 right-1/4">
                  <MapPin className="w-4 h-4 text-foreground" />
                </div>

                {/* Conflict marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 rounded-full bg-[#d4a574] animate-pulse" />
                </div>
                
                <div className="absolute top-1/4 left-1/4 bottom-1/4 right-1/4 border border-foreground/20" />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Distance</span>
                  <span>8.2 km</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Avg Speed</span>
                  <span>18 km/h</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Traffic Condition</span>
                  <span className="text-[#d4a574]">Heavy</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Time of Day</span>
                  <span>Evening Rush</span>
                </div>
              </div>
            </div>

            <div className="border border-border rounded-md p-5 bg-white">
              <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
                Event Summary
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Motion Events</span>
                  <span className="text-sm">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Audio Events</span>
                  <span className="text-sm">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Combined Events</span>
                  <span className="text-sm text-[#d4a574]">1</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm text-muted-foreground">Overall Trip Score</span>
                  <span className="text-sm text-[#7ba88a]">Good</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}