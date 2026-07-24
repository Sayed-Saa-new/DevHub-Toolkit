import { useMemo, useState } from "react";
import { ArrowLeftRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Panel, Field, CopyButton, DownloadButton } from "./primitives";
import { cn } from "@/lib/utils";

type Mode = "structural" | "text";

type DiffKind = "add" | "remove" | "change" | "same";

type StructRow = {
  kind: DiffKind;
  path: string;
  left?: string;
  right?: string;
  depth: number;
};

const SAMPLE_LEFT = `{
  "name": "DevHub",
  "version": "1.0.0",
  "features": ["json", "base64", "regex"],
  "author": { "name": "Ada", "email": "ada@example.com" },
  "beta": false
}`;

const SAMPLE_RIGHT = `{
  "name": "DevHub Toolkit",
  "version": "1.1.0",
  "features": ["json", "base64", "regex", "sql"],
  "author": { "name": "Ada", "email": "ada@dev.io", "role": "owner" },
  "released": true
}`;

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function fmt(v: unknown): string {
  if (v === undefined) return "—";
  return typeof v === "string" ? JSON.stringify(v) : JSON.stringify(v);
}

function diffStruct(
  a: unknown,
  b: unknown,
  path = "$",
  depth = 0,
  out: StructRow[] = [],
  showSame = false,
  sortKeys = true,
): StructRow[] {
  if (Object.is(a, b) || JSON.stringify(a) === JSON.stringify(b)) {
    if (showSame) out.push({ kind: "same", path, left: fmt(a), right: fmt(b), depth });
    return out;
  }
  if (isObj(a) && isObj(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    const list = sortKeys ? [...keys].sort() : [...keys];
    out.push({ kind: "same", path, left: "{", right: "{", depth });
    for (const k of list) {
      const p = `${path}.${k}`;
      if (!(k in a)) out.push({ kind: "add", path: p, right: fmt(b[k]), depth: depth + 1 });
      else if (!(k in b)) out.push({ kind: "remove", path: p, left: fmt(a[k]), depth: depth + 1 });
      else diffStruct(a[k], b[k], p, depth + 1, out, showSame, sortKeys);
    }
    return out;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    const len = Math.max(a.length, b.length);
    out.push({ kind: "same", path, left: "[", right: "[", depth });
    for (let i = 0; i < len; i++) {
      const p = `${path}[${i}]`;
      if (i >= a.length) out.push({ kind: "add", path: p, right: fmt(b[i]), depth: depth + 1 });
      else if (i >= b.length)
        out.push({ kind: "remove", path: p, left: fmt(a[i]), depth: depth + 1 });
      else diffStruct(a[i], b[i], p, depth + 1, out, showSame, sortKeys);
    }
    return out;
  }
  out.push({ kind: "change", path, left: fmt(a), right: fmt(b), depth });
  return out;
}

function safeParse(src: string): { ok: true; value: unknown } | { ok: false; error: string } {
  try {
    return { ok: true, value: JSON.parse(src) };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

function canonical(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(canonical);
  if (isObj(v)) {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(v).sort()) out[k] = canonical(v[k]);
    return out;
  }
  return v;
}

const KIND_STYLE: Record<DiffKind, string> = {
  add: "bg-emerald-500/10 text-emerald-300 border-l-2 border-emerald-500/60",
  remove: "bg-rose-500/10 text-rose-300 border-l-2 border-rose-500/60",
  change: "bg-amber-500/10 text-amber-200 border-l-2 border-amber-500/60",
  same: "text-muted-foreground",
};

const KIND_SIGN: Record<DiffKind, string> = {
  add: "+",
  remove: "−",
  change: "~",
  same: " ",
};

export function JsonDiff() {
  const [left, setLeft] = useState(SAMPLE_LEFT);
  const [right, setRight] = useState(SAMPLE_RIGHT);
  const [mode, setMode] = useState<Mode>("structural");
  const [showSame, setShowSame] = useState(false);
  const [sortKeys, setSortKeys] = useState(true);
  const [ignoreOrder, setIgnoreOrder] = useState(false);

  const parsedLeft = useMemo(() => safeParse(left), [left]);
  const parsedRight = useMemo(() => safeParse(right), [right]);

  const result = useMemo(() => {
    if (!parsedLeft.ok || !parsedRight.ok) return null;
    const a = ignoreOrder ? canonical(parsedLeft.value) : parsedLeft.value;
    const b = ignoreOrder ? canonical(parsedRight.value) : parsedRight.value;
    return diffStruct(a, b, "$", 0, [], showSame, sortKeys);
  }, [parsedLeft, parsedRight, showSame, sortKeys, ignoreOrder]);

  const summary = useMemo(() => {
    if (!result) return { add: 0, remove: 0, change: 0 };
    return result.reduce(
      (acc, r) => {
        if (r.kind !== "same") acc[r.kind]++;
        return acc;
      },
      { add: 0, remove: 0, change: 0 } as Record<Exclude<DiffKind, "same">, number>,
    );
  }, [result]);

  const identical =
    parsedLeft.ok &&
    parsedRight.ok &&
    JSON.stringify(canonical(parsedLeft.value)) === JSON.stringify(canonical(parsedRight.value));

  const patchText = useMemo(() => {
    if (!result) return "";
    return result
      .filter((r) => r.kind !== "same")
      .map((r) => {
        if (r.kind === "change") return `~ ${r.path}: ${r.left} → ${r.right}`;
        if (r.kind === "add") return `+ ${r.path}: ${r.right}`;
        return `- ${r.path}: ${r.left}`;
      })
      .join("\n");
  }, [result]);

  const swap = () => {
    setLeft(right);
    setRight(left);
  };

  const format = () => {
    if (parsedLeft.ok) setLeft(JSON.stringify(parsedLeft.value, null, 2));
    if (parsedRight.ok) setRight(JSON.stringify(parsedRight.value, null, 2));
    toast.success("Formatted both sides");
  };

  return (
    <div className="space-y-4">
      <Panel
        title="Options"
        actions={
          <>
            <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" onClick={format}>
              <RefreshCw className="size-3" /> Format
            </Button>
            <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" onClick={swap}>
              <ArrowLeftRight className="size-3" /> Swap
            </Button>
          </>
        }
      >
        <div className="grid gap-4 p-3 md:grid-cols-4">
          <Field label="Mode">
            <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
              <TabsList className="h-8">
                <TabsTrigger value="structural" className="text-xs">
                  Structural
                </TabsTrigger>
                <TabsTrigger value="text" className="text-xs">
                  Text
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </Field>
          <Field label="Show unchanged">
            <div className="flex h-8 items-center">
              <Switch checked={showSame} onCheckedChange={setShowSame} />
            </div>
          </Field>
          <Field label="Sort keys">
            <div className="flex h-8 items-center">
              <Switch checked={sortKeys} onCheckedChange={setSortKeys} />
            </div>
          </Field>
          <Field label="Ignore array order" hint="canonicalize">
            <div className="flex h-8 items-center">
              <Switch checked={ignoreOrder} onCheckedChange={setIgnoreOrder} />
            </div>
          </Field>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title={parsedLeft.ok ? "Left (original)" : `Left — ${parsedLeft.error}`}>
          <Textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            spellCheck={false}
            className={cn(
              "min-h-[280px] rounded-none border-0 font-mono text-xs focus-visible:ring-0",
              !parsedLeft.ok && "text-rose-300",
            )}
          />
        </Panel>
        <Panel title={parsedRight.ok ? "Right (changed)" : `Right — ${parsedRight.error}`}>
          <Textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            spellCheck={false}
            className={cn(
              "min-h-[280px] rounded-none border-0 font-mono text-xs focus-visible:ring-0",
              !parsedRight.ok && "text-rose-300",
            )}
          />
        </Panel>
      </div>

      <Panel
        title={
          identical
            ? "Diff — identical ✓"
            : `Diff — +${summary.add} added · −${summary.remove} removed · ~${summary.change} changed`
        }
        actions={
          <>
            <CopyButton text={patchText} label="Copy patch" />
            <DownloadButton filename="diff.patch" content={patchText} mime="text/plain" />
          </>
        }
      >
        {!parsedLeft.ok || !parsedRight.ok ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            Fix JSON errors above to see the diff.
          </div>
        ) : identical ? (
          <div className="p-6 text-center text-sm text-emerald-300">
            Both inputs are structurally equal.
          </div>
        ) : mode === "structural" ? (
          <div className="max-h-[520px] overflow-auto font-mono text-xs">
            {result!.map((r, i) => (
              <div
                key={i}
                className={cn("flex gap-2 px-3 py-1", KIND_STYLE[r.kind])}
                style={{ paddingLeft: `${12 + r.depth * 14}px` }}
              >
                <span className="w-3 shrink-0 select-none">{KIND_SIGN[r.kind]}</span>
                <span className="shrink-0 text-muted-foreground/70">{r.path}</span>
                {r.kind === "change" ? (
                  <span className="truncate">
                    <span className="line-through opacity-60">{r.left}</span>{" "}
                    <span>→ {r.right}</span>
                  </span>
                ) : (
                  <span className="truncate">{r.kind === "remove" ? r.left : r.right}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <pre className="max-h-[520px] overflow-auto p-3 font-mono text-xs whitespace-pre-wrap">
            {patchText}
          </pre>
        )}
      </Panel>
    </div>
  );
}
