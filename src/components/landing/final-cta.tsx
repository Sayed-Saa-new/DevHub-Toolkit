import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react-motion";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { TOOLS } from "@/lib/tools";
import { Reveal } from "./reveal";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_center,_oklch(1_0_0/_10%),_transparent_60%)] pointer-events-none" />
      <Reveal className="relative mx-auto max-w-3xl px-4 md:px-8 py-24 text-center">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
          Stop hunting tabs.
          <br />
          <span className="text-muted-foreground">Start shipping.</span>
        </h2>
        <p className="mt-5 text-muted-foreground max-w-lg mx-auto">
          {TOOLS.length}+ developer utilities in a single, monochrome, keyboard-first workspace. Free, forever.
        </p>
        <div className="mt-9 flex flex-wrap gap-3 justify-center">
          <Link to="/tools" aria-label="Open the toolkit">
            <HoverBorderGradient
              as="div"
              containerClassName="rounded-full"
              className="text-sm font-medium flex items-center gap-2 px-5 py-2.5"
            >
              Open the toolkit <ArrowRight className="size-4" />
            </HoverBorderGradient>
          </Link>
          <a href="https://github.com" target="_blank" rel="noreferrer">
            <Button size="lg" variant="outline" className="h-11 px-5 gap-2 rounded-full">
              <Github className="size-4" /> Star on GitHub
            </Button>
          </a>
        </div>
      </Reveal>
    </section>
  );
}