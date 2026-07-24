import { marked } from "marked";
import { useEffect, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton, DownloadButton, Field, Panel } from "./primitives";

export function RegexTester() {
  const [pattern, setPattern] = useState("(\\w+)@(\\w+)\\.(\\w+)");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Contact me at hello@devhub.dev or admin@example.com");

  const { matches, error } = useMemo(() => {
    if (!pattern) return { matches: [] as RegExpMatchArray[], error: null as string | null };
    try {
      const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      return { matches: Array.from(text.matchAll(re)), error: null };
    } catch (e) {
      return { matches: [], error: (e as Error).message };
    }
  }, [pattern, flags, text]);

  const highlighted = useMemo(() => {
    if (error || matches.length === 0) return text;
    const parts: (string | { m: string })[] = [];
    let last = 0;
    for (const m of matches) {
      const start = m.index ?? 0;
      parts.push(text.slice(last, start), { m: m[0] });
      last = start + m[0].length;
    }
    parts.push(text.slice(last));
    return parts;
  }, [text, matches, error]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-2">
        <span className="text-muted-foreground font-mono px-1">/</span>
        <Input
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          className="border-0 shadow-none focus-visible:ring-0 font-mono"
        />
        <span className="text-muted-foreground font-mono px-1">/</span>
        <Input
          value={flags}
          onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ""))}
          className="border-0 shadow-none focus-visible:ring-0 font-mono w-20"
          placeholder="flags"
        />
      </div>
      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive font-mono">
          {error}
        </div>
      )}
      <Field label="Test string">
        <Textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="font-mono text-sm"
        />
      </Field>
      <Panel title={`${matches.length} match${matches.length === 1 ? "" : "es"}`}>
        <pre className="p-4 font-mono text-sm whitespace-pre-wrap break-all min-h-[80px]">
          {typeof highlighted === "string"
            ? highlighted
            : highlighted.map((p, i) =>
                typeof p === "string" ? (
                  p
                ) : (
                  <mark key={i} className="bg-foreground/20 text-foreground rounded px-0.5">
                    {p.m}
                  </mark>
                ),
              )}
        </pre>
      </Panel>
      {matches.length > 0 && (
        <Panel title="Groups">
          <div className="divide-y divide-border">
            {matches.map((m, i) => (
              <div key={i} className="px-3 py-2 text-sm">
                <div className="font-mono text-xs text-muted-foreground">
                  match {i + 1} @ {m.index}
                </div>
                <div className="font-mono">{m[0]}</div>
                {m.slice(1).length > 0 && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    groups:{" "}
                    {m.slice(1).map((g, j) => (
                      <span key={j} className="font-mono ml-2">
                        [{j + 1}] {g}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}

export function MarkdownEditor() {
  const [src, setSrc] = useState(
    `# Hello DevHub\n\n**Markdown** with a *live* preview.\n\n- lists\n- \`code\`\n- [links](https://example.com)\n\n\`\`\`js\nconsole.log("hi");\n\`\`\`\n`,
  );
  const [html, setHtml] = useState("");
  useEffect(() => {
    (async () => setHtml(String(await marked.parse(src))))();
  }, [src]);
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Panel title="Markdown" actions={<CopyButton text={src} />}>
        <Textarea
          value={src}
          onChange={(e) => setSrc(e.target.value)}
          className="min-h-[520px] border-0 rounded-none focus-visible:ring-0 resize-none font-mono text-sm"
        />
      </Panel>
      <Panel
        title="Preview"
        actions={<DownloadButton filename="preview.html" content={html} mime="text/html" />}
      >
        <div
          className="p-4 md-preview min-h-[520px] max-h-[640px] overflow-auto text-sm"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Panel>
      <style>{`.md-preview h1{font-size:1.5rem;font-weight:600;margin:.75rem 0}.md-preview h2{font-size:1.2rem;font-weight:600;margin:.75rem 0}.md-preview p{margin:.5rem 0;line-height:1.6}.md-preview ul{list-style:disc;margin:.5rem 0 .5rem 1.25rem}.md-preview code{background:oklch(1 0 0/8%);padding:.1rem .35rem;border-radius:.25rem;font-family:var(--font-mono)}.md-preview pre{background:oklch(1 0 0/6%);padding:.75rem;border-radius:.5rem;overflow:auto;font-family:var(--font-mono);font-size:.85rem;margin:.5rem 0}.md-preview a{text-decoration:underline;text-underline-offset:3px}`}</style>
    </div>
  );
}

export function Playground() {
  const [html, setHtml] = useState(`<h1>Hello</h1>\n<button id="b">Click me</button>`);
  const [css, setCss] = useState(
    `body{font-family:system-ui;background:#0a0a0a;color:#fff;padding:2rem}\nbutton{padding:.5rem 1rem;border-radius:.5rem;background:#fff;color:#000;border:0;cursor:pointer}`,
  );
  const [js, setJs] = useState(
    `document.getElementById('b').onclick = () => alert('Hi from DevHub!');`,
  );
  const doc = `<!doctype html><html><head><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="space-y-3">
        <Panel title="HTML">
          <Textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="min-h-[140px] border-0 rounded-none focus-visible:ring-0 resize-none font-mono text-xs"
          />
        </Panel>
        <Panel title="CSS">
          <Textarea
            value={css}
            onChange={(e) => setCss(e.target.value)}
            className="min-h-[140px] border-0 rounded-none focus-visible:ring-0 resize-none font-mono text-xs"
          />
        </Panel>
        <Panel title="JavaScript">
          <Textarea
            value={js}
            onChange={(e) => setJs(e.target.value)}
            className="min-h-[140px] border-0 rounded-none focus-visible:ring-0 resize-none font-mono text-xs"
          />
        </Panel>
      </div>
      <Panel title="Preview">
        <iframe
          title="playground"
          sandbox="allow-scripts"
          srcDoc={doc}
          className="w-full min-h-[500px] bg-white"
        />
      </Panel>
    </div>
  );
}

export function SvgOptimizer() {
  const [src, setSrc] = useState(
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">\n  <!-- a comment -->\n  <circle cx="50" cy="50" r="40" fill="white"  />\n</svg>`,
  );
  const optimized = useMemo(() => {
    return src
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/>\s+</g, "><")
      .replace(/\s{2,}/g, " ")
      .replace(/\s*=\s*/g, "=")
      .trim();
  }, [src]);
  const savedPct = src.length
    ? Math.max(0, Math.round(((src.length - optimized.length) / src.length) * 100))
    : 0;
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <Panel title="Input SVG">
          <Textarea
            value={src}
            onChange={(e) => setSrc(e.target.value)}
            className="min-h-[280px] border-0 rounded-none focus-visible:ring-0 resize-none font-mono text-xs"
          />
        </Panel>
        <Panel
          title={`Optimized — ${savedPct}% smaller`}
          actions={
            <>
              <CopyButton text={optimized} />
              <DownloadButton filename="optimized.svg" content={optimized} mime="image/svg+xml" />
            </>
          }
        >
          <pre className="p-3 font-mono text-xs whitespace-pre-wrap break-all min-h-[280px]">
            {optimized}
          </pre>
        </Panel>
      </div>
      <p className="text-xs text-muted-foreground">
        Basic minifier: strips comments, extra whitespace, and normalizes attribute spacing. For
        deep SVGO passes, run svgo locally.
      </p>
    </div>
  );
}
