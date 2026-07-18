import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Search, Sparkles, Star } from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, TOOLS, TOOLS_BY_SLUG, searchTools, type Category } from "@/lib/tools";
import { useFavorites, useHydrated, useRecents } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DevHub Toolkit — 23 developer tools in one place" },
      { name: "description", content: "JSON, Base64, JWT, UUID, hashes, regex, QR codes, color, gradients and more. Fast, minimal, keyboard-first." },
      { property: "og:title", content: "DevHub Toolkit — 23 developer tools in one place" },
      { property: "og:description", content: "JSON, Base64, JWT, UUID, hashes, regex, QR codes, color, gradients and more. Fast, minimal, keyboard-first." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
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
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-border bg-card/50 text-xs text-muted-foreground mb-6">
            <Sparkles className="size-3" />
            <span>23 utilities · local-first · zero tracking</span>
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
