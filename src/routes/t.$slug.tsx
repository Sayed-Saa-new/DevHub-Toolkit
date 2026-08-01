import { createFileRoute, notFound } from "@tanstack/react-router";

import { ToolShell } from "@/components/tool-shell";
import { TOOLS_BY_SLUG } from "@/lib/tools";
import { TOOL_SEO } from "@/lib/seo";
import { TOOL_COMPONENTS } from "@/tools/registry";
import { TOOL_CONTENT } from "@/lib/tool-content";
import { ToolContent } from "@/components/tool-content";

// Single shared OG image for all tool pages — hosted locally to prevent broken previews
const ogImage = "https://devhub.flinkeo.online/og-image.png";

export const Route = createFileRoute("/t/$slug")({
  head: ({ params }) => {
    const t = TOOLS_BY_SLUG[params.slug];
    const base = "https://devhub.flinkeo.online";
    const path = `/t/${params.slug}`;
    const url = `${base}${path}`;
    if (!t) {
      return {
        meta: [
          { title: "Tool not found — DevHub Toolkit" },
          {
            name: "description",
            content:
              "The developer tool you're looking for doesn't exist on DevHub Toolkit. Browse the full catalog of formatters, encoders, generators, and references.",
          },
          { property: "og:title", content: "Tool not found — DevHub Toolkit" },
          {
            property: "og:description",
            content:
              "The developer tool you're looking for doesn't exist on DevHub Toolkit. Browse the full catalog of formatters, encoders, generators, and references.",
          },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const seo = TOOL_SEO[params.slug];
    const title = seo
      ? `${seo.title} · DevHub Toolkit`
      : `${t.name} — Free Online ${t.category} Tool · DevHub Toolkit`;
    const desc = seo
      ? seo.description
      : `${t.description} Free, fast, browser-based ${t.category} tool — no signup, no tracking, works in your browser.`;
    const keywords = (seo?.keywords ?? t.keywords).concat([
      t.name.toLowerCase(),
      `${t.name.toLowerCase()} online`,
      `free ${t.name.toLowerCase()}`,
    ]);
    const categoryLabel = t.category.charAt(0).toUpperCase() + t.category.slice(1);
    const softwareApp = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": `${url}#software`,
      name: t.name,
      alternateName: `${t.name} Online`,
      description: desc,
      url,
      applicationCategory: "DeveloperApplication",
      applicationSubCategory: categoryLabel,
      operatingSystem: "Any (Web Browser)",
      browserRequirements: "Requires JavaScript. Requires HTML5.",
      inLanguage: "en",
      isAccessibleForFree: true,
      keywords: Array.from(new Set(keywords)).join(", "),
      featureList: t.keywords,
      image: ogImage,
      softwareVersion: "1.0",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url,
      },
      author: { "@id": `${base}/#org` },
      publisher: {
        "@type": "Organization",
        "@id": `${base}/#org`,
        name: "DevHub Toolkit",
        url: base,
        logo: { "@type": "ImageObject", url: `${base}/icon-512.png` },
      },
    };
    const breadcrumbs = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: categoryLabel,
          // Fixed: was /?category=X, corrected to /c/X
          item: `${base}/c/${t.category}`,
        },
        { "@type": "ListItem", position: 3, name: t.name, item: url },
      ],
    };
    const webPage = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": url,
      url,
      name: title,
      description: desc,
      inLanguage: "en",
      isPartOf: { "@id": `${base}/#website` },
      primaryImageOfPage: { "@type": "ImageObject", url: ogImage },
      about: { "@id": `${url}#software` },
      breadcrumb: { "@id": `${url}#breadcrumbs` },
      datePublished: "2026-07-01T00:00:00.000Z",
      // Static date — avoids misleading Google with a per-request timestamp
      dateModified: "2026-07-25T00:00:00.000Z",
    };
    const content = TOOL_CONTENT[params.slug];
    const extraScripts = content
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "@id": `${url}#faq`,
              mainEntity: content.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          },
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              "@id": `${url}#howto`,
              name: content.howTo.name,
              step: content.howTo.steps.map((s, i) => ({
                "@type": "HowToStep",
                position: i + 1,
                name: s.name,
                text: s.text,
              })),
            }),
          },
        ]
      : [];
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "keywords", content: Array.from(new Set(keywords)).join(", ") },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "DevHub Toolkit" },
        { property: "og:image", content: ogImage },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: `${t.name} — DevHub Toolkit` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: ogImage },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(softwareApp) },
        {
          type: "application/ld+json",
          children: JSON.stringify({ ...breadcrumbs, "@id": `${url}#breadcrumbs` }),
        },
        { type: "application/ld+json", children: JSON.stringify(webPage) },
        ...extraScripts,
      ],
    };
  },
  loader: ({ params }) => {
    const tool = TOOLS_BY_SLUG[params.slug];
    if (!tool) throw notFound();
    return { slug: params.slug };
  },
  notFoundComponent: ToolNotFound,
  component: ToolRoute,
});

function ToolRoute() {
  const { slug } = Route.useLoaderData();
  const tool = TOOLS_BY_SLUG[slug]!;
  const Component = TOOL_COMPONENTS[tool.slug] ?? ComingSoon;
  return (
    <ToolShell tool={tool}>
      <Component />
      <ToolContent slug={slug} />
    </ToolShell>
  );
}

function ComingSoon() {
  return (
    <div className="rounded-xl border border-dashed border-border p-12 text-center">
      <div className="font-medium">Coming soon</div>
      <p className="text-sm text-muted-foreground mt-1">
        This tool is under construction — check back soon!
      </p>
    </div>
  );
}

function ToolNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Tool not found</h1>
      <p className="text-sm text-muted-foreground mt-2">
        The tool you're looking for doesn't exist.
      </p>
    </div>
  );
}
