import { Link } from "@tanstack/react-router";
import { ArrowRight, Rss } from "lucide-react-motion";
import { Button } from "@/components/ui/button";
import { GenerateButton } from "@/components/ui/generate-button";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
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
        <h1 className="text-5xl md:text-7xl font-semibold tracking-[-0.035em] leading-[0.98]">
          Every developer tool,
          <br />
          <span className="text-muted-foreground">one keystroke away.</span>
        </h1>
        <p className="mt-7 max-w-lg mx-auto text-[15px] md:text-base text-muted-foreground leading-relaxed">
          Format JSON, decode JWTs, generate hashes, craft gradients — {TOOLS.length}+ utilities in one minimal, local-first workspace.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <Link to="/tools" aria-label="Open the toolkit">
            <HoverBorderGradient
              as="div"
              containerClassName="rounded-full"
              className="text-sm font-medium flex items-center gap-2 px-5 py-2.5"
            >
              Open the toolkit <ArrowRight className="size-4" />
            </HoverBorderGradient>
          </Link>
          <Link to="/changelog">
            <Button size="lg" variant="outline" className="h-11 px-5 gap-2 rounded-full">
              <Rss className="size-4" /> What's new
            </Button>
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