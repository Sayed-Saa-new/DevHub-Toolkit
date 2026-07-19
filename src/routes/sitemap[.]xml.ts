import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { TOOLS, CATEGORIES } from "@/lib/tools";
import { getChangelogEntries } from "@/lib/changelog";

const BASE_URL = "https://devhub.flinkeo.online";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const paths = [
          "/",
          "/tools",
          "/changelog",
          ...CATEGORIES.map((c) => `/c/${c.id}`),
          ...TOOLS.map((t) => `/t/${t.slug}`),
          ...getChangelogEntries().map((e) => `/changelog/${e.slug}`),
        ];
        const urls = paths.map(
          (p) =>
            `  <url>\n    <loc>${BASE_URL}${p}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${p === "/" ? "1.0" : "0.7"}</priority>\n  </url>`,
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});