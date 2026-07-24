import { useEffect, useMemo, useRef, useState } from "react";
import TurndownService from "turndown";
import { marked } from "marked";
import { ClipboardPaste, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

import { CopyButton, DownloadButton, Field, Panel } from "./primitives";

type BulletMarker = "-" | "*" | "+";
type HeadingStyle = "atx" | "setext";
type CodeFence = "```" | "~~~";
type LinkStyle = "inlined" | "referenced";
type Mode = "auto" | "html" | "text";

const SAMPLE = `Welcome to DevHub

This is a paragraph with **already bold** and _italic_ text, plus a link https://devhub.flinkeo.online you can visit.

Features
- Fast client-side conversion
- Works with pasted rich text
- Supports GitHub Flavored Markdown

Steps
1. Paste text or HTML
2. Tweak the options
3. Copy the markdown

    const hello = "code block via 4-space indent";
    console.log(hello);
`;

function looksLikeHtml(s: string) {
  return /<\/?[a-z][\s\S]*?>/i.test(s.trim());
}

/** Heuristic plain-text → Markdown pass. Keeps existing markdown intact. */
function plainTextToMarkdown(input: string): string {
  const lines = input.replace(/\r\n?/g, "\n").split("\n");
  const out: string[] = [];

  // Detect a Setext-ish heading: a short line followed by ==== or ----
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const next = lines[i + 1] ?? "";
    if (/^\s*$/.test(line)) {
      out.push("");
      continue;
    }

    // ==== / ---- underlines → ATX headings
    if (/^\s*={3,}\s*$/.test(next) && line.trim()) {
      out.push(`# ${line.trim()}`);
      i++;
      continue;
    }
    if (/^\s*-{3,}\s*$/.test(next) && line.trim()) {
      out.push(`## ${line.trim()}`);
      i++;
      continue;
    }

    // Short standalone line before a blank line and a paragraph → heading candidate
    const prev = out[out.length - 1] ?? "";
    const looksTitle =
      line.length <= 80 &&
      /^[A-Z0-9]/.test(line.trim()) &&
      !/[.!?:;,]$/.test(line.trim()) &&
      /^\s*$/.test(next) &&
      (prev === "" || /^\s*$/.test(prev)) &&
      line.trim().split(/\s+/).length <= 10;
    if (looksTitle && !/^[-*+]\s/.test(line) && !/^\d+\.\s/.test(line)) {
      out.push(`## ${line.trim()}`);
      continue;
    }

    // Bullet-ish markers → -
    const bullet = line.match(/^(\s*)[•●▪◦·]\s+(.*)$/);
    if (bullet) {
      out.push(`${bullet[1]}- ${bullet[2]}`);
      continue;
    }

    // Indented 4+ spaces → keep as code (already valid MD indented code)
    out.push(line);
  }

  let md = out.join("\n");

  // Auto-link bare URLs (avoid ones already inside () or <>)
  md = md.replace(/(^|[\s(])((https?:\/\/|www\.)[^\s<>"'`)]+)/g, (_m, pre: string, url: string) => {
    const clean = url.replace(/[.,;:!?)]+$/, "");
    const trailing = url.slice(clean.length);
    const href = clean.startsWith("http") ? clean : `https://${clean}`;
    return `${pre}<${href}>${trailing}`;
  });

  // Collapse 3+ blank lines
  md = md.replace(/\n{3,}/g, "\n\n");
  return md.trim() + "\n";
}

function createTurndown(opts: {
  bullet: BulletMarker;
  heading: HeadingStyle;
  fence: CodeFence;
  link: LinkStyle;
  gfm: boolean;
}) {
  const svc = new TurndownService({
    headingStyle: opts.heading,
    bulletListMarker: opts.bullet,
    codeBlockStyle: "fenced",
    fence: opts.fence,
    linkStyle: opts.link,
    emDelimiter: "_",
    strongDelimiter: "**",
  });

  svc.remove(["script", "style", "noscript"]);

  if (opts.gfm) {
    // Minimal GFM: tables + strikethrough + task lists.
    svc.addRule("strikethrough", {
      filter: ["del", "s", "strike" as unknown as keyof HTMLElementTagNameMap],
      replacement: (content) => `~~${content}~~`,
    });
    svc.addRule("taskListItem", {
      filter: (node) => node.nodeName === "LI" && !!node.querySelector('input[type="checkbox"]'),
      replacement: (_content, node) => {
        const el = node as HTMLElement;
        const cb = el.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
        const checked = cb?.checked ? "x" : " ";
        const text = el.textContent?.trim() ?? "";
        return `- [${checked}] ${text}\n`;
      },
    });
    svc.addRule("table", {
      filter: "table",
      replacement: (_content, node) => {
        const table = node as HTMLTableElement;
        const rows = Array.from(table.rows);
        if (rows.length === 0) return "";
        const cells = rows.map((r) =>
          Array.from(r.cells).map((c) => (c.textContent ?? "").trim().replace(/\|/g, "\\|")),
        );
        const width = Math.max(...cells.map((r) => r.length));
        cells.forEach((r) => {
          while (r.length < width) r.push("");
        });
        const head = cells[0];
        const body = cells.slice(1);
        const sep = new Array(width).fill("---");
        const lines = [
          `| ${head.join(" | ")} |`,
          `| ${sep.join(" | ")} |`,
          ...body.map((r) => `| ${r.join(" | ")} |`),
        ];
        return `\n\n${lines.join("\n")}\n\n`;
      },
    });
  }

  return svc;
}

export function TextToMarkdown() {
  const [input, setInput] = useState(SAMPLE);
  const [mode, setMode] = useState<Mode>("auto");
  const [bullet, setBullet] = useState<BulletMarker>("-");
  const [heading, setHeading] = useState<HeadingStyle>("atx");
  const [fence, setFence] = useState<CodeFence>("```");
  const [link, setLink] = useState<LinkStyle>("inlined");
  const [gfm, setGfm] = useState(true);
  const [smartText, setSmartText] = useState(true);
  const [preview, setPreview] = useState<"markdown" | "rendered">("markdown");
  const [previewHtml, setPreviewHtml] = useState("");
  const dropRef = useRef<HTMLTextAreaElement>(null);

  const detected: "html" | "text" = useMemo(
    () => (mode === "auto" ? (looksLikeHtml(input) ? "html" : "text") : mode),
    [input, mode],
  );

  const markdown = useMemo(() => {
    if (!input.trim()) return "";
    try {
      if (detected === "html") {
        const svc = createTurndown({ bullet, heading, fence, link, gfm });
        return svc.turndown(input).trim() + "\n";
      }
      return smartText ? plainTextToMarkdown(input) : input;
    } catch (e) {
      return `<!-- Conversion error: ${(e as Error).message} -->`;
    }
  }, [input, detected, bullet, heading, fence, link, gfm, smartText]);

  useEffect(() => {
    (async () => setPreviewHtml(String(await marked.parse(markdown))))();
  }, [markdown]);

  const stats = useMemo(() => {
    const chars = markdown.length;
    const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
    const lines = markdown ? markdown.split("\n").length : 0;
    return { chars, words, lines };
  }, [markdown]);

  async function pasteRich() {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        if (item.types.includes("text/html")) {
          const blob = await item.getType("text/html");
          const html = await blob.text();
          setInput(html);
          setMode("html");
          toast.success("Pasted rich HTML from clipboard");
          return;
        }
      }
      const txt = await navigator.clipboard.readText();
      setInput(txt);
      toast.success("Pasted from clipboard");
    } catch {
      toast.error("Clipboard access denied");
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-3 flex flex-wrap items-end gap-3">
        <Field label="Input mode">
          <Select value={mode} onValueChange={(v) => setMode(v as Mode)}>
            <SelectTrigger className="h-9 w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto detect</SelectItem>
              <SelectItem value="html">HTML / Rich text</SelectItem>
              <SelectItem value="text">Plain text</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Bullet">
          <Select value={bullet} onValueChange={(v) => setBullet(v as BulletMarker)}>
            <SelectTrigger className="h-9 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-">- dash</SelectItem>
              <SelectItem value="*">* star</SelectItem>
              <SelectItem value="+">+ plus</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Heading style">
          <Select value={heading} onValueChange={(v) => setHeading(v as HeadingStyle)}>
            <SelectTrigger className="h-9 w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="atx"># ATX</SelectItem>
              <SelectItem value="setext">Setext ===</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Code fence">
          <Select value={fence} onValueChange={(v) => setFence(v as CodeFence)}>
            <SelectTrigger className="h-9 w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="```">```</SelectItem>
              <SelectItem value="~~~">~~~</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Links">
          <Select value={link} onValueChange={(v) => setLink(v as LinkStyle)}>
            <SelectTrigger className="h-9 w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inlined">Inlined [x](url)</SelectItem>
              <SelectItem value="referenced">Referenced [x][1]</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Switch checked={gfm} onCheckedChange={setGfm} /> GFM tables & tasks
        </label>
        <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Switch checked={smartText} onCheckedChange={setSmartText} /> Smart text
        </label>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-[10px] uppercase">
            detected: {detected}
          </Badge>
          <Button variant="outline" size="sm" onClick={pasteRich} className="h-8 gap-1.5">
            <ClipboardPaste className="size-3.5" /> Paste
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput(SAMPLE)}
            className="h-8 gap-1.5"
          >
            <Wand2 className="size-3.5" /> Sample
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Panel
          title="Source — paste HTML or plain text"
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInput("")}
              disabled={!input}
              className="h-7 text-xs"
            >
              Clear
            </Button>
          }
        >
          <Textarea
            ref={dropRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[440px] border-0 rounded-none focus-visible:ring-0 resize-none font-mono text-sm"
            placeholder="Paste HTML from a web page, a Google Doc, Notion, or just plain text…"
          />
        </Panel>

        <Panel
          title={preview === "markdown" ? "Markdown output" : "Rendered preview"}
          actions={
            <>
              <div className="mr-1 flex items-center rounded-md border border-border overflow-hidden">
                <button
                  onClick={() => setPreview("markdown")}
                  className={`px-2 py-1 text-[11px] font-medium uppercase tracking-wider transition ${
                    preview === "markdown"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  MD
                </button>
                <button
                  onClick={() => setPreview("rendered")}
                  className={`px-2 py-1 text-[11px] font-medium uppercase tracking-wider transition ${
                    preview === "rendered"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Preview
                </button>
              </div>
              <CopyButton text={markdown} />
              <DownloadButton filename="converted.md" content={markdown} mime="text/markdown" />
            </>
          }
        >
          {preview === "markdown" ? (
            <pre className="p-4 font-mono text-sm whitespace-pre-wrap break-words min-h-[440px] max-h-[540px] overflow-auto">
              {markdown || (
                <span className="text-muted-foreground">Markdown will appear here…</span>
              )}
            </pre>
          ) : (
            <div
              className="p-4 md-preview min-h-[440px] max-h-[540px] overflow-auto text-sm"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          )}
        </Panel>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-mono">
        <span>{stats.chars.toLocaleString()} chars</span>
        <span>{stats.words.toLocaleString()} words</span>
        <span>{stats.lines.toLocaleString()} lines</span>
        <span className="ml-auto">100% client-side — nothing is uploaded.</span>
      </div>

      <style>{`.md-preview h1{font-size:1.5rem;font-weight:600;margin:.75rem 0}.md-preview h2{font-size:1.2rem;font-weight:600;margin:.75rem 0}.md-preview h3{font-size:1.05rem;font-weight:600;margin:.6rem 0}.md-preview p{margin:.5rem 0;line-height:1.6}.md-preview ul{list-style:disc;margin:.5rem 0 .5rem 1.25rem}.md-preview ol{list-style:decimal;margin:.5rem 0 .5rem 1.25rem}.md-preview code{background:oklch(1 0 0/8%);padding:.1rem .35rem;border-radius:.25rem;font-family:var(--font-mono)}.md-preview pre{background:oklch(1 0 0/6%);padding:.75rem;border-radius:.5rem;overflow:auto;font-family:var(--font-mono);font-size:.85rem;margin:.5rem 0}.md-preview a{text-decoration:underline;text-underline-offset:3px}.md-preview table{border-collapse:collapse;margin:.5rem 0}.md-preview th,.md-preview td{border:1px solid oklch(1 0 0/12%);padding:.35rem .6rem}.md-preview blockquote{border-left:3px solid oklch(1 0 0/20%);padding-left:.75rem;color:oklch(1 0 0/70%);margin:.5rem 0}`}</style>
    </div>
  );
}
