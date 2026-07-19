---
title: "Image Compressor — smarter re-compress, format preservation & batch fixes"
date: 2026-07-25
version: v1.11
tag: Improvement
---

Polished the **Image Compressor** based on real-world usage — settings now behave the way you'd expect and batch downloads are much more reliable.

- **Re-compress all** button reapplies quality, dimension and format changes to already-added files
- **Auto** format now preserves the source type — WebP stays WebP, PNG stays PNG, everything else becomes JPEG
- **Download All** staggers downloads so browsers stop blocking them
- **Bigger output warning** — if a compressed file grows past its target, you'll see a `+X%` hint in amber
- **PNG lossless notice** — a small heads-up that the quality slider doesn't apply to PNG
- **Clear all** button plus tighter validation on max dimension and target size
- Re-selecting the same file now works, and files can be re-compressed infinitely without stacking quality loss