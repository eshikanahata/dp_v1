import React from 'react';
import { Clock } from 'lucide-react';

interface Event {
  time: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
}

export function RecentEvents() {
  const events: Event[] = [
    { time: '14:32', description: 'Friction event detected - Trip #247', severity: 'warning' },
    { time: '14:15', description: 'Trip completed - ₹245 earned', severity: 'info' },
    { time: '13:55', description: 'Audio intensity spike logged', severity: 'warning' },
    { time: '13:42', description: 'Conflict moment - combined signal', severity: 'critical' },
    { time: '13:20', description: 'Trip completed - ₹187.50 earned', severity: 'info' },
    { time: '12:58', description: 'Shift velocity adjusted', severity: 'info' }
  ];

  return (
    <div className="border border-border rounded-md p-6 bg-white">
      <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
        Recent Events
      </div>

      <div className="space-y-2">
        {events.map((event, index) => (
          <div
            key={index}
            className="flex items-start gap-3 py-2 border-b border-border last:border-0"
          >
            <div className="text-xs text-muted-foreground w-12 flex-shrink-0 pt-0.5">
              {event.time}
            </div>
            <div className="flex-1">
              <div className="text-sm">{event.description}</div>
            </div>
            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
              event.severity === 'critical' ? 'bg-foreground' :
              event.severity === 'warning' ? 'bg-[#d4a574]' :
              'bg-[#7a9db8]'
            }`} />
          </div>
        ))}
      </div>
    </div>
  );
}