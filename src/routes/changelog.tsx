import { createFileRoute, Link } from "@tanstack/react-router";
import { Rss, Search, Check, Link2 } from "lucide-react";
import { useMemo, useState } from "react";

import { getChangelogEntries, type ChangelogEntry } from "@/lib/changelog";
import { AnimatedTag } from "@/components/animated-tag";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const BASE = "https://devhub.flinkeo.online";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: "Changelog — What we're shipping · DevHub Toolkit" },
      {
        name: "description",
        content:
          "A running log of new tools, features, and improvements shipping to DevHub Toolkit.",
      },
      { property: "og:title", content: "Changelog · DevHub Toolkit" },
      {
        property: "og:description",
        content:
          "A running log of new tools, features, and improvements shipping to DevHub Toolkit.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${BASE}/changelog` },
    ],
    links: [{ rel: "canonical", href: `${BASE}/changelog` }],
    // Feed autodiscovery
  }),
  loader: () => ({ entries: getChangelogEntries() }),
  component: ChangelogPage,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function tagVariant(tag?: string): "default" | "new" | "improvement" | "fix" {
  if (!tag) return "default";
  const t = tag.toLowerCase();
  if (t.includes("new")) return "new";
  if (t.includes("fix")) return "fix";
  if (t.includes("improv") || t.includes("update") || t.includes("enhanc")) return "improvement";
  return "default";
}

function ChangelogPage() {
  const { entries } = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "new" | "improvement" | "fix">("all");
  const [copied, setCopied] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c = { all: entries.length, new: 0, improvement: 0, fix: 0 };
    for (const e of entries as ChangelogEntry[]) {
      const v = tagVariant(e.tag);
      if (v !== "default") c[v] += 1;
    }
    return c;
  }, [entries]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (entries as ChangelogEntry[]).filter((e) => {
      if (filter !== "all" && tagVariant(e.tag) !== filter) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        (e.tag ?? "").toLowerCase().includes(q) ||
        e.html.replace(/<[^>]+>/g, " ").toLowerCase().includes(q)
      );
    });
  }, [entries, query, filter]);

  async function copyLink(slug: string) {
    try {
      await navigator.clipboard.writeText(`${BASE}/changelog/${slug}`);
      setCopied(slug);
      setTimeout(() => setCopied((c) => (c === slug ? null : c)), 1500);
    } catch {
      /* ignore */
    }
  }

  const FILTERS = [
    { id: "all", label: "All" },
    { id: "new", label: "New" },
    { id: "improvement", label: "Improved" },
    { id: "fix", label: "Fixes" },
  ] as const;

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="border-b border-border/60 px-4 md:px-8 py-10 md:py-14">
        <div className="mx-auto max-w-5xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            <Rss className="size-3" /> Changelog
          </div>
          <h1 className="text-balance text-2xl md:text-3xl font-semibold tracking-tight">
            What we&apos;re shipping
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            New tools, features, fixes, and small delights — updated as they land.
          </p>
          <a
            href="/rss.xml"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            <Rss className="size-3" /> Subscribe via RSS
          </a>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex flex-wrap items-center gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded-md border px-2.5 py-1 text-xs transition-colors",
                  filter === f.id
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}{" "}
                <span className="font-mono opacity-60">{counts[f.id as keyof typeof counts]}</span>
              </button>
            ))}
          </div>
          <div className="relative md:w-64">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search changelog…"
              aria-label="Search changelog"
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Entries */}
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        {visible.length === 0 ? (
          <div className="py-24 text-center text-sm text-muted-foreground">
            No entries match your search.
          </div>
        ) : (
          <ul className="flex flex-col">
            {visible.map((post: ChangelogEntry, i: number) => (
              <li key={post.slug}>
                <article className="grid grid-cols-1 md:grid-cols-12 py-8 md:py-10">
                  {/* Date rail */}
                  <div className="hidden md:block md:col-span-2 md:col-start-1 pr-4">
                    <div className="sticky top-20 space-y-2">
                      <time
                        dateTime={post.publishedAt}
                        className="font-mono text-xs leading-none text-muted-foreground"
                      >
                        {formatDate(post.publishedAt)}
                      </time>
                      {post.tag && (
                        <AnimatedTag className="inline-flex" variant={tagVariant(post.tag)}>
                          {post.tag}
                        </AnimatedTag>
                      )}
                    </div>
                  </div>

                  {/* Vertical divider */}
                  <div className="hidden md:block md:col-start-3 md:col-end-4 border-l border-dashed border-border" />

                  {/* Content */}
                  <div className="md:col-span-9 md:col-start-4 md:pl-2">
                    <div className="mb-3 md:hidden flex items-center gap-2">
                      <time
                        dateTime={post.publishedAt}
                        className="font-mono text-xs leading-none text-muted-foreground"
                      >
                        {formatDate(post.publishedAt)}
                      </time>
                      {post.tag && (
                        <AnimatedTag variant={tagVariant(post.tag)}>{post.tag}</AnimatedTag>
                      )}
                    </div>

                    <div className="mb-3 flex items-start gap-2">
                      <h2 className="text-balance text-xl md:text-2xl font-semibold leading-tight tracking-tight">
                        <Link
                          to="/changelog/$slug"
                          params={{ slug: post.slug }}
                          className="hover:underline underline-offset-4"
                        >
                          {post.title}
                        </Link>
                      </h2>
                      <button
                        type="button"
                        onClick={() => copyLink(post.slug)}
                        aria-label={`Copy link to ${post.title}`}
                        className="mt-1 shrink-0 rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                      >
                        {copied === post.slug ? (
                          <Check className="size-3.5" />
                        ) : (
                          <Link2 className="size-3.5" />
                        )}
                      </button>
                    </div>

                    <div
                      className="prose-md max-w-none"
                      dangerouslySetInnerHTML={{ __html: post.html }}
                    />
                  </div>
                </article>
                {i < visible.length - 1 && <div className="border-t border-dashed border-border" />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
