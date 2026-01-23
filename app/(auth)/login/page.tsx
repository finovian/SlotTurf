"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "../../../lib/store";
import LoginView from "../../../views/LoginView";
import { useRequestOTP, useVerifyOTP } from "@/hooks/use-data";

export default function LoginPage() {
  const router = useRouter();

  const { mutate: requestOTP, isPending } = useRequestOTP();
  const { mutate: verifyOTP } = useVerifyOTP();

  const { setLoggedIn, setTempMobile, tempMobile, showToast } = useUIStore();
  const [isOTP, setIsOTP] = useState(false);

  const handleSendOTP = (mobile: string) => {
    setTempMobile(mobile);

    requestOTP(mobile, {
      onSuccess: () => {
        showToast(`OTP sent to +91 ${mobile}`, "success");
        setIsOTP(true);
      },
      onError: (err) => {
        showToast(err.message || "Failed to send OTP", "error");
      },
    });
  };

  const handleVerifyOTP = (otpValue: any) => {
    verifyOTP(
      { mobile: tempMobile as "", otp: otpValue },
      {
        onSuccess: () => {
            showToast('Login successful', "success");
          setLoggedIn(true);
          router.replace("/profile-setup");
        },
        onError: (err) => {
          showToast(err.message || "OTP verification failed", "error");
        }
      },
    );
  };

  return (
    <LoginView
      onSendOTP={handleSendOTP}
      onVerifyOTP={handleVerifyOTP}
      isOTPStage={isOTP}
      tempMobile={tempMobile}
      onBack={() => setIsOTP(false)}
    />
  );
}
