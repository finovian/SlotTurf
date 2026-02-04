"use client";

import { useProfile, useProfileUpdate } from "@/hooks/use-data";
import { useUIStore } from "@/lib/store";
import { Owner } from "@/types";
import EditProfileView from "@/views/EditProfileView";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  const { owner, setOwner } = useUIStore();
  const { data, isLoading } = useProfile();

  const { mutate } = useProfileUpdate();

  const handleUpdate = (updatedOwner: Owner) => {
    mutate(
      {
        newMobile: owner?.mobile,
        user_name: owner?.owner_name,
      },
      {
        onSuccess: () => {},
        onError: (err) => {
          console.log("err", err);
        },
      },
    );

    setOwner(updatedOwner);
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <EditProfileView
      owner={(data as any)?.user as any}
      onUpdate={handleUpdate}
      onBack={handleBack}
    />
  );
}
