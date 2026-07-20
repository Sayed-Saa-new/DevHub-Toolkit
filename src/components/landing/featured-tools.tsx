import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react-motion";
import { TOOLS } from "@/lib/tools";
import { SectionHead } from "./section-head";
import { FEATURED_SLUGS, FEATURE_ICON } from "./data";

export function FeaturedTools() {
  const tools = FEATURED_SLUGS.map((slug) => TOOLS.find((t) => t.slug === slug)).filter(
    (t): t is (typeof TOOLS)[number] => Boolean(t),
  );
  return (
    <section className="mx-auto max-w-6xl px-4 md:px-8 py-20">
      <SectionHead
        eyebrow="Most-used"
        title="Popular tools, ready in a click"
        subtitle="A curated slice of the toolkit — the utilities developers open every day."
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tools.map((t) => {
          const Icon = FEATURE_ICON[t.slug] ?? Sparkles;
          return (
            <Link
              key={t.slug}
              to="/t/$slug"
              params={{ slug: t.slug }}
              data-motion-icon-group
              className="group relative rounded-xl border border-border bg-card p-5 hover:border-foreground/40 hover:bg-accent/40 transition"
            >
              <div className="size-9 rounded-lg border border-border bg-background grid place-items-center mb-4">
                <Icon className="size-4" />
              </div>
              <div className="font-medium">{t.name}</div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
              <ArrowRight className="size-4 absolute top-5 right-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </Link>
          );
        })}
      </div>
      <div className="mt-8 flex justify-center">
        <Link to="/tools" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 underline-offset-4 hover:underline">
          Browse all {TOOLS.length} tools <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}