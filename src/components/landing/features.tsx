import {
  ShieldCheck,
  Zap,
  Command,
  Sparkles,
  Star,
  Keyboard,
} from "lucide-react-motion";
import { WobbleCard } from "@/components/wobble-card";
import { SectionHead } from "./section-head";
import { Reveal, Stagger, StaggerItem } from "./reveal";

export function Features() {
  return (
    <section className="border-t border-border bg-card/20">
      <div className="mx-auto max-w-6xl px-4 md:px-8 py-20">
        <Reveal>
          <SectionHead
          title="Built the way developers actually work"
          subtitle="Six things that make the toolkit feel effortless — every day, all day."
          />
        </Reveal>
        <Stagger className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-3">
          <StaggerItem className="lg:col-span-2">
          <WobbleCard containerClassName="min-h-[280px]">
            <div className="p-8 md:p-10 max-w-lg" data-motion-icon-group>
              <div className="size-10 rounded-lg border border-border grid place-items-center mb-5 bg-background/50 backdrop-blur">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Local-first, private by default
              </h3>
              <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                Your data never leaves the browser. No tracking, no telemetry, no server round-trips for the tools you run — encoding, hashing, formatting, all client-side.
              </p>
            </div>
          </WobbleCard>
          </StaggerItem>

          <StaggerItem>
          <WobbleCard containerClassName="min-h-[280px]">
            <div className="p-8 h-full flex flex-col" data-motion-icon-group>
              <div className="size-10 rounded-lg border border-border grid place-items-center mb-5 bg-background/50 backdrop-blur">
                <Zap className="size-5" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">
                Instant &amp; offline-ready
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Sub-second interactions. Keeps working when your Wi-Fi doesn't.
              </p>
            </div>
          </WobbleCard>
          </StaggerItem>

          <StaggerItem className="lg:col-span-3">
          <WobbleCard containerClassName="min-h-[260px]">
            <div className="p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-6 md:gap-10" data-motion-icon-group>
              <div className="flex-1 max-w-xl">
                <div className="size-10 rounded-lg border border-border grid place-items-center mb-5 bg-background/50 backdrop-blur">
                  <Command className="size-5" />
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  Keyboard-first, palette-driven
                </h3>
                <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                  ⌘K searches every tool, category, recent and favorite. Never lift your hands off the keyboard — the whole toolkit is one shortcut away.
                </p>
              </div>
              <div className="hidden md:flex flex-shrink-0 items-center gap-2 rounded-xl border border-border bg-background/60 backdrop-blur px-5 py-4 font-mono text-sm">
                <kbd className="px-2 py-1 rounded-md border border-border bg-card">⌘</kbd>
                <span className="text-muted-foreground">+</span>
                <kbd className="px-2 py-1 rounded-md border border-border bg-card">K</kbd>
                <span className="ml-3 text-muted-foreground">Search anything…</span>
              </div>
            </div>
          </WobbleCard>
          </StaggerItem>

          <StaggerItem>
          <WobbleCard containerClassName="min-h-[240px]">
            <div className="p-8 h-full flex flex-col" data-motion-icon-group>
              <div className="size-10 rounded-lg border border-border grid place-items-center mb-5 bg-background/50 backdrop-blur">
                <Sparkles className="size-5" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">AI when you want it</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Explain code, generate SQL &amp; regex, write commits — powered by Gemini, optional.
              </p>
            </div>
          </WobbleCard>
          </StaggerItem>

          <StaggerItem>
          <WobbleCard containerClassName="min-h-[240px]">
            <div className="p-8 h-full flex flex-col" data-motion-icon-group>
              <div className="size-10 rounded-lg border border-border grid place-items-center mb-5 bg-background/50 backdrop-blur">
                <Star className="size-5" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">Favorites &amp; recents</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Pin daily tools. Recents remember where you left off across sessions.
              </p>
            </div>
          </WobbleCard>
          </StaggerItem>

          <StaggerItem>
          <WobbleCard containerClassName="min-h-[240px]">
            <div className="p-8 h-full flex flex-col" data-motion-icon-group>
              <div className="size-10 rounded-lg border border-border grid place-items-center mb-5 bg-background/50 backdrop-blur">
                <Keyboard className="size-5" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">Minimal, premium UI</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Monochrome, quiet, considered — inspired by Vercel, Linear &amp; Raycast.
              </p>
            </div>
          </WobbleCard>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}