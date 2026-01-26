"use client";

import { useRouter } from "next/navigation";
import { useUIStore } from "../../../lib/store";
import LoginView from "../../../views/LoginView";
import { useRequestOTP } from "@/hooks/use-data";

export default function LoginPage() {
  const router = useRouter();

  const { mutate: requestOTP, isPending } = useRequestOTP();

  const { setTempMobile, tempMobile, showToast } = useUIStore();

  const handleSendOTP = (mobile: string) => {
    setTempMobile(mobile);

    requestOTP(mobile, {
      onSuccess: () => {
        showToast(`OTP sent to +91 ${mobile}`, "success");
        router.push("/verify");
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
