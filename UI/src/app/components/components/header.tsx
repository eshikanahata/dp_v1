import React from 'react';
import { useNavigate } from 'react-router';

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="border-b border-border bg-white">
      <div className="flex items-center justify-between px-8 h-16">
        <div className="flex items-center">
          <h1 className="text-xl tracking-tight">DriverPulse</h1>
        </div>
        
        <nav className="flex items-center gap-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-sm text-foreground hover:text-foreground/80 transition-colors"
          >
            Dashboard
          </button>
          <button 
            onClick={() => navigate('/live-shift')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Live Shift
          </button>
          <button 
            onClick={() => navigate('/debrief')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Debrief
          </button>
          <button 
            onClick={() => navigate('/analytics')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Analytics
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Settings
          </button>
        </nav>
      </div>
    </header>
  );
}