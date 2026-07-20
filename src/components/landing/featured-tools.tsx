import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react-motion";
import { TOOLS } from "@/lib/tools";
import { SectionHead } from "./section-head";
import { FEATURED_SLUGS, FEATURE_ICON } from "./data";
import { Reveal, Stagger, StaggerItem } from "./reveal";

export function FeaturedTools() {
  const tools = FEATURED_SLUGS.map((slug) => TOOLS.find((t) => t.slug === slug)).filter(
    (t): t is (typeof TOOLS)[number] => Boolean(t),
  );
  return (
    <section className="mx-auto max-w-6xl px-4 md:px-8 py-20">
      <Reveal>
        <SectionHead
        title="The utilities you open every day"
        subtitle="A curated slice of the toolkit. Everything else lives one keystroke away."
        align="left"
        />
      </Reveal>
      <Stagger className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
        {tools.map((t, i) => {
          const Icon = FEATURE_ICON[t.slug] ?? Sparkles;
          return (
            <StaggerItem key={t.slug}>
            <Link
              to="/t/$slug"
              params={{ slug: t.slug }}
              data-motion-icon-group
              className="group relative block h-full bg-card p-6 hover:bg-accent/40 transition"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="size-9 rounded-lg border border-border bg-background grid place-items-center">
                  <Icon className="size-4" />
                </div>
                <span className="font-mono text-[10px] text-muted-foreground/60 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="font-medium tracking-tight">{t.name}</div>
              <p className="text-[13px] text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{t.description}</p>
              <ArrowRight className="size-3.5 absolute bottom-6 right-6 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </Link>
            </StaggerItem>
          );
        })}
      </Stagger>
      <Reveal delay={0.1} className="mt-8 flex justify-center">
        <Link to="/tools" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 underline-offset-4 hover:underline">
          Browse all {TOOLS.length} tools <ArrowRight className="size-3.5" />
        </Link>
      </Reveal>
    </section>
  );
}