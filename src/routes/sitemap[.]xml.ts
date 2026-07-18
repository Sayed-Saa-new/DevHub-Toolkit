import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { TOOLS } from "@/lib/tools";

const BASE_URL = "https://huggable-heart-helper-93.lovable.app";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        // /favorites is intentionally excluded (noindex + Disallow in robots.txt).
        // /api/* endpoints are not user-facing pages.
        const paths = ["/", ...TOOLS.map((t) => `/t/${t.slug}`)];
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