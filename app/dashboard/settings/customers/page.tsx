"use client";

import { useRouter } from "next/navigation";
import { useHistory, useTurfs } from "@/hooks/use-data";
import CustomersView from "@/views/CustomersView";
import { useUIStore } from "@/lib/store";

export default function CustomersPage() {
  const router = useRouter();
  const { selectedTurfId, setSelectedTurfId } = useUIStore();
  const { data: turfs } = useTurfs();
  
  const { data: history } = useHistory({
    ground_id: selectedTurfId === "all" ? "" : (selectedTurfId ?? ""),
  });

  // Map booking_date → date for CustomersView compatibility
  const bookings =
    history?.bookings?.map((b: any) => ({
      ...b,
      date: b.booking_date,
      turfID: b.edges?.ground?.id,
    })) ?? [];

  return (
    <CustomersView
      bookings={bookings}
      turfs={turfs?.ground ?? []}
      selectedTurfId={selectedTurfId}
      onTurfSelect={setSelectedTurfId}
      onCustomerSelect={(mobile) =>
        router.push(`/dashboard/settings/customers/${mobile}`)
      }
    />
  );
}
