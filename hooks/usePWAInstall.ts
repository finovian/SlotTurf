import { useEffect, useState } from "react";

export const usePWAInstall = () => {
  const [prompt, setPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "other" | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(true); // Default to true until checked

  useEffect(() => {
    // Check if already installed
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');
    
    setIsStandalone(isStandaloneMode);

    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform("ios");
    } else if (/android/.test(userAgent)) {
      setPlatform("android");
    } else {
      setPlatform("other");
    }

    // Check dismissal from localStorage
    const lastDismissed = localStorage.getItem("pwa-dismissed");
    if (lastDismissed) {
      const lastDate = new Date(parseInt(lastDismissed));
      const now = new Date();
      const diffDays = (now.getTime() - lastDate.getTime()) / (1000 * 3600 * 24);
      
      // If dismissed less than 2 days ago, don't show
      if (diffDays < 2) {
        setHasDismissed(true);
      } else {
        setHasDismissed(false);
      }
    } else {
      setHasDismissed(false);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    
    // For iOS, it's never "installable" via prompt, but we show the guide
    if (/iphone|ipad|ipod/.test(userAgent) && !isStandaloneMode) {
        setIsInstallable(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (platform === "ios") {
        // iOS doesn't support programmatic prompt
        return;
    }

    if (!prompt) return;
    prompt.prompt();
    const result = await prompt.userChoice;
    if (result.outcome === "accepted") {
      setIsInstallable(false);
      setPrompt(null);
      localStorage.setItem("pwa-installed", "true");
    }
  };

  const dismiss = () => {
    localStorage.setItem("pwa-dismissed", Date.now().toString());
    setIsInstallable(false);
    setHasDismissed(true);
  };

  const showBanner = isInstallable && !isStandalone && !hasDismissed;

  return { showBanner, install, dismiss, platform };
};