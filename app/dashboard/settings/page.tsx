"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { View } from "@/types";
import SettingsView from "@/views/SettingsView";
import ConfirmationModal from "@/components/Modal";

export default function SettingsPage() {
  const router = useRouter();
  const { logout } = useStore();

  const [showConfirm, setShowConfirm] = useState<"logout" | "delete" | null>(
    null,
  );

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };
  const handleNavigate = (view: View) => {
    const viewToHref: { [key in View]?: string } = {
      [View.EDIT_PROFILE]: "/dashboard/settings/profile",
      [View.EDIT_TURF]: "/dashboard/settings/turfs",
      [View.CUSTOMERS]: "/dashboard/settings/customers",
      [View.SUBSCRIPTION]: "/dashboard/settings/billing",
      [View.LEGAL]: "/dashboard/settings/legal",
      [View.SUPPORT]: "/dashboard/settings/support",
    };
    const href = viewToHref[view];
    if (href) {
      router.push(href);
    }
  };

  return (
    <>
      <SettingsView
        onLogout={() => setShowConfirm("logout")}
        onNavigate={handleNavigate}
        onDeleteAccount={() => setShowConfirm("delete")}
      />
      <ConfirmationModal
        isOpen={!!showConfirm}
        onClose={() => setShowConfirm(null)}
        onConfirm={() => {
          if (showConfirm === "logout" || showConfirm === "delete")
            handleLogout();
          setShowConfirm(null);
        }}
        title={showConfirm === "logout" ? "Logout?" : "Delete Account?"}
        description={
          showConfirm === "logout"
            ? "You will be signed out."
            : "This will erase all data."
        }
        confirmLabel={showConfirm === "logout" ? "Logout" : "Delete All"}
        isDanger={showConfirm === "delete"}
      />
    </>
  );
}
