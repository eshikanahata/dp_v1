import React from 'react';
import { useNavigate } from 'react-router';
import { User, TrendingUp, AlertTriangle, ArrowRight, Shield } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();

  const handleDemoPersona = (persona: 'priya' | 'rohan') => {
    localStorage.setItem('driverPulsePersona', persona);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Dark atmospheric background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/10 px-8 py-6">
          <div className="max-w-[1400px] mx-auto">
            <h1 className="text-xl tracking-tight mb-1">DriverPulse</h1>
            <p className="text-sm text-white/60">
              Context-Aware Telemetry for Driver Wellbeing and Performance
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1400px] mx-auto px-8 py-16">
          <div className="grid grid-cols-2 gap-12 items-start">
            {/* Login Panel */}
            <div className="bg-white/5 border border-white/10 rounded-md p-8 backdrop-blur-sm">
              <h2 className="text-lg mb-6">Sign In</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Email</label>
                  <input
                    type="email"
                    placeholder="driver@example.com"
                    className="w-full bg-white/5 border border-white/20 rounded px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/20 rounded px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>
              </div>

              <button className="w-full bg-white text-black py-3 rounded text-sm hover:bg-white/90 transition-colors mb-4">
                Sign In
              </button>

              <div className="text-center">
                <button className="text-sm text-white/50 hover:text-white/70 transition-colors">
                  Use demo access →
                </button>
              </div>
            </div>

            {/* Persona Selection */}
            <div>
              <div className="mb-6">
                <h2 className="text-lg mb-2">Select Demo Persona</h2>
                <p className="text-sm text-white/60">
                  Choose a driver profile to explore DriverPulse capabilities
                </p>
              </div>

              <div className="space-y-4">
                {/* Priya - High-Pace Earner */}
                <button
                  onClick={() => handleDemoPersona('priya')}
                  className="w-full bg-white/5 border border-white/10 hover:border-[#7ba88a]/40 rounded-md p-6 text-left transition-all hover:bg-white/[0.07] group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-base mb-1">Priya S.</div>
                        <div className="text-sm text-white/60">High-Pace Earner</div>
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-[#7ba88a]" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-white/50 mb-1">Goal</div>
                      <div className="text-sm">₹1,100</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/50 mb-1">Progress</div>
                      <div className="text-sm text-[#7ba88a]">80%</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/50 mb-1">Friction</div>
                      <div className="text-sm text-[#7ba88a]">Low</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-xs text-white/50">On track, stable pace</span>
                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>

                {/* Rohan - Stressed Earner */}
                <button
                  onClick={() => handleDemoPersona('rohan')}
                  className="w-full bg-white/5 border border-white/10 hover:border-[#d4a574]/40 rounded-md p-6 text-left transition-all hover:bg-white/[0.07] group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-base mb-1">Rohan K.</div>
                        <div className="text-sm text-white/60">Stressed Earner</div>
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-[#d4a574]" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-white/50 mb-1">Pace</div>
                      <div className="text-sm text-[#d4a574]">Below</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/50 mb-1">Friction</div>
                      <div className="text-sm text-[#d4a574]">High</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/50 mb-1">Alerts</div>
                      <div className="text-sm">4</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-xs text-white/50">Cabin conflict + traffic friction</span>
                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 left-8">
          <div className="flex items-center gap-2 text-sm text-white/50">
            <Shield className="w-4 h-4" />
            <span>Privacy-First: Local Audio Processing</span>
          </div>
        </div>
      </div>
    </div>
  );
}