interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  variant?: "default" | "warning" | "success" | "info";
}

const VARIANT_STYLES = {
  warning: {
    card: "border-[#d4a574]/30 bg-[#d4a574]/5",
    value: "text-[#d4a574]",
    label: "text-[#d4a574]",
  },
  success: {
    card: "border-[#7ba88a]/30 bg-[#7ba88a]/5",
    value: "text-[#7ba88a]",
    label: "text-[#7ba88a]",
  },
  info: {
    card: "border-[#7a9db8]/30 bg-[#7a9db8]/5",
    value: "text-[#7a9db8]",
    label: "text-[#7a9db8]",
  },
  default: {
    card: "border-gray-200 bg-white",
    value: "text-gray-900",
    label: "text-gray-600",
  },
};

export function MetricCard({ label, value, subtitle, variant = "default" }: MetricCardProps) {
  const styles = VARIANT_STYLES[variant];
  return (
    <div className={`border rounded-md p-5 ${styles.card}`}>
      <div className={`text-xs font-medium mb-2 uppercase tracking-wider ${styles.label}`}>{label}</div>
      <div className={`text-2xl font-semibold mb-1 ${styles.value}`}>{value}</div>
      {subtitle && <div className="text-xs text-gray-600">{subtitle}</div>}
    </div>
  );
}
