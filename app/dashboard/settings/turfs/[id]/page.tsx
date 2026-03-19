"use client";

export const runtime = "edge";

import { useAddTurf, useDeleteTurf, useSaveTurf, useTurfs } from "@/hooks/use-data";
import { Turf } from "@/types";
import { EditTurfView } from "@/views/ManagementViews";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function EditTurfPage() {
  const params = useParams();
  const { data: turfs } = useTurfs();
  const saveTurf = useSaveTurf();
  const deleteTurf = useDeleteTurf();
  const createTurf = useAddTurf()
  const [showConfirm, setShowConfirm] = useState(false);

  const turfId = params.id as string;
  const isNew = turfId === "new";
  const turf = isNew ? null : turfs?.ground?.find((t ) => t.id === turfId) || null;

  const handleSave = (turf: Turf) => {
    console.log('turf20', turf)
    if(isNew){
      createTurf.mutate(turf)
    }
    
    saveTurf.mutate(turf);
    // router.back();
  };

  const handleDelete = (id: string) => {
    console.log('idddd', id)
    deleteTurf.mutate(id);
    // router.back();
  };

  if (!isNew && !turf) {
    return <div>Loading...</div>;
  }

  return (
    <EditTurfView
      turf={turf}
      turfCount={turfs?.ground?.length ?? 0}
      onSave={handleSave}
      onDelete={handleDelete}
      showConfirm={showConfirm}
      setShowConfirm={setShowConfirm}
    />
  );
}
