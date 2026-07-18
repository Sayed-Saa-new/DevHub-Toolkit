import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";

import { TOOLS_BY_SLUG } from "@/lib/tools";
import { useFavorites, useHydrated } from "@/lib/storage";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Favorites — DevHub Toolkit" },
      { name: "description", content: "Your saved developer tools." },
      { property: "og:title", content: "Favorites — DevHub Toolkit" },
      { property: "og:description", content: "Your saved developer tools." },
      { property: "og:url", content: "/favorites" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/favorites" }],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const hydrated = useHydrated();
  const { favorites } = useFavorites();
  const tools = favorites.map((s) => TOOLS_BY_SLUG[s]).filter(Boolean);

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="size-10 rounded-xl border border-border grid place-items-center">
          <Star className="size-4" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Favorites</h1>
          <p className="text-sm text-muted-foreground">Quick access to the tools you use most.</p>
        </div>
      </div>

      {!hydrated ? null : tools.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-16 text-center">
          <div className="mx-auto size-12 rounded-full border border-border grid place-items-center mb-4">
            <Star className="size-5 text-muted-foreground" />
          </div>
          <div className="font-medium">No favorites yet</div>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Open a tool and hit <span className="font-mono">Save</span> to pin it here for quick access.
          </p>
          <Link to="/" className="inline-block mt-6 text-sm underline underline-offset-4 hover:text-foreground text-muted-foreground">
            Browse all tools
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tools.map((t) => (
            <Link
              key={t.slug}
              to={`/t/${t.slug}`}
              className="rounded-xl border border-border bg-card p-4 hover:border-foreground/40 transition flex items-start gap-3"
            >
              <div className="size-9 rounded-lg border border-border bg-background grid place-items-center">
                <t.icon className="size-4" />
              </div>
              <div>
                <div className="font-medium">{t.name}</div>
                <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}