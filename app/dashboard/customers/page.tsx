"use client";

import { useRouter } from "next/navigation";
import { useBookings } from "../../../../hooks/use-data";
import CustomersView from "../../../../views/CustomersView";

export default function CustomersPage() {
  const router = useRouter();
  const { data: bookings = [] } = useBookings();

  const handleCustomerSelect = (mobile: string) => {
    // For now, just log the selection.
    // In the future, this could navigate to a customer detail page.
    console.log("Selected customer:", mobile);
  };

  return (
    <CustomersView
      bookings={bookings}
      onCustomerSelect={handleCustomerSelect}
    />
  );
}
