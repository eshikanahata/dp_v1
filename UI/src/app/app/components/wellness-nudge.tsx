import React, { useState } from 'react';
import { Coffee, AlertCircle } from 'lucide-react';

export function WellnessNudge() {
  const [onBreak, setOnBreak] = useState(false);
  const persona = localStorage.getItem('driverPulsePersona') || 'rohan';
  
  const wellnessData = {
    priya: {
      message: 'Consider a brief pause in 30 minutes to maintain peak performance.',
      severity: 'low'
    },
    rohan: {
      message: 'Consider a short pause in 20 minutes. Friction elevated during last trip.',
      severity: 'medium'
    }
  };
  
  const data = wellnessData[persona as keyof typeof wellnessData];
  
  return (
    <div className="border border-[#d4a574]/20 rounded-md p-5 bg-[#d4a574]/5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#d4a574]/10 border border-[#d4a574]/30 flex items-center justify-center flex-shrink-0">
          <Coffee className="w-5 h-5 text-[#d4a574]" />
        </div>
        <div className="flex-1">
          <div className="text-sm mb-1">Wellness Recommendation</div>
          {onBreak ? (
            <div className="text-sm text-[#7ba88a] mb-3">
              You are on a break now!
            </div>
          ) : (
            <div className="text-xs text-muted-foreground mb-3">
              {data.message}
            </div>
          )}
          <div className="flex gap-2">
            <button 
              onClick={() => setOnBreak(!onBreak)}
              className="text-xs px-3 py-1.5 bg-foreground text-white rounded hover:bg-foreground/90 transition-colors"
            >
              {onBreak ? 'End Break' : 'Schedule Break'}
            </button>
            {!onBreak && (
              <button className="text-xs px-3 py-1.5 border border-border rounded hover:bg-muted transition-colors">
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}