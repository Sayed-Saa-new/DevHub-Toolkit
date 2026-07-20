import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Sparkles,
  Rss,
  Star,
  Menu,
  X,
} from "lucide-react-motion";
import { Github, Briefcase, Rocket, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import type { ComponentType } from "react";

import { Button } from "@/components/ui/button";
import { PremiumButton } from "@/components/ui/premium-button";
import { BrandMark } from "@/components/brand-mark";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { CATEGORIES, TOOLS } from "@/lib/tools";
import { cn } from "@/lib/utils";
import { getChangelogEntries } from "@/lib/changelog";
import { CATEGORY_ART, FEATURED_TOOL_SLUGS } from "./data";

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuValue, setMenuValue] = useState("");
  const closeMenu = () => setMenuValue("");
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { label: "Tools", to: "/tools" as const },
    { label: "Favorites", to: "/favorites" as const },
    { label: "Changelog", to: "/changelog" as const },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8 h-14 flex items-center justify-between">
        <Link to="/" className="group inline-flex items-center gap-2.5">
          <BrandMark size={26} className="text-foreground" />
          <span className="font-semibold tracking-tight text-[15px]">
            Dev<span className="text-muted-foreground">Hub</span>
          </span>
        </Link>

        <NavigationMenu
          value={menuValue}
          onValueChange={setMenuValue}
          className="hidden md:flex"
          delayDuration={80}
          skipDelayDuration={200}
        >
          <NavigationMenuList className="gap-0">
            <NavigationMenuItem value="tools">
              <NavigationMenuTrigger className="h-8 px-3 text-sm bg-transparent data-[state=open]:bg-accent/50 hover:bg-accent/50 text-muted-foreground data-[state=open]:text-foreground hover:text-foreground">
                Tools
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ToolsMenuBody close={closeMenu} />
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem value="categories">
              <NavigationMenuTrigger className="h-8 px-3 text-sm bg-transparent data-[state=open]:bg-accent/50 hover:bg-accent/50 text-muted-foreground data-[state=open]:text-foreground hover:text-foreground">
                Categories
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[980px] max-w-[95vw]">
                  <MegaMenuBody onClose={closeMenu} />
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/favorites"
                  className="h-8 px-3 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 inline-flex items-center transition"
                >
                  Favorites
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem value="changelog">
              <NavigationMenuTrigger className="h-8 px-3 text-sm bg-transparent data-[state=open]:bg-accent/50 hover:bg-accent/50 text-muted-foreground data-[state=open]:text-foreground hover:text-foreground">
                Changelog
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ChangelogMenuBody close={closeMenu} />
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden md:flex items-center gap-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="size-8 grid place-items-center rounded-md border border-border hover:border-foreground/40 hover:bg-accent/40 transition"
          >
            <Github className="size-3.5" />
          </a>
          <Link to="/tools">
            <PremiumButton variant="primary" size="sm" rightIcon={<ArrowRight className="size-3.5" />}>
              Open toolkit
            </PremiumButton>
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden size-9 grid place-items-center rounded-md border border-border"
          aria-label="Menu"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col">
            {nav.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/c/$category"
              params={{ category: "converters" }}
              onClick={() => setOpen(false)}
              className="py-2.5 text-sm text-muted-foreground hover:text-foreground"
            >
              Categories
            </Link>
            <Link to="/tools" onClick={() => setOpen(false)}>
              <Button size="sm" className="mt-2 w-full h-9 rounded-full gap-1.5">
                Open toolkit <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function MegaMenuBody({ onClose }: { onClose: () => void }) {
  const half = Math.ceil(CATEGORIES.length / 2);
  const colA = CATEGORIES.slice(0, half);
  const colB = CATEGORIES.slice(half);

  const inspiration = [
    { icon: Briefcase, label: "All tools", desc: "Browse every utility in one grid.", to: "/tools" as const },
    { icon: Rocket, label: "Favorites", desc: "Your pinned tools, one shortcut away.", to: "/favorites" as const },
    { icon: BookOpen, label: "Changelog", desc: "New releases, fixes and improvements.", to: "/changelog" as const },
  ];

  return (
    <div className="grid grid-cols-[1fr_1fr_0.9fr]">
      <MegaColumn title="Categories" items={colA} onClose={onClose} />
      <div className="border-l border-border">
        <MegaColumn title="All categories" items={colB} onClose={onClose} />
      </div>
      <div className="border-l border-border bg-muted/30 p-5">
        <div className="text-xs text-muted-foreground mb-3">Inspiration</div>
        <ul className="space-y-1">
          {inspiration.map((i) => (
            <li key={i.label}>
              <Link
                to={i.to}
                onClick={onClose}
                className="group flex items-start gap-3 rounded-lg p-2.5 -mx-2.5 hover:bg-accent/60 transition"
              >
                <div className="mt-0.5 size-5 grid place-items-center text-muted-foreground group-hover:text-foreground transition-colors">
                  <i.icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground">{i.label}</div>
                  <div className="text-xs text-muted-foreground leading-snug line-clamp-2">{i.desc}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MegaColumn({
  title,
  items,
  onClose,
}: {
  title: string;
  items: typeof CATEGORIES;
  onClose: () => void;
}) {
  return (
    <div className="p-5">
      <div className="text-xs text-muted-foreground mb-3">{title}</div>
      <ul className="space-y-1">
        {items.map((c) => {
          const art = CATEGORY_ART[c.id];
          const count = TOOLS.filter((t) => t.category === c.id).length;
          return (
            <li key={c.id}>
              <Link
                to="/c/$category"
                params={{ category: c.id }}
                onClick={onClose}
                className="group flex items-start gap-3 rounded-lg p-2 -mx-2 hover:bg-accent/60 transition"
              >
                <div className="relative shrink-0 w-[92px] aspect-[16/10] rounded-md overflow-hidden border border-border bg-gradient-to-br from-neutral-900 to-black flex items-center justify-center p-2">
                  <img
                    src={art.image}
                    alt=""
                    className="max-h-full max-w-full object-contain opacity-90 group-hover:opacity-100 group-hover:scale-[1.06] transition-all duration-500"
                    loading="eager"
                    decoding="async"
                  />
                </div>
                <div className="min-w-0 pt-0.5">
                  <div className="text-sm font-medium text-foreground flex items-center gap-2">
                    {c.label}
                    <span className="text-[10px] font-mono text-muted-foreground/70">
                      {count.toString().padStart(2, "0")}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground leading-snug line-clamp-2 mt-0.5">
                    {art.blurb}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ToolsMenuBody({ close }: { close: () => void }) {
  const featured = FEATURED_TOOL_SLUGS.map((s) => TOOLS.find((t) => t.slug === s)).filter(
    Boolean,
  ) as typeof TOOLS;
  const fresh = TOOLS.filter((t) => t.isNew).slice(-6).reverse();

  const jumps: { icon: ComponentType<{ className?: string }>; label: string; desc: string; to: "/tools" | "/favorites" }[] = [
    { icon: Briefcase, label: "All tools", desc: `Browse all ${TOOLS.length} utilities.`, to: "/tools" },
    { icon: Star, label: "Favorites", desc: "Your pinned tools.", to: "/favorites" },
  ];

  return (
    <div className="w-[820px] max-w-[95vw] grid grid-cols-[1fr_1fr_0.85fr]">
      <div className="p-5">
        <div className="text-xs text-muted-foreground mb-3">Featured</div>
        <ul className="space-y-1">
          {featured.map((t) => (
            <li key={t.slug}>
              <Link
                to="/t/$slug"
                params={{ slug: t.slug }}
                onClick={close}
                className="group flex items-start gap-3 rounded-lg p-2 -mx-2 hover:bg-accent/60 transition"
              >
                <div className="mt-0.5 size-8 grid place-items-center rounded-md border border-border bg-muted/40 text-foreground/80 group-hover:border-foreground/40 transition">
                  <t.icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground leading-snug line-clamp-1">
                    {t.description}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-l border-border p-5">
        <div className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
          <span className="inline-block size-1.5 rounded-full bg-foreground" />
          New in DevHub
        </div>
        <ul className="space-y-1">
          {fresh.map((t) => (
            <li key={t.slug}>
              <Link
                to="/t/$slug"
                params={{ slug: t.slug }}
                onClick={close}
                className="group flex items-start gap-3 rounded-lg p-2 -mx-2 hover:bg-accent/60 transition"
              >
                <div className="mt-0.5 size-8 grid place-items-center rounded-md border border-border bg-muted/40 text-foreground/80 group-hover:border-foreground/40 transition">
                  <t.icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground flex items-center gap-2">
                    {t.name}
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm border border-foreground/30 text-foreground/80">
                      new
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground leading-snug line-clamp-1">
                    {t.description}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-l border-border bg-muted/30 p-5 flex flex-col">
        <div className="text-xs text-muted-foreground mb-3">Jump to</div>
        <ul className="space-y-1">
          {jumps.map((j) => (
            <li key={j.label}>
              <Link
                to={j.to}
                onClick={close}
                className="group flex items-start gap-3 rounded-lg p-2.5 -mx-2.5 hover:bg-accent/60 transition"
              >
                <div className="mt-0.5 size-5 grid place-items-center text-muted-foreground group-hover:text-foreground transition-colors">
                  <j.icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground">{j.label}</div>
                  <div className="text-xs text-muted-foreground leading-snug line-clamp-2">
                    {j.desc}
                  </div>
                </div>
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/c/$category"
              params={{ category: "ai" }}
              onClick={close}
              className="group flex items-start gap-3 rounded-lg p-2.5 -mx-2.5 hover:bg-accent/60 transition"
            >
              <div className="mt-0.5 size-5 grid place-items-center text-muted-foreground group-hover:text-foreground transition-colors">
                <Sparkles className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-foreground">AI tools</div>
                <div className="text-xs text-muted-foreground leading-snug line-clamp-2">
                  Explain, optimize, generate.
                </div>
              </div>
            </Link>
          </li>
        </ul>
        <div className="mt-auto pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
          <span>Command palette</span>
          <kbd className="font-mono text-[10px] border border-border rounded px-1.5 py-0.5">⌘K</kbd>
        </div>
      </div>
    </div>
  );
}

function ChangelogMenuBody({ close }: { close: () => void }) {
  const entries = getChangelogEntries().slice(0, 4);

  const tagStyle = (tag?: string) => {
    const t = (tag || "").toLowerCase();
    if (t.includes("new")) return "border-foreground/30 text-foreground/80";
    if (t.includes("improve")) return "border-amber-400/40 text-amber-300/90";
    if (t.includes("fix")) return "border-sky-400/40 text-sky-300/90";
    return "border-border text-muted-foreground";
  };

  return (
    <div className="w-[660px] max-w-[95vw] grid grid-cols-[1.5fr_0.9fr]">
      <div className="p-5">
        <div className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
          <Rss className="size-3" /> Latest releases
        </div>
        {entries.length === 0 ? (
          <div className="text-sm text-muted-foreground py-6 text-center">No entries yet.</div>
        ) : (
          <ul className="space-y-1">
            {entries.map((e) => (
              <li key={e.slug}>
                <Link
                  to="/changelog/$slug"
                  params={{ slug: e.slug }}
                  onClick={close}
                  className="group block rounded-lg p-2.5 -mx-2.5 hover:bg-accent/60 transition"
                >
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="font-mono">
                      {new Date(e.publishedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {e.tag && (
                      <span
                        className={cn(
                          "text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm border",
                          tagStyle(e.tag),
                        )}
                      >
                        {e.tag}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-sm font-medium text-foreground group-hover:underline underline-offset-4 decoration-foreground/40">
                    {e.title}
                  </div>
                  {e.summary && (
                    <div className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                      {e.summary}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="border-l border-border bg-muted/30 p-5 flex flex-col">
        <div className="text-xs text-muted-foreground mb-3">More</div>
        <ul className="space-y-1">
          <li>
            <Link
              to="/changelog"
              onClick={close}
              className="group flex items-start gap-3 rounded-lg p-2.5 -mx-2.5 hover:bg-accent/60 transition"
            >
              <div className="mt-0.5 size-5 grid place-items-center text-muted-foreground group-hover:text-foreground transition-colors">
                <BookOpen className="size-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">All releases</div>
                <div className="text-xs text-muted-foreground">Every update since day one.</div>
              </div>
            </Link>
          </li>
          <li>
            <a
              href="/rss.xml"
              onClick={close}
              className="group flex items-start gap-3 rounded-lg p-2.5 -mx-2.5 hover:bg-accent/60 transition"
            >
              <div className="mt-0.5 size-5 grid place-items-center text-muted-foreground group-hover:text-foreground transition-colors">
                <Rss className="size-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">RSS feed</div>
                <div className="text-xs text-muted-foreground">Subscribe in your reader.</div>
              </div>
            </a>
          </li>
        </ul>
        <div className="mt-auto pt-4 border-t border-border/60">
          <div className="text-xs text-muted-foreground">
            <span className="text-foreground font-medium">Tip:</span> star tools you use most —
            they surface in <span className="text-foreground">Favorites</span>.
          </div>
        </div>
      </div>
    </div>
  );
}