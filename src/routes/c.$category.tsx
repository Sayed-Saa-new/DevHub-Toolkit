import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { CATEGORIES, TOOLS, type Category } from "@/lib/tools";

const BASE = "https://devhub.flinkeo.online";

const CATEGORY_META: Record<Category, { title: string; description: string; keywords: string }> = {
  converters: {
    title: "Developer Converters — JSON, Base64, CSV, YAML, cURL & more",
    description: "Free online developer converters: JSON ↔ TypeScript, Base64, URL, YAML ↔ JSON, CSV ↔ JSON, cURL → code, Markdown, timezone, number base and more.",
    keywords: "developer converters, json converter, base64 converter, yaml to json, csv to json, curl to fetch, markdown converter, url encoder",
  },
  generators: {
    title: "Developer Generators — UUID, Hash, QR, JWT, Passwords, Mock Data",
    description: "Generate UUIDs, hashes (MD5/SHA), QR codes, JWTs, strong passwords, Lorem Ipsum, mock JSON/SQL data, meta tags, favicons and more — free and instant.",
    keywords: "uuid generator, hash generator, qr code generator, jwt generator, password generator, mock data generator, lorem ipsum, meta tag generator",
  },
  design: {
    title: "CSS Design Tools — Gradients, Shadows, Colors, Clamp",
    description: "Design CSS gradients, box shadows, border radius, pick colors (HEX/RGB/HSL) and build fluid typography with CSS clamp() — live previews, copy-ready code.",
    keywords: "css gradient generator, box shadow generator, css clamp calculator, color converter, border radius generator, fluid typography",
  },
  editors: {
    title: "Developer Editors — JSON, Markdown, Regex, SQL, Playground",
    description: "Live editors for JSON, Markdown, Regex, SQL, HTML/CSS/JS playground, JSON diff, text diff and Schema.org validator — fast, keyboard-first, monochrome UI.",
    keywords: "json formatter, markdown editor, regex tester, sql formatter, json diff, text diff, code playground, schema validator",
  },
  reference: {
    title: "Developer Reference — HTTP Codes, Git, Linux, VS Code, Cron",
    description: "Quick reference for HTTP status codes, Git commands, Linux/Unix shell, VS Code shortcuts and cron expressions — searchable and copy-ready.",
    keywords: "http status codes, git cheat sheet, linux commands, vscode shortcuts, cron cheat sheet",
  },
  ai: {
    title: "AI Developer Tools — Explainer, Optimizer, SQL, Regex, Tests",
    description: "AI-powered developer helpers: explain code, optimize snippets, generate commit messages, SQL, regex, unit tests and error fixes — powered by Gemini.",
    keywords: "ai code explainer, ai code optimizer, ai commit message, ai sql generator, ai regex generator, ai unit test generator",
  },
};

export const Route = createFileRoute("/c/$category")({
  loader: ({ params }) => {
    if (!CATEGORIES.some((c) => c.id === params.category)) throw notFound();
    return { category: params.category as Category };
  },
  head: ({ params }) => {
    const cat = params.category as Category;
    const meta = CATEGORY_META[cat];
    if (!meta) return { meta: [{ title: "Category — DevHub Toolkit" }] };
    const url = `${BASE}/c/${cat}`;
    const tools = TOOLS.filter((t) => t.category === cat);
    return {
      meta: [
        { title: meta.title },
        { name: "description", content: meta.description },
        { name: "keywords", content: meta.keywords },
        { property: "og:url", content: url },
        { property: "og:title", content: meta.title },
        { property: "og:description", content: meta.description },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: meta.title,
            description: meta.description,
            url,
            isPartOf: { "@id": `${BASE}/#website` },
            hasPart: tools.map((t) => ({
              "@type": "SoftwareApplication",
              name: t.name,
              url: `${BASE}/t/${t.slug}`,
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web",
            })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: BASE + "/" },
              { "@type": "ListItem", position: 2, name: CATEGORIES.find((c) => c.id === cat)?.label, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData() as { category: Category };
  const label = CATEGORIES.find((c) => c.id === category)?.label ?? category;
  const meta = CATEGORY_META[category];
  const tools = TOOLS.filter((t) => t.category === category);

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-10">
      <nav className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span className="text-foreground">{label}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{label}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{meta.description}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            to="/c/$category"
            params={{ category: c.id }}
            className={
              c.id === category
                ? "h-8 px-3 rounded-full border border-foreground bg-foreground text-background text-xs grid place-items-center"
                : "h-8 px-3 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 text-xs grid place-items-center transition"
            }
          >
            {c.label}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tools.map((t) => (
          <Link
            key={t.slug}
            to="/t/$slug"
            params={{ slug: t.slug }}
            data-motion-icon-group
            className="group rounded-xl border border-border bg-card p-4 hover:border-foreground/40 hover:bg-accent/40 transition"
          >
            <div className="flex items-start gap-3">
              <div className="size-9 rounded-lg border border-border bg-background grid place-items-center shrink-0">
                <t.icon className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{t.name}</div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
              </div>
              <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}