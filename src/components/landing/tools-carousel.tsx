import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react-motion";
import { LoadingCarousel, type Tip } from "@/components/ui/loading-carousel";
import { SectionHead } from "./section-head";
import { Reveal } from "./reveal";

type CategoryTip = Tip & { label: string; slug: string };

const tips: CategoryTip[] = [
  {
    label: "Converters",
    slug: "converters",
    text: "Convert & format anything — JSON, Base64, YAML, cURL, SQL.",
    image: "/img/screenshots/converters.webp",
    url: "/c/converters",
  },
  {
    label: "Generators",
    slug: "generators",
    text: "Generate UUIDs, hashes, JWTs, QR codes and rich mock data.",
    image: "/img/screenshots/generators.webp",
    url: "/c/generators",
  },
  {
    label: "Design",
    slug: "design",
    text: "Design tokens on tap — gradients, shadows, radii, fluid clamps.",
    image: "/img/screenshots/design.webp",
    url: "/c/design",
  },
  {
    label: "Editors",
    slug: "editors",
    text: "Live editors for JSON, Markdown, Regex and SQL — instant feedback.",
    image: "/img/screenshots/editors.webp",
    url: "/c/editors",
  },
  {
    label: "Reference",
    slug: "reference",
    text: "Searchable cheat sheets — HTTP, Git, Linux, VS Code, cron.",
    image: "/img/screenshots/reference.webp",
    url: "/c/reference",
  },
  {
    label: "AI",
    slug: "ai",
    text: "AI helpers — explain, optimize, convert code and craft SQL.",
    image: "/img/screenshots/ai.webp",
    url: "/c/ai",
  },
];

export function ToolsCarousel() {
  const [current, setCurrent] = useState(0);
  const active = tips[current];

  return (
    <section className="relative border-y border-border bg-card/20 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(oklch(0.55_0_0/_0.15)_1px,transparent_1px)] [background-size:22px_22px]"
      />
      <div className="relative mx-auto max-w-6xl px-4 md:px-8 py-20 md:py-28">
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <SectionHead
            align="left"
            title="A glimpse of what's inside"
            subtitle="Six categories, forty-four hand-crafted utilities. Autoplays every 4.5s — hover to pause, arrow keys to steer."
          />
          <Link
            to="/tools"
            className="hidden md:inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group shrink-0"
          >
            Browse all tools
            <ArrowUpRight className="size-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </Reveal>

        {/* Double-bezel shell */}
        <Reveal delay={0.1} className="rounded-[1.75rem] border border-border bg-background/60 p-1.5 shadow-[0_20px_60px_-30px_oklch(0_0_0/_0.5)] backdrop-blur-sm">
          <div className="rounded-[calc(1.75rem-0.375rem)] overflow-hidden border border-border/70 bg-background">
            {/* Meta strip */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/70 bg-card/40">
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex gap-1 shrink-0" aria-hidden>
                  <span className="size-2.5 rounded-full bg-foreground/15" />
                  <span className="size-2.5 rounded-full bg-foreground/15" />
                  <span className="size-2.5 rounded-full bg-foreground/15" />
                </span>
                <span className="font-mono text-[11px] text-muted-foreground truncate">
                  devhub.toolkit / {active.slug}
                </span>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                {String(current + 1).padStart(2, "0")} / {String(tips.length).padStart(2, "0")}
              </span>
            </div>

            <LoadingCarousel
              tips={tips}
              aspectRatio="wide"
              autoplayInterval={4500}
              onTipChange={setCurrent}
              className="rounded-none border-0 max-w-none"
            />
          </div>
        </Reveal>

        {/* Category rail */}
        <Reveal delay={0.2} className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {tips.map((t, i) => (
            <Link
              key={t.slug}
              to="/c/$category"
              params={{ category: t.slug }}
              className={`text-[12px] px-3 py-1.5 rounded-full border transition-colors ${
                i === current
                  ? "border-foreground/60 bg-foreground text-background"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}