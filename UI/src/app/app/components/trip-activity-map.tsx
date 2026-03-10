import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function TripActivityMap() {
  return (
    <div className="border border-border rounded-md p-6 bg-white">
      <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
        Trip Activity Zones
      </div>

      <div className="relative h-64 bg-muted rounded overflow-hidden">
        {/* Map background */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1594818379941-1b4162746219?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc3RyZWV0JTIwbWFwJTIwb3ZlcmhlYWQlMjBhZXJpYWx8ZW58MXx8fHwxNzczMTE2MTk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="City street map"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/40" />
        </div>

        {/* Activity zones with heat effect */}
        <div className="absolute top-1/4 left-1/3 w-20 h-20 bg-[#d4a574]/30 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-[#d4a574]/35 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-[#d4a574]/25 rounded-full blur-2xl" />

        {/* Route path with animated segments */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M 20% 25%, L 35% 30%, L 50% 50%, L 60% 65%, L 75% 70%" 
            fill="none" 
            stroke="#000000" 
            strokeWidth="3" 
            strokeDasharray="5,5"
            opacity="0.4"
          />
        </svg>

        {/* Location markers */}
        <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
          <MapPin className="w-5 h-5 text-[#7ba88a] drop-shadow-md" fill="currentColor" />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <MapPin className="w-5 h-5 text-[#d4a574] drop-shadow-md" fill="currentColor" />
        </div>
        <div className="absolute bottom-1/4 right-1/3 transform translate-x-1/2 translate-y-1/2">
          <MapPin className="w-5 h-5 text-foreground drop-shadow-md" fill="currentColor" />
        </div>

        {/* Navigation indicator */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45">
          <Navigation className="w-4 h-4 text-[#7ba88a] drop-shadow-md" fill="currentColor" />
        </div>

        <div className="absolute bottom-4 left-4 bg-white/95 px-3 py-2 rounded text-xs border border-border shadow-sm">
          <div className="text-muted-foreground mb-1">Today's Coverage</div>
          <div className="font-medium">3 primary zones • 42 km</div>
        </div>
      </div>
    </div>
  );
}