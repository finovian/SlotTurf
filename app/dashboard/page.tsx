"use client";

import { useDashboard, useTurfs } from "@/hooks/use-data";
import { useUIStore } from "@/lib/store";
import DashboardView from "@/views/DashboardView";

export default function DashboardPage() {
  const { selectedTurfId, setSelectedTurfId } = useUIStore();
  const { data: turfs } = useTurfs();
  const { data: dashboard, isLoading } = useDashboard();
  console.log("dashboard", dashboard?.today_agenda);

  return (
    <DashboardView
      turfs={turfs?.ground ?? []}
      ownerName={dashboard?.owner_name ?? ""}
      confirmedSlots={dashboard?.confirmed_slots_today ?? 0}
      traffic={dashboard?.traffic_today ?? 0}
      totalGrounds={turfs?.ground?.length ?? 0}
      todayAgenda={dashboard?.today_agenda ?? []}
      nextOutlook={dashboard?.next_outlook ?? []}
      isLoading={isLoading}
    />
  );
}
