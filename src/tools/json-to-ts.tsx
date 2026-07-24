import { useMemo, useState } from "react";
import { Wand2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Panel, Field, CopyButton, DownloadButton } from "./primitives";

type Mode = "interface" | "type" | "zod";
type Options = {
  rootName: string;
  mode: Mode;
  exportTypes: boolean;
  readonly: boolean;
  optionalNulls: boolean;
  arrayStyle: "T[]" | "Array<T>";
  quoteKeys: "auto" | "always";
};

const DEFAULT_JSON = `{
  "id": 42,
  "name": "Ada Lovelace",
  "isActive": true,
  "tags": ["math", "cs"],
  "profile": {
    "email": "ada@example.com",
    "avatarUrl": null,
    "age": 36
  },
  "posts": [
    { "id": 1, "title": "First", "views": 120, "pinned": true },
    { "id": 2, "title": "Second", "views": 87 }
  ]
}`;

type TypeNode =
  | { kind: "primitive"; name: "string" | "number" | "boolean" | "null" | "any" | "unknown" }
  | { kind: "array"; element: TypeNode }
  | { kind: "object"; fields: Map<string, { type: TypeNode; optional: boolean }> }
  | { kind: "union"; members: TypeNode[] };

function inferNode(value: unknown): TypeNode {
  if (value === null) return { kind: "primitive", name: "null" };
  if (Array.isArray(value)) {
    if (value.length === 0)
      return { kind: "array", element: { kind: "primitive", name: "unknown" } };
    const merged = value.map(inferNode).reduce((a, b) => mergeTypes(a, b));
    return { kind: "array", element: merged };
  }
  switch (typeof value) {
    case "string":
      return { kind: "primitive", name: "string" };
    case "number":
      return { kind: "primitive", name: "number" };
    case "boolean":
      return { kind: "primitive", name: "boolean" };
    case "object": {
      const obj = value as Record<string, unknown>;
      const fields = new Map<string, { type: TypeNode; optional: boolean }>();
      for (const key of Object.keys(obj)) {
        fields.set(key, { type: inferNode(obj[key]), optional: false });
      }
      return { kind: "object", fields };
    }
    default:
      return { kind: "primitive", name: "any" };
  }
}

function mergeTypes(a: TypeNode, b: TypeNode): TypeNode {
  if (typesEqual(a, b)) return a;
  if (a.kind === "object" && b.kind === "object") {
    const merged = new Map<string, { type: TypeNode; optional: boolean }>();
    const keys = new Set([...a.fields.keys(), ...b.fields.keys()]);
    for (const k of keys) {
      const av = a.fields.get(k);
      const bv = b.fields.get(k);
      if (av && bv)
        merged.set(k, { type: mergeTypes(av.type, bv.type), optional: av.optional || bv.optional });
      else if (av) merged.set(k, { ...av, optional: true });
      else if (bv) merged.set(k, { ...bv, optional: true });
    }
    return { kind: "object", fields: merged };
  }
  if (a.kind === "array" && b.kind === "array")
    return { kind: "array", element: mergeTypes(a.element, b.element) };
  const flat = (n: TypeNode): TypeNode[] => (n.kind === "union" ? n.members : [n]);
  const members = dedupeTypes([...flat(a), ...flat(b)]);
  return members.length === 1 ? members[0] : { kind: "union", members };
}

function typesEqual(a: TypeNode, b: TypeNode): boolean {
  return JSON.stringify(serialize(a)) === JSON.stringify(serialize(b));
}
function serialize(n: TypeNode): unknown {
  if (n.kind === "object")
    return {
      o: [...n.fields.entries()].sort().map(([k, v]) => [k, v.optional, serialize(v.type)]),
    };
  if (n.kind === "array") return { a: serialize(n.element) };
  if (n.kind === "union") return { u: n.members.map(serialize) };
  return n;
}
function dedupeTypes(ns: TypeNode[]): TypeNode[] {
  const seen = new Set<string>();
  const out: TypeNode[] = [];
  for (const n of ns) {
    const k = JSON.stringify(serialize(n));
    if (!seen.has(k)) {
      seen.add(k);
      out.push(n);
    }
  }
  return out;
}

const RESERVED = new Set([
  "string",
  "number",
  "boolean",
  "any",
  "null",
  "undefined",
  "void",
  "never",
  "unknown",
  "object",
]);
function toPascal(s: string): string {
  const cleaned = s.replace(/[^a-zA-Z0-9]+/g, " ").trim();
  if (!cleaned) return "T";
  const p = cleaned
    .split(/\s+/)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
  return /^[0-9]/.test(p) ? "_" + p : p;
}
function singular(s: string): string {
  if (/ies$/.test(s)) return s.replace(/ies$/, "y");
  if (/sses$/.test(s)) return s.replace(/es$/, "");
  if (/s$/.test(s) && !/ss$/.test(s)) return s.replace(/s$/, "");
  return s;
}
function isValidIdentifier(k: string): boolean {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k);
}

