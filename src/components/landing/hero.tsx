import { Link } from "@tanstack/react-router";
import { ArrowRight, Rss } from "lucide-react-motion";
import { PremiumButton } from "@/components/ui/premium-button";
import { GenerateButton } from "@/components/ui/generate-button";
import { TOOLS } from "@/lib/tools";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
      <div className="absolute inset-x-0 -top-40 h-96 bg-[radial-gradient(ellipse_at_center,_oklch(1_0_0/_10%),_transparent_65%)] pointer-events-none" />
      <div className="relative mx-auto max-w-5xl px-4 md:px-8 py-20 md:py-28 text-center">
        <div className="hero-badge mb-6 inline-flex">
          <style>{`
            .hero-badge .gen-txt-wrapper { min-width: 0 !important; width: auto !important; white-space: nowrap !important; }
            .hero-badge .gen-txt-1, .hero-badge .gen-txt-2 { word-spacing: normal !important; white-space: nowrap !important; }
            .hero-badge .gen-txt-1 { position: relative !important; }
            .hero-badge .gen-btn-letter { white-space: nowrap !important; }
          `}</style>
          <GenerateButton
            label={`${TOOLS.length}+ utilities • Local-first • No signup`}
            activeLabel="Exploring the toolkit"
            aria-label={`${TOOLS.length}+ utilities, local-first, no signup`}
            className="text-base md:text-lg"
          />
        </div>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.02]">
          Every developer tool
          <br />
          <span className="text-muted-foreground">in one keystroke.</span>
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-base md:text-lg text-muted-foreground">
          A minimal, fast toolkit for the tasks you do every day. Format JSON, decode JWTs, generate hashes, tweak gradients — from one clean interface.
        </p>
        <div className="mt-9 flex flex-wrap gap-3 justify-center">
          <Link to="/tools">
            <PremiumButton variant="primary" rightIcon={<ArrowRight className="size-4" />}>
              Explore all tools
            </PremiumButton>
          </Link>
          <Link to="/changelog">
            <PremiumButton variant="ghost" leftIcon={<Rss className="size-4" />}>
              What's new
            </PremiumButton>
          </Link>
        </div>
        <div className="mt-6 flex items-center gap-2 justify-center text-xs text-muted-foreground">
          <kbd className="font-mono text-[10px] border border-border rounded px-1.5 py-0.5">⌘K</kbd>
          <span>to open the command palette anywhere</span>
        </div>
      </div>
    </section>
  );
}