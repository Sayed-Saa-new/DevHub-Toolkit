import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react-motion";
import { CATEGORIES, TOOLS } from "@/lib/tools";
import { CATEGORY_ART } from "./data";
import { SectionHead } from "./section-head";
import { Reveal, Stagger, StaggerItem } from "./reveal";

export function CategoriesShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-4 md:px-8 py-20 md:py-28">
      <Reveal>
        <SectionHead
        title="Six categories. Forty-four tools. Zero clutter."
        subtitle="Everything is organized so you can find the right utility in seconds — not tabs."
        />
      </Reveal>
      <Stagger className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat, i) => {
          const count = TOOLS.filter((t) => t.category === cat.id).length;
          const art = CATEGORY_ART[cat.id];
          return (
            <StaggerItem key={cat.id} className="h-full">
            <Link
              to="/c/$category"
              params={{ category: cat.id }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 hover:border-foreground/40 hover:bg-accent/40 transition-colors flex flex-col min-h-[200px] h-full"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-[10px] text-muted-foreground/60 tabular-nums">
                  {String(i + 1).padStart(2, "0")} / {String(CATEGORIES.length).padStart(2, "0")}
                </span>
                <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="mt-auto pt-10">
                <div className="text-xl font-medium tracking-tight">{cat.label}</div>
                {art?.blurb && (
                  <p className="mt-2 text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {art.blurb}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="tabular-nums font-medium text-foreground">{count}</span>
                  <span>tools</span>
                  <span className="h-px flex-1 bg-border/70 ml-2" />
                </div>
              </div>
            </Link>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}