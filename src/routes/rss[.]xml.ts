import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { getChangelogEntries } from "@/lib/changelog";

const BASE_URL = "https://devhub.flinkeo.online";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: () => {
        const entries = getChangelogEntries();
        const items = entries
          .map(
            (e) =>
              `  <item>\n    <title>${esc(e.title)}</title>\n    <link>${BASE_URL}/changelog/${e.slug}</link>\n    <guid isPermaLink="true">${BASE_URL}/changelog/${e.slug}</guid>\n    <pubDate>${new Date(e.publishedAt).toUTCString()}</pubDate>\n    ${e.tag ? `<category>${esc(e.tag)}</category>` : ""}\n    <description><![CDATA[${e.html}]]></description>\n  </item>`,
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>DevHub Toolkit — Changelog</title>
  <link>${BASE_URL}/changelog</link>
  <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
  <description>New tools, features, fixes, and small delights shipping to DevHub Toolkit.</description>
  <language>en</language>
  <lastBuildDate>${new Date(entries[0]?.publishedAt ?? Date.now()).toUTCString()}</lastBuildDate>
${items}
</channel>
</rss>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});