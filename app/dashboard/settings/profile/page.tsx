"use client";

import { useProfile, useProfileUpdate } from "@/hooks/use-data";
import { useUIStore } from "@/lib/store";
import { Owner } from "@/types";
import EditProfileView from "@/views/EditProfileView";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  const { showToast, owner, setOwner } = useUIStore();
  const { data, isLoading } = useProfile();

  const { mutate } = useProfileUpdate();

  const handleUpdate = (updatedOwner: Owner) => {
    mutate(
      {
        newMobile: updatedOwner.mobile,
        user_name: updatedOwner.owner_name,
      },
      {
        onSuccess: () => {
          setOwner(updatedOwner);
          showToast("Profile updated successfully", "success");
          router.push("/dashboard/settings");
        },
        onError: (err) => {
          console.error("Profile update error:", err);
          showToast("Failed to update profile", "error");
        },
      },
    );
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
