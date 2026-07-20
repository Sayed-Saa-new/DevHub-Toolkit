import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react-motion";
import { CATEGORIES, TOOLS } from "@/lib/tools";
import { SectionHead } from "./section-head";

export function CategoriesShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-4 md:px-8 py-20">
      <SectionHead
        eyebrow="Categories"
        title="Six categories, one clean hub"
        subtitle="Everything is organized so you can find the right tool in seconds."
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CATEGORIES.map((cat) => {
          const count = TOOLS.filter((t) => t.category === cat.id).length;
          return (
            <Link
              key={cat.id}
              to="/c/$category"
              params={{ category: cat.id }}
              className="group relative rounded-xl border border-border bg-card p-6 hover:border-foreground/40 hover:bg-accent/40 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-medium">{cat.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{count} tools</div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}