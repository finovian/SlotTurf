"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useUIStore } from "../../../lib/store";
import LoginView from "../../../views/LoginView";
import { useRequestOTP } from "@/hooks/use-data";
import { Suspense } from "react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect_to");

  const { mutate: requestOTP, isPending } = useRequestOTP();

  const { setTempMobile, tempMobile, showToast } = useUIStore();

  const handleSendOTP = (mobile: string) => {
    setTempMobile(mobile);

    requestOTP(mobile, {
      onSuccess: () => {
        showToast(`OTP sent to +91 ${mobile}`, "success");
        const nextUrl = redirectTo 
          ? `/verify?redirect_to=${encodeURIComponent(redirectTo)}` 
          : "/verify";
        router.push(nextUrl);
      },
      onError: (err) => {
        showToast(err.message || "Failed to send OTP", "error");
      },
    });
  };

  return (
    <LoginView
      onSendOTP={handleSendOTP}
      tempMobile={tempMobile}
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse font-bold text-neutral-400 uppercase tracking-widest text-xs">
          Loading login...
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
