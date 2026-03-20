"use client";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Download, X, Share } from "lucide-react";

export const PWAInstallBanner = () => {
  const { showBanner, install, dismiss, platform } = usePWAInstall();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[100] bg-neutral-900 text-white rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom-8 duration-500 border border-white/10 backdrop-blur-xl bg-neutral-900/90">
      <button 
        onClick={dismiss}
        className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
      >
        <X size={20} />
      </button>

      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Download size={24} />
            </div>
            <div>
                <p className="font-bold text-lg tracking-tight">Add to Home Screen</p>
                <p className="text-xs text-neutral-400 font-medium">Get the full experience on your phone</p>
            </div>
        </div>

        {platform === "ios" ? (
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">How to install on iOS:</p>
                <div className="space-y-3">
                    <div className="flex items-start gap-3 text-xs">
                        <div className="w-5 h-5 bg-white/10 rounded-md flex items-center justify-center shrink-0">
                            <Share size={12} className="text-blue-400" />
                        </div>
                        <p className="text-neutral-300">Tap the <span className="text-white font-bold">Share</span> button in Safari</p>
                    </div>
                    <div className="flex items-start gap-3 text-xs">
                        <div className="w-5 h-5 bg-white/10 rounded-md flex items-center justify-center shrink-0">
                            <Plus size={12} />
                        </div>
                        <p className="text-neutral-300">Scroll down and select <span className="text-white font-bold">Add to Home Screen</span></p>
                    </div>
                </div>
            </div>
        ) : (
            <button
                onClick={install}
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl active:scale-95 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-3 text-sm"
            >
                <Download size={18} /> Install App
            </button>
        )}
        
        <button 
            onClick={dismiss}
            className="w-full text-center text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-neutral-400 transition-colors"
        >
            Maybe Later
        </button>
      </div>
    </div>
  );
};

const Plus = ({ size, className }: { size?: number, className?: string }) => (
    <svg 
        width={size || 24} 
        height={size || 24} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);
