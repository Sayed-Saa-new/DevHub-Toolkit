import { marked } from "marked";

export interface ChangelogEntry {
  slug: string;
  title: string;
  publishedAt: string; // ISO date
  summary?: string;
  tag?: string;
  html: string;
}

// Eager raw import — bundled at build time by Vite.
const files = import.meta.glob("/src/content/changelog/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function parseFrontmatter(source: string): { data: Record<string, string>; body: string } {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: source };
  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[kv[1]] = value;
  }
  return { data, body: match[2] };
}

function slugFromPath(path: string): string {
  const name = path.split("/").pop()!.replace(/\.md$/, "");
  // Strip leading YYYY-MM-DD- if present
  return name.replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

let cache: ChangelogEntry[] | null = null;

export function getChangelogEntries(): ChangelogEntry[] {
  if (cache) return cache;
  const entries: ChangelogEntry[] = [];
  for (const [path, source] of Object.entries(files)) {
    const { data, body } = parseFrontmatter(source);
    const published = data.publishedAt ?? data.date;
    if (!data.title || !published) continue;
    entries.push({
      slug: slugFromPath(path),
      title: data.title,
      publishedAt: new Date(published).toISOString(),
      summary: data.summary,
      tag: data.tag,
      html: marked.parse(body, { async: false }) as string,
    });
  }
  entries.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  cache = entries;
  return entries;
}

export function getChangelogEntry(slug: string): ChangelogEntry | undefined {
  return getChangelogEntries().find((e) => e.slug === slug);
}
