"use client";

import { useRouter } from "next/navigation";
import { useUIStore } from "../../lib/store";
import { useCreateGround, useTurfs } from "../../hooks/use-data";
import ProfileSetupView from "../../views/ProfileSetupView";
import { useEffect } from "react";

export default function ProfileSetupPage() {
  const router = useRouter();
  const { tempMobile, setSelectedTurfId } = useUIStore();
  const { data, isLoading } = useTurfs();

  const { mutate } = useCreateGround();

  useEffect(() => {
    if (!isLoading && data?.ground) {
      if (data?.ground?.length > 0) {
        setSelectedTurfId(data?.ground?.[0]?.id);
        return router.replace("/dashboard");
      }
    }
  }, [data?.ground?.length, isLoading]);

  const handleOnboarding = (data: any) => {
    console.log('data', data)
    const { owner_name, groundName, openingTime, closingTime, hourlyPrice } =
      data;

    mutate(
      {
        closing: closingTime,
        ground_name: groundName,
        opening: openingTime,
        rate: hourlyPrice,
        user_name: owner_name,
      },
      {
        onSuccess: () => {
          router.replace("/dashboard");
        },
        onError: (err) => {
          console.log("err", err);
        },
      },
    );
  };

  return (
    <ProfileSetupView mobile={tempMobile || ""} onComplete={handleOnboarding} />
  );
}
