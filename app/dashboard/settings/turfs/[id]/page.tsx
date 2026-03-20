"use client";

import { useAddTurf, useDeleteTurf, useSaveTurf, useTurfs } from "@/hooks/use-data";
import { useUIStore } from "@/lib/store";
import { Turf } from "@/types";
import { EditTurfView } from "@/views/ManagementViews";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function EditTurfPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useUIStore();
  const { data: turfs } = useTurfs();
  const saveTurf = useSaveTurf();
  const deleteTurf = useDeleteTurf();
  const createTurf = useAddTurf();
  const [showConfirm, setShowConfirm] = useState(false);

  const turfId = params.id as string;
  const isNew = turfId === "new";
  const turf = isNew ? null : turfs?.ground?.find((t) => t.id === turfId) || null;

  const handleSave = (turfData: any) => {
    if (isNew) {
      createTurf.mutate(turfData, {
        onSuccess: () => {
          showToast("Ground added successfully", "success");
          router.push("/dashboard/settings/turfs");
        },
        onError: (err) => {
          console.error("Add turf error:", err);
          showToast("Failed to add ground", "error");
        },
      });
    } else {
      saveTurf.mutate(turfData, {
        onSuccess: () => {
          showToast("Ground updated successfully", "success");
          router.push("/dashboard/settings/turfs");
        },
        onError: (err) => {
          console.error("Save turf error:", err);
          showToast("Failed to update ground", "error");
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteTurf.mutate(id, {
      onSuccess: () => {
        showToast("Ground removed successfully", "success");
        router.push("/dashboard/settings/turfs");
      },
      onError: (err) => {
        console.error("Delete turf error:", err);
        showToast("Failed to remove ground", "error");
      },
    });
  };

  if (!isNew && !turf) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-neutral-400 animate-pulse font-bold uppercase tracking-widest text-xs">
          Loading ground details...
        </p>
      </div>
    );
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
