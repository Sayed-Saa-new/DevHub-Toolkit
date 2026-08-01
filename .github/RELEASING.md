# Releasing DevHub Toolkit

Releases are fully automated by [`.github/workflows/release.yml`](./workflows/release.yml).

## Cut a release

```bash
git tag v1.4.0 -m "DevHub Toolkit v1.4.0"
git push origin v1.4.0
```

That triggers the workflow, which:

1. Installs deps with Bun and runs `lint` + `build`
2. Generates release notes from `src/content/changelog/*.md`
3. Zips the `dist/` output as `devhub-toolkit-<version>.zip`
4. Publishes a GitHub Release with the notes, commit list, and the zip attached

Tags containing a hyphen (e.g. `v1.4.0-beta.1`) are published as pre-releases.

## Controlling the notes

Add `version: v1.4.0` to a changelog file's frontmatter to pin it to a release:

```md
---
title: New tool — Markdown Editor
publishedAt: 2026-08-01
summary: Pro-level markdown editing with toolbar, split preview, and exports.
tag: New tool
version: v1.4.0
---
```

Without a `version` field, every changelog entry published after the previous tag is
included (falling back to the newest entry).

You can also run the workflow manually from the Actions tab with **Run workflow → tag**.

## Preview notes locally

```bash
bun scripts/release-notes.mjs v1.4.0
```