import React from 'react';
import { AlertCircle, TrendingUp, Activity } from 'lucide-react';

export function DriverStatusPanel() {
  const persona = localStorage.getItem('driverPulsePersona') || 'rohan';
  
  const statusData = {
    priya: {
      status: 'Excellent',
      icon: TrendingUp,
      iconColor: 'text-[#7ba88a]',
      borderColor: 'border-[#7ba88a]',
      bgColor: 'bg-[#7ba88a]/10',
      description: 'Performance excellent, maintaining high velocity',
      velocity: 'Excellent',
      stressLevel: 'Very Low',
      cabinState: 'Calm'
    },
    rohan: {
      status: 'On Track',
      icon: TrendingUp,
      iconColor: 'text-[#7ba88a]',
      borderColor: 'border-[#7ba88a]',
      bgColor: 'bg-[#7ba88a]/10',
      description: 'Performance nominal, no interventions required',
      velocity: 'Optimal',
      stressLevel: 'Low',
      cabinState: 'Stable'
    }
  };
  
  const data = statusData[persona as keyof typeof statusData];
  const StatusIcon = data.icon;
  
  return (
    <div className="border border-border rounded-md p-6 bg-white">
      <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
        Driver Status
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-16 h-16 rounded-full ${data.bgColor} border-2 ${data.borderColor} flex items-center justify-center`}>
          <StatusIcon className={`w-7 h-7 ${data.iconColor}`} />
        </div>
        <div>
          <div className="text-xl mb-1">{data.status}</div>
          <div className="text-sm text-muted-foreground">
            {data.description}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Velocity</div>
          <div className="text-sm">{data.velocity}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Stress Level</div>
          <div className="text-sm">{data.stressLevel}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Cabin State</div>
          <div className="text-sm">{data.cabinState}</div>
        </div>
      </div>
    </div>
  );
}