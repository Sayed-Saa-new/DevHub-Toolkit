import { createFileRoute, notFound } from "@tanstack/react-router";

import { ToolShell } from "@/components/tool-shell";
import { TOOLS_BY_SLUG } from "@/lib/tools";
import { TOOL_SEO } from "@/lib/seo";
import { TOOL_COMPONENTS } from "@/tools/registry";

export const Route = createFileRoute("/t/$slug")({
  head: ({ params }) => {
    const t = TOOLS_BY_SLUG[params.slug];
    const base = "https://huggable-heart-helper-93.lovable.app";
    const path = `/t/${params.slug}`;
    const url = `${base}${path}`;
    if (!t) {
      return {
        meta: [
          { title: "Tool not found — DevHub Toolkit" },
          { name: "description", content: "The developer tool you're looking for doesn't exist on DevHub Toolkit. Browse the full catalog of formatters, encoders, generators, and references." },
          { property: "og:title", content: "Tool not found — DevHub Toolkit" },
          { property: "og:description", content: "The developer tool you're looking for doesn't exist on DevHub Toolkit. Browse the full catalog of formatters, encoders, generators, and references." },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const seo = TOOL_SEO[params.slug];
    const title = seo ? `${seo.title} · DevHub Toolkit` : `${t.name} — Free Online ${t.category} Tool · DevHub Toolkit`;
    const desc = seo
      ? seo.description
      : `${t.description} Free, fast, browser-based ${t.category} tool — no signup, no tracking, works in your browser.`;
    const keywords = (seo?.keywords ?? t.keywords).concat([t.name.toLowerCase(), `${t.name.toLowerCase()} online`, `free ${t.name.toLowerCase()}`]);
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "keywords", content: Array.from(new Set(keywords)).join(", ") },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: t.name,
            description: desc,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        },
      ],
    };
  },
  loader: ({ params }) => {
    const tool = TOOLS_BY_SLUG[params.slug];
    if (!tool) throw notFound();
    return { tool };
  },
  notFoundComponent: ToolNotFound,
  component: ToolRoute,
});

function ToolRoute() {
  const { tool } = Route.useLoaderData();
  const Component = TOOL_COMPONENTS[tool.slug] ?? ComingSoon;
  return (
    <ToolShell tool={tool}>
      <Component />
    </ToolShell>
  );
}

function ComingSoon() {
  return (
    <div className="rounded-xl border border-dashed border-border p-12 text-center">
      <div className="font-medium">Coming soon</div>
      <p className="text-sm text-muted-foreground mt-1">
        This tool requires an AI backend. Ask to enable Lovable Cloud to activate it.
      </p>
    </div>
  );
}

function ToolNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Tool not found</h1>
      <p className="text-sm text-muted-foreground mt-2">The tool you're looking for doesn't exist.</p>
    </div>
  );
}