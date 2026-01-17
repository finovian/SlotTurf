"use client";

import { useUIStore } from "@/lib/store";
import { Owner } from "@/types";
import EditProfileView from "@/views/EditProfileView";
import { useRouter } from "next/navigation";


export default function EditProfilePage() {
  const router = useRouter();
  const { owner, setOwner } = useUIStore();

  const handleUpdate = (updatedOwner: Owner) => {
    setOwner(updatedOwner);
  };

  const handleBack = () => {
    router.back();
  };

  if (!owner) {
    return <div>Loading...</div>;
  }

  return (
    <EditProfileView owner={owner} onUpdate={handleUpdate} onBack={handleBack} />
  );
}
