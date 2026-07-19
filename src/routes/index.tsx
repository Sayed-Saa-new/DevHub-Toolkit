import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Sparkles,
  Keyboard,
  Search,
  Rss,
  Star,
  Command,
  Braces,
  KeyRound,
  Hash,
  QrCode,
  Regex,
  Blend,
  Terminal,
  Check,
  Menu,
  X,
} from "lucide-react-motion";
import { MotionIconConfig } from "lucide-react-motion";
import { Github, Twitter, Fingerprint } from "lucide-react";
import { Briefcase, Rocket, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { GenerateButton } from "@/components/ui/generate-button";
import { BrandMark } from "@/components/brand-mark";
import { CATEGORIES, TOOLS } from "@/lib/tools";
import { cn } from "@/lib/utils";
import catConverters from "@/assets/cat-converters.svg";
import catGenerators from "@/assets/cat-generators.svg";
import catDesign from "@/assets/cat-design.svg";
import catEditors from "@/assets/cat-editors.svg";
import catReference from "@/assets/cat-reference.svg";
import catAi from "@/assets/cat-ai.svg";

const CATEGORY_ART: Record<string, { image: string; blurb: string }> = {
  converters: { image: catConverters, blurb: "Transform data between formats — JSON, Base64, YAML, CSV, cURL." },
  generators: { image: catGenerators, blurb: "Create UUIDs, hashes, QR codes, JWTs, passwords and mock data." },
  design: { image: catDesign, blurb: "Craft gradients, shadows, colors and fluid CSS values." },
  editors: { image: catEditors, blurb: "Live editors for JSON, Markdown, Regex, SQL and playgrounds." },
  reference: { image: catReference, blurb: "HTTP codes, Git, Linux, VS Code and cron — searchable." },
  ai: { image: catAi, blurb: "AI helpers: explain, optimize, convert code and craft SQL or tests." },
};

const SITE = "https://devhub.flinkeo.online";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `DevHub Toolkit — ${TOOLS.length}+ Developer Utilities, One Keystroke` },
      {
        name: "description",
        content:
          "The all-in-one developer toolkit. Format JSON, decode JWTs, generate hashes, tweak gradients, run AI helpers — 44+ premium utilities, local-first, zero signup.",
      },
      {
        name: "keywords",
        content:
          "developer tools, online developer toolkit, json formatter, base64 decoder, jwt decoder, uuid generator, hash generator, regex tester, qr code generator, ai code explainer, css gradient generator, free developer tools",
      },
      { property: "og:url", content: `${SITE}/` },
      { property: "og:title", content: `DevHub Toolkit — ${TOOLS.length}+ developer utilities in one keystroke` },
      {
        property: "og:description",
        content:
          "Every developer utility you actually use — JSON, Base64, JWT, UUID, hashes, regex, QR, AI SQL and more. Fast, minimal, no signup.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "DevHub Toolkit" },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d73bcc09-2f60-409d-b833-91c82c156e5e/id-preview-aa9e0d77--6b271a1b-d2e8-44e0-909f-190eae9de463.lovable.app-1784378017742.png",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `DevHub Toolkit — ${TOOLS.length}+ developer utilities in one keystroke` },
      {
        name: "twitter:description",
        content: "Every developer utility you actually use — local-first, keyboard-first, monochrome.",
      },
    ],
    links: [
      { rel: "canonical", href: `${SITE}/` },
      { rel: "prefetch", as: "image", href: catConverters, type: "image/svg+xml" },
      { rel: "prefetch", as: "image", href: catGenerators, type: "image/svg+xml" },
      { rel: "prefetch", as: "image", href: catDesign, type: "image/svg+xml" },
      { rel: "prefetch", as: "image", href: catEditors, type: "image/svg+xml" },
      { rel: "prefetch", as: "image", href: catReference, type: "image/svg+xml" },
      { rel: "prefetch", as: "image", href: catAi, type: "image/svg+xml" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${SITE}/#website`,
          name: "DevHub Toolkit",
          url: `${SITE}/`,
          description:
            "All-in-one developer toolkit — 44+ utilities: JSON, Base64, JWT, UUID, hashes, regex, QR, AI helpers and more.",
          inLanguage: "en",
          publisher: { "@id": `${SITE}/#org` },
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE}/tools?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${SITE}/#org`,
          name: "DevHub Toolkit",
          url: `${SITE}/`,
          logo: { "@type": "ImageObject", url: `${SITE}/favicon.svg` },
        }),
      },
    ],
  }),
  component: Landing,
});

