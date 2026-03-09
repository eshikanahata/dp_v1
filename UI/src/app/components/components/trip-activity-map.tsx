import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

export function TripActivityMap() {
  return (
    <div className="border border-border rounded-md p-6 bg-white">
      <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
        Trip Activity Zones
      </div>

      <div className="relative h-64 bg-muted rounded overflow-hidden">
        {/* Simplified map representation with streets */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000000" strokeWidth="0.5" opacity="0.1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Street lines for map feel */}
            <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#000000" strokeWidth="2" opacity="0.15" />
            <line x1="0" y1="60%" x2="100%" y2="60%" stroke="#000000" strokeWidth="2" opacity="0.15" />
            <line x1="25%" y1="0" x2="25%" y2="100%" stroke="#000000" strokeWidth="2" opacity="0.15" />
            <line x1="60%" y1="0" x2="60%" y2="100%" stroke="#000000" strokeWidth="2" opacity="0.15" />
          </svg>
        </div>

        {/* Activity zones with heat effect */}
        <div className="absolute top-1/4 left-1/3 w-20 h-20 bg-[#d4a574]/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-[#d4a574]/25 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-[#d4a574]/15 rounded-full blur-2xl" />

        {/* Route path with animated segments */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M 20% 25%, L 35% 30%, L 50% 50%, L 60% 65%, L 75% 70%" 
            fill="none" 
            stroke="#000000" 
            strokeWidth="3" 
            strokeDasharray="5,5"
            opacity="0.3"
          />
        </svg>

        {/* Location markers */}
        <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
          <MapPin className="w-5 h-5 text-[#7ba88a]" fill="currentColor" />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <MapPin className="w-5 h-5 text-[#d4a574]" fill="currentColor" />
        </div>
        <div className="absolute bottom-1/4 right-1/3 transform translate-x-1/2 translate-y-1/2">
          <MapPin className="w-5 h-5 text-foreground" fill="currentColor" />
        </div>

        {/* Navigation indicator */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45">
          <Navigation className="w-4 h-4 text-[#7ba88a]" fill="currentColor" />
        </div>

        <div className="absolute bottom-4 left-4 bg-white/95 px-3 py-2 rounded text-xs border border-border">
          <div className="text-muted-foreground mb-1">Today's Coverage</div>
          <div className="font-medium">3 primary zones • 42 km</div>
        </div>
      </div>
    </div>
  );
}