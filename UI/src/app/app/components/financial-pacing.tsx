import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export function FinancialPacing() {
  const persona = localStorage.getItem('driverPulsePersona') || 'rohan';
  
  const pacingData = {
    priya: {
      currentVelocity: 89,
      requiredVelocity: 75,
      color: '#7ba88a' // Green for exceeding
    },
    rohan: {
      currentVelocity: 72,
      requiredVelocity: 75,
      color: '#d4a574' // Amber for lagging
    }
  };
  
  const { currentVelocity, requiredVelocity, color } = pacingData[persona as keyof typeof pacingData];
  const progress = (currentVelocity / requiredVelocity) * 100;
  const variance = currentVelocity - requiredVelocity;

  const data = [
    { name: 'Complete', value: progress > 100 ? 100 : progress },
    { name: 'Remaining', value: progress > 100 ? 0 : 100 - progress }
  ];

  const COLORS = [color, '#e5e5e5'];

  return (
    <div className="border border-border rounded-md p-6 bg-white">
      <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
        Financial Pacing
      </div>

      <div className="flex items-center gap-6">
        <div className="relative" style={{ width: 160, height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
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
            <div className="text-2xl">{progress.toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
        </div>

        <div className="flex-1">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Current Velocity</span>
              <span className="text-sm">₹{currentVelocity}/hr</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Required Velocity</span>
              <span className="text-sm">₹{requiredVelocity}/hr</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Variance</span>
              <span className={`text-sm ${variance >= 0 ? 'text-[#7ba88a]' : 'text-[#d4a574]'}`}>
                {variance >= 0 ? '+' : ''}₹{variance}/hr
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}