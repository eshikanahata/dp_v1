"use client";
import { AlertTriangle, Navigation, Volume2, AlertCircle } from "lucide-react";
import type { FrictionEvent } from "@/types/trip";

interface TripFrictionSummaryProps {
  events: FrictionEvent[];
}

const SEVERITY_STYLES = {
  HIGH: { text: "text-gray-900", bg: "bg-gray-900/5", dot: "bg-gray-900" },
  MEDIUM: { text: "text-[#d4a574]", bg: "bg-[#d4a574]/5", dot: "bg-[#d4a574]" },
  LOW: { text: "text-gray-400", bg: "bg-gray-100", dot: "bg-gray-400/40" },
};

const FLAG_ICONS: Record<string, React.ReactNode> = {
  HARSH_BRAKING: <AlertTriangle className="w-4 h-4" />,
  SUDDEN_MANEUVER: <Navigation className="w-4 h-4" />,
  AUDIO_SPIKE: <Volume2 className="w-4 h-4" />,
  CONFLICT_MOMENT: <AlertCircle className="w-4 h-4" />,
};

export function TripFrictionSummary({ events }: TripFrictionSummaryProps) {
  return (
    <div className="border border-gray-200 rounded-md p-6 bg-white">
      <div className="text-xs font-medium text-gray-600 mb-4 uppercase tracking-wider">Trip Friction Summary</div>
      {events.length === 0 ? (
        <div className="text-sm text-gray-400">No friction events recorded.</div>
      ) : (
        <div className="space-y-3">
          {events.map((event, i) => {
            const sev = event.severity as keyof typeof SEVERITY_STYLES;
            const styles = SEVERITY_STYLES[sev] ?? SEVERITY_STYLES.LOW;
            const icon = FLAG_ICONS[event.flag_type] ?? <AlertCircle className="w-4 h-4" />;
            return (
              <div key={i} className={`flex items-center justify-between p-3 rounded ${styles.bg}`}>
                <div className="flex items-center gap-3">
                  <div className={styles.text}>{icon}</div>
                  <span className="text-sm font-medium text-gray-800">{event.explanation}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-600 font-mono">{event.elapsed_seconds}s</span>
                  <div className={`w-2 h-2 rounded-full ${styles.dot}`} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