const FEATURED_SLUGS = [
  "json-formatter",
  "jwt-decoder",
  "base64",
  "uuid",
  "hash",
  "regex",
  "qrcode",
  "gradient",
];

const FEATURE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  "json-formatter": Braces,
  "jwt-decoder": KeyRound,
  base64: Terminal,
  uuid: Fingerprint,
  hash: Hash,
  regex: Regex,
  qrcode: QrCode,
  gradient: Blend,
};

function Landing() {
  return (
    <MotionIconConfig trigger="parent-hover" duration={0.25}>
      <div className="min-w-0">
        <LandingHeader />
        <Hero />
        <FeaturedTools />
        <Features />
        <CategoriesShowcase />
        <Stats />
        <Testimonials />
        <FAQ />
        <FinalCTA />
        <BigFooter />
      </div>
    </MotionIconConfig>
  );
}

/* ---------------- Landing Header ---------------- */

function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
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

        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/tools"
            className="h-8 px-3 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 inline-flex items-center transition"
          >
            Tools
          </Link>
          <CategoriesMenu />
          {nav.slice(1).map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="h-8 px-3 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 inline-flex items-center transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

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
            <Button size="sm" className="h-8 rounded-full px-4 gap-1.5">
              Open toolkit <ArrowRight className="size-3.5" />
            </Button>
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
            {nav.map((item) =>
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="py-2.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </Link>
            )}
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

/* ---------------- Categories Mega-Menu ---------------- */

function CategoriesMenu() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          "h-8 px-3 rounded-md text-sm inline-flex items-center gap-1 transition",
          open ? "text-foreground bg-accent/50" : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
        )}
      >
        Categories
        <svg
          className={cn("size-3 transition-transform", open && "rotate-180")}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <>
          {/* hover bridge to avoid gap flicker */}
          <div className="absolute left-0 right-0 top-full h-3" aria-hidden />
          {typeof document !== "undefined" &&
            createPortal(
              <div
                role="menu"
                onMouseEnter={openNow}
                onMouseLeave={closeSoon}
                className="fixed left-1/2 -translate-x-1/2 top-16 w-[980px] max-w-[95vw] rounded-2xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-fade-in z-50"
              >
                <MegaMenuBody onClose={() => setOpen(false)} />
              </div>,
              document.body,
            )}
        </>
      )}
    </div>
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
                     loading="lazy"
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

/* ---------------- Hero ---------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
      <div className="absolute inset-x-0 -top-40 h-96 bg-[radial-gradient(ellipse_at_center,_oklch(1_0_0/_10%),_transparent_65%)] pointer-events-none" />
      <div className="relative mx-auto max-w-5xl px-4 md:px-8 py-20 md:py-28 text-center">
        <div className="hero-badge mb-6 inline-flex">
          <style>{`
            .hero-badge .gen-txt-wrapper { min-width: 0 !important; width: auto !important; white-space: nowrap !important; }
            .hero-badge .gen-txt-1, .hero-badge .gen-txt-2 { word-spacing: normal !important; white-space: nowrap !important; }
            .hero-badge .gen-txt-1 { position: relative !important; }
            .hero-badge .gen-btn-letter { white-space: nowrap !important; }
          `}</style>
          <GenerateButton
            label={`${TOOLS.length}+ utilities • Local-first • No signup`}
            activeLabel="Exploring the toolkit"
            aria-label={`${TOOLS.length}+ utilities, local-first, no signup`}
            className="text-base md:text-lg"
          />
        </div>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.02]">
          Every developer tool
          <br />
          <span className="text-muted-foreground">in one keystroke.</span>
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-base md:text-lg text-muted-foreground">
          A minimal, fast toolkit for the tasks you do every day. Format JSON, decode JWTs, generate hashes, tweak gradients — from one clean interface.
        </p>
        <div className="mt-9 flex flex-wrap gap-3 justify-center">
          <Link to="/tools">
            <Button size="lg" className="h-11 px-5 gap-2 rounded-full">
              Explore all tools <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link to="/changelog">
            <Button size="lg" variant="outline" className="h-11 px-5 gap-2 rounded-full">
              <Rss className="size-4" /> What's new
            </Button>
          </Link>
        </div>
        <div className="mt-6 flex items-center gap-2 justify-center text-xs text-muted-foreground">
          <kbd className="font-mono text-[10px] border border-border rounded px-1.5 py-0.5">⌘K</kbd>
          <span>to open the command palette anywhere</span>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Featured tools ---------------- */

function FeaturedTools() {
  const tools = FEATURED_SLUGS.map((slug) => TOOLS.find((t) => t.slug === slug)).filter(
    (t): t is (typeof TOOLS)[number] => Boolean(t),
  );
  return (
    <section className="mx-auto max-w-6xl px-4 md:px-8 py-20">
      <SectionHead
        eyebrow="Most-used"
        title="Popular tools, ready in a click"
        subtitle="A curated slice of the toolkit — the utilities developers open every day."
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tools.map((t) => {
          const Icon = FEATURE_ICON[t.slug] ?? Sparkles;
          return (
            <Link
              key={t.slug}
              to="/t/$slug"
              params={{ slug: t.slug }}
              data-motion-icon-group
              className="group relative rounded-xl border border-border bg-card p-5 hover:border-foreground/40 hover:bg-accent/40 transition"
            >
              <div className="size-9 rounded-lg border border-border bg-background grid place-items-center mb-4">
                <Icon className="size-4" />
              </div>
              <div className="font-medium">{t.name}</div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
              <ArrowRight className="size-4 absolute top-5 right-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </Link>
          );
        })}
      </div>
      <div className="mt-8 flex justify-center">
        <Link to="/tools" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 underline-offset-4 hover:underline">
          Browse all {TOOLS.length} tools <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}

/* ---------------- Features / Why ---------------- */

