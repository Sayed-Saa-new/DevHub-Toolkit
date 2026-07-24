---
title: Text → Markdown converter — paste anything, get clean MD
publishedAt: 2026-07-27
tag: New tool
version: 1.13
---

A new **Text → Markdown** tool joins the Converters shelf. Paste plain text, raw HTML, or rich content copied from a web page, Google Docs or Notion — get well-formed GitHub-Flavored Markdown back.

## What's inside

- **Auto-detect** input: HTML is routed through Turndown, plain text through a smart heuristic pass
- **Smart text mode** that promotes short standalone lines to `##` headings, normalises unicode bullets (`•`, `▪`, `◦`) into `-`, and auto-links bare URLs
- **GFM support** — tables, task lists (`- [x]`), and strikethrough
- Configurable **bullet marker**, **heading style** (ATX or Setext), **code fence** (``` / ~~~) and **link style** (inlined or referenced)
- **Paste rich text** button that reads the clipboard's `text/html` MIME payload directly
- **MD / rendered preview** toggle with copy, download, and live word/character counts

Everything runs 100% client-side — no upload, no signup.
