import { Link } from "@tanstack/react-router";
import { ArrowRight, Rss } from "lucide-react-motion";
import { Button } from "@/components/ui/button";
import { GenerateButton } from "@/components/ui/generate-button";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { TOOLS } from "@/lib/tools";

export function Hero() {
  const marqueeTools = TOOLS.slice(0, 18);
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Layer 1 — subtle grid */}
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none hero-fade" />
      {/* Layer 2 — animated aurora glows */}
      <div className="aurora" aria-hidden />
      {/* Layer 3 — top vignette */}
      <div className="absolute inset-x-0 -top-40 h-96 bg-[radial-gradient(ellipse_at_center,_oklch(1_0_0/_10%),_transparent_65%)] pointer-events-none" />
      {/* Layer 4 — bottom fade into next section */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 md:px-8 pt-24 pb-24 md:pt-32 md:pb-28 text-center">
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

        <h1 className="text-[2.75rem] leading-[1.02] sm:text-6xl md:text-[5.25rem] md:leading-[0.98] font-semibold tracking-[-0.035em] text-balance">
          Every developer tool,
          <br className="hidden sm:block" />{" "}
          <span className="font-editorial text-foreground/95 pr-1">in one</span>{" "}
          <span className="relative inline-block">
            <span className="relative z-10">keystroke.</span>
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-1 md:bottom-2 h-2 md:h-3 bg-foreground/90 -skew-x-6 z-0 rounded-sm"
            />
          </span>
        </h1>

        <p className="mt-7 max-w-xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed text-balance">
          A minimal, fast toolkit for the tasks you do every day. Format JSON, decode JWTs, generate hashes, tweak gradients — from one clean interface.
        </p>

        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <Link to="/tools" aria-label="Explore all tools">
            <HoverBorderGradient
              as="div"
              containerClassName="rounded-full"
              className="text-sm font-medium flex items-center gap-2 px-5 py-2.5"
            >
              Explore all tools <ArrowRight className="size-4" />
            </HoverBorderGradient>
          </Link>
          <Link to="/changelog">
            <Button size="lg" variant="outline" className="h-11 px-5 gap-2 rounded-full">
              <Rss className="size-4" /> What's new
            </Button>
          </Link>
        </div>

        <div className="mt-7 flex items-center gap-2 justify-center text-xs text-muted-foreground">
          <kbd className="font-mono text-[10px] border border-border rounded px-1.5 py-0.5">⌘K</kbd>
          <span>to open the command palette anywhere</span>
        </div>
      </div>

      {/* Marquee ticker — subtle proof of surface area */}
      <div className="relative border-t border-border/60 bg-background/40 backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="overflow-hidden py-3">
          <div className="marquee text-[11px] uppercase tracking-[0.22em] text-muted-foreground/70 font-mono">
            {[...marqueeTools, ...marqueeTools].map((t, i) => (
              <span key={`${t.slug}-${i}`} className="flex items-center gap-2.5 whitespace-nowrap">
                <span className="size-1 rounded-full bg-foreground/40" />
                {t.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}