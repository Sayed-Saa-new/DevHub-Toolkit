import { forwardRef, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeftRight,
  Upload,
  RefreshCw,
  Trash2,
  FileDown,
  Copy,
  Rows,
  Columns,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  diffLines,
  diffWordsWithSpace,
  diffChars,
  diffSentences,
  createTwoFilesPatch,
  type Change,
} from "diff";
import { toast } from "sonner";

import { ToolShell } from "@/components/tool-shell";
import { TOOLS_BY_SLUG } from "@/lib/tools";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn, copyToClipboard, downloadFile } from "@/lib/utils";
import { Panel } from "./primitives";

type Granularity = "line" | "word" | "char" | "sentence";
type ViewMode = "split" | "unified";

const SAMPLE_LEFT = `function greet(name) {
  const message = "Hello, " + name;
  console.log(message);
  return message;
}

greet("world");
`;

const SAMPLE_RIGHT = `function greet(name = "friend") {
  const message = \`Hello, \${name}!\`;
  console.log(message);
  return { message, at: Date.now() };
}

greet("world");
greet();
`;

const STORAGE_KEY = "devhub:diff-checker";

type StoreShape = {
  left: string;
  right: string;
  granularity: Granularity;
  view: ViewMode;
  ignoreCase: boolean;
  ignoreWhitespace: boolean;
  trimLines: boolean;
  ignoreBlank: boolean;
};

function preprocess(
  text: string,
  { ignoreCase, ignoreWhitespace, trimLines, ignoreBlank }: Pick<
    StoreShape,
    "ignoreCase" | "ignoreWhitespace" | "trimLines" | "ignoreBlank"
  >,
) {
  let out = text.replace(/\r\n/g, "\n");
  if (ignoreCase) out = out.toLowerCase();
  if (trimLines || ignoreBlank) {
    const lines = out.split("\n");
    const mapped = trimLines ? lines.map((l) => l.replace(/\s+$/g, "").replace(/^\s+/g, "")) : lines;
    out = (ignoreBlank ? mapped.filter((l) => l.trim() !== "") : mapped).join("\n");
  }
  if (ignoreWhitespace) {
    out = out
      .split("\n")
      .map((l) => l.replace(/[ \t]+/g, " ").trim())
      .join("\n");
  }
  return out;
}

function computeStats(changes: Change[]) {
  let added = 0;
  let removed = 0;
  let unchanged = 0;
  for (const c of changes) {
    const units = c.value.length;
    if (c.added) added += units;
    else if (c.removed) removed += units;
    else unchanged += units;
  }
  const total = added + removed + unchanged;
  const similarity = total === 0 ? 100 : Math.round((unchanged / total) * 100);
  return { added, removed, unchanged, similarity };
}

function runDiff(left: string, right: string, granularity: Granularity) {
  switch (granularity) {
    case "word":
      return diffWordsWithSpace(left, right);
    case "char":
      return diffChars(left, right);
    case "sentence":
      return diffSentences(left, right);
    case "line":
    default:
      return diffLines(left, right);
  }
}

/** Build aligned side-by-side line rows from a diffLines result. */
function buildSplitRows(changes: Change[]) {
  type Row = { left?: string; right?: string; leftNo?: number; rightNo?: number; kind: "same" | "add" | "remove" | "change" };
  const rows: Row[] = [];
  let leftNo = 1;
  let rightNo = 1;

  for (let i = 0; i < changes.length; i++) {
    const c = changes[i];
    const next = changes[i + 1];
    const lines = c.value.replace(/\n$/, "").split("\n");
    if (c.removed && next && next.added) {
      const rLines = next.value.replace(/\n$/, "").split("\n");
      const max = Math.max(lines.length, rLines.length);
      for (let j = 0; j < max; j++) {
        const l = lines[j];
        const r = rLines[j];
        rows.push({
          left: l,
          right: r,
          leftNo: l !== undefined ? leftNo++ : undefined,
          rightNo: r !== undefined ? rightNo++ : undefined,
          kind: l === undefined ? "add" : r === undefined ? "remove" : "change",
        });
      }
      i++; // consumed pair
      continue;
    }
    for (const line of lines) {
      if (c.added) rows.push({ right: line, rightNo: rightNo++, kind: "add" });
      else if (c.removed) rows.push({ left: line, leftNo: leftNo++, kind: "remove" });
      else rows.push({ left: line, right: line, leftNo: leftNo++, rightNo: rightNo++, kind: "same" });
    }
  }
  return rows;
}

function useSyncScroll() {
  const a = useRef<HTMLDivElement | null>(null);
  const b = useRef<HTMLDivElement | null>(null);
  const lock = useRef(false);
  useEffect(() => {
    const A = a.current;
    const B = b.current;
    if (!A || !B) return;
    const onA = () => {
      if (lock.current) return;
      lock.current = true;
      B.scrollTop = A.scrollTop;
      B.scrollLeft = A.scrollLeft;
      requestAnimationFrame(() => (lock.current = false));
    };
    const onB = () => {
      if (lock.current) return;
      lock.current = true;
      A.scrollTop = B.scrollTop;
      A.scrollLeft = B.scrollLeft;
      requestAnimationFrame(() => (lock.current = false));
    };
    A.addEventListener("scroll", onA);
    B.addEventListener("scroll", onB);
    return () => {
      A.removeEventListener("scroll", onA);
      B.removeEventListener("scroll", onB);
    };
  }, []);
  return { a, b };
}

export function DiffChecker() {
  const tool = TOOLS_BY_SLUG["diff-checker"];
  const [left, setLeft] = useState(SAMPLE_LEFT);
  const [right, setRight] = useState(SAMPLE_RIGHT);
  const [leftName, setLeftName] = useState("original.txt");
  const [rightName, setRightName] = useState("modified.txt");
  const [granularity, setGranularity] = useState<Granularity>("line");
  const [view, setView] = useState<ViewMode>("split");
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [trimLines, setTrimLines] = useState(true);
  const [ignoreBlank, setIgnoreBlank] = useState(false);
  const [wrap, setWrap] = useState(true);
  const [showOnlyChanges, setShowOnlyChanges] = useState(false);
  const [cursor, setCursor] = useState(0);

  // Restore
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw) as Partial<StoreShape>;
      if (typeof s.left === "string") setLeft(s.left);
      if (typeof s.right === "string") setRight(s.right);
      if (s.granularity) setGranularity(s.granularity);
      if (s.view) setView(s.view);
      if (typeof s.ignoreCase === "boolean") setIgnoreCase(s.ignoreCase);
      if (typeof s.ignoreWhitespace === "boolean") setIgnoreWhitespace(s.ignoreWhitespace);
      if (typeof s.trimLines === "boolean") setTrimLines(s.trimLines);
      if (typeof s.ignoreBlank === "boolean") setIgnoreBlank(s.ignoreBlank);
    } catch {}
  }, []);

  // Persist
  useEffect(() => {
    const s: StoreShape = { left, right, granularity, view, ignoreCase, ignoreWhitespace, trimLines, ignoreBlank };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch {}
  }, [left, right, granularity, view, ignoreCase, ignoreWhitespace, trimLines, ignoreBlank]);

  const opts = { ignoreCase, ignoreWhitespace, trimLines, ignoreBlank };
  const processedLeft = useMemo(() => preprocess(left, opts), [left, ignoreCase, ignoreWhitespace, trimLines, ignoreBlank]);
  const processedRight = useMemo(() => preprocess(right, opts), [right, ignoreCase, ignoreWhitespace, trimLines, ignoreBlank]);

  const changes = useMemo(
    () => runDiff(processedLeft, processedRight, granularity),
    [processedLeft, processedRight, granularity],
  );
  const lineChanges = useMemo(
    () => diffLines(processedLeft, processedRight),
    [processedLeft, processedRight],
  );
  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    let unchanged = 0;
    for (const c of lineChanges) {
      const n = c.value.split("\n").length - (c.value.endsWith("\n") ? 1 : 0);
      if (c.added) added += n;
      else if (c.removed) removed += n;
      else unchanged += n;
    }
    const total = added + removed + unchanged;
    const similarity = total === 0 ? 100 : Math.round((unchanged / total) * 100);
    return { added, removed, unchanged, similarity };
  }, [lineChanges]);

  const splitRows = useMemo(() => buildSplitRows(lineChanges), [lineChanges]);
  const changeRowIndexes = useMemo(
    () => splitRows.map((r, i) => (r.kind !== "same" ? i : -1)).filter((i) => i >= 0),
    [splitRows],
  );

  const patch = useMemo(() => {
    if (!left && !right) return "";
    return createTwoFilesPatch(leftName, rightName, left, right, "", "", { context: 3 });
  }, [left, right, leftName, rightName]);

  const { a: leftScrollRef, b: rightScrollRef } = useSyncScroll();

  const swap = () => {
    setLeft(right);
    setRight(left);
    setLeftName(rightName);
    setRightName(leftName);
  };

  const clear = () => {
    setLeft("");
    setRight("");
    toast.success("Cleared");
  };

  const loadSample = () => {
    setLeft(SAMPLE_LEFT);
    setRight(SAMPLE_RIGHT);
    setLeftName("original.txt");
    setRightName("modified.txt");
  };

  const jumpTo = (dir: 1 | -1) => {
    if (changeRowIndexes.length === 0) return;
    const next = (cursor + dir + changeRowIndexes.length) % changeRowIndexes.length;
    setCursor(next);
    const idx = changeRowIndexes[next];
    const el = document.querySelector(`[data-diff-row="${idx}"]`);
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const inField = tag === "TEXTAREA" || tag === "INPUT";
      if (inField) return;
      if (e.key === "n" || e.key === "j") { e.preventDefault(); jumpTo(1); }
      else if (e.key === "p" || e.key === "k") { e.preventDefault(); jumpTo(-1); }
      else if (e.key === "s" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); swap(); }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  });

  const handleFile = async (side: "left" | "right", file: File | undefined) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large (5 MB max)");
      return;
    }
    const text = await file.text();
    if (side === "left") { setLeft(text); setLeftName(file.name); }
    else { setRight(text); setRightName(file.name); }
  };

  return (
    <ToolShell tool={tool}>
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="rounded-xl border border-border bg-card p-3 flex flex-wrap items-center gap-2">
          <Tabs value={granularity} onValueChange={(v) => setGranularity(v as Granularity)}>
            <TabsList className="h-8">
              <TabsTrigger value="line" className="text-xs">Line</TabsTrigger>
              <TabsTrigger value="word" className="text-xs">Word</TabsTrigger>
              <TabsTrigger value="char" className="text-xs">Char</TabsTrigger>
              <TabsTrigger value="sentence" className="text-xs">Sentence</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="h-6 w-px bg-border mx-1" />

          <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
            <TabsList className="h-8">
              <TabsTrigger value="split" className="text-xs gap-1.5">
                <Columns className="size-3.5" /> Split
              </TabsTrigger>
              <TabsTrigger value="unified" className="text-xs gap-1.5">
                <Rows className="size-3.5" /> Unified
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" onClick={swap} className="h-8 gap-1.5 text-xs">
              <ArrowLeftRight className="size-3.5" /> Swap
            </Button>
            <Button variant="ghost" size="sm" onClick={loadSample} className="h-8 gap-1.5 text-xs">
              <RefreshCw className="size-3.5" /> Sample
            </Button>
            <Button variant="ghost" size="sm" onClick={clear} className="h-8 gap-1.5 text-xs">
              <Trash2 className="size-3.5" /> Clear
            </Button>
          </div>
        </div>

        {/* Options */}
        <div className="rounded-xl border border-border bg-card p-3 grid grid-cols-2 md:grid-cols-6 gap-x-4 gap-y-2">
          <ToggleOpt id="opt-case" label="Ignore case" checked={ignoreCase} onChange={setIgnoreCase} />
          <ToggleOpt id="opt-ws" label="Ignore whitespace" checked={ignoreWhitespace} onChange={setIgnoreWhitespace} />
          <ToggleOpt id="opt-trim" label="Trim lines" checked={trimLines} onChange={setTrimLines} />
          <ToggleOpt id="opt-blank" label="Ignore blank lines" checked={ignoreBlank} onChange={setIgnoreBlank} />
          <ToggleOpt id="opt-wrap" label="Wrap lines" checked={wrap} onChange={setWrap} />
          <ToggleOpt id="opt-only" label="Changes only" checked={showOnlyChanges} onChange={setShowOnlyChanges} />
        </div>

        {/* Stats bar */}
        <div className="rounded-xl border border-border bg-card px-4 py-3 flex flex-wrap items-center gap-3 text-sm">
          <Stat label="Added" value={`+${stats.added}`} className="text-emerald-500" />
          <Stat label="Removed" value={`−${stats.removed}`} className="text-red-500" />
          <Stat label="Unchanged" value={String(stats.unchanged)} />
          <Stat label="Similarity" value={`${stats.similarity}%`} />
          <div className="ml-auto flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-1 font-mono">
              {changeRowIndexes.length ? `${cursor + 1} / ${changeRowIndexes.length}` : "0 / 0"}
            </span>
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => jumpTo(-1)} aria-label="Previous change">
              <ChevronUp className="size-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => jumpTo(1)} aria-label="Next change">
              <ChevronDown className="size-3.5" />
            </Button>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid gap-4 md:grid-cols-2">
          <InputPane
            side="left"
            name={leftName}
            onNameChange={setLeftName}
            value={left}
            onChange={setLeft}
            onFile={(f) => handleFile("left", f)}
          />
          <InputPane
            side="right"
            name={rightName}
            onNameChange={setRightName}
            value={right}
            onChange={setRight}
            onFile={(f) => handleFile("right", f)}
          />
        </div>

        {/* Diff view */}
        {view === "split" ? (
          <Panel title="Side-by-side diff">
            <div className="grid grid-cols-2 divide-x divide-border font-mono text-[12.5px] leading-relaxed">
              <ScrollShell ref={leftScrollRef}>
                {splitRows.map((r, i) =>
                  showOnlyChanges && r.kind === "same" ? null : (
                    <DiffLine
                      key={`l-${i}`}
                      no={r.leftNo}
                      text={r.left}
                      kind={r.kind === "add" ? "same-empty" : r.kind === "remove" ? "remove" : r.kind === "change" ? "remove" : "same"}
                      wrap={wrap}
                      rowIndex={i}
                      focused={changeRowIndexes[cursor] === i}
                    />
                  ),
                )}
              </ScrollShell>
              <ScrollShell ref={rightScrollRef}>
                {splitRows.map((r, i) =>
                  showOnlyChanges && r.kind === "same" ? null : (
                    <DiffLine
                      key={`r-${i}`}
                      no={r.rightNo}
                      text={r.right}
                      kind={r.kind === "remove" ? "same-empty" : r.kind === "add" ? "add" : r.kind === "change" ? "add" : "same"}
                      wrap={wrap}
                      rowIndex={i}
                      focused={changeRowIndexes[cursor] === i}
                    />
                  ),
                )}
              </ScrollShell>
            </div>
          </Panel>
        ) : (
          <Panel title="Unified diff">
            <UnifiedView changes={changes} granularity={granularity} wrap={wrap} showOnlyChanges={showOnlyChanges} />
          </Panel>
        )}

        {/* Patch export */}
        <Panel
          title="Unified patch (.diff)"
          actions={
            <>
              <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" onClick={() => copyToClipboard(patch)} disabled={!patch}>
                <Copy className="size-3" /> Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 text-xs"
                onClick={() => downloadFile(`${leftName || "a"}-vs-${rightName || "b"}.diff`, patch, "text/plain")}
                disabled={!patch}
              >
                <FileDown className="size-3" /> Download
              </Button>
            </>
          }
        >
          <pre className="p-3 text-[12.5px] leading-relaxed font-mono max-h-72 overflow-auto whitespace-pre">{patch || "// no changes"}</pre>
        </Panel>

        <p className="text-xs text-muted-foreground px-1">
          Shortcuts: <kbd className="px-1 border rounded">J</kbd>/<kbd className="px-1 border rounded">N</kbd> next change ·{" "}
          <kbd className="px-1 border rounded">K</kbd>/<kbd className="px-1 border rounded">P</kbd> previous ·{" "}
          <kbd className="px-1 border rounded">⌘S</kbd> swap sides
        </p>
      </div>
    </ToolShell>
  );
}

