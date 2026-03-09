import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, AlertTriangle, Coffee, Flag, CheckCircle, Activity, Navigation, Volume2, AlertCircle, MapPin, Settings } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export function LiveShiftPage() {
  const navigate = useNavigate();
  const [nudgeAcknowledged, setNudgeAcknowledged] = useState(false);
  const currentVelocity = 68;
  const requiredVelocity = 75;
  const progress = (currentVelocity / requiredVelocity) * 100;

  const data = [
    { name: 'Complete', value: progress },
    { name: 'Remaining', value: 100 - progress }
  ];

  const COLORS = ['#d4a574', '#e5e5e5'];

  const motivationalMessages = [
    "You're doing great! Stay focused and safe.",
    "Every journey counts. Keep up the excellent work!",
    "Your dedication shows. Drive safe, drive smart.",
    "Excellence is a journey, not a destination. You're on the right path!",
    "Stay calm, stay safe. You've got this!"
  ];

  const getRandomMessage = () => {
    return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  };

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
            <div>
              <h1 className="text-lg">DriverPulse Live Shift</h1>
              <p className="text-xs text-muted-foreground">
                Real-time monitoring of earnings pace, trip friction, and driver wellbeing
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#7ba88a] animate-pulse" />
              <span className="text-sm text-muted-foreground">Live Monitoring Active</span>
            </div>
            <button
              onClick={() => navigate('/settings')}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Main Monitoring */}
          <div className="col-span-8 space-y-6">
            {/* Financial Pacing - Prominent */}
            <div className="border border-[#d4a574]/30 rounded-md p-8 bg-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                    Financial Pacing
                  </div>
                  <div className="text-sm text-[#d4a574]">Velocity Lagging</div>
                </div>
                <div className="px-3 py-1 bg-[#d4a574]/10 border border-[#d4a574]/30 rounded text-xs text-[#d4a574]">
                  Attention Required
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="relative" style={{ width: 180, height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={68}
                        outerRadius={90}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl mb-1">{progress.toFixed(0)}%</div>
                    <div className="text-xs text-muted-foreground">of target</div>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-border rounded p-4 bg-muted/30">
                      <div className="text-xs text-muted-foreground mb-1">Current Velocity</div>
                      <div className="text-2xl text-[#d4a574]">₹{currentVelocity}/hr</div>
                    </div>
                    <div className="border border-border rounded p-4 bg-muted/30">
                      <div className="text-xs text-muted-foreground mb-1">Required Velocity</div>
                      <div className="text-2xl">₹{requiredVelocity}/hr</div>
                    </div>
                  </div>
                  <div className="border border-border rounded p-4 bg-muted/30">
                    <div className="text-xs text-muted-foreground mb-1">Goal Progress</div>
                    <div className="text-lg">₹1,240 of ₹1,800 daily target</div>
                    <div className="text-xs text-muted-foreground mt-1">₹560 remaining, ~3.2 hrs needed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stress Orb / Friction Status */}
            <div className="border border-border rounded-md p-6 bg-white">
              <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
                Friction Status
              </div>

              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-[#d4a574]/10 border-2 border-[#d4a574] flex items-center justify-center">
                    <Activity className="w-10 h-10 text-[#d4a574]" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#d4a574] animate-pulse" />
                </div>

                <div className="flex-1">
                  <div className="text-lg mb-2">Elevated Friction Detected</div>
                  <div className="text-sm text-muted-foreground mb-3">
                    Multiple stress indicators active in current shift
                  </div>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 bg-[#d4a574]/10 border border-[#d4a574]/30 rounded text-xs">
                      Cabin Audio
                    </div>
                    <div className="px-3 py-1 bg-[#d4a574]/10 border border-[#d4a574]/30 rounded text-xs">
                      Motion Events
                    </div>
                    <div className="px-3 py-1 bg-[#d4a574]/10 border border-[#d4a574]/30 rounded text-xs">
                      Traffic Context
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Event Stream */}
            <div className="border border-border rounded-md p-6 bg-white">
              <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
                Real-Time Event Stream
              </div>

              <div className="space-y-2">
                {[
                  { time: '14:32:18', type: 'Harsh Braking', icon: <AlertTriangle className="w-4 h-4" />, severity: 'high' },
                  { time: '14:31:45', type: 'Sustained Cabin Audio', icon: <Volume2 className="w-4 h-4" />, severity: 'medium' },
                  { time: '14:30:12', type: 'Sudden Maneuver', icon: <Navigation className="w-4 h-4" />, severity: 'medium' },
                  { time: '14:28:03', type: 'Overlap Detected', icon: <AlertCircle className="w-4 h-4" />, severity: 'high' },
                  { time: '14:25:20', type: 'Traffic Congestion', icon: <Activity className="w-4 h-4" />, severity: 'low' }
                ].map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-border rounded hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`${
                        event.severity === 'high' ? 'text-foreground' :
                        event.severity === 'medium' ? 'text-[#d4a574]' :
                        'text-muted-foreground'
                      }`}>
                        {event.icon}
                      </div>
                      <span className="text-sm">{event.type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground font-mono">{event.time}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        event.severity === 'high' ? 'bg-foreground' :
                        event.severity === 'medium' ? 'bg-[#d4a574]' :
                        'bg-muted-foreground'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini Route Strip */}
            <div className="border border-border rounded-md p-6 bg-white">
              <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
                Current Trip Context
              </div>

              <div className="relative h-32 bg-muted rounded overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid-live" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#000000" strokeWidth="0.5" opacity="0.1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-live)" />
                  </svg>
                </div>

                <div className="absolute top-1/2 left-1/4">
                  <MapPin className="w-5 h-5 text-[#7ba88a]" fill="currentColor" />
                </div>
                <div className="absolute top-1/2 right-1/4">
                  <MapPin className="w-5 h-5 text-foreground" />
                </div>
                
                <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-foreground/20">
                  <div className="absolute left-0 top-0 h-full w-3/5 bg-foreground/60" />
                </div>

                <div className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 rounded text-xs border border-border">
                  Trip in progress: 8.2 km
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Alerts & Actions */}
          <div className="col-span-4 space-y-6">
            {/* Wellness Nudge - Prominent */}
            <div className="border border-[#d4a574]/30 rounded-md p-5 bg-[#d4a574]/5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#d4a574]/20 border border-[#d4a574]/40 flex items-center justify-center flex-shrink-0">
                  <Coffee className="w-5 h-5 text-[#d4a574]" />
                </div>
                <div>
                  <div className="text-sm mb-1">Wellness Alert</div>
                  {nudgeAcknowledged ? (
                    <div className="text-sm text-[#7ba88a] font-medium">
                      {getRandomMessage()}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      Consider a wellness pause in 5 minutes
                    </div>
                  )}
                </div>
              </div>

              {!nudgeAcknowledged && (
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Fatigue Index</span>
                    <span className="text-[#d4a574]">3.2</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Friction Signals</span>
                    <span>4 recent</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Last Break</span>
                    <span>2h 18m ago</span>
                  </div>
                </div>
              )}

              <button 
                onClick={() => setNudgeAcknowledged(!nudgeAcknowledged)}
                className={`w-full py-2 rounded text-sm transition-colors ${
                  nudgeAcknowledged 
                    ? 'bg-[#7ba88a] text-white hover:bg-[#7ba88a]/90'
                    : 'bg-foreground text-white hover:bg-foreground/90'
                }`}
              >
                {nudgeAcknowledged ? 'Reset Nudge' : 'Acknowledge Nudge'}
              </button>
            </div>

            {/* Trip Status */}
            <div className="border border-border rounded-md p-5 bg-white">
              <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
                Trip Status
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-xs text-muted-foreground">Shift Duration</span>
                  <span className="text-sm">3h 42m</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-xs text-muted-foreground">Trips Completed</span>
                  <span className="text-sm">9</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-xs text-muted-foreground">Active Trip ID</span>
                  <span className="text-sm font-mono">#247</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-xs text-muted-foreground">Last Flagged</span>
                  <span className="text-sm">14:32:18</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/feedback')}
                className="w-full border border-border bg-white rounded p-4 text-left hover:bg-muted/30 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Flag className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-sm">Report Issue</span>
                  </div>
                  <div className="text-muted-foreground">→</div>
                </div>
              </button>
            </div>

            {/* Monitoring Status */}
            <div className="border border-border rounded-md p-5 bg-white">
              <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
                Active Sensors
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Motion Detection</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#7ba88a]" />
                    <span className="text-xs">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Audio Analysis</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#7ba88a]" />
                    <span className="text-xs">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">GPS Tracking</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#7ba88a]" />
                    <span className="text-xs">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">ML Inference</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#7ba88a]" />
                    <span className="text-xs">Running</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}