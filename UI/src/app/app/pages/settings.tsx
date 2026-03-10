import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Separator } from '../components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { MoreVertical, ArrowLeft } from 'lucide-react';

type SettingsSection = 
  | 'profile' 
  | 'shift-preferences' 
  | 'wellness-alerts' 
  | 'privacy-audio' 
  | 'notifications' 
  | 'data-export' 
  | 'system';

export function SettingsPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');

  // Get persona from localStorage
  const persona = localStorage.getItem('driverPulsePersona') || 'rohan';
  const defaultName = persona === 'priya' ? 'Priya' : 'Rohan';
  const defaultEmail = persona === 'priya' ? 'priya@driverpulse.com' : 'rohan@driverpulse.com';
  const defaultID = persona === 'priya' ? 'DRV-2847-PS' : 'DRV-2847-RK';

  // Settings state
  const [driverName, setDriverName] = useState(defaultName);
  const [driverEmail, setDriverEmail] = useState(defaultEmail);
  const [driverID, setDriverID] = useState(defaultID);
  const [vehicleType, setVehicleType] = useState('sedan');
  
  const [dailyGoal, setDailyGoal] = useState('2500');
  const [preferredStart, setPreferredStart] = useState('09:00');
  const [preferredEnd, setPreferredEnd] = useState('17:00');
  const [breakReminder, setBreakReminder] = useState('2');
  
  const [fatigueAlertEnabled, setFatigueAlertEnabled] = useState(true);
  const [frictionSensitivity, setFrictionSensitivity] = useState('medium');
  const [wellnessPause, setWellnessPause] = useState(true);
  
  const [localProcessing, setLocalProcessing] = useState(true);
  const [dataRetention, setDataRetention] = useState('90');
  const [consentStatus, setConsentStatus] = useState('granted');
  
  const [inAppAlerts, setInAppAlerts] = useState(true);
  const [debriefSummaries, setDebriefSummaries] = useState(true);
  const [warningSeverity, setWarningSeverity] = useState('medium');
  
  const [themeMode] = useState('dark');
  const [appVersion] = useState('v2.4.1');
  const [telemetryStatus] = useState('active');
  const [auditLogStatus] = useState('enabled');

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Settings saved');
    navigate('/dashboard');
  };

  const handleReset = () => {
    // Reset to defaults - clear all fields
    setDriverName('');
    setDriverEmail('');
    console.log('Settings reset');
  };

  const handleResetToDefault = () => {
    // Reset all settings to factory defaults
    setDriverName(defaultName);
    setDriverEmail(defaultEmail);
    setDailyGoal('2500');
    setPreferredStart('09:00');
    setPreferredEnd('17:00');
    setBreakReminder('2');
    setFatigueAlertEnabled(true);
    setFrictionSensitivity('medium');
    setWellnessPause(true);
    setLocalProcessing(true);
    setDataRetention('90');
    setInAppAlerts(true);
    setDebriefSummaries(true);
    setWarningSeverity('medium');
    console.log('All settings reset to default');
  };

  const handleExportSettings = () => {
    // Export current settings as JSON
    const settings = {
      profile: { driverName, driverEmail, driverID, vehicleType },
      shiftPreferences: { dailyGoal, preferredStart, preferredEnd, breakReminder },
      wellnessAlerts: { fatigueAlertEnabled, frictionSensitivity, wellnessPause },
      privacy: { localProcessing, dataRetention, consentStatus },
      notifications: { inAppAlerts, debriefSummaries, warningSeverity }
    };
    console.log('Exporting settings:', JSON.stringify(settings, null, 2));
  };

  const handleSignOut = () => {
    navigate('/');
  };

  const handleExportFlaggedMoments = () => {
    console.log('Exporting flagged moments...');
  };

  const handleExportTripSummaries = () => {
    console.log('Exporting trip summaries...');
  };

  return (
    <div className="dark min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-neutral-800 bg-black">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl tracking-tight">Settings</h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                Manage profile, alerts, privacy, exports, and system preferences
              </p>
            </div>
          </div>
          
          {/* Top-right action buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="bg-transparent border-neutral-700 text-white hover:bg-neutral-900 hover:text-white transition-colors"
            >
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-white text-black hover:bg-neutral-200 transition-colors"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex">
        {/* Left sidebar navigation */}
        <div className="w-64 border-r border-neutral-800 min-h-[calc(100vh-4rem)] bg-black">
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveSection('profile')}
              className={`w-full text-left px-4 py-2.5 rounded text-sm transition-colors ${
                activeSection === 'profile'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveSection('shift-preferences')}
              className={`w-full text-left px-4 py-2.5 rounded text-sm transition-colors ${
                activeSection === 'shift-preferences'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
              }`}
            >
              Shift Preferences
            </button>
            <button
              onClick={() => setActiveSection('wellness-alerts')}
              className={`w-full text-left px-4 py-2.5 rounded text-sm transition-colors ${
                activeSection === 'wellness-alerts'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
              }`}
            >
              Wellness Alerts
            </button>
            <button
              onClick={() => setActiveSection('privacy-audio')}
              className={`w-full text-left px-4 py-2.5 rounded text-sm transition-colors ${
                activeSection === 'privacy-audio'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
              }`}
            >
              Privacy & Audio Processing
            </button>
            <button
              onClick={() => setActiveSection('notifications')}
              className={`w-full text-left px-4 py-2.5 rounded text-sm transition-colors ${
                activeSection === 'notifications'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveSection('data-export')}
              className={`w-full text-left px-4 py-2.5 rounded text-sm transition-colors ${
                activeSection === 'data-export'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
              }`}
            >
              Data & Export
            </button>
            <button
              onClick={() => setActiveSection('system')}
              className={`w-full text-left px-4 py-2.5 rounded text-sm transition-colors ${
                activeSection === 'system'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
              }`}
            >
              System
            </button>
          </nav>
        </div>

        {/* Main content area */}
        <div className="flex-1 p-8 max-w-4xl">
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg mb-1">Profile</h2>
                <p className="text-sm text-neutral-500">
                  Basic driver information and vehicle details
                </p>
              </div>

              <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="driver-name" className="text-sm text-neutral-300">
                    Driver Name
                  </Label>
                  <Input
                    id="driver-name"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="Your Name"
                    className="bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driver-email" className="text-sm text-neutral-300">
                    Email Address
                  </Label>
                  <Input
                    id="driver-email"
                    type="email"
                    value={driverEmail}
                    onChange={(e) => setDriverEmail(e.target.value)}
                    placeholder="Your Email"
                    className="bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500"
                  />
                  <p className="text-xs text-neutral-500">
                    Used for debrief summaries and system notifications
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driver-id" className="text-sm text-neutral-300">
                    Driver ID
                  </Label>
                  <Input
                    id="driver-id"
                    value={driverID}
                    onChange={(e) => setDriverID(e.target.value)}
                    className="bg-neutral-900 border-neutral-700 text-white"
                    disabled
                  />
                  <p className="text-xs text-neutral-500">
                    System-assigned identifier (read-only)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicle-type" className="text-sm text-neutral-300">
                    Vehicle Type
                  </Label>
                  <Select value={vehicleType} onValueChange={setVehicleType}>
                    <SelectTrigger className="bg-neutral-900 border-neutral-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-700">
                      <SelectItem value="sedan" className="text-white hover:bg-neutral-800 focus:bg-neutral-800 cursor-pointer">Sedan</SelectItem>
                      <SelectItem value="suv" className="text-white hover:bg-neutral-800 focus:bg-neutral-800 cursor-pointer">SUV</SelectItem>
                      <SelectItem value="luxury" className="text-white hover:bg-neutral-800 focus:bg-neutral-800 cursor-pointer">Luxury</SelectItem>
                      <SelectItem value="van" className="text-white hover:bg-neutral-800 focus:bg-neutral-800 cursor-pointer">Van</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Shift Preferences Section */}
          {activeSection === 'shift-preferences' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg mb-1">Shift Preferences</h2>
                <p className="text-sm text-neutral-500">
                  Daily goals and preferred driving hours
                </p>
              </div>

              <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="daily-goal" className="text-sm text-neutral-300">
                    Daily Goal Amount ($)
                  </Label>
                  <Input
                    id="daily-goal"
                    type="number"
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(e.target.value)}
                    className="bg-neutral-900 border-neutral-700 text-white"
                  />
                  <p className="text-xs text-neutral-500">
                    Target earnings for financial pacing calculations
                  </p>
                </div>

                <Separator className="bg-neutral-800" />

                <div className="space-y-2">
                  <Label htmlFor="preferred-start" className="text-sm text-neutral-300">
                    Preferred Shift Start
                  </Label>
                  <Input
                    id="preferred-start"
                    type="time"
                    value={preferredStart}
                    onChange={(e) => setPreferredStart(e.target.value)}
                    className="bg-neutral-900 border-neutral-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferred-end" className="text-sm text-neutral-300">
                    Preferred Shift End
                  </Label>
                  <Input
                    id="preferred-end"
                    type="time"
                    value={preferredEnd}
                    onChange={(e) => setPreferredEnd(e.target.value)}
                    className="bg-neutral-900 border-neutral-700 text-white"
                  />
                </div>

                <Separator className="bg-neutral-800" />

                <div className="space-y-2">
                  <Label htmlFor="break-reminder" className="text-sm text-neutral-300">
                    Break Reminder Frequency (hours)
                  </Label>
                  <Select value={breakReminder} onValueChange={setBreakReminder}>
                    <SelectTrigger className="bg-neutral-900 border-neutral-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-700">
                      <SelectItem value="1" className="text-white hover:bg-neutral-800 focus:bg-neutral-800 cursor-pointer">Every 1 hour</SelectItem>
                      <SelectItem value="2" className="text-white hover:bg-neutral-800 focus:bg-neutral-800 cursor-pointer">Every 2 hours</SelectItem>
                      <SelectItem value="3" className="text-white hover:bg-neutral-800 focus:bg-neutral-800 cursor-pointer">Every 3 hours</SelectItem>
                      <SelectItem value="4" className="text-white hover:bg-neutral-800 focus:bg-neutral-800 cursor-pointer">Every 4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-neutral-500">
                    System will suggest breaks at this interval
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Wellness Alerts Section */}
          {activeSection === 'wellness-alerts' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg mb-1">Wellness Alerts</h2>
                <p className="text-sm text-neutral-500">
                  Fatigue detection and wellness monitoring
                </p>
              </div>

              <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm text-neutral-300">
                      Fatigue Alert Detection
                    </Label>
                    <p className="text-xs text-neutral-500">
                      Audio-based fatigue pattern detection
                    </p>
                  </div>
                  <Switch
                    checked={fatigueAlertEnabled}
                    onCheckedChange={setFatigueAlertEnabled}
                  />
                </div>

                <Separator className="bg-neutral-800" />

                <div className="space-y-2">
                  <Label className="text-sm text-neutral-300">
                    Friction Detection Sensitivity
                  </Label>
                  <RadioGroup value={frictionSensitivity} onValueChange={setFrictionSensitivity}>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="low" id="friction-low" />
                        <Label htmlFor="friction-low" className="text-sm text-neutral-400 font-normal cursor-pointer">
                          Low – Only major incidents
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="friction-medium" />
                        <Label htmlFor="friction-medium" className="text-sm text-neutral-400 font-normal cursor-pointer">
                          Medium – Balanced detection
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="high" id="friction-high" />
                        <Label htmlFor="friction-high" className="text-sm text-neutral-400 font-normal cursor-pointer">
                          High – All friction events
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                  <p className="text-xs text-neutral-500 pt-1">
                    Controls sensitivity for passenger conflict detection
                  </p>
                </div>

                <Separator className="bg-neutral-800" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm text-neutral-300">
                      Wellness Pause Suggestions
                    </Label>
                    <p className="text-xs text-neutral-500">
                      Proactive break recommendations based on patterns
                    </p>
                  </div>
                  <Switch
                    checked={wellnessPause}
                    onCheckedChange={setWellnessPause}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Privacy & Audio Processing Section */}
          {activeSection === 'privacy-audio' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg mb-1">Privacy & Audio Processing</h2>
                <p className="text-sm text-neutral-500">
                  Data retention and audio analysis settings
                </p>
              </div>

              <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm text-neutral-300">
                      Local Audio Processing
                    </Label>
                    <p className="text-xs text-neutral-500">
                      Process audio on-device for maximum privacy
                    </p>
                  </div>
                  <Switch
                    checked={localProcessing}
                    onCheckedChange={setLocalProcessing}
                  />
                </div>

                <Separator className="bg-neutral-800" />

                <div className="space-y-2">
                  <Label htmlFor="data-retention" className="text-sm text-neutral-300">
                    Data Retention Duration (days)
                  </Label>
                  <Select value={dataRetention} onValueChange={setDataRetention}>
                    <SelectTrigger className="bg-neutral-900 border-neutral-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-700">
                      <SelectItem value="30" className="text-white hover:bg-neutral-800 focus:bg-neutral-800 cursor-pointer">30 days</SelectItem>
                      <SelectItem value="60" className="text-white hover:bg-neutral-800 focus:bg-neutral-800 cursor-pointer">60 days</SelectItem>
                      <SelectItem value="90" className="text-white hover:bg-neutral-800 focus:bg-neutral-800 cursor-pointer">90 days</SelectItem>
                      <SelectItem value="180" className="text-white hover:bg-neutral-800 focus:bg-neutral-800 cursor-pointer">180 days</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-neutral-500">
                    Audio data automatically deleted after this period
                  </p>
                </div>

                <Separator className="bg-neutral-800" />

                <div className="space-y-2">
                  <Label className="text-sm text-neutral-300">
                    Consent Status
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1.5 rounded text-xs ${
                      consentStatus === 'granted' 
                        ? 'bg-green-900/30 text-green-400 border border-green-800/50' 
                        : 'bg-amber-900/30 text-amber-400 border border-amber-800/50'
                    }`}>
                      {consentStatus === 'granted' ? 'Granted' : 'Pending'}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Audio recording consent for wellness monitoring
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg mb-1">Notifications</h2>
                <p className="text-sm text-neutral-500">
                  Alert preferences and severity thresholds
                </p>
              </div>

              <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm text-neutral-300">
                      In-App Alerts
                    </Label>
                    <p className="text-xs text-neutral-500">
                      Real-time notifications during shift
                    </p>
                  </div>
                  <Switch
                    checked={inAppAlerts}
                    onCheckedChange={setInAppAlerts}
                  />
                </div>

                <Separator className="bg-neutral-800" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm text-neutral-300">
                      Trip Debrief Summaries
                    </Label>
                    <p className="text-xs text-neutral-500">
                      Post-trip analytics and insights
                    </p>
                  </div>
                  <Switch
                    checked={debriefSummaries}
                    onCheckedChange={setDebriefSummaries}
                  />
                </div>

                <Separator className="bg-neutral-800" />

                <div className="space-y-2">
                  <Label htmlFor="warning-severity" className="text-sm text-neutral-300">
                    Warning Severity Threshold
                  </Label>
                  <Select value={warningSeverity} onValueChange={setWarningSeverity}>
                    <SelectTrigger className="bg-neutral-900 border-neutral-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-700">
                      <SelectItem value="low">Low – Show all warnings</SelectItem>
                      <SelectItem value="medium">Medium – Important only</SelectItem>
                      <SelectItem value="high">High – Critical only</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-neutral-500">
                    Minimum severity level for alert notifications
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Data & Export Section */}
          {activeSection === 'data-export' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg mb-1">Data & Export</h2>
                <p className="text-sm text-neutral-500">
                  Export trip data and flagged events
                </p>
              </div>

              <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-6 space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm text-neutral-300">
                    Export Flagged Moments
                  </Label>
                  <p className="text-xs text-neutral-500 mb-3">
                    Download all flagged friction and wellness events as CSV
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportFlaggedMoments}
                    className="bg-transparent border-neutral-700 text-white hover:bg-neutral-800 hover:text-white"
                  >
                    Export Flagged Events
                  </Button>
                </div>

                <Separator className="bg-neutral-800" />

                <div className="space-y-2">
                  <Label className="text-sm text-neutral-300">
                    Export Trip Summaries
                  </Label>
                  <p className="text-xs text-neutral-500 mb-3">
                    Download complete trip history with metrics as JSON
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportTripSummaries}
                    className="bg-transparent border-neutral-700 text-white hover:bg-neutral-800 hover:text-white"
                  >
                    Export Trip Data
                  </Button>
                </div>

                <Separator className="bg-neutral-800" />

                <div className="space-y-2">
                  <Label className="text-sm text-neutral-300">
                    Schema Version
                  </Label>
                  <div className="flex items-center gap-2">
                    <code className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-xs text-neutral-400 font-mono">
                      v3.2.1
                    </code>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Current data export schema format
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* System Section */}
          {activeSection === 'system' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg mb-1">System</h2>
                <p className="text-sm text-neutral-500">
                  Application settings and diagnostics
                </p>
              </div>

              <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-6 space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm text-neutral-300">
                    Theme Mode
                  </Label>
                  <div className="flex items-center gap-2">
                    <code className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-xs text-neutral-400">
                      {themeMode}
                    </code>
                    <span className="text-xs text-neutral-600">(locked)</span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    DriverPulse uses dark mode for optimal night driving visibility
                  </p>
                </div>

                <Separator className="bg-neutral-800" />

                <div className="space-y-2">
                  <Label className="text-sm text-neutral-300">
                    App Version
                  </Label>
                  <code className="block px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-xs text-neutral-400 font-mono w-fit">
                    {appVersion}
                  </code>
                  <p className="text-xs text-neutral-500">
                    Current application build version
                  </p>
                </div>

                <Separator className="bg-neutral-800" />

                <div className="space-y-2">
                  <Label className="text-sm text-neutral-300">
                    Telemetry Status
                  </Label>
                  <div className={`px-3 py-1.5 rounded text-xs w-fit ${
                    telemetryStatus === 'active'
                      ? 'bg-green-900/30 text-green-400 border border-green-800/50'
                      : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                  }`}>
                    {telemetryStatus}
                  </div>
                  <p className="text-xs text-neutral-500">
                    Real-time system performance monitoring
                  </p>
                </div>

                <Separator className="bg-neutral-800" />

                <div className="space-y-2">
                  <Label className="text-sm text-neutral-300">
                    Audit Log Status
                  </Label>
                  <div className={`px-3 py-1.5 rounded text-xs w-fit ${
                    auditLogStatus === 'enabled'
                      ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50'
                      : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                  }`}>
                    {auditLogStatus}
                  </div>
                  <p className="text-xs text-neutral-500">
                    Change tracking for compliance and security
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}