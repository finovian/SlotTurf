"use client";

export const runtime = "edge";

import { useDeleteTurf, useSaveTurf, useTurfs } from "@/hooks/use-data";
import { Turf } from "@/types";
import { EditTurfView } from "@/views/ManagementViews";
import { useRouter, useParams } from "next/navigation";

export default function EditTurfPage() {
  const router = useRouter();
  const params = useParams();
  const { data: turfs = [] } = useTurfs();
  const saveTurf = useSaveTurf();
  const deleteTurf = useDeleteTurf();

  const turfId = params.id as string;
  const isNew = turfId === "new";
  const turf = isNew ? null : turfs.find((t) => t.id === turfId) || null;

  const handleSave = (turf: Turf) => {
    saveTurf.mutate(turf);
    router.back();
  };

  const handleDelete = (id: string) => {
    deleteTurf.mutate(id);
    router.back();
  };

  if (!isNew && !turf) {
    return <div>Loading...</div>;
  }

  return (
    <EditTurfView
      turf={turf}
      turfCount={turfs.length}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  );
}
