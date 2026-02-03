"use client";

import { useTurfs } from "@/hooks/use-data";
import { Turf } from "@/types";
import { ManageTurfsView } from "@/views/ManagementViews";
import { useRouter } from "next/navigation";


export default function ManageTurfsPage() {
  const router = useRouter();
  const { data: turfs  } = useTurfs();

  console.log('turfs', turfs)

  const handleAdd = () => {
    router.push("/dashboard/settings/turfs/new");
  };

  const handleEdit = (turf: Turf) => {
    router.push(`/dashboard/settings/turfs/${turf.id}`);
  };

  const handleBack = () => {
    router.back();
  }

  return <ManageTurfsView turfs={turfs?.ground} onAdd={handleAdd} onEdit={handleEdit} onBack={handleBack} />;
}
