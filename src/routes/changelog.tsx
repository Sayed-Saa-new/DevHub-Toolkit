import { createFileRoute, Link } from "@tanstack/react-router";
import { Rss } from "lucide-react";

import { getChangelogEntries, type ChangelogEntry } from "@/lib/changelog";
import { AnimatedTag } from "@/components/animated-tag";

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
        </div>
      </section>

      {/* Entries */}
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        {entries.length === 0 ? (
          <div className="py-24 text-center text-sm text-muted-foreground">
            Nothing to see here yet…
          </div>
        ) : (
          <ul className="flex flex-col">
            {entries.map((post: ChangelogEntry, i: number) => (
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

                    <h2 className="text-balance text-xl md:text-2xl font-semibold leading-tight tracking-tight mb-3">
                      <Link
                        to="/changelog/$slug"
                        params={{ slug: post.slug }}
                        className="hover:underline underline-offset-4"
                      >
                        {post.title}
                      </Link>
                    </h2>

                    <div
                      className="prose-md max-w-none"
                      dangerouslySetInnerHTML={{ __html: post.html }}
                    />
                  </div>
                </article>
                {i < entries.length - 1 && <div className="border-t border-dashed border-border" />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
