"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "../lib/store";

export default function Home() {
  const router = useRouter();
  const { isLoggedIn, owner } = useUIStore();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    } else if (!owner) {
      router.replace("/profile-setup");
    } else {
      router.replace("/dashboard");
    }
  }, [isLoggedIn, owner, router]);

  return null;
}
