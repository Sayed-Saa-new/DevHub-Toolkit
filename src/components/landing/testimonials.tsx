import { SectionHead } from "./section-head";
import { TESTIMONIALS } from "./data";
import { Reveal, Stagger, StaggerItem } from "./reveal";

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 md:px-8 py-20">
      <Reveal>
        <SectionHead title="Quiet tools, loud reactions" />
      </Reveal>
      <Stagger className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-3">
        {TESTIMONIALS.map((q) => (
          <StaggerItem key={q.a} className="h-full">
          <figure className="rounded-2xl border border-border bg-card p-7 flex flex-col hover:border-foreground/30 transition-colors h-full">
            <div className="text-foreground/40 font-serif text-3xl leading-none mb-3" aria-hidden>“</div>
            <blockquote className="text-[15px] leading-relaxed text-foreground/90 flex-1">
              “{q.q}”
            </blockquote>
            <figcaption className="mt-6 text-xs">
              <div className="font-medium">{q.a}</div>
              <div className="text-muted-foreground mt-0.5">{q.role}</div>
            </figcaption>
          </figure>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}