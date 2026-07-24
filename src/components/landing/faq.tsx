import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHead } from "./section-head";
import { FAQ_ITEMS } from "./data";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="border-t border-border bg-card/20">
      <div className="mx-auto max-w-3xl px-4 md:px-8 py-20">
        <SectionHead title="Questions, answered" />
        <div className="mt-10 divide-y divide-border border border-border rounded-xl bg-background overflow-hidden">
          {FAQ_ITEMS.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-accent/30 transition"
                >
                  <span className="font-medium text-sm">{it.q}</span>
                  <span
                    className={cn(
                      "size-6 rounded-full border border-border grid place-items-center text-muted-foreground shrink-0 transition-transform",
                      isOpen && "rotate-45",
                    )}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 -mt-1 text-sm text-muted-foreground leading-relaxed">
                    {it.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
