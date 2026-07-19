import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Search, Star } from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GenerateButton } from "@/components/ui/generate-button";
import { CATEGORIES, TOOLS, TOOLS_BY_SLUG, searchTools, type Category } from "@/lib/tools";
import { useFavorites, useHydrated, useRecents } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "DevHub Toolkit — 44 Free Online Developer Tools" },
      { name: "description", content: "Free online JSON formatter, Base64 decoder, JWT decoder, UUID & hash generators, regex tester, QR codes, AI SQL & regex generators — 44 developer tools in one keystroke." },
      { name: "keywords", content: "developer tools online, free developer tools, all in one developer tools, json formatter online, base64 decoder online, jwt decoder, uuid generator, hash generator, regex tester online, qr code generator, ai sql generator, ai regex generator, ai code explainer, css gradient generator, box shadow generator, yaml to json, csv to json" },
      { property: "og:url", content: "https://devhub.flinkeo.online/" },
      { property: "og:title", content: "DevHub Toolkit — 44 Free Online Developer Tools" },
      { property: "og:description", content: "Every developer utility you actually use — JSON, Base64, JWT, UUID, hashes, regex, QR, AI SQL and 35+ more. Fast, minimal, no signup." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "DevHub Toolkit" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d73bcc09-2f60-409d-b833-91c82c156e5e/id-preview-aa9e0d77--6b271a1b-d2e8-44e0-909f-190eae9de463.lovable.app-1784378017742.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "DevHub Toolkit — 44 free developer tools" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "DevHub Toolkit — 44 Free Online Developer Tools" },
      { name: "twitter:description", content: "Every developer utility you actually use — JSON, Base64, JWT, UUID, hashes, regex, QR, AI SQL and 35+ more." },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d73bcc09-2f60-409d-b833-91c82c156e5e/id-preview-aa9e0d77--6b271a1b-d2e8-44e0-909f-190eae9de463.lovable.app-1784378017742.png" },
    ],
    links: [{ rel: "canonical", href: "https://devhub.flinkeo.online/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": "https://devhub.flinkeo.online/#website",
          name: "DevHub Toolkit",
          url: "https://devhub.flinkeo.online/",
          description:
            "Free online developer toolkit — 44 utilities in one place: JSON formatter, Base64 decoder, JWT decoder, UUID & hash generators, regex tester, QR codes, AI SQL and regex generators, cheat sheets and more.",
          inLanguage: "en",
          publisher: { "@id": "https://devhub.flinkeo.online/#org" },
          potentialAction: {
            "@type": "SearchAction",
            target:
              "https://devhub.flinkeo.online/?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://devhub.flinkeo.online/#org",
          name: "DevHub Toolkit",
          url: "https://devhub.flinkeo.online/",
          logo: {
            "@type": "ImageObject",
            url: "https://devhub.flinkeo.online/favicon.svg",
          },
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "all">("all");
  const hydrated = useHydrated();
  const { favorites, isFav } = useFavorites();
  const { recents } = useRecents();

  const filtered = useMemo(() => {
    let list = searchTools(q);
    if (cat !== "all") list = list.filter((t) => t.category === cat);
    return list;
  }, [q, cat]);

  return (
    <div className="min-w-0">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg opacity-70 pointer-events-none" />
        <div className="absolute inset-x-0 -top-40 h-80 bg-[radial-gradient(ellipse_at_center,_oklch(1_0_0/_8%),_transparent_60%)] pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-4 md:px-8 py-14 md:py-20">
          <div className="mb-6">
            <GenerateButton
              size="sm"
              label={`${TOOLS.length} Utilities`}
              activeLabel="Exploring"
              aria-label={`${TOOLS.length} utilities, local-first, zero tracking`}
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
            Every developer tool
            <br />
            <span className="text-muted-foreground">in one keystroke.</span>
          </h1>
          <p className="mt-5 max-w-xl text-muted-foreground">
            A minimal, fast toolkit for the tasks you do every day. Format JSON,
            decode JWTs, generate hashes, tweak gradients — all from a single
            clean interface.
          </p>

          <div className="mt-8 flex items-center gap-2 max-w-lg h-11 px-3 rounded-lg border border-border bg-card/60 focus-within:border-foreground/40 transition">
            <Search className="size-4 text-muted-foreground" />
            <Input
              autoFocus
              aria-label="Search tools"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search JSON, base64, hash, regex…"
              className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 h-9"
            />
            <kbd className="font-mono text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">⌘K</kbd>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <CatChip active={cat === "all"} onClick={() => setCat("all")}>All</CatChip>
            {CATEGORIES.map((c) => (
              <CatChip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
                {c.label}
              </CatChip>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="uppercase tracking-wider text-[10px]">Browse hubs:</span>
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                to="/c/$category"
                params={{ category: c.id }}
                className="hover:text-foreground underline-offset-4 hover:underline transition"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 md:px-8 py-10 space-y-12">
        {hydrated && favorites.length > 0 && cat === "all" && !q && (
          <Section title="Favorites" icon={<Star className="size-3.5" />}>
            <Grid tools={favorites.map((s) => TOOLS_BY_SLUG[s]).filter(Boolean)} isFav={isFav} />
          </Section>
        )}

        {hydrated && recents.length > 0 && cat === "all" && !q && (
          <Section title="Recently used">
            <Grid tools={recents.map((s) => TOOLS_BY_SLUG[s]).filter(Boolean)} isFav={isFav} />
          </Section>
        )}

        <Section title={q || cat !== "all" ? `${filtered.length} tool${filtered.length === 1 ? "" : "s"}` : "All tools"}>
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <div className="mx-auto size-10 rounded-full border border-border grid place-items-center mb-3">
                <Search className="size-4 text-muted-foreground" />
              </div>
              <div className="font-medium">No tools match "{q}"</div>
              <p className="text-sm text-muted-foreground mt-1">Try a different keyword or clear the filter.</p>
            </div>
          ) : (
            <Grid tools={filtered} isFav={isFav} hydrated={hydrated} />
          )}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-sm font-medium tracking-wide uppercase text-muted-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function CatChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-8 px-3 rounded-full border text-xs transition",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40",
      )}
    >
      {children}
    </button>
  );
}

function Grid({ tools, isFav, hydrated }: { tools: ReturnType<typeof searchTools>; isFav: (s: string) => boolean; hydrated?: boolean }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {tools.map((t) => (
        <Link
          key={t.slug}
          to={`/t/${t.slug}`}
          data-motion-icon-group
          className="group relative rounded-xl border border-border bg-card p-4 hover:border-foreground/40 hover:bg-accent/40 transition"
        >
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-lg border border-border bg-background grid place-items-center shrink-0">
              <t.icon className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="font-medium truncate">{t.name}</div>
                {hydrated && isFav(t.slug) && <Star className="size-3 fill-foreground text-foreground" />}
                {t.status === "soon" && (
                  <Badge variant="secondary" className="text-[9px] uppercase tracking-wider ml-auto">soon</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
            </div>
            <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>
      ))}
    </div>
  );
}
