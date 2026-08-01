import { useEffect, useState } from "react";
import { X, ArrowUpRight } from "lucide-react-motion";

const PH_URL = "https://www.producthunt.com/products/devhub-toolkit?launch=devhub-toolkit";
const STORAGE_KEY = "devhub:ph-banner-dismissed:v1";

export function PHBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  return (
    <div className="relative z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 md:px-8 h-10 flex items-center justify-center gap-3 text-xs relative">
        <a
          href={PH_URL}
          target="_blank"
          rel="noreferrer"
          data-motion-icon-group
          className="group flex items-center justify-center gap-2 min-w-0 text-center text-muted-foreground hover:text-foreground transition"
        >
          <span className="inline-flex items-center gap-1.5 shrink-0 rounded-full border border-foreground/20 bg-foreground/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground/80">
            <span className="size-1.5 rounded-full bg-foreground animate-pulse" />
            Aug 5
          </span>
          <span className="truncate">
            <span className="text-foreground font-medium">Launching on Product Hunt</span>
            <span className="hidden sm:inline"> — follow to get notified on launch day.</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 shrink-0 font-medium text-foreground">
            Notify me <ArrowUpRight className="size-3.5" />
          </span>
        </a>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-4 md:right-8 shrink-0 size-6 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
