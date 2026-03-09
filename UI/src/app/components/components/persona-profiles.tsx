import React from 'react';
import { TrendingUp, AlertTriangle, User } from 'lucide-react';
import { useNavigate } from 'react-router';

interface Profile {
  name: string;
  type: string;
  status: 'active' | 'inactive';
  earnings: string;
  trips: number;
  frictionLevel: 'low' | 'medium' | 'high';
  persona: 'priya' | 'rohan';
}

export function PersonaProfiles() {
  const navigate = useNavigate();
  
  const profiles: Profile[] = [
    {
      name: 'Priya S.',
      type: 'High-Pace Earner',
      status: 'inactive',
      earnings: '₹1,565',
      trips: 12,
      frictionLevel: 'low',
      persona: 'priya'
    },
    {
      name: 'Rohan K.',
      type: 'Stressed Earner',
      status: 'active',
      earnings: '₹1,242.50',
      trips: 9,
      frictionLevel: 'medium',
      persona: 'rohan'
    }
  ];

  const handlePersonaSwitch = (persona: 'priya' | 'rohan') => {
    localStorage.setItem('driverPulsePersona', persona);
    // Force refresh by navigating away and back
    navigate('/');
    setTimeout(() => {
      navigate('/dashboard');
    }, 10);
  };

  return (
    <div className="border border-border rounded-md p-6 bg-white">
      <div className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
        Demo Personas
      </div>

      <div className="space-y-4">
        {profiles.map((profile, index) => (
          <button
            key={index}
            onClick={() => handlePersonaSwitch(profile.persona)}
            className={`w-full border rounded p-4 text-left transition-all hover:shadow-md ${
              profile.status === 'active' 
                ? 'border-foreground bg-foreground/5' 
                : 'border-border bg-white hover:border-foreground/30'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-sm mb-0.5">{profile.name}</div>
                  <div className="text-xs text-muted-foreground">{profile.type}</div>
                </div>
              </div>
              {profile.status === 'active' && (
                <div className="w-2 h-2 rounded-full bg-[#7ba88a]" />
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Earnings</div>
                <div className="text-sm">{profile.earnings}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Trips</div>
                <div className="text-sm">{profile.trips}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Friction</div>
                <div className={`text-sm ${
                  profile.frictionLevel === 'high' ? 'text-foreground' :
                  profile.frictionLevel === 'medium' ? 'text-[#d4a574]' :
                  'text-[#7ba88a]'
                }`}>
                  {profile.frictionLevel === 'low' ? 'Low' :
                   profile.frictionLevel === 'medium' ? 'Medium' :
                   'High'}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}