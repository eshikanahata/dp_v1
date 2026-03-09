import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  variant?: 'default' | 'warning' | 'success' | 'info';
}

export function MetricCard({ label, value, subtitle, variant = 'default' }: MetricCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return 'border-[#d4a574]/20 bg-[#d4a574]/5';
      case 'success':
        return 'border-[#7ba88a]/20 bg-[#7ba88a]/5';
      case 'info':
        return 'border-[#7a9db8]/20 bg-[#7a9db8]/5';
      default:
        return 'border-border bg-white';
    }
  };

  const getValueColor = () => {
    switch (variant) {
      case 'warning':
        return 'text-[#d4a574]';
      case 'success':
        return 'text-[#7ba88a]';
      case 'info':
        return 'text-[#7a9db8]';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className={`border rounded-md p-5 ${getVariantStyles()}`}>
      <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
        {label}
      </div>
      <div className={`text-2xl mb-1 ${getValueColor()}`}>
        {value}
      </div>
      {subtitle && (
        <div className="text-xs text-muted-foreground">
          {subtitle}
        </div>
      )}
    </div>
  );
}
