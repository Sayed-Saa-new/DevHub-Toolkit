#!/usr/bin/env node
/**
 * Build GitHub Release notes from src/content/changelog/*.md
 *
 * Usage: bun scripts/release-notes.mjs v1.4.0
 *
 * Strategy:
 *  1. If a changelog file has `version: <tag>` in its frontmatter, use that entry.
 *  2. Otherwise use every changelog entry published after the previous git tag date,
 *     falling back to the most recent entry.
 */
import { readdirSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";

const DIR = join(process.cwd(), "src/content/changelog");
const tag = process.argv[2] ?? "";
const site = "https://devhub.flinkeo.online";

function parse(file) {
  const raw = readFileSync(join(DIR, file), "utf8");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const data = {};
  let body = raw;
  if (m) {
    body = m[2];
    for (const line of m[1].split(/\r?\n/)) {
      const kv = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
      if (!kv) continue;
      data[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
    }
  }
  const slug = file.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
  return { file, slug, data, body: body.trim() };
}

function previousTagDate() {
  try {
    const prev = execSync(`git describe --tags --abbrev=0 ${tag}^ 2>/dev/null`, {
      encoding: "utf8",
    }).trim();
    if (!prev) return null;
    return new Date(
      execSync(`git log -1 --format=%cI ${prev}`, { encoding: "utf8" }).trim(),
    );
  } catch {
    return null;
  }
}

let entries = [];
try {
  entries = readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parse)
    .sort(
      (a, b) =>
        new Date(b.data.publishedAt ?? b.data.date ?? 0) -
        new Date(a.data.publishedAt ?? a.data.date ?? 0),
    );
} catch {
  entries = [];
}

let selected = entries.filter((e) => e.data.version && e.data.version === tag);

if (selected.length === 0) {
  const since = previousTagDate();
  selected = since
    ? entries.filter((e) => new Date(e.data.publishedAt ?? e.data.date ?? 0) > since)
    : [];
  if (selected.length === 0 && entries.length > 0) selected = [entries[0]];
}

const out = [];

for (const e of selected) {
  out.push(`## ${e.data.title ?? e.slug}`);
  if (e.data.tag) out.push(`\`${e.data.tag}\``);
  out.push("");
  out.push(e.body);
  out.push("");
  out.push(`[Read on the changelog →](${site}/changelog#${e.slug})`);
  out.push("");
  out.push("---");
  out.push("");
}

if (out.length === 0) {
  out.push(`Release \`${tag}\` of DevHub Toolkit.`, "");
}

out.push(
  `**Live site:** ${site} · **Changelog:** ${site}/changelog · **RSS:** ${site}/rss.xml`,
);

process.stdout.write(out.join("\n") + "\n");