---
title: New tool — CSS Clamp Calculator
publishedAt: 2026-07-22
tag: New tool
summary: Generate fluid CSS clamp() values for typography and spacing with px/rem output and a live viewport preview.
---

Meet **`/t/clamp-calculator`** — stop hand-tuning media queries for `font-size`.

## Controls

- **Min / Max size** — the boundaries in pixels
- **Min / Max viewport** — the range across which the size interpolates
- **Output unit** — `rem` (accessibility-friendly, respects user zoom) or `px`
- **Root font-size** — configurable base for `rem` output

## Live preview

Six common breakpoints (360, 480, 768, 1024, 1280, 1536) render the interpolated size in real time so you see exactly how the value scales before shipping it.