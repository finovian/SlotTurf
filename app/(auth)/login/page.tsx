"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "../../../lib/store";
import LoginView from "../../../views/LoginView";

export default function LoginPage() {
  const router = useRouter();
  const { setLoggedIn, setTempMobile, tempMobile } = useUIStore();
  const [isOTP, setIsOTP] = useState(false);

  const handleSendOTP = (mobile: string) => {
    setTempMobile(mobile);
    setIsOTP(true);
  };

  const handleVerifyOTP = () => {
    setLoggedIn(true);
    router.replace("/profile-setup");
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
