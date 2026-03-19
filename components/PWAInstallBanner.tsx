"use client";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Download } from "lucide-react";

export const PWAInstallBanner = () => {
  const { isInstallable, install } = usePWAInstall();

  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 bg-neutral-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
      <div>
        <p className="font-bold text-sm">Add to Home Screen</p>
        <p className="text-xs text-neutral-400 mt-0.5">Open SlotTurf like an app</p>
      </div>
      <button
        onClick={install}
        className="flex items-center gap-2 bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl active:scale-95 transition-transform"
      >
        <Download size={14} /> Install
      </button>
    </div>
  );
};