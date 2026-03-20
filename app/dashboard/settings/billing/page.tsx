"use client";

import { SubscriptionSkeleton } from "@/components/Skeleton";
import { useSubscription, useCancelSubscription } from "@/hooks/use-data";
import { apiFetch } from "@/lib/apiClient";
import { Check, CreditCard, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PLAN_FEATURES: Record<string, string[]> = {
  trial: ["2 grounds", "50 bookings free", "21 days trial"],
  basic: ["2 grounds", "Prevent double bookings", "6 months history"],
  standard: ["3 grounds", "1 year history", "Priority support"],
  pro: ["Unlimited grounds", "All history", "Early access features"],
};

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: "₹499",
    period: "/month",
    features: PLAN_FEATURES.basic,
  },
  {
    id: "standard",
    name: "Standard",
    price: "₹999",
    period: "/month",
    features: PLAN_FEATURES.standard,
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹1,999",
    period: "/month",
    features: PLAN_FEATURES.pro,
  },
];

const SubscriptionView: React.FC = () => {
  const { data: sub, isLoading } = useSubscription();
  const cancelSubscription = useCancelSubscription();
  const router = useRouter();
  const [upgradeLoading, setUpgradeLoading] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Handle auto-checkout from query param
  useEffect(() => {
    if (!isLoading && sub) {
      const params = new URLSearchParams(window.location.search);
      const planParam = params.get("plan");
      if (planParam && planParam !== sub.plan && PLANS.some(p => p.id === planParam)) {
        // Clear the param from URL to avoid re-triggering on refresh
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        handleUpgrade(planParam);
      }
    }
  }, [isLoading, sub]);

  const handleUpgrade = async (planId: string) => {
    setUpgradeLoading(planId);
    try {
      const data = (await apiFetch("/subscription/checkout", {
        method: "POST",
        body: JSON.stringify({ plan: planId }),
      })) as any;

      const options = {
        key: data.key_id,
        subscription_id: data.subscription_id,
        name: "SlotTurf",
        description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
        image: "/icon-192.png",
        handler: function () {
          // Webhook handles DB update — just refresh subscription data
          router.refresh();
        },
        theme: { color: "#000000" },
        modal: {
          ondismiss: () => setUpgradeLoading(null),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => setUpgradeLoading(null));
      rzp.open();
    } catch (err) {
      setUpgradeLoading(null);
    }
  };

  if (isLoading) return <SubscriptionSkeleton />;
  if (!sub) return null;

  const isTrial = sub.plan === "trial";
  const isActive = sub.status === "active";
  const bookingsLeft = sub.max_bookings - sub.used_bookings;
  const features = PLAN_FEATURES[sub.plan] ?? PLAN_FEATURES.basic;

  return (
    <div className="py-6 space-y-6 animate-in fade-in duration-300">

      {/* ── Current Plan Card ───────────────────────────────────────────── */}
      <div className="bg-neutral-900 rounded-4xl p-8 text-white space-y-6 shadow-2xl">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">
              Current Plan
            </span>
            <h2 className="text-3xl font-bold tracking-tight capitalize">
              {isTrial ? "Free Trial" : `${sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)}`}
            </h2>
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isActive
              ? "bg-emerald-500/20 text-emerald-500"
              : "bg-red-500/20 text-red-400"
          }`}>
            {sub.status}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 pt-4 border-t border-neutral-800">
          {features.map((f) => (
            <div key={f} className="flex items-center gap-3">
              <Check size={16} className="text-emerald-500 shrink-0" />
              <span className="text-sm font-medium text-neutral-400">{f}</span>
            </div>
          ))}
        </div>

        {/* Trial usage or renewal date */}
        <div className="pt-4 border-t border-neutral-800">
          {isTrial ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                  Days Left
                </p>
                <p className="text-xl font-bold mt-0.5">{sub.days_remaining}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                  Bookings Left
                </p>
                <p className="text-xl font-bold mt-0.5">{bookingsLeft} / {sub.max_bookings}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                  Renewal Date
                </p>
                <p className="font-bold mt-0.5">{sub.end_date}</p>
              </div>
              <p className="text-2xl font-bold">
                {sub.plan === "basic" && "₹499"}
                {sub.plan === "standard" && "₹999"}
                {sub.plan === "pro" && "₹1,999"}
                <span className="text-xs text-neutral-500 font-medium">/mo</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Trial warning banner ─────────────────────────────────────────── */}
      {isTrial && (sub.days_remaining <= 7 || bookingsLeft <= 10) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-center gap-3">
          <Zap size={16} className="text-amber-500 shrink-0" />
          <p className="text-xs font-bold text-amber-700">
            {bookingsLeft <= 10
              ? `Only ${bookingsLeft} bookings left in your trial`
              : `Trial ends in ${sub.days_remaining} days`}
            {" · "}Upgrade to keep your data safe.
          </p>
        </div>
      )}

      {/* ── Upgrade Plans ───────────────────────────────────────────────── */}
      <div className="space-y-3">
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">
          {isTrial ? "Choose a Plan" : "Change Plan"}
        </p>

        {PLANS.map((plan) => {
          const isCurrent = sub.plan === plan.id;
          const isLoadingThis = upgradeLoading === plan.id;

          return (
            <div
              key={plan.id}
              className={`bg-white border rounded-2xl p-5 space-y-4 transition-all ${
                plan.popular
                  ? "border-emerald-400 shadow-sm shadow-emerald-100"
                  : "border-neutral-100"
              }`}
            >
              {plan.popular && (
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">
                  ⭐ Most Popular
                </span>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-black text-neutral-900 text-sm">{plan.name}</p>
                  <p className="text-xl font-black text-neutral-900 mt-0.5">
                    {plan.price}
                    <span className="text-xs text-neutral-400 font-medium">
                      {plan.period}
                    </span>
                  </p>
                </div>

                {isCurrent ? (
                  <span className="text-xs font-bold bg-neutral-100 text-neutral-500 px-3 py-1.5 rounded-full">
                    Current
                  </span>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={!!upgradeLoading}
                    className="text-xs font-bold bg-neutral-900 text-white px-4 py-2 rounded-xl active:scale-95 transition-transform disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <CreditCard size={12} />
                    {isLoadingThis ? "Opening..." : "Upgrade"}
                  </button>
                )}
              </div>

              <div className="space-y-1.5 pt-1 border-t border-neutral-50">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-[8px] font-black shrink-0">
                      ✓
                    </div>
                    <p className="text-xs text-neutral-500">{f}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Manage / Cancel ─────────────────────────────────────────────── */}
      {!isTrial && isActive && (
        <div className="bg-white rounded-3xl border border-neutral-100 p-6 space-y-4">
          <div>
            <h3 className="font-bold text-neutral-900 text-sm">Manage Subscription</h3>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Payments secured by Razorpay. Cancellation takes effect at end of billing period.
            </p>
          </div>
          {!showCancelConfirm ? (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="text-xs font-bold text-red-400 uppercase tracking-wider"
            >
              Cancel Subscription
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-neutral-500">
                Are you sure? You'll lose access at end of billing period.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    cancelSubscription.mutate();
                    setShowCancelConfirm(false);
                  }}
                  className="flex-1 h-10 bg-red-50 text-red-500 font-bold rounded-xl text-xs"
                >
                  Yes, Cancel
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 h-10 bg-neutral-100 text-neutral-600 font-bold rounded-xl text-xs"
                >
                  Keep Plan
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <p className="text-center text-[9px] font-bold text-neutral-300 uppercase tracking-[0.3em] pb-4">
        Secured by Razorpay
      </p>
    </div>
  );
};

export default SubscriptionView;