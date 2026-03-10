"use client";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { DriverDashboard } from "@/types/trip";

interface FinancialPacingProps {
  data: DriverDashboard;
}

export function FinancialPacing({ data }: FinancialPacingProps) {
  const { current_velocity, required_velocity, velocity_variance } = data;
  const progress = required_velocity > 0 ? (current_velocity / required_velocity) * 100 : 0;
  const isAhead = velocity_variance >= 0;
  const color = isAhead ? "#7ba88a" : "#d4a574";

  const chartData = [
    { name: "Current", value: progress > 100 ? 100 : progress },
    { name: "Gap", value: progress > 100 ? 0 : 100 - progress },
  ];

  return (
    <div className="border border-gray-200 rounded-md p-6 bg-white">
      <div className="text-xs font-medium text-gray-600 mb-4 uppercase tracking-wider">Financial Pacing</div>
      <div className="flex items-center gap-6">
        <div className="relative" style={{ width: 160, height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={80}
                startAngle={90} endAngle={-270}
                dataKey="value" stroke="none"
              >
                <Cell fill={color} />
                <Cell fill="#e5e5e5" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-semibold" style={{ color }}>{progress.toFixed(0)}%</div>
            <div className="text-xs text-gray-500">Complete</div>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-sm text-gray-600">Current Velocity</span>
            <span className="text-sm font-semibold" style={{ color }}>₹{current_velocity}/hr</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-sm text-gray-600">Required Velocity</span>
            <span className="text-sm font-semibold text-gray-900">₹{required_velocity}/hr</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Variance</span>
            <span className={`text-sm font-semibold ${isAhead ? "text-[#7ba88a]" : "text-[#d4a574]"}`}>
              {isAhead ? "+" : ""}₹{velocity_variance}/hr
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
