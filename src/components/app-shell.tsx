import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Command,
  Search,
  Star,
  Github,
  Menu,
  Keyboard,
  ArrowRight,
  Clock,
  Home,
  CornerDownLeft,
  StarOff,
  Rss,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { MotionIconConfig } from "lucide-react-motion";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AnimatedTag } from "@/components/animated-tag";
import { Sheet, SheetContent, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CATEGORIES, TOOLS, TOOLS_BY_SLUG, searchTools, type Category } from "@/lib/tools";
import { useFavorites, useHydrated, useRecents, useSeen } from "@/lib/storage";
import { BrandMark, BrandLockup } from "@/components/brand-mark";

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hydrated = useHydrated();
  const { favorites } = useFavorites();
  const { recents } = useRecents();
  const { seen } = useSeen();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      const target = e.target as HTMLElement | null;
      const typing =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (!typing && e.key === "?" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setShortcutsOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Page scroll progress
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
      doc.style.setProperty("--scroll", String(p));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const byCategory = useMemo(() => {
    const map = new Map<Category, typeof TOOLS>();
    for (const t of TOOLS) {
      const arr = map.get(t.category) ?? [];
      arr.push(t);
      map.set(t.category, arr);
    }
    return map;
  }, []);

  const sidebarNav = (
    <SidebarNav
      pathname={pathname}
      hydrated={hydrated}
      favorites={favorites}
      recents={recents}
      seen={seen}
      byCategory={byCategory}
      onSearchClick={() => setOpen(true)}
    />
  );

  return (
    <MotionIconConfig trigger="parent-hover" duration={0.25}>
    <div className="min-h-svh flex bg-background text-foreground">
      <div className="scroll-progress" aria-hidden />
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar sticky top-0 h-svh">
        {sidebarNav}
      </aside>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-sidebar border-sidebar-border flex flex-col">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          {sidebarNav}
        </SheetContent>
      </Sheet>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 h-14 border-b border-border glass flex items-center px-4 md:px-6 gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden -ml-1 grid place-items-center size-9 rounded-md hover:bg-accent text-foreground"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <Link to="/" className="md:hidden" aria-label="DevHub Toolkit — Home">
            <BrandLockup />
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="flex-1 md:max-w-md flex items-center gap-2 h-9 px-3 rounded-md border border-border bg-background/40 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <Search className="size-3.5" />
            <span className="hidden sm:inline">Search {TOOLS.length} tools…</span>
            <span className="sm:hidden">Search…</span>
            <kbd className="ml-auto font-mono text-[10px] border border-border rounded px-1.5 py-0.5">⌘K</kbd>
          </button>
          <Link to="/favorites" className="hidden sm:block">
            <Button variant="ghost" size="sm" className="gap-2">
              <Star className="size-3.5" /> Favorites
            </Button>
          </Link>
          <Link to="/changelog" className="hidden sm:block">
            <Button variant="ghost" size="sm" className="gap-2">
              <Rss className="size-3.5" /> Changelog
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Keyboard shortcuts"
            className="hidden sm:inline-flex"
            onClick={() => setShortcutsOpen(true)}
          >
            <Keyboard className="size-4" />
          </Button>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hidden sm:block">
            <Button variant="ghost" size="icon" aria-label="GitHub">
              <Github className="size-4" />
            </Button>
          </a>
        </header>

        <main className="flex-1 min-w-0">{children}</main>

        <footer className="border-t border-border px-6 py-6 text-xs text-muted-foreground flex flex-wrap gap-4 justify-between">
          <span>DevHub Toolkit — Built for developers.</span>
          <span className="font-mono">All processing runs locally in your browser.</span>
        </footer>
      </div>

      <GlobalCommand open={open} onOpenChange={setOpen} onShowShortcuts={() => setShortcutsOpen(true)} />
      <ShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </div>
    </MotionIconConfig>
  );
}

function SidebarNav({
  pathname,
  hydrated,
  favorites,
  recents,
  seen,
  byCategory,
  onSearchClick,
}: {
  pathname: string;
  hydrated: boolean;
  favorites: string[];
  recents: string[];
  seen: string[];
  byCategory: Map<Category, typeof TOOLS>;
  onSearchClick: () => void;
}) {
  return (
    <>
      <Link
        to="/"
        aria-label="DevHub Toolkit — Home"
        className="group flex items-center gap-2.5 px-5 pr-14 lg:pr-5 h-14 border-b border-sidebar-border transition-colors hover:bg-accent/40"
      >
        <BrandMark size={28} className="text-foreground transition-transform group-hover:scale-105" />
        <span className="font-semibold tracking-tight text-[15px]">
          Dev<span className="text-muted-foreground">Hub</span>
        </span>
        <Badge variant="secondary" className="ml-auto text-[10px] font-mono shrink-0">version 1</Badge>
      </Link>

      <button
        onClick={onSearchClick}
        className="mx-3 mt-3 mb-2 flex items-center gap-2 h-9 px-3 rounded-md border border-sidebar-border bg-background/40 text-sm text-muted-foreground hover:text-foreground hover:border-border transition"
      >
        <Search className="size-3.5" />
        <span>Search tools…</span>
        <kbd className="ml-auto font-mono text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">
          ⌘K
        </kbd>
      </button>

      <ScrollArea className="flex-1 px-2 py-2">
        {hydrated && favorites.length > 0 && (
          <SidebarGroup title="Favorites">
            {favorites
              .map((s) => TOOLS_BY_SLUG[s])
              .filter(Boolean)
              .map((t) => (
                <SidebarLink key={t.slug} to={`/t/${t.slug}`} active={pathname === `/t/${t.slug}`}>
                  <t.icon className="size-3.5 opacity-70" /> {t.name}
                </SidebarLink>
              ))}
          </SidebarGroup>
        )}

        {hydrated && recents.length > 0 && (
          <SidebarGroup title="Recent">
            {recents
              .map((s) => TOOLS_BY_SLUG[s])
              .filter(Boolean)
              .map((t) => (
                <SidebarLink key={t.slug} to={`/t/${t.slug}`} active={pathname === `/t/${t.slug}`}>
                  <t.icon className="size-3.5 opacity-70" /> {t.name}
                </SidebarLink>
              ))}
          </SidebarGroup>
        )}

        {CATEGORIES.map((cat) => {
          const tools = byCategory.get(cat.id) ?? [];
          if (tools.length === 0) return null;
          return (
            <SidebarGroup
              key={cat.id}
              title={cat.label}
              href={`/c/${cat.id}`}
            >
              {tools.map((t) => (
                <SidebarLink key={t.slug} to={`/t/${t.slug}`} active={pathname === `/t/${t.slug}`}>
                  <t.icon className="size-3.5 opacity-70" />
                  <span className="truncate">{t.name}</span>
                  {t.isNew && hydrated && !seen.includes(t.slug) && (
                    <AnimatedTag
                      variant="new"
                      className="ml-auto text-[9px] px-1.5 py-px"
                    >
                      New
                    </AnimatedTag>
                  )}
                  {t.status === "soon" && (
                    <span className="ml-auto text-[9px] uppercase tracking-wider text-muted-foreground">
                      soon
                    </span>
                  )}
                </SidebarLink>
              ))}
            </SidebarGroup>
          );
        })}
      </ScrollArea>

      <div className="border-t border-sidebar-border px-3 py-3 text-xs text-muted-foreground flex items-center gap-2">
        <Command className="size-3" />
        <span>Press ⌘K anywhere</span>
      </div>
    </>
  );
}

function ShortcutsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const rows: Array<[string, string[]]> = [
    ["Open command palette", ["⌘", "K"]],
    ["Toggle command palette", ["Ctrl", "K"]],
    ["Show shortcuts", ["?"]],
    ["Close dialogs", ["Esc"]],
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="size-4" /> Keyboard shortcuts
          </DialogTitle>
          <DialogDescription>Move faster around DevHub Toolkit.</DialogDescription>
        </DialogHeader>
        <div className="divide-y divide-border border border-border rounded-lg overflow-hidden">
          {rows.map(([label, keys]) => (
            <div key={label} className="flex items-center justify-between px-3 py-2 text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="flex items-center gap-1">
                {keys.map((k) => (
                  <kbd
                    key={k}
                    className="font-mono text-[11px] border border-border rounded px-1.5 py-0.5 bg-muted/40"
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SidebarGroup({ title, href, children }: { title: string; href?: string; children: ReactNode }) {
  return (
    <div className="mb-3">
      {href ? (
        <Link
          to={href}
          className="block px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition"
        >
          {title}
        </Link>
      ) : (
        <div className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </div>
      )}
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

function SidebarLink({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      data-motion-icon-group
      className={cn(
        "mx-1 flex items-center gap-2 h-8 px-2 rounded-md text-sm transition",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
      )}
    >
      {children}
    </Link>
  );
}

function GlobalCommand({
  open,
  onOpenChange,
  onShowShortcuts,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onShowShortcuts: () => void;
}) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const { favorites, toggle: toggleFav, isFav } = useFavorites();
  const { recents, push: pushRecent } = useRecents();
  const { isSeen } = useSeen();

  // Reset query each time the palette opens
  useEffect(() => {
    if (open) setQ("");
  }, [open]);

  const go = (slug: string) => {
    pushRecent(slug);
    onOpenChange(false);
    navigate({ to: "/t/$slug", params: { slug } });
  };

  const favTools = useMemo(
    () => favorites.map((s) => TOOLS_BY_SLUG[s]).filter(Boolean),
    [favorites],
  );
  const recentTools = useMemo(
    () => recents.map((s) => TOOLS_BY_SLUG[s]).filter(Boolean).slice(0, 5),
    [recents],
  );
  const byCategory = useMemo(() => {
    const map = new Map<Category, typeof TOOLS>();
    for (const t of TOOLS) {
      const arr = map.get(t.category) ?? [];
      arr.push(t);
      map.set(t.category, arr);
    }
    return map;
  }, []);

  const showQuick = q.trim().length === 0;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search tools, categories, or actions…"
        value={q}
        onValueChange={setQ}
      />
      <CommandList className="max-h-[420px]">
        <CommandEmpty>
          <div className="py-6 text-center">
            <div className="text-sm text-foreground">No matches</div>
            <div className="text-xs text-muted-foreground mt-1">
              Try a different keyword — {TOOLS.length} tools indexed.
            </div>
          </div>
        </CommandEmpty>

        {showQuick && hydrated && recentTools.length > 0 && (
          <>
            <CommandGroup heading="Recent">
              {recentTools.map((t) => (
                <ToolCommandItem
                  key={`r-${t.slug}`}
                  tool={t}
                  onSelect={() => go(t.slug)}
                  onFav={() => toggleFav(t.slug)}
                  favored={isFav(t.slug)}
                  hint={<Clock className="size-3.5" />}
                />
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {showQuick && hydrated && favTools.length > 0 && (
          <>
            <CommandGroup heading="Favorites">
              {favTools.map((t) => (
                <ToolCommandItem
                  key={`f-${t.slug}`}
                  tool={t}
                  onSelect={() => go(t.slug)}
                  onFav={() => toggleFav(t.slug)}
                  favored
                  hint={<Star className="size-3.5 fill-current" />}
                />
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {CATEGORIES.map((cat) => {
          const tools = byCategory.get(cat.id) ?? [];
          if (tools.length === 0) return null;
          return (
            <CommandGroup key={cat.id} heading={cat.label}>
              {tools.map((t) => (
                <ToolCommandItem
                  key={t.slug}
                  tool={t}
                  onSelect={() => go(t.slug)}
                  onFav={() => toggleFav(t.slug)}
                  favored={hydrated && isFav(t.slug)}
                  showNew={hydrated && !!t.isNew && !isSeen(t.slug)}
                />
              ))}
            </CommandGroup>
          );
        })}

        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            value="go home dashboard"
            onSelect={() => {
              onOpenChange(false);
              navigate({ to: "/" });
            }}
            className="gap-2"
          >
            <Home className="size-4 opacity-70" />
            <span>Go to Home</span>
            <span className="ml-auto text-[10px] text-muted-foreground font-mono">/</span>
          </CommandItem>
          <CommandItem
            value="favorites bookmarks saved"
            onSelect={() => {
              onOpenChange(false);
              navigate({ to: "/favorites" });
            }}
            className="gap-2"
          >
            <Star className="size-4 opacity-70" />
            <span>Open Favorites</span>
            <span className="ml-auto text-[10px] text-muted-foreground font-mono">/favorites</span>
          </CommandItem>
          <CommandItem
            value="keyboard shortcuts help"
            onSelect={() => {
              onOpenChange(false);
              onShowShortcuts();
            }}
            className="gap-2"
          >
            <Keyboard className="size-4 opacity-70" />
            <span>Keyboard shortcuts</span>
            <span className="ml-auto text-[10px] text-muted-foreground font-mono">?</span>
          </CommandItem>
          <CommandItem
            value="github source repository"
            onSelect={() => {
              onOpenChange(false);
              window.open("https://github.com", "_blank", "noreferrer");
            }}
            className="gap-2"
          >
            <Github className="size-4 opacity-70" />
            <span>View on GitHub</span>
            <ArrowRight className="ml-auto size-3.5 opacity-50" />
          </CommandItem>
        </CommandGroup>
      </CommandList>

      <div className="flex items-center justify-between gap-4 border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <BrandMark size={14} />
          <span className="font-medium">DevHub</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <CornerDownLeft className="size-3" /> open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="font-mono border border-border rounded px-1 py-px">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="font-mono border border-border rounded px-1 py-px">esc</kbd>
            close
          </span>
        </div>
      </div>
    </CommandDialog>
  );
}

function ToolCommandItem({
  tool,
  onSelect,
  onFav,
  favored,
  hint,
  showNew,
}: {
  tool: (typeof TOOLS)[number];
  onSelect: () => void;
  onFav: () => void;
  favored: boolean;
  hint?: ReactNode;
  showNew?: boolean;
}) {
  return (
    <CommandItem
      value={`${tool.name} ${tool.category} ${tool.keywords.join(" ")}`}
      onSelect={onSelect}
      className="gap-2.5 group"
      data-motion-icon-group
    >
      <tool.icon className="size-4 opacity-70 shrink-0" />
      <span className="truncate">{tool.name}</span>
      {showNew && (
        <AnimatedTag variant="new" className="text-[9px] px-1.5 py-px shrink-0">
          New
        </AnimatedTag>
      )}
      <span className="hidden sm:inline text-[11px] text-muted-foreground truncate">
        — {tool.description}
      </span>
      <span className="ml-auto flex items-center gap-2 shrink-0">
        {hint}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onFav();
          }}
          className="opacity-0 group-hover:opacity-100 data-[on=true]:opacity-100 grid place-items-center size-6 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition"
          data-on={favored}
          aria-label={favored ? "Remove from favorites" : "Add to favorites"}
          title={favored ? "Remove from favorites" : "Add to favorites"}
        >
          {favored ? <Star className="size-3.5 fill-current" /> : <StarOff className="size-3.5" />}
        </button>
      </span>
    </CommandItem>
  );
}