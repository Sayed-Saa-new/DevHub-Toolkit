import { marked } from "marked";
import {
  Bold,
  Code,
  Columns2,
  Eye,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  ListTodo,
  Minus,
  Pencil,
  Quote,
  Redo2,
  Strikethrough,
  Table as TableIcon,
  Undo2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CopyButton, DownloadButton, Panel } from "./primitives";

const STORAGE_KEY = "devhub:markdown-editor:draft";

const SAMPLE = `# Hello DevHub

**Markdown** with a *live* preview, a full toolbar and autosave.

## Features

- [x] GFM tables, task lists, ~~strikethrough~~
- [ ] Synced scrolling
- \`inline code\` and fenced blocks

| Tool | Speed | Price |
| ---- | ----- | ----- |
| DevHub | Instant | Free |

> Everything runs client-side.

\`\`\`js
console.log("hi");
\`\`\`
`;

type Mode = "split" | "write" | "preview";

interface Wrap {
  before: string;
  after?: string;
  block?: boolean;
  placeholder?: string;
}

const ACTIONS: { id: string; label: string; icon: typeof Bold; key?: string; wrap: Wrap }[] = [
  {
    id: "bold",
    label: "Bold",
    icon: Bold,
    key: "b",
    wrap: { before: "**", after: "**", placeholder: "bold text" },
  },
  {
    id: "italic",
    label: "Italic",
    icon: Italic,
    key: "i",
    wrap: { before: "*", after: "*", placeholder: "italic text" },
  },
  {
    id: "strike",
    label: "Strikethrough",
    icon: Strikethrough,
    wrap: { before: "~~", after: "~~", placeholder: "struck" },
  },
  {
    id: "code",
    label: "Inline code",
    icon: Code,
    key: "e",
    wrap: { before: "`", after: "`", placeholder: "code" },
  },
  {
    id: "h1",
    label: "Heading 1",
    icon: Heading1,
    wrap: { before: "# ", block: true, placeholder: "Heading" },
  },
  {
    id: "h2",
    label: "Heading 2",
    icon: Heading2,
    wrap: { before: "## ", block: true, placeholder: "Heading" },
  },
  {
    id: "h3",
    label: "Heading 3",
    icon: Heading3,
    wrap: { before: "### ", block: true, placeholder: "Heading" },
  },
  {
    id: "quote",
    label: "Quote",
    icon: Quote,
    wrap: { before: "> ", block: true, placeholder: "Quote" },
  },
  {
    id: "ul",
    label: "Bullet list",
    icon: List,
    wrap: { before: "- ", block: true, placeholder: "Item" },
  },
  {
    id: "ol",
    label: "Numbered list",
    icon: ListOrdered,
    wrap: { before: "1. ", block: true, placeholder: "Item" },
  },
  {
    id: "task",
    label: "Task list",
    icon: ListTodo,
    wrap: { before: "- [ ] ", block: true, placeholder: "Task" },
  },
  {
    id: "link",
    label: "Link",
    icon: Link2,
    key: "k",
    wrap: { before: "[", after: "](https://)", placeholder: "label" },
  },
  {
    id: "image",
    label: "Image",
    icon: ImageIcon,
    wrap: { before: "![", after: "](https://)", placeholder: "alt" },
  },
  {
    id: "table",
    label: "Table",
    icon: TableIcon,
    wrap: {
      before: "\n| Column | Column |\n| ------ | ------ |\n| Cell   | Cell   |\n",
      block: true,
    },
  },
  { id: "hr", label: "Divider", icon: Minus, wrap: { before: "\n---\n", block: true } },
];

function stats(src: string) {
  const words = src.trim() ? src.trim().split(/\s+/).length : 0;
  return {
    words,
    chars: src.length,
    lines: src ? src.split("\n").length : 0,
    read: Math.max(1, Math.round(words / 200)),
  };
}

