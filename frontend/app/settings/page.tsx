"use client";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Section = "profile" | "shift-preferences" | "wellness-alerts" | "privacy-audio" | "notifications" | "data-export" | "system";

const NAV: { id: Section; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "shift-preferences", label: "Shift Preferences" },
  { id: "wellness-alerts", label: "Wellness Alerts" },
  { id: "privacy-audio", label: "Privacy & Audio Processing" },
  { id: "notifications", label: "Notifications" },
  { id: "data-export", label: "Data & Export" },
  { id: "system", label: "System" },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? "bg-white" : "bg-neutral-700"}`}
    >
      <span className={`inline-block h-3.5 w-3.5 rounded-full transition-transform ${checked ? "translate-x-4 bg-black" : "translate-x-1 bg-neutral-400"}`} />
    </button>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-neutral-300 block">{label}</label>
      {children}
      {hint && <p className="text-xs text-neutral-500">{hint}</p>}
    </div>
  );
}

export default function SettingsPage() {
  const [active, setActive] = useState<Section>("profile");
  const [driverName, setDriverName] = useState("Rajesh Patel");
  const [driverEmail, setDriverEmail] = useState("rajesh@driverpulse.com");
  const [vehicleType, setVehicleType] = useState("Sedan");
  const [dailyGoal, setDailyGoal] = useState("2500");
  const [shiftStart, setShiftStart] = useState("09:00");
  const [shiftEnd, setShiftEnd] = useState("17:00");
  const [fatigueAlert, setFatigueAlert] = useState(true);
  const [wellnessPause, setWellnessPause] = useState(true);
  const [localProcessing, setLocalProcessing] = useState(true);
  const [inAppAlerts, setInAppAlerts] = useState(true);
  const [debriefSummaries, setDebriefSummaries] = useState(true);

  const inputCls = "w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white text-sm focus:outline-none focus:border-neutral-500";
  const selectCls = `${inputCls} cursor-pointer`;
  const sepCls = "border-t border-neutral-800";

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-neutral-800">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-neutral-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl tracking-tight">Settings</h1>
              <p className="text-xs text-neutral-500">Manage profile, alerts, privacy, exports, and system preferences</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-1.5 border border-neutral-700 rounded text-sm hover:bg-neutral-900 transition-colors">Reset</button>
            <Link href="/dashboard" className="px-4 py-1.5 bg-white text-black rounded text-sm hover:bg-neutral-200 transition-colors">Save Changes</Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-neutral-800 min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-1">
            {NAV.map(({ id, label }) => (
              <button key={id} onClick={() => setActive(id)}
                className={`w-full text-left px-4 py-2.5 rounded text-sm transition-colors ${active === id ? "bg-neutral-900 text-white" : "text-neutral-400 hover:text-white hover:bg-neutral-900/50"}`}>
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 max-w-2xl">
          {active === "profile" && (
            <div className="space-y-6">
              <div><h2 className="text-lg mb-1">Profile</h2><p className="text-sm text-neutral-500">Basic driver information and vehicle details</p></div>
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-6 space-y-5">
                <Field label="Driver Name"><input value={driverName} onChange={(e) => setDriverName(e.target.value)} className={inputCls} /></Field>
                <div className={sepCls} />
                <Field label="Email Address" hint="Used for debrief summaries and system notifications">
                  <input type="email" value={driverEmail} onChange={(e) => setDriverEmail(e.target.value)} className={inputCls} />
                </Field>
                <div className={sepCls} />
                <Field label="Driver ID" hint="System-assigned identifier (read-only)">
                  <input value="DRV-2847-RK" className={inputCls} disabled />
                </Field>
                <div className={sepCls} />
                <Field label="Vehicle Type">
                  <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className={selectCls}>
                    {["Sedan", "SUV", "Luxury", "Van"].map((v) => <option key={v}>{v}</option>)}
                  </select>
                </Field>
              </div>
            </div>
          )}

          {active === "shift-preferences" && (
            <div className="space-y-6">
              <div><h2 className="text-lg mb-1">Shift Preferences</h2><p className="text-sm text-neutral-500">Daily goals and preferred driving hours</p></div>
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-6 space-y-5">
                <Field label="Daily Goal Amount (₹)" hint="Target earnings for financial pacing calculations">
                  <input type="number" value={dailyGoal} onChange={(e) => setDailyGoal(e.target.value)} className={inputCls} />
                </Field>
                <div className={sepCls} />
                <Field label="Preferred Shift Start"><input type="time" value={shiftStart} onChange={(e) => setShiftStart(e.target.value)} className={inputCls} /></Field>
                <Field label="Preferred Shift End"><input type="time" value={shiftEnd} onChange={(e) => setShiftEnd(e.target.value)} className={inputCls} /></Field>
                <div className={sepCls} />
                <Field label="Break Reminder Frequency" hint="System will suggest breaks at this interval">
                  <select className={selectCls}>
                    {["Every 1 hour", "Every 2 hours", "Every 3 hours", "Every 4 hours"].map((v) => <option key={v}>{v}</option>)}
                  </select>
                </Field>
              </div>
            </div>
          )}

          {active === "wellness-alerts" && (
            <div className="space-y-6">
              <div><h2 className="text-lg mb-1">Wellness Alerts</h2><p className="text-sm text-neutral-500">Fatigue detection and wellness monitoring</p></div>
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div><div className="text-sm text-neutral-300">Fatigue Alert Detection</div><p className="text-xs text-neutral-500">Audio-based fatigue pattern detection</p></div>
                  <Toggle checked={fatigueAlert} onChange={setFatigueAlert} />
                </div>
                <div className={sepCls} />
                <Field label="Friction Detection Sensitivity">
                  <select className={selectCls}><option>Medium – Balanced detection</option><option>Low – Only major incidents</option><option>High – All friction events</option></select>
                </Field>
                <div className={sepCls} />
                <div className="flex items-center justify-between">
                  <div><div className="text-sm text-neutral-300">Wellness Pause Suggestions</div><p className="text-xs text-neutral-500">Proactive break recommendations based on patterns</p></div>
                  <Toggle checked={wellnessPause} onChange={setWellnessPause} />
                </div>
              </div>
            </div>
          )}

          {active === "privacy-audio" && (
            <div className="space-y-6">
              <div><h2 className="text-lg mb-1">Privacy & Audio Processing</h2><p className="text-sm text-neutral-500">Data retention and audio analysis settings</p></div>
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div><div className="text-sm text-neutral-300">Local Audio Processing</div><p className="text-xs text-neutral-500">Process audio on-device for maximum privacy</p></div>
                  <Toggle checked={localProcessing} onChange={setLocalProcessing} />
                </div>
                <div className={sepCls} />
                <Field label="Data Retention Duration (days)" hint="Audio data automatically deleted after this period">
                  <select className={selectCls}>{["30 days", "60 days", "90 days", "180 days"].map((v) => <option key={v}>{v}</option>)}</select>
                </Field>
                <div className={sepCls} />
                <Field label="Consent Status"><div className="px-3 py-1.5 w-fit rounded text-xs bg-green-900/30 text-green-400 border border-green-800/50">Granted</div></Field>
              </div>
            </div>
          )}

          {active === "notifications" && (
            <div className="space-y-6">
              <div><h2 className="text-lg mb-1">Notifications</h2><p className="text-sm text-neutral-500">Alert preferences and severity thresholds</p></div>
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div><div className="text-sm text-neutral-300">In-App Alerts</div><p className="text-xs text-neutral-500">Real-time notifications during shift</p></div>
                  <Toggle checked={inAppAlerts} onChange={setInAppAlerts} />
                </div>
                <div className={sepCls} />
                <div className="flex items-center justify-between">
                  <div><div className="text-sm text-neutral-300">Trip Debrief Summaries</div><p className="text-xs text-neutral-500">Post-trip analytics and insights</p></div>
                  <Toggle checked={debriefSummaries} onChange={setDebriefSummaries} />
                </div>
                <div className={sepCls} />
                <Field label="Warning Severity Threshold" hint="Minimum severity level for alert notifications">
                  <select className={selectCls}>{["Medium – Important only", "Low – Show all warnings", "High – Critical only"].map((v) => <option key={v}>{v}</option>)}</select>
                </Field>
              </div>
            </div>
          )}

          {active === "data-export" && (
            <div className="space-y-6">
              <div><h2 className="text-lg mb-1">Data & Export</h2><p className="text-sm text-neutral-500">Export trip data and flagged events</p></div>
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-6 space-y-5">
                {["Flagged Moments", "Trip Summaries"].map((label) => (
                  <div key={label}>
                    <Field label={`Export ${label}`} hint={`Download all ${label.toLowerCase()} as CSV`}>
                      <button className="px-4 py-2 border border-neutral-700 rounded text-sm hover:bg-neutral-800 transition-colors">Export {label}</button>
                    </Field>
                    <div className={`${sepCls} mt-5`} />
                  </div>
                ))}
                <Field label="Schema Version"><code className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-xs text-neutral-400 font-mono">v2.0.0</code></Field>
              </div>
            </div>
          )}

          {active === "system" && (
            <div className="space-y-6">
              <div><h2 className="text-lg mb-1">System</h2><p className="text-sm text-neutral-500">Application settings and diagnostics</p></div>
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-6 space-y-5">
                {[
                  ["Theme Mode", <><code className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-xs text-neutral-400">dark</code><span className="text-xs text-neutral-600 ml-2">(locked)</span></>],
                  ["App Version", <code className="block px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-xs text-neutral-400 font-mono w-fit">v2.0.0</code>],
                  ["Telemetry Status", <div className="px-3 py-1.5 rounded text-xs w-fit bg-green-900/30 text-green-400 border border-green-800/50">active</div>],
                  ["Audit Log Status", <div className="px-3 py-1.5 rounded text-xs w-fit bg-blue-900/30 text-blue-400 border border-blue-800/50">enabled</div>],
                ].map(([k, v], i) => (
                  <div key={i}>
                    <Field label={k as string}>{v}</Field>
                    {i < 3 && <div className={`${sepCls} mt-5`} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