function emitTypeScript(root: TypeNode, opts: Options): string {
  const decls: string[] = [];
  const registry = new Map<string, string>();
  const usedNames = new Set<string>();

  function uniqueName(base: string): string {
    let name = toPascal(base) || "T";
    if (RESERVED.has(name.toLowerCase())) name = name + "Type";
    let n = name;
    let i = 2;
    while (usedNames.has(n)) {
      n = name + i;
      i++;
    }
    usedNames.add(n);
    return n;
  }

  function render(node: TypeNode, hint: string): string {
    if (node.kind === "primitive") return node.name;
    if (node.kind === "array") {
      const el = render(node.element, singular(hint));
      const wrap = /[|&\s]/.test(el) && opts.arrayStyle === "T[]" ? `(${el})` : el;
      return opts.arrayStyle === "T[]" ? `${wrap}[]` : `Array<${el}>`;
    }
    if (node.kind === "union") return node.members.map((m) => render(m, hint)).join(" | ");
    const sig = JSON.stringify(serialize(node));
    if (registry.has(sig)) return registry.get(sig)!;
    const name = uniqueName(hint);
    registry.set(sig, name);
    const lines: string[] = [];
    for (const [key, { type, optional }] of node.fields.entries()) {
      const isNullable =
        type.kind === "union" &&
        type.members.some((m) => m.kind === "primitive" && m.name === "null");
      const opt = optional || (opts.optionalNulls && isNullable);
      const cleanType =
        opts.optionalNulls && isNullable ? renderStripNull(type, key) : render(type, key);
      const safeKey =
        isValidIdentifier(key) && opts.quoteKeys !== "always" ? key : JSON.stringify(key);
      const ro = opts.readonly ? "readonly " : "";
      lines.push(`  ${ro}${safeKey}${opt ? "?" : ""}: ${cleanType};`);
    }
    const exp = opts.exportTypes ? "export " : "";
    if (opts.mode === "interface") decls.push(`${exp}interface ${name} {\n${lines.join("\n")}\n}`);
    else decls.push(`${exp}type ${name} = {\n${lines.join("\n")}\n};`);
    return name;
  }

  function renderStripNull(node: TypeNode, hint: string): string {
    if (node.kind !== "union") return render(node, hint);
    const kept = node.members.filter((m) => !(m.kind === "primitive" && m.name === "null"));
    if (kept.length === 1) return render(kept[0], hint);
    return kept.map((m) => render(m, hint)).join(" | ");
  }

  const rootRendered = render(root, opts.rootName);
  if (root.kind !== "object") {
    const exp = opts.exportTypes ? "export " : "";
    decls.push(`${exp}type ${toPascal(opts.rootName)} = ${rootRendered};`);
  }
  return decls.join("\n\n") + "\n";
}

function emitZod(root: TypeNode, opts: Options): string {
  const decls: string[] = [];
  const registry = new Map<string, string>();
  const used = new Set<string>();
  function uniq(base: string) {
    let n = toPascal(base) || "T";
    if (RESERVED.has(n.toLowerCase())) n = n + "Schema";
    let name = n + "Schema",
      i = 2;
    while (used.has(name)) {
      name = n + "Schema" + i;
      i++;
    }
    used.add(name);
    return name;
  }
  function r(node: TypeNode, hint: string): string {
    if (node.kind === "primitive") {
      if (node.name === "null") return "z.null()";
      if (node.name === "any" || node.name === "unknown") return "z.unknown()";
      return `z.${node.name}()`;
    }
    if (node.kind === "array") return `z.array(${r(node.element, singular(hint))})`;
    if (node.kind === "union")
      return `z.union([${node.members.map((m) => r(m, hint)).join(", ")}])`;
    const sig = JSON.stringify(serialize(node));
    if (registry.has(sig)) return registry.get(sig)!;
    const name = uniq(hint);
    registry.set(sig, name);
    const lines: string[] = [];
    for (const [k, { type, optional }] of node.fields.entries()) {
      const safeKey = isValidIdentifier(k) ? k : JSON.stringify(k);
      const val = r(type, k);
      lines.push(`  ${safeKey}: ${val}${optional ? ".optional()" : ""},`);
    }
    const exp = opts.exportTypes ? "export " : "";
    decls.push(`${exp}const ${name} = z.object({\n${lines.join("\n")}\n});`);
    return name;
  }
  const rootRef = r(root, opts.rootName);
  const exp = opts.exportTypes ? "export " : "";
  if (root.kind === "object") {
    decls.push(`${exp}type ${toPascal(opts.rootName)} = z.infer<typeof ${rootRef}>;`);
  } else {
    decls.push(`${exp}const ${toPascal(opts.rootName)}Schema = ${rootRef};`);
    decls.push(
      `${exp}type ${toPascal(opts.rootName)} = z.infer<typeof ${toPascal(opts.rootName)}Schema>;`,
    );
  }
  return `import { z } from "zod";\n\n` + decls.join("\n\n") + "\n";
}

