"use client";
import { TrendingUp } from "lucide-react";
import type { DriverDashboard } from "@/types/trip";

interface DriverStatusPanelProps {
  data: DriverDashboard;
}

export function DriverStatusPanel({ data }: DriverStatusPanelProps) {
  const isExcellent = data.performance_status === "Excellent";
  const iconColor = isExcellent ? "text-[#7ba88a]" : "text-[#d4a574]";
  const borderColor = isExcellent ? "border-[#7ba88a]" : "border-[#d4a574]";
  const bgColor = isExcellent ? "bg-[#7ba88a]/10" : "bg-[#d4a574]/10";

  return (
    <div className="border border-gray-200 rounded-md p-6 bg-white">
      <div className="text-xs font-medium text-gray-600 mb-4 uppercase tracking-wider">Driver Status</div>
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-16 h-16 rounded-full ${bgColor} border-2 ${borderColor} flex items-center justify-center`}>
          <TrendingUp className={`w-7 h-7 ${iconColor}`} />
        </div>
        <div>
          <div className="text-xl font-semibold text-gray-900">{data.performance_status}</div>
          <div className="text-sm text-gray-600">{data.performance_desc}</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div>
          <div className="text-xs text-gray-500 mb-1">Velocity</div>
          <div className="text-sm font-medium text-gray-900">{data.velocity_label}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Stress Level</div>
          <div className="text-sm font-medium text-gray-900">{data.stress_level}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Cabin State</div>
          <div className="text-sm font-medium text-gray-900">{data.cabin_state}</div>
        </div>
      </div>
    </div>
  );
}
