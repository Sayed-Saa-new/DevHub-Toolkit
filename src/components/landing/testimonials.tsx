import { SectionHead } from "./section-head";
import { TESTIMONIALS } from "./data";

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 md:px-8 py-20">
      <SectionHead eyebrow="Loved by developers" title="Quiet tools, loud reactions" />
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-3">
        {TESTIMONIALS.map((q) => (
          <figure key={q.a} className="rounded-xl border border-border bg-card p-6 flex flex-col">
            <blockquote className="text-sm leading-relaxed text-foreground/90 flex-1">
              “{q.q}”
            </blockquote>
            <figcaption className="mt-6 text-xs">
              <div className="font-medium">{q.a}</div>
              <div className="text-muted-foreground">{q.role}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}