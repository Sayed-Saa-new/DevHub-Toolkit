import { Link } from "@tanstack/react-router";
import { Search, Check } from "lucide-react-motion";
import { Github, Twitter } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { AsciiWordmark } from "@/components/ascii-wordmark";
import { CATEGORIES, TOOLS } from "@/lib/tools";

export function BigFooter() {
  const productLinks = [
    { label: "All tools", to: "/tools" as const },
    { label: "Favorites", to: "/favorites" as const },
    { label: "Changelog", to: "/changelog" as const },
  ];
  return (
    <footer className="relative overflow-hidden border-t border-border bg-card/10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at 50% 100%, black 40%, transparent 75%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 md:px-8 pt-16 pb-4">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <BrandMark size={28} className="text-foreground" />
              <span className="font-semibold tracking-tight text-[15px]">
                Dev<span className="text-muted-foreground">Hub</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
              The all-in-one developer toolkit. Minimal, local-first, keyboard-first — built for
              people who ship.
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
              <FooterLink key={l.to} to={l.to}>
                {l.label}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Categories">
            {CATEGORIES.slice(0, 4).map((c) => (
              <li key={c.id}>
                <Link
                  to="/c/$category"
                  params={{ category: c.id }}
                  className="text-sm text-muted-foreground hover:text-foreground transition"
                >
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
                  <Link
                    to="/t/$slug"
                    params={{ slug }}
                    className="text-sm text-muted-foreground hover:text-foreground transition"
                  >
                    {t.name}
                  </Link>
                </li>
              );
            })}
          </FooterCol>

          <FooterCol title="Resources">
            <li>
              <a
                href="/llms.txt"
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
                llms.txt
              </a>
            </li>
            <li>
              <a
                href="/sitemap.xml"
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
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
          <div>© {new Date().getFullYear()} DevHub Toolkit · Built for developers.</div>
        </div>
      </div>

      <div aria-hidden className="relative select-none pointer-events-none -mt-2">
        <AsciiWordmark
          text="DevHub"
          className="mx-auto max-w-[1400px] px-4 md:px-8 pointer-events-auto"
        />
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

function FooterLink({
  to,
  children,
}: {
  to: "/tools" | "/favorites" | "/changelog";
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link to={to} className="text-sm text-muted-foreground hover:text-foreground transition">
        {children}
      </Link>
    </li>
  );
}