function Features() {
  const items = [
    {
      icon: ShieldCheck,
      title: "Local-first, private",
      desc: "Your data never leaves the browser. No tracking, no telemetry, no server round-trips for the tools you run.",
    },
    {
      icon: Zap,
      title: "Instant, offline-ready",
      desc: "Sub-second interactions. Everything runs client-side and stays working when your Wi-Fi doesn't.",
    },
    {
      icon: Keyboard,
      title: "Keyboard-first",
      desc: "⌘K to search anything. Never lift your hands from the keyboard — palette, favorites, recents built in.",
    },
    {
      icon: Sparkles,
      title: "AI when you want it",
      desc: "Explain code, generate SQL and regex, write commit messages — powered by Gemini, optional and off by default.",
    },
    {
      icon: Star,
      title: "Favorites & recents",
      desc: "Pin the tools you use daily. Recents remember where you left off across sessions.",
    },
    {
      icon: Command,
      title: "Minimal, premium UI",
      desc: "Monochrome, quiet, considered — inspired by Vercel, Linear and Raycast. Built for long coding days.",
    },
  ];
  return (
    <section className="border-t border-border bg-card/20">
      <div className="mx-auto max-w-6xl px-4 md:px-8 py-20">
        <SectionHead
          eyebrow="Why DevHub"
          title="Built the way developers actually work"
          subtitle="Six things that make the toolkit feel effortless — every day, all day."
        />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((f) => (
            <div key={f.title} data-motion-icon-group className="rounded-xl border border-border bg-background p-5">
              <div className="size-9 rounded-lg border border-border grid place-items-center mb-4">
                <f.icon className="size-4" />
              </div>
              <div className="font-medium">{f.title}</div>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Categories ---------------- */

function CategoriesShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-4 md:px-8 py-20">
      <SectionHead
        eyebrow="Categories"
        title="Six categories, one clean hub"
        subtitle="Everything is organized so you can find the right tool in seconds."
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CATEGORIES.map((cat) => {
          const count = TOOLS.filter((t) => t.category === cat.id).length;
          return (
            <Link
              key={cat.id}
              to="/c/$category"
              params={{ category: cat.id }}
              className="group relative rounded-xl border border-border bg-card p-6 hover:border-foreground/40 hover:bg-accent/40 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-medium">{cat.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{count} tools</div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- Stats ---------------- */

function Stats() {
  const stats = [
    { value: `${TOOLS.length}+`, label: "Developer utilities" },
    { value: "6", label: "Curated categories" },
    { value: "100%", label: "Runs in your browser" },
    { value: "0", label: "Signups required" },
  ];
  return (
    <section className="border-y border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-4 md:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-4xl md:text-5xl font-semibold tracking-tight">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */

function Testimonials() {
  const quotes = [
    {
      q: "Replaced five browser bookmarks with one URL. The command palette alone is worth it.",
      a: "Anika R.",
      role: "Full-stack engineer",
    },
    {
      q: "It just feels right. Monochrome, fast, no ads. Exactly what a developer utility should be.",
      a: "Marcus L.",
      role: "Staff engineer, fintech",
    },
    {
      q: "The AI regex generator saves me every time. I actually understand what it produces.",
      a: "Priya S.",
      role: "Backend developer",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 md:px-8 py-20">
      <SectionHead
        eyebrow="Loved by developers"
        title="Quiet tools, loud reactions"
      />
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-3">
        {quotes.map((q) => (
          <figure key={q.a} className="rounded-xl border border-border bg-card p-6 flex flex-col">
            <blockquote className="text-sm leading-relaxed text-foreground/90 flex-1">
              “{q.q}”
            </blockquote>
            <figcaption className="mt-6 text-xs">
              <div className="font-medium">{q.a}</div>
              <div className="text-muted-foreground">{q.role}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

function FAQ() {
  const items = [
    {
      q: "Is DevHub Toolkit free?",
      a: "Yes. Every tool is free forever, with no signup, no ads, and no rate limits on client-side utilities.",
    },
    {
      q: "Does my data leave the browser?",
      a: "No — all tools run locally in your browser. AI helpers send only the text you provide, on demand, and never store it.",
    },
    {
      q: "Can I use it offline?",
      a: "Yes. After the first load, the toolkit works without an internet connection (except AI tools, which need a network).",
    },
    {
      q: "How is this different from other online tools?",
      a: "One clean interface for 44+ tools, keyboard-first navigation, favorites/recents, and a monochrome premium UI — no ads, no cross-site tracking.",
    },
    {
      q: "Can I request a tool?",
      a: "Absolutely. Open an issue on GitHub and it goes straight into the roadmap.",
    },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="border-t border-border bg-card/20">
      <div className="mx-auto max-w-3xl px-4 md:px-8 py-20">
        <SectionHead eyebrow="FAQ" title="Frequently asked" />
        <div className="mt-10 divide-y divide-border border border-border rounded-xl bg-background overflow-hidden">
          {items.map((it, i) => {
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

/* ---------------- Final CTA ---------------- */

function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_center,_oklch(1_0_0/_10%),_transparent_60%)] pointer-events-none" />
      <div className="relative mx-auto max-w-3xl px-4 md:px-8 py-24 text-center">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
          Stop hunting tabs.
          <br />
          <span className="text-muted-foreground">Start shipping.</span>
        </h2>
        <p className="mt-5 text-muted-foreground max-w-lg mx-auto">
          {TOOLS.length}+ developer utilities in a single, monochrome, keyboard-first workspace. Free, forever.
        </p>
        <div className="mt-9 flex flex-wrap gap-3 justify-center">
          <Link to="/tools">
            <Button size="lg" className="h-11 px-5 gap-2 rounded-full">
              Open the toolkit <ArrowRight className="size-4" />
            </Button>
          </Link>
          <a href="https://github.com" target="_blank" rel="noreferrer">
            <Button size="lg" variant="outline" className="h-11 px-5 gap-2 rounded-full">
              <Github className="size-4" /> Star on GitHub
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Big premium footer ---------------- */

function BigFooter() {
  const productLinks = [
    { label: "All tools", to: "/tools" as const },
    { label: "Favorites", to: "/favorites" as const },
    { label: "Changelog", to: "/changelog" as const },
  ];
  return (
    <footer className="border-t border-border bg-card/10">
      <div className="mx-auto max-w-6xl px-4 md:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <BrandMark size={28} className="text-foreground" />
              <span className="font-semibold tracking-tight text-[15px]">
                Dev<span className="text-muted-foreground">Hub</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
              The all-in-one developer toolkit. Minimal, local-first, keyboard-first — built for people who ship.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="size-9 grid place-items-center rounded-md border border-border hover:border-foreground/40 hover:bg-accent/40 transition"
              >
                <Github className="size-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="size-9 grid place-items-center rounded-md border border-border hover:border-foreground/40 hover:bg-accent/40 transition"
              >
                <Twitter className="size-4" />
              </a>
              <a
                href="/sitemap.xml"
                aria-label="Sitemap"
                className="size-9 grid place-items-center rounded-md border border-border hover:border-foreground/40 hover:bg-accent/40 transition"
              >
                <Search className="size-4" />
              </a>
            </div>
          </div>

          <FooterCol title="Product">
            {productLinks.map((l) => (
              <FooterLink key={l.to} to={l.to}>{l.label}</FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Categories">
            {CATEGORIES.slice(0, 4).map((c) => (
              <li key={c.id}>
                <Link to="/c/$category" params={{ category: c.id }} className="text-sm text-muted-foreground hover:text-foreground transition">
                  {c.label}
                </Link>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Popular">
            {["json-formatter", "jwt-decoder", "base64", "regex"].map((slug) => {
              const t = TOOLS.find((x) => x.slug === slug);
              if (!t) return null;
              return (
                <li key={slug}>
                  <Link to="/t/$slug" params={{ slug }} className="text-sm text-muted-foreground hover:text-foreground transition">
                    {t.name}
                  </Link>
                </li>
              );
            })}
          </FooterCol>

          <FooterCol title="Resources">
            <li>
              <a href="/llms.txt" className="text-sm text-muted-foreground hover:text-foreground transition">
                llms.txt
              </a>
            </li>
            <li>
              <a href="/sitemap.xml" className="text-sm text-muted-foreground hover:text-foreground transition">
                Sitemap
              </a>
            </li>
            <li>
              <a
                href="/.well-known/security.txt"
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
                Security
              </a>
            </li>
          </FooterCol>
        </div>

        <div className="mt-14 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Check className="size-3.5" />
            <span className="font-mono">All processing runs locally in your browser.</span>
          </div>
          <div>
            © {new Date().getFullYear()} DevHub Toolkit · Built for developers.
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-3">
        {title}
      </div>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({ to, children }: { to: "/tools" | "/favorites" | "/changelog"; children: React.ReactNode }) {
  return (
    <li>
      <Link to={to} className="text-sm text-muted-foreground hover:text-foreground transition">
        {children}
      </Link>
    </li>
  );
}

/* ---------------- Section head ---------------- */

function SectionHead({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="inline-block text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground border border-border rounded-full px-3 py-1">
        {eyebrow}
      </div>
      <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}