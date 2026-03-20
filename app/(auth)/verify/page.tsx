"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useUIStore } from "../../../lib/store";
import { useVerifyOTP } from "@/hooks/use-data";
import VerifyView from "@/views/verifyView";
import Cookies from "js-cookie";
import { Suspense } from "react";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect_to");

  const { mutate: verifyOTP } = useVerifyOTP();

  const { setLoggedIn, tempMobile, showToast } = useUIStore();

  const handleVerifyOTP = (otpValue: any) => {
    verifyOTP(
      { mobile: tempMobile as "", otp: otpValue },
      {
        onSuccess: (data) => {
          console.log('data', data)
          showToast("Login successful", "success");
          setLoggedIn(true);
          Cookies.set("access_token", data?.token, {
            expires: 15, 
            secure: true,
            sameSite: "lax",
          });

          if (redirectTo) {
            router.replace(redirectTo);
            return;
          }

          if (data?.isActive) {
            router.replace("/dashboard");
          } else {
            router.replace("/profile-setup");
          }
        },
        onError: (err) => {
          showToast(err.message || "OTP verification failed", "error");
        },
      },
    );
  };

  return <VerifyView onVerifyOTP={handleVerifyOTP} tempMobile={tempMobile} />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse font-bold text-neutral-400 uppercase tracking-widest text-xs">
          Verifying...
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
