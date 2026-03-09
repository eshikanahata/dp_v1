import React from 'react';
import { AlertCircle, TrendingUp, Activity } from 'lucide-react';

export function DriverStatusPanel() {
  return (
    <div className="border border-border rounded-md p-6 bg-white">
      <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
        Driver Status
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-[#7ba88a]/10 border-2 border-[#7ba88a] flex items-center justify-center">
          <TrendingUp className="w-7 h-7 text-[#7ba88a]" />
        </div>
        <div>
          <div className="text-xl mb-1">On Track</div>
          <div className="text-sm text-muted-foreground">
            Performance nominal, no interventions required
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Velocity</div>
          <div className="text-sm">Optimal</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Stress Level</div>
          <div className="text-sm">Low</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Cabin State</div>
          <div className="text-sm">Stable</div>
        </div>
      </div>
    </div>
  );
}
