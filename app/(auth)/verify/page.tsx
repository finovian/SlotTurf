"use client";

import { useRouter } from "next/navigation";
import { useUIStore } from "../../../lib/store";
import { useVerifyOTP } from "@/hooks/use-data";
import VerifyView from "@/views/verifyView";

export default function LoginPage() {
  const router = useRouter();

  const { mutate: verifyOTP } = useVerifyOTP();

  const { setLoggedIn, tempMobile, showToast } = useUIStore();

  const handleVerifyOTP = (otpValue: any) => {
    verifyOTP(
      { mobile: tempMobile as "", otp: otpValue },
      {
        onSuccess: (data) => {
          showToast("Login successful", "success");
          setLoggedIn(true);
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
