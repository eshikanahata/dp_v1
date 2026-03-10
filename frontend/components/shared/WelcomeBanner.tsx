interface WelcomeBannerProps {
  name: string;
  shiftStatus?: string;
}

export function WelcomeBanner({
  name,
  shiftStatus = "Current Shift: Mid-fare, Goal Progress Active, Monitoring Friction Signals",
}: WelcomeBannerProps) {
  return (
    <div className="bg-black text-white px-8 py-6">
      <div className="max-w-[1600px] mx-auto">
        <h2 className="text-lg mb-1">Good Evening, {name}.</h2>
        <p className="text-sm text-white/70">{shiftStatus}</p>
      </div>
    </div>
  );
}