export function JsonToTs() {
  const [input, setInput] = useState(DEFAULT_JSON);
  const [opts, setOpts] = useState<Options>({
    rootName: "Root",
    mode: "interface",
    exportTypes: true,
    readonly: false,
    optionalNulls: true,
    arrayStyle: "T[]",
    quoteKeys: "auto",
  });

  const result = useMemo(() => {
    const src = input.trim();
    if (!src) return { ok: true as const, code: "", stats: null };
    try {
      const parsed = JSON.parse(src);
      const node = inferNode(parsed);
      const code = opts.mode === "zod" ? emitZod(node, opts) : emitTypeScript(node, opts);
      const typeCount = (code.match(/^(export\s+)?(interface|type|const)\s+/gm) || []).length;
      return { ok: true as const, code, stats: { types: typeCount, chars: code.length } };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : String(e) };
    }
  }, [input, opts]);

  function prettify() {
    try {
      setInput(JSON.stringify(JSON.parse(input), null, 2));
    } catch {
      toast.error("Invalid JSON — can't format");
    }
  }
  function set<K extends keyof Options>(k: K, v: Options[K]) {
    setOpts((o) => ({ ...o, [k]: v }));
  }

  const ext = opts.mode === "zod" ? "schema.ts" : "types.ts";

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={prettify} className="gap-1.5">
            <Wand2 className="size-3.5" />
            Format
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setInput(DEFAULT_JSON)}
            className="gap-1.5"
          >
            <RefreshCw className="size-3.5" />
            Sample
          </Button>
        </div>
        <Panel title="JSON input">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="min-h-[520px] font-mono text-xs border-0 rounded-none focus-visible:ring-0 resize-none"
            placeholder="Paste JSON here…"
          />
        </Panel>
        {!result.ok && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 text-destructive text-xs px-3 py-2 font-mono">
            {result.error}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Panel title="Options">
          <div className="p-3 grid grid-cols-2 gap-3">
            <Field label="Root name">
              <Input
                value={opts.rootName}
                onChange={(e) => set("rootName", e.target.value || "Root")}
                className="h-8 font-mono text-xs"
              />
            </Field>
            <Field label="Output">
              <Tabs value={opts.mode} onValueChange={(v) => set("mode", v as Mode)}>
                <TabsList className="h-8 w-full">
                  <TabsTrigger value="interface" className="text-xs h-6">
                    interface
                  </TabsTrigger>
                  <TabsTrigger value="type" className="text-xs h-6">
                    type
                  </TabsTrigger>
                  <TabsTrigger value="zod" className="text-xs h-6">
                    zod
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </Field>
            <Field label="Array syntax">
              <Tabs
                value={opts.arrayStyle}
                onValueChange={(v) => set("arrayStyle", v as Options["arrayStyle"])}
              >
                <TabsList className="h-8 w-full">
                  <TabsTrigger value="T[]" className="text-xs h-6">
                    T[]
                  </TabsTrigger>
                  <TabsTrigger value="Array<T>" className="text-xs h-6">
                    Array&lt;T&gt;
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </Field>
            <Field label="Quote keys">
              <Tabs
                value={opts.quoteKeys}
                onValueChange={(v) => set("quoteKeys", v as Options["quoteKeys"])}
              >
                <TabsList className="h-8 w-full">
                  <TabsTrigger value="auto" className="text-xs h-6">
                    auto
                  </TabsTrigger>
                  <TabsTrigger value="always" className="text-xs h-6">
                    always
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </Field>
            <div className="col-span-2 grid grid-cols-3 gap-3 pt-1">
              <ToggleRow
                label="Export"
                checked={opts.exportTypes}
                onChange={(v) => set("exportTypes", v)}
              />
              <ToggleRow
                label="Readonly"
                checked={opts.readonly}
                onChange={(v) => set("readonly", v)}
              />
              <ToggleRow
                label="null → optional"
                checked={opts.optionalNulls}
                onChange={(v) => set("optionalNulls", v)}
              />
            </div>
          </div>
        </Panel>

        <Panel
          title={
            result.ok && result.stats
              ? `Output — ${result.stats.types} type${result.stats.types === 1 ? "" : "s"}`
              : "Output"
          }
          actions={
            <>
              <CopyButton text={result.ok ? result.code : ""} />
              <DownloadButton
                filename={ext}
                content={result.ok ? result.code : ""}
                mime="text/typescript"
              />
            </>
          }
        >
          <pre className="p-3 overflow-auto text-xs font-mono max-h-[560px] leading-relaxed">
            <code>
              {result.ok
                ? result.code || "// Paste JSON to see generated types"
                : "// Fix JSON errors to generate types"}
            </code>
          </pre>
        </Panel>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-border px-2 py-1.5">
      <Label className="text-xs">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
