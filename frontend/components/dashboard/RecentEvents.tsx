"use client";
import type { FrictionEvent } from "@/types/trip";

interface RecentEventsProps {
  events: FrictionEvent[];
}

const SEV_DOT: Record<string, string> = {
  HIGH: "bg-gray-900",
  MEDIUM: "bg-[#d4a574]",
  LOW: "bg-[#7a9db8]",
};

export function RecentEvents({ events }: RecentEventsProps) {
  return (
    <div className="border border-gray-200 rounded-md p-6 bg-white">
      <div className="text-xs font-medium text-gray-600 mb-4 uppercase tracking-wider">Recent Events</div>
      {events.length === 0 ? (
        <div className="text-sm text-gray-400">No events in this session.</div>
      ) : (
        <div className="space-y-2">
          {events.slice(0, 6).map((ev, i) => (
            <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
              <div className="text-xs text-gray-600 font-mono w-16 flex-shrink-0 pt-0.5">
                +{ev.elapsed_seconds}s
              </div>
              <div className="flex-1 text-sm font-medium text-gray-800">{ev.explanation}</div>
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${SEV_DOT[ev.severity] ?? "bg-gray-400"}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
