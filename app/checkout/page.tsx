"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get("plan") ?? "basic";

  useEffect(() => {
    router.replace(`/dashboard/settings/billing?plan=${plan}`);
  }, [plan, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse font-bold text-neutral-400 uppercase tracking-widest text-xs">
        Redirecting to checkout...
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse font-bold text-neutral-400 uppercase tracking-widest text-xs">
          Loading checkout...
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
