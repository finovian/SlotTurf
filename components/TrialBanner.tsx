import { useSubscription } from "@/hooks/use-data";

export const TrialBanner = () => {
  const { data: sub } = useSubscription();
  
  if (!sub || sub.plan !== "trial") return null;
  
  const daysLeft = sub.days_remaining;
  const bookingsLeft = sub.max_bookings - sub.used_bookings;
  
  // Only show when getting close
  if (daysLeft > 7 && bookingsLeft > 10) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between">
      <p className="text-xs font-bold text-amber-700">
        Trial ends in {daysLeft} days · {bookingsLeft} bookings left
      </p>
      
       <a href="/dashboard/settings/billing"
        className="text-xs font-bold text-amber-900 underline"
      >
        Upgrade
      </a>
    </div>
  );
};