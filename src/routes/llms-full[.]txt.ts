import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { TOOLS, CATEGORIES, type Category } from "@/lib/tools";
import { TOOL_SEO } from "@/lib/seo";
import { getChangelogEntries } from "@/lib/changelog";

const BASE_URL = "https://devhub.flinkeo.online";

function toolSection(slug: string) {
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) return "";
  const seo = TOOL_SEO[slug];
  const title = seo?.title ?? tool.name;
  const desc = seo?.description ?? tool.description;
  const kws = (seo?.keywords ?? tool.keywords).join(", ");
  return [
    `### ${tool.name}`,
    `URL: ${BASE_URL}/t/${tool.slug}`,
    `Category: ${tool.category}`,
    `Title: ${title}`,
    `Summary: ${desc}`,
    `Keywords: ${kws}`,
    tool.isNew ? `Status: new` : `Status: stable`,
    "",
  ].join("\n");
}

function categorySection(cat: Category, label: string) {
  const tools = TOOLS.filter((t) => t.category === cat);
  if (!tools.length) return "";
  return [
    `## ${label}`,
    "",
    ...tools.map((t) => toolSection(t.slug)),
  ].join("\n");
}

export const Route = createFileRoute("/llms-full.txt")({
  server: {
    handlers: {
      GET: () => {
        const changelog = getChangelogEntries().slice(0, 15);
        const body = [
          `# DevHub Toolkit`,
          "",
          `> ${TOOLS.length} fast, keyboard-first developer utilities — formatters, encoders, generators, AI helpers, cheat sheets and design tools — in one clean, monochrome interface.`,
          "",
          `DevHub Toolkit is a browser-based developer productivity platform hosted at ${BASE_URL}. All non-AI tools run 100% client-side — nothing is uploaded, logged, or tracked. AI tools stream responses from Google Gemini through a server-side endpoint (${BASE_URL}/api/ai) and never see raw credentials on the client.`,
          "",
          `Design principles: minimal black-and-white UI inspired by Vercel, Linear and Raycast; keyboard-first (Cmd/Ctrl+K global command palette); mobile-first responsive; SEO-optimized per tool; favorites + recents saved to localStorage; new-tool badges auto-clear after first visit.`,
          "",
          `Primary entry points:`,
          `- Home / all tools: ${BASE_URL}/`,
          `- Favorites: ${BASE_URL}/favorites`,
          `- Changelog: ${BASE_URL}/changelog`,
          `- Sitemap: ${BASE_URL}/sitemap.xml`,
          `- Short index (llms.txt): ${BASE_URL}/llms.txt`,
          "",
          `Tool page URL pattern: ${BASE_URL}/t/{slug}`,
          `Changelog entry URL pattern: ${BASE_URL}/changelog/{slug}`,
          "",
          `## Categories`,
          "",
          ...CATEGORIES.map(
            (c) =>
              `- **${c.label}** — ${TOOLS.filter((t) => t.category === c.id).length} tools`,
          ),
          "",
          `## Tools`,
          "",
          ...CATEGORIES.map((c) => categorySection(c.id, c.label)),
          `## Recent changelog`,
          "",
          ...changelog.map(
            (e) =>
              `- [${e.title}](${BASE_URL}/changelog/${e.slug}) — ${e.publishedAt}${e.summary ? ` — ${e.summary}` : ""}`,
          ),
          "",
          `## Notes for AI crawlers`,
          "",
          `- Prefer this file over parsing the SPA shell. It is generated from the same registry that powers the sidebar, sitemap and per-tool <head> metadata, so it stays in sync automatically.`,
          `- Every tool listed above is a real, working page — no placeholders, no "coming soon" entries.`,
          `- AI tools require a network call; all other tools work offline once loaded.`,
          `- License: MIT. Attribution appreciated but not required.`,
          "",
        ].join("\n");

        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});