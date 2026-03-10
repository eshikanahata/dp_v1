"use client";
import { useState } from "react";
import { Coffee } from "lucide-react";

interface WellnessNudgeProps {
  message?: string;
}

export function WellnessNudge({
  message = "Consider a brief pause in 30 minutes to maintain peak performance.",
}: WellnessNudgeProps) {
  const [onBreak, setOnBreak] = useState(false);

  return (
    <div className="border border-[#d4a574]/30 rounded-md p-5 bg-[#d4a574]/5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#d4a574]/20 border border-[#d4a574]/40 flex items-center justify-center flex-shrink-0">
          <Coffee className="w-5 h-5 text-[#d4a574]" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-900 mb-1">Wellness Recommendation</div>
          {onBreak ? (
            <div className="text-sm text-[#7ba88a] font-medium mb-3">You are on a break now!</div>
          ) : (
            <div className="text-sm text-gray-700 mb-3">{message}</div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setOnBreak(!onBreak)}
              className="text-xs font-medium px-4 py-2 bg-black text-white rounded hover:bg-black/80 transition-colors"
            >
              {onBreak ? "End Break" : "Schedule Break"}
            </button>
            {!onBreak && (
              <button className="text-xs font-medium px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-gray-700">
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
