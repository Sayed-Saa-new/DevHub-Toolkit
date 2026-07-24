import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

import { TOOL_CONTENT } from "@/lib/tool-content";

export function ToolContent({ slug }: { slug: string }) {
  const c = TOOL_CONTENT[slug];
  if (!c) return null;
  return (
    <section
      aria-label="About this tool"
      className="mt-14 md:mt-20 space-y-16 border-t border-border pt-12"
    >
      <div className="max-w-3xl">
        <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
          Overview
        </div>
        <p className="mt-3 text-base md:text-lg text-foreground/85 leading-relaxed">{c.intro}</p>
      </div>

      <div>
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Features</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-px bg-border rounded-xl overflow-hidden border border-border">
          {c.features.map((f) => (
            <div key={f.title} className="bg-card p-5">
              <div className="flex items-start gap-2">
                <Check className="size-4 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium">{f.title}</div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{f.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight">{c.howTo.name}</h2>
        <ol className="mt-6 space-y-4">
          {c.howTo.steps.map((s, i) => (
            <li key={s.name} className="flex gap-4 items-start">
              <div className="mt-0.5 size-7 rounded-md border border-border grid place-items-center font-mono text-xs tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <div className="font-medium">{s.name}</div>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Examples</h2>
        <div className="mt-6 space-y-6">
          {c.examples.map((ex, i) => (
            <div key={i} className="rounded-xl border border-border overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border flex items-center justify-between bg-card">
                <div className="text-sm">
                  <span className="text-muted-foreground">Prompt: </span>
                  <span className="font-medium">{ex.prompt}</span>
                </div>
                <span className="text-[10px] font-mono uppercase text-muted-foreground">
                  {ex.dialect}
                </span>
              </div>
              <pre className="p-4 text-xs md:text-sm overflow-x-auto bg-background/50 font-mono leading-relaxed">
                <code>{ex.sql}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Use cases</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {c.useCases.map((u) => (
            <div key={u.title} className="rounded-xl border border-border p-5 bg-card">
              <div className="font-medium">{u.title}</div>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{u.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
          Frequently asked questions
        </h2>
        <dl className="mt-6 divide-y divide-border border-y border-border">
          {c.faq.map((f) => (
            <div key={f.q} className="py-5">
              <dt className="font-medium">{f.q}</dt>
              <dd className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-3xl">
                {f.a}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {c.related && c.related.length > 0 && (
        <div>
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Related tools</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {c.related.map((r) => (
              <Link
                key={r.slug}
                to="/t/$slug"
                params={{ slug: r.slug }}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-card transition"
              >
                {r.label}
                <ArrowRight className="size-3.5" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
