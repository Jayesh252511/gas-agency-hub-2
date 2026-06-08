import { useState, useEffect } from "react";
import { Smartphone, X, Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "gh_pwa_dismissed";

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Already dismissed or already installed
    if (localStorage.getItem(DISMISSED_KEY) === "true") return;
    // Already running as installed PWA
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => { setInstalled(true); setShow(false); });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      setInstalled(true);
    }
    setShow(false);
    setDeferredPrompt(null);
  };

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(DISMISSED_KEY, "true");
  };

  if (!show || installed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 lg:bottom-6 lg:left-auto lg:right-6 lg:max-w-sm z-50 animate-slide-in-from-bottom">
      <div className="bg-card border border-primary/20 rounded-2xl shadow-2xl p-4 flex items-start gap-4">
        {/* Icon */}
        <div className="h-12 w-12 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
          <Smartphone className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-foreground">Install Gas Agency Hub</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Add to your home screen for faster access — works offline too!
          </p>
          <div className="flex items-center gap-2 mt-3">
            <button
              id="pwa-install-btn"
              onClick={install}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Install App
            </button>
            <button
              onClick={dismiss}
              className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={dismiss}
          className="text-muted-foreground hover:text-foreground p-0.5 shrink-0"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
