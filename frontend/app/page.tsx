"use client";
import Link from "next/link";
import { User, Shield, AlertTriangle } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col">
      {/* Header */}
      <header className="px-8 py-6 border-b border-white/10">
        <h1 className="text-xl font-semibold tracking-tight">DriverPulse</h1>
        <p className="text-sm text-gray-400 mt-1">
          Context-Aware Telemetry for Driver Wellbeing and Performance
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column: Sign In Form */}
          <div className="bg-[#121212] border border-white/5 rounded-xl p-8 lg:p-10 shadow-2xl">
            <h2 className="text-2xl font-semibold mb-8">Sign In</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input 
                  type="email" 
                  placeholder="driver@example.com" 
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
              
              <Link 
                href="/dashboard" 
                className="block w-full text-center bg-white text-black font-semibold py-3 rounded-md hover:bg-gray-200 transition-colors mt-4"
              >
                Sign In
              </Link>
            </div>
            
            <div className="mt-6 text-center">
              <Link href="/dashboard" className="text-sm text-gray-500 hover:text-white transition-colors">
                Use demo access →
              </Link>
            </div>
          </div>

          {/* Right Column: Persona Selection */}
          <div className="flex flex-col justify-center">
            <h2 className="text-xl font-semibold mb-2">Select Demo Persona</h2>
            <p className="text-sm text-gray-400 mb-8">Choose a driver profile to explore DriverPulse capabilities</p>
            
            <div className="space-y-4">
              {/* Persona 1: High-Pace Earner */}
              <Link href="/dashboard" className="block bg-[#121212] border border-white/5 rounded-xl p-6 hover:border-white/20 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-300" />
                    </div>
                    <div>
                      <div className="font-medium text-lg">Priya S.</div>
                      <div className="text-sm text-gray-400">High-Pace Earner</div>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#7ba88a]" />
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Goal</div>
                    <div className="font-semibold">₹1,100</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Progress</div>
                    <div className="font-semibold text-[#7ba88a]">80%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Friction</div>
                    <div className="font-semibold text-[#7ba88a]">Low</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400 border-t border-white/5 pt-4 mt-2">
                  <span>On track, stable pace</span>
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
              </Link>

              {/* Persona 2: Stressed Earner */}
              <Link href="/dashboard" className="block bg-[#121212] border border-[#d4a574]/20 rounded-xl p-6 hover:border-[#d4a574]/50 transition-all group relative overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#d4a574]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-300" />
                    </div>
                    <div>
                      <div className="font-medium text-lg">Rohan K.</div>
                      <div className="text-sm text-gray-400">Stressed Earner</div>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#d4a574] animate-pulse" />
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Pace</div>
                    <div className="font-semibold text-[#d4a574]">Below</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Friction</div>
                    <div className="font-semibold text-[#d4a574]">High</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Alerts</div>
                    <div className="font-semibold">4</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400 border-t border-white/5 pt-4 mt-2">
                  <span>Cabin conflict + traffic friction</span>
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 flex items-center gap-2 text-sm text-gray-500">
        <Shield className="w-4 h-4" />
        <span>Privacy-First: Local Audio Processing</span>
      </footer>
    </div>
  );
}