export function MarkdownEditor() {
  const [src, setSrc] = useState(SAMPLE);
  const [html, setHtml] = useState("");
  const [mode, setMode] = useState<Mode>("split");
  const [saved, setSaved] = useState<string | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const syncing = useRef<"editor" | "preview" | null>(null);
  const history = useRef<{ stack: string[]; index: number }>({ stack: [SAMPLE], index: 0 });

  // Restore draft on mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSrc(raw);
        history.current = { stack: [raw], index: 0 };
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Autosave (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, src);
        setSaved(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      } catch {
        /* ignore */
      }
    }, 600);
    return () => clearTimeout(t);
  }, [src]);

  // Render
  useEffect(() => {
    setHtml(String(marked.parse(src, { async: false, gfm: true, breaks: false })));
  }, [src]);

  const pushHistory = useCallback((value: string) => {
    const h = history.current;
    h.stack = h.stack.slice(0, h.index + 1);
    h.stack.push(value);
    if (h.stack.length > 100) h.stack.shift();
    h.index = h.stack.length - 1;
  }, []);

  const update = useCallback(
    (value: string) => {
      setSrc(value);
      pushHistory(value);
    },
    [pushHistory],
  );

  const undo = useCallback(() => {
    const h = history.current;
    if (h.index > 0) {
      h.index -= 1;
      setSrc(h.stack[h.index]);
    }
  }, []);

  const redo = useCallback(() => {
    const h = history.current;
    if (h.index < h.stack.length - 1) {
      h.index += 1;
      setSrc(h.stack[h.index]);
    }
  }, []);

  const applyWrap = useCallback(
    (wrap: Wrap) => {
      const ta = taRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const value = ta.value;
      const selected = value.slice(start, end) || wrap.placeholder || "";

      let next: string;
      let caret: number;
      if (wrap.block) {
        const lineStart = value.lastIndexOf("\n", start - 1) + 1;
        if (wrap.after === undefined && !selected.includes("\n") && wrap.before.startsWith("\n")) {
          next = value.slice(0, end) + wrap.before + value.slice(end);
          caret = end + wrap.before.length;
        } else {
          const body = value.slice(lineStart, end) || wrap.placeholder || "";
          const prefixed = body
            .split("\n")
            .map((l) => wrap.before + l)
            .join("\n");
          next = value.slice(0, lineStart) + prefixed + value.slice(end);
          caret = lineStart + prefixed.length;
        }
      } else {
        const after = wrap.after ?? "";
        next = value.slice(0, start) + wrap.before + selected + after + value.slice(end);
        caret = start + wrap.before.length + selected.length;
      }
      update(next);
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(caret, caret);
      });
    },
    [update],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const meta = e.metaKey || e.ctrlKey;
      if (!meta) return;
      const k = e.key.toLowerCase();
      if (k === "z") {
        e.preventDefault();
        e.shiftKey ? redo() : undo();
        return;
      }
      const action = ACTIONS.find((a) => a.key === k);
      if (action) {
        e.preventDefault();
        applyWrap(action.wrap);
      }
    },
    [applyWrap, undo, redo],
  );

  // Synced scrolling
  const syncFrom = useCallback((source: "editor" | "preview") => {
    if (syncing.current && syncing.current !== source) return;
    const ta = taRef.current;
    const pv = previewRef.current;
    if (!ta || !pv) return;
    const from = source === "editor" ? ta : pv;
    const to = source === "editor" ? pv : ta;
    const range = from.scrollHeight - from.clientHeight;
    if (range <= 0) return;
    syncing.current = source;
    to.scrollTop = (from.scrollTop / range) * (to.scrollHeight - to.clientHeight);
    requestAnimationFrame(() => {
      syncing.current = null;
    });
  }, []);

  const s = useMemo(() => stats(src), [src]);
  const showEditor = mode !== "preview";
  const showPreview = mode !== "write";

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-border bg-card p-1.5">
        {ACTIONS.map((a) => (
          <Button
            key={a.id}
            variant="ghost"
            size="icon"
            title={a.key ? `${a.label} (⌘${a.key.toUpperCase()})` : a.label}
            aria-label={a.label}
            className="size-8"
            onClick={() => applyWrap(a.wrap)}
          >
            <a.icon className="size-4" />
          </Button>
        ))}
        <div className="mx-1 h-5 w-px bg-border" />
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          title="Undo (⌘Z)"
          aria-label="Undo"
          onClick={undo}
        >
          <Undo2 className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          title="Redo (⇧⌘Z)"
          aria-label="Redo"
          onClick={redo}
        >
          <Redo2 className="size-4" />
        </Button>
        <div className="ml-auto flex items-center gap-1 rounded-lg border border-border p-0.5">
          {(
            [
              ["write", "Write", Pencil],
              ["split", "Split", Columns2],
              ["preview", "Preview", Eye],
            ] as const
          ).map(([m, label, Icon]) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors",
                mode === m
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={cn("grid gap-4", mode === "split" && "md:grid-cols-2")}>
        {showEditor && (
          <Panel title="Markdown" actions={<CopyButton text={src} />}>
            <Textarea
              ref={taRef}
              value={src}
              onChange={(e) => update(e.target.value)}
              onKeyDown={onKeyDown}
              onScroll={() => syncFrom("editor")}
              spellCheck={false}
              className="min-h-[520px] max-h-[640px] overflow-auto border-0 rounded-none focus-visible:ring-0 resize-none font-mono text-sm"
            />
          </Panel>
        )}
        {showPreview && (
          <Panel
            title="Preview"
            actions={
              <>
                <CopyButton text={html} label="Copy HTML" />
                <DownloadButton
                  filename="document.md"
                  content={src}
                  mime="text/markdown"
                  label=".md"
                />
                <DownloadButton
                  filename="preview.html"
                  content={html}
                  mime="text/html"
                  label=".html"
                />
              </>
            }
          >
            <div
              ref={previewRef}
              onScroll={() => syncFrom("preview")}
              className="p-4 md-preview min-h-[520px] max-h-[640px] overflow-auto text-sm"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </Panel>
        )}
      </div>

      {/* Status bar */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 rounded-xl border border-border bg-muted/30 px-3 py-2 font-mono text-[11px] text-muted-foreground">
        <span>{s.words} words</span>
        <span>{s.chars} chars</span>
        <span>{s.lines} lines</span>
        <span>~{s.read} min read</span>
        <span className="ml-auto">{saved ? `Autosaved ${saved}` : "Autosave on"}</span>
      </div>

      <style>{`.md-preview h1{font-size:1.5rem;font-weight:600;margin:.75rem 0}.md-preview h2{font-size:1.2rem;font-weight:600;margin:.75rem 0}.md-preview h3{font-size:1.05rem;font-weight:600;margin:.6rem 0}.md-preview p{margin:.5rem 0;line-height:1.6}.md-preview ul{list-style:disc;margin:.5rem 0 .5rem 1.25rem}.md-preview ol{list-style:decimal;margin:.5rem 0 .5rem 1.25rem}.md-preview li{margin:.15rem 0}.md-preview li:has(input){list-style:none;margin-left:-1rem}.md-preview input[type=checkbox]{margin-right:.5rem}.md-preview blockquote{border-left:2px solid currentColor;opacity:.8;padding-left:.75rem;margin:.5rem 0}.md-preview hr{border:0;border-top:1px solid oklch(1 0 0/12%);margin:1rem 0}.md-preview table{width:100%;border-collapse:collapse;margin:.75rem 0;font-size:.85rem}.md-preview th,.md-preview td{border:1px solid oklch(1 0 0/12%);padding:.4rem .6rem;text-align:left}.md-preview th{background:oklch(1 0 0/5%);font-weight:600}.md-preview code{background:oklch(1 0 0/8%);padding:.1rem .35rem;border-radius:.25rem;font-family:var(--font-mono)}.md-preview pre{background:oklch(1 0 0/6%);padding:.75rem;border-radius:.5rem;overflow:auto;font-family:var(--font-mono);font-size:.85rem;margin:.5rem 0}.md-preview pre code{background:transparent;padding:0}.md-preview a{text-decoration:underline;text-underline-offset:3px}.md-preview img{max-width:100%;border-radius:.5rem}`}</style>
    </div>
  );
}
