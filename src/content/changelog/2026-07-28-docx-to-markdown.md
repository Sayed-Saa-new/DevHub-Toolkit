---
title: DOCX → Markdown converter — batch convert Word files in your browser
publishedAt: 2026-07-28
tag: New tool
version: 1.14
---

A new **DOCX → Markdown** tool lands on the Converters shelf. Drop one Word file or dozens, get clean GitHub-Flavored Markdown back — all processed locally in your browser via `mammoth.js`, never uploaded anywhere.

![DOCX → Markdown converter interface](/changelog/docx-to-markdown.png)

## What's inside

- **Batch drag-and-drop** — up to 50 MB per file, 150 MB per batch
- **Word style mapping** — Title, Subtitle, Quote and Code paragraphs map to the right Markdown constructs
- **GFM tables & strikethrough** with a custom Turndown renderer that survives merged cells and pipes in text
- **Image handling**: inline as base64, output as `#image-N` placeholders, or skip entirely
- Configurable **bullet marker** (`-` / `*` / `+`) and **heading style** (ATX or Setext)
- **MD / rendered preview** toggle, per-file copy, single `.md` download, or a **one-click ZIP** of the whole batch
- Word count, image count, and elapsed time reported per file — plus any conversion notices from Word's XML

Everything runs 100% client-side. Your documents never leave the tab.