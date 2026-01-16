"use client";

import React, { useState } from 'react';
import LoginView from '../../../views/LoginView.tsx';
import { useStore } from '../../../lib/store.tsx';
import { useRouter } from '../../../lib/navigation.ts';

export default function LoginPage() {
  const { state, login, verifyOtp } = useStore();
  const router = useRouter();
  const [isOTP, setIsOTP] = useState(false);

  const handleSendOTP = (mobile: string) => {
    login(mobile);
    setIsOTP(true);
  };

  const handleVerify = (otp: string) => {
    verifyOtp(otp);
    router.replace('/');
  };

  return (
    <LoginView 
      onSendOTP={handleSendOTP}
      onVerifyOTP={handleVerify}
      isOTPStage={isOTP}
      tempMobile={state.tempMobile}
      onBack={() => setIsOTP(false)}
    />
  );
}