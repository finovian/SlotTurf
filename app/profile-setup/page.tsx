"use client";

import { useRouter } from "next/navigation";
import { useUIStore } from "../../lib/store";
import { useSaveTurf } from "../../hooks/use-data";
import ProfileSetupView from "../../views/ProfileSetupView";
import { Turf } from "../../types";

export default function ProfileSetupPage() {
  const router = useRouter();
  const { tempMobile, setOwner, setSelectedTurfId } = useUIStore();
  const saveTurf = useSaveTurf();

  const handleOnboarding = (data: any) => {
    const { name, businessName, mobile, groundName, openingTime, closingTime, hourlyPrice } = data;
    const newOwner = { name, businessName, mobile };
    const firstTurf: Turf = {
      id: `T-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      name: groundName,
      type: 'Cricket',
      hourlyPrice,
      openingTime,
      closingTime,
      status: 'active'
    };
    saveTurf.mutate(firstTurf);
    setOwner(newOwner);
    setSelectedTurfId(firstTurf.id);
    router.replace("/dashboard");
  };

  return <ProfileSetupView mobile={tempMobile || ""} onComplete={handleOnboarding} />;
}