function ToggleOpt({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Label htmlFor={id} className="text-xs text-muted-foreground cursor-pointer">{label}</Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function Stat({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className={cn("font-mono font-semibold tabular-nums", className)}>{value}</span>
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}

const ScrollShell = forwardRef<HTMLDivElement, { children: ReactNode }>(function ScrollShell(
  { children },
  ref,
) {
  return (
    <div ref={ref} className="max-h-[520px] overflow-auto">
      {children}
    </div>
  );
});

function InputPane({
  side,
  name,
  onNameChange,
  value,
  onChange,
  onFile,
}: {
  side: "left" | "right";
  name: string;
  onNameChange: (v: string) => void;
  value: string;
  onChange: (v: string) => void;
  onFile: (file: File | undefined) => void;
}) {
  const inputId = `file-${side}`;
  return (
    <Panel
      title={side === "left" ? "Original" : "Modified"}
      actions={
        <>
          <label htmlFor={inputId}>
            <input
              id={inputId}
              type="file"
              className="sr-only"
              accept=".txt,.md,.json,.js,.ts,.tsx,.jsx,.css,.html,.xml,.yaml,.yml,.csv,.log,.py,.go,.rs,.java,.c,.cpp,.rb,.php,.sh,.sql,text/*"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" asChild>
              <span><Upload className="size-3" /> Upload</span>
            </Button>
          </label>
        </>
      }
    >
      <div className="px-3 py-2 border-b border-border">
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="h-7 text-xs font-mono"
          placeholder={side === "left" ? "original.txt" : "modified.txt"}
          aria-label={`${side} file name`}
        />
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onDrop={async (e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) onFile(file);
        }}
        onDragOver={(e) => e.preventDefault()}
        placeholder={`Paste ${side === "left" ? "original" : "modified"} text, or drop a file…`}
        className="min-h-[220px] font-mono text-[12.5px] rounded-none border-0 focus-visible:ring-0 resize-y"
        spellCheck={false}
      />
      <div className="px-3 py-1.5 text-[10.5px] text-muted-foreground border-t border-border font-mono flex justify-between">
        <span>{value.split("\n").length} lines</span>
        <span>{value.length.toLocaleString()} chars</span>
      </div>
    </Panel>
  );
}

function DiffLine({
  no,
  text,
  kind,
  wrap,
  rowIndex,
  focused,
}: {
  no?: number;
  text?: string;
  kind: "same" | "add" | "remove" | "same-empty";
  wrap: boolean;
  rowIndex: number;
  focused: boolean;
}) {
  const bg =
    kind === "add"
      ? "bg-emerald-500/10"
      : kind === "remove"
        ? "bg-red-500/10"
        : kind === "same-empty"
          ? "bg-muted/40"
          : "";
  const marker = kind === "add" ? "+" : kind === "remove" ? "−" : " ";
  return (
    <div
      data-diff-row={rowIndex}
      className={cn(
        "flex min-h-[1.5em] px-0",
        bg,
        focused && "ring-1 ring-inset ring-foreground/40",
      )}
    >
      <span className="w-10 shrink-0 select-none text-right pr-2 text-muted-foreground/70 tabular-nums text-[11px] pt-0.5">
        {no ?? ""}
      </span>
      <span className="w-4 shrink-0 select-none text-center text-muted-foreground pt-0.5">{marker}</span>
      <span className={cn("flex-1 pr-2 pt-0.5", wrap ? "whitespace-pre-wrap break-all" : "whitespace-pre overflow-x-auto")}>
        {text ?? ""}
      </span>
    </div>
  );
}

function UnifiedView({
  changes,
  granularity,
  wrap,
  showOnlyChanges,
}: {
  changes: Change[];
  granularity: Granularity;
  wrap: boolean;
  showOnlyChanges: boolean;
}) {
  // For line granularity render classic +/- gutter; for word/char/sentence render inline highlighting.
  if (granularity === "line") {
    let leftNo = 1;
    let rightNo = 1;
  const rows: ReactNode[] = [];
    let key = 0;
    for (const c of changes) {
      const lines = c.value.replace(/\n$/, "").split("\n");
      for (const line of lines) {
        if (c.added) {
          rows.push(
            <div key={key++} className="flex bg-emerald-500/10">
              <Gutter left="" right={rightNo++} />
              <span className="w-4 text-center text-emerald-600">+</span>
              <span className={cn("flex-1 pr-2", wrap ? "whitespace-pre-wrap break-all" : "whitespace-pre overflow-x-auto")}>{line}</span>
            </div>,
          );
        } else if (c.removed) {
          rows.push(
            <div key={key++} className="flex bg-red-500/10">
              <Gutter left={leftNo++} right="" />
              <span className="w-4 text-center text-red-600">−</span>
              <span className={cn("flex-1 pr-2", wrap ? "whitespace-pre-wrap break-all" : "whitespace-pre overflow-x-auto")}>{line}</span>
            </div>,
          );
        } else {
          if (!showOnlyChanges) {
            rows.push(
              <div key={key++} className="flex">
                <Gutter left={leftNo} right={rightNo} />
                <span className="w-4 text-center text-muted-foreground">&nbsp;</span>
                <span className={cn("flex-1 pr-2", wrap ? "whitespace-pre-wrap break-all" : "whitespace-pre overflow-x-auto")}>{line}</span>
              </div>,
            );
          }
          leftNo++;
          rightNo++;
        }
      }
    }
    return <div className="max-h-[560px] overflow-auto font-mono text-[12.5px] leading-relaxed">{rows}</div>;
  }

  return (
    <div
      className={cn(
        "max-h-[560px] overflow-auto font-mono text-[13px] leading-relaxed p-3",
        wrap ? "whitespace-pre-wrap break-words" : "whitespace-pre",
      )}
    >
      {changes.map((c, i) => (
        <span
          key={i}
          className={cn(
            c.added && "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
            c.removed && "bg-red-500/20 text-red-700 dark:text-red-300 line-through decoration-red-500/50",
          )}
        >
          {c.value}
        </span>
      ))}
    </div>
  );
}

function Gutter({ left, right }: { left: number | string; right: number | string }) {
  return (
    <span className="shrink-0 flex select-none text-[11px] text-muted-foreground/70 tabular-nums">
      <span className="w-10 text-right pr-2 pt-0.5">{left}</span>
      <span className="w-10 text-right pr-2 pt-0.5">{right}</span>
    </span>
  );
}