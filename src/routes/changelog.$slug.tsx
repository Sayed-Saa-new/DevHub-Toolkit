import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { getChangelogEntries, getChangelogEntry } from "@/lib/changelog";

const BASE = "https://devhub.flinkeo.online";

export const Route = createFileRoute("/changelog/$slug")({
  head: ({ params }) => {
    const entry = getChangelogEntry(params.slug);
    if (!entry) {
      return {
        meta: [
          { title: "Update not found · DevHub Toolkit" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const url = `${BASE}/changelog/${entry.slug}`;
    const desc = entry.summary ?? `Changelog entry: ${entry.title}`;
    return {
      meta: [
        { title: `${entry.title} · Changelog · DevHub Toolkit` },
        { name: "description", content: desc },
        { property: "og:title", content: entry.title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "article:published_time", content: entry.publishedAt },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  loader: ({ params }) => {
    const entry = getChangelogEntry(params.slug);
    if (!entry) throw notFound();
    return { entry };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Update not found</h1>
      <p className="text-sm text-muted-foreground mt-2">This changelog entry doesn&apos;t exist.</p>
      <Link
        to="/changelog"
        className="mt-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to changelog
      </Link>
    </div>
  ),
  component: ChangelogEntryPage,
});

function ChangelogEntryPage() {
  const { slug } = Route.useParams();
  const all = getChangelogEntries();
  const entry = all.find((e) => e.slug === slug)!;
  const idx = all.findIndex((e) => e.slug === entry.slug);
  const prev = idx >= 0 ? all[idx + 1] : undefined;
  const next = idx > 0 ? all[idx - 1] : undefined;

  return (
    <article className="mx-auto max-w-3xl px-4 md:px-8 py-10 md:py-14">
      <Link
        to="/changelog"
        className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3" /> Changelog
      </Link>

      <div className="mt-5 flex items-center gap-2 text-xs font-mono text-muted-foreground">
        <time dateTime={entry.publishedAt}>
          {new Date(entry.publishedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </time>
        {entry.tag && (
          <span className="rounded-md border border-border bg-muted/30 px-2 py-0.5 text-[10px] uppercase tracking-wider">
            {entry.tag}
          </span>
        )}
      </div>

      <h1 className="mt-3 text-balance text-2xl md:text-3xl font-semibold leading-tight tracking-tight">
        {entry.title}
      </h1>

      <div className="prose-md max-w-none mt-8" dangerouslySetInnerHTML={{ __html: entry.html }} />

      {(prev || next) && (
        <nav className="mt-12 grid grid-cols-2 gap-3 border-t border-dashed border-border pt-6 text-sm">
          <div>
            {prev && (
              <Link
                to="/changelog/$slug"
                params={{ slug: prev.slug }}
                className="block rounded-lg border border-border p-3 hover:bg-accent/40 transition"
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  ← Older
                </div>
                <div className="mt-1 font-medium truncate">{prev.title}</div>
              </Link>
            )}
          </div>
          <div>
            {next && (
              <Link
                to="/changelog/$slug"
                params={{ slug: next.slug }}
                className="block rounded-lg border border-border p-3 text-right hover:bg-accent/40 transition"
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Newer →
                </div>
                <div className="mt-1 font-medium truncate">{next.title}</div>
              </Link>
            )}
          </div>
        </nav>
      )}
    </article>
  );
}
