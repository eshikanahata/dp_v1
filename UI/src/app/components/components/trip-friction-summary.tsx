import React from 'react';
import { AlertTriangle, Navigation, Volume2, AlertCircle } from 'lucide-react';

interface FrictionEvent {
  type: string;
  icon: React.ReactNode;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
}

export function TripFrictionSummary() {
  const events: FrictionEvent[] = [
    {
      type: 'Harsh Braking',
      icon: <AlertTriangle className="w-4 h-4" />,
      severity: 'medium',
      timestamp: '14:32'
    },
    {
      type: 'Sudden Maneuver',
      icon: <Navigation className="w-4 h-4" />,
      severity: 'low',
      timestamp: '14:18'
    },
    {
      type: 'Cabin Audio Intensity',
      icon: <Volume2 className="w-4 h-4" />,
      severity: 'medium',
      timestamp: '13:55'
    },
    {
      type: 'Combined Conflict Moment',
      icon: <AlertCircle className="w-4 h-4" />,
      severity: 'high',
      timestamp: '13:42'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-foreground';
      case 'medium':
        return 'text-[#d4a574]';
      case 'low':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-foreground/5';
      case 'medium':
        return 'bg-[#d4a574]/5';
      case 'low':
        return 'bg-muted';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="border border-border rounded-md p-6 bg-white">
      <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
        Trip Friction Summary
      </div>

      <div className="space-y-3">
        {events.map((event, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded ${getSeverityBg(event.severity)}`}
          >
            <div className="flex items-center gap-3">
              <div className={getSeverityColor(event.severity)}>
                {event.icon}
              </div>
              <span className="text-sm">{event.type}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">{event.timestamp}</span>
              <div className={`w-2 h-2 rounded-full ${
                event.severity === 'high' ? 'bg-foreground' :
                event.severity === 'medium' ? 'bg-[#d4a574]' :
                'bg-muted-foreground/40'
              }`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
