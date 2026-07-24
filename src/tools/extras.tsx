import { useMemo, useState } from "react";
import * as yaml from "js-yaml";
import { diffWords, diffLines } from "diff";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CopyButton, DownloadButton, Field, Mono, Panel } from "./primitives";
import { copyToClipboard } from "@/lib/utils";

// ---------- Password Generator ----------
export function PasswordGenerator() {
  const [len, setLen] = useState(20);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [nums, setNums] = useState(true);
  const [syms, setSyms] = useState(true);
  const [exclude, setExclude] = useState("");
  const [pw, setPw] = useState("");

  function generate() {
    let pool = "";
    if (upper) pool += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lower) pool += "abcdefghijklmnopqrstuvwxyz";
    if (nums) pool += "0123456789";
    if (syms) pool += "!@#$%^&*()-_=+[]{};:,.<>/?";
    if (exclude) pool = [...pool].filter((c) => !exclude.includes(c)).join("");
    if (!pool) return setPw("");
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    setPw(Array.from(arr, (n) => pool[n % pool.length]).join(""));
  }

  const entropy = useMemo(() => {
    let poolSize = 0;
    if (upper) poolSize += 26;
    if (lower) poolSize += 26;
    if (nums) poolSize += 10;
    if (syms) poolSize += 26;
    poolSize = Math.max(1, poolSize - exclude.length);
    return Math.round(len * Math.log2(poolSize));
  }, [len, upper, lower, nums, syms, exclude]);

  const strength =
    entropy < 50 ? "Weak" : entropy < 80 ? "Good" : entropy < 120 ? "Strong" : "Elite";

  return (
    <div className="space-y-4">
      <Panel
        title="Password"
        actions={
          <>
            <CopyButton text={pw} />
            <Button size="sm" variant="ghost" onClick={generate} className="h-7 text-xs">
              Regenerate
            </Button>
          </>
        }
      >
        <div className="p-4 font-mono text-lg break-all min-h-[60px]">
          {pw || <span className="text-muted-foreground text-sm">Click Generate</span>}
        </div>
        <div className="px-4 pb-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span>
            Entropy: <span className="font-mono text-foreground">{entropy} bits</span>
          </span>
          <span>·</span>
          <span>{strength}</span>
        </div>
      </Panel>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label={`Length — ${len}`}>
          <input
            type="range"
            min={4}
            max={128}
            value={len}
            onChange={(e) => setLen(Number(e.target.value))}
            className="w-full accent-foreground"
          />
        </Field>
        <Field label="Exclude characters">
          <Input
            value={exclude}
            onChange={(e) => setExclude(e.target.value)}
            placeholder="e.g. 0O1lI"
            className="font-mono"
          />
        </Field>
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        {(
          [
            ["Uppercase", upper, setUpper],
            ["Lowercase", lower, setLower],
            ["Numbers", nums, setNums],
            ["Symbols", syms, setSyms],
          ] as [string, boolean, (v: boolean) => void][]
        ).map(([l, v, s]) => (
          <label key={l} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={v}
              onChange={(e) => s(e.target.checked)}
              className="accent-foreground"
            />{" "}
            {l}
          </label>
        ))}
      </div>
      <Button onClick={generate}>Generate</Button>
    </div>
  );
}

// ---------- Lorem Ipsum ----------
const LOREM_WORDS =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(
    " ",
  );

export function LoremIpsum() {
  const [paras, setParas] = useState(3);
  const [wpp, setWpp] = useState(50);
  const [startLorem, setStartLorem] = useState(true);

  const text = useMemo(() => {
    const out: string[] = [];
    for (let p = 0; p < paras; p++) {
      const words: string[] = [];
      for (let i = 0; i < wpp; i++)
        words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
      if (p === 0 && startLorem) {
        words[0] = "Lorem";
        words[1] = "ipsum";
      }
      let s = words.join(" ");
      s = s.charAt(0).toUpperCase() + s.slice(1) + ".";
      out.push(s);
    }
    return out.join("\n\n");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paras, wpp, startLorem]);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <Field label={`Paragraphs — ${paras}`}>
          <input
            type="range"
            min={1}
            max={20}
            value={paras}
            onChange={(e) => setParas(Number(e.target.value))}
            className="w-full accent-foreground"
          />
        </Field>
        <Field label={`Words per paragraph — ${wpp}`}>
          <input
            type="range"
            min={10}
            max={200}
            value={wpp}
            onChange={(e) => setWpp(Number(e.target.value))}
            className="w-full accent-foreground"
          />
        </Field>
        <label className="flex items-end gap-2 pb-2">
          <input
            type="checkbox"
            checked={startLorem}
            onChange={(e) => setStartLorem(e.target.checked)}
            className="accent-foreground"
          />
          <span className="text-sm">Start with "Lorem ipsum"</span>
        </label>
      </div>
      <Panel title="Output" actions={<CopyButton text={text} />}>
        <pre className="p-4 whitespace-pre-wrap text-sm leading-relaxed">{text}</pre>
      </Panel>
    </div>
  );
}

// ---------- Case Converter ----------
function splitWords(s: string) {
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_\-\.\/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .split(" ")
    .filter(Boolean);
}

export function CaseConverter() {
  const [text, setText] = useState("hello world example text");
  const w = useMemo(() => splitWords(text), [text]);
  const cases: [string, string][] = [
    ["camelCase", w.map((x, i) => (i === 0 ? x : x[0].toUpperCase() + x.slice(1))).join("")],
    ["PascalCase", w.map((x) => x[0]?.toUpperCase() + x.slice(1)).join("")],
    ["snake_case", w.join("_")],
    ["CONSTANT_CASE", w.join("_").toUpperCase()],
    ["kebab-case", w.join("-")],
    ["Title Case", w.map((x) => x[0]?.toUpperCase() + x.slice(1)).join(" ")],
    [
      "Sentence case",
      w.length
        ? w[0][0].toUpperCase() + w[0].slice(1) + (w.length > 1 ? " " + w.slice(1).join(" ") : "")
        : "",
    ],
    ["UPPER CASE", text.toUpperCase()],
    ["lower case", text.toLowerCase()],
    ["Slug", w.join("-")],
  ];
  return (
    <div className="space-y-4">
      <Field label="Input">
        <Textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="font-mono text-sm"
        />
      </Field>
      <div className="grid sm:grid-cols-2 gap-3">
        {cases.map(([name, val]) => (
          <Panel key={name} title={name}>
            <div className="flex items-center gap-2 px-3 py-2">
              <Mono className="flex-1 break-all">
                {val || <span className="text-muted-foreground">—</span>}
              </Mono>
              <CopyButton text={val} />
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

// ---------- YAML ↔ JSON ----------
export function YamlJsonConverter() {
  const [yamlIn, setYamlIn] = useState(
    "name: DevHub\nversion: 1.0\nfeatures:\n  - fast\n  - free\n",
  );
  const [jsonIn, setJsonIn] = useState(`{\n  "name": "DevHub",\n  "version": 1\n}`);

  const yamlToJson = useMemo(() => {
    try {
      return { out: JSON.stringify(yaml.load(yamlIn), null, 2), err: null as string | null };
    } catch (e) {
      return { out: "", err: (e as Error).message };
    }
  }, [yamlIn]);

  const jsonToYaml = useMemo(() => {
    try {
      return { out: yaml.dump(JSON.parse(jsonIn)), err: null as string | null };
    } catch (e) {
      return { out: "", err: (e as Error).message };
    }
  }, [jsonIn]);

  return (
    <Tabs defaultValue="y2j">
      <TabsList>
        <TabsTrigger value="y2j">YAML → JSON</TabsTrigger>
        <TabsTrigger value="j2y">JSON → YAML</TabsTrigger>
      </TabsList>
      <TabsContent value="y2j" className="grid md:grid-cols-2 gap-4 mt-4">
        <Panel title="YAML">
          <Textarea
            value={yamlIn}
            onChange={(e) => setYamlIn(e.target.value)}
            className="min-h-[380px] border-0 rounded-none focus-visible:ring-0 resize-none font-mono text-sm"
          />
        </Panel>
        <Panel
          title={yamlToJson.err ? "Error" : "JSON"}
          actions={<CopyButton text={yamlToJson.out} />}
        >
          <pre className="p-4 font-mono text-sm min-h-[380px] whitespace-pre-wrap break-all">
            {yamlToJson.err ? (
              <span className="text-destructive">{yamlToJson.err}</span>
            ) : (
              yamlToJson.out
            )}
          </pre>
        </Panel>
      </TabsContent>
      <TabsContent value="j2y" className="grid md:grid-cols-2 gap-4 mt-4">
        <Panel title="JSON">
          <Textarea
            value={jsonIn}
            onChange={(e) => setJsonIn(e.target.value)}
            className="min-h-[380px] border-0 rounded-none focus-visible:ring-0 resize-none font-mono text-sm"
          />
        </Panel>
        <Panel
          title={jsonToYaml.err ? "Error" : "YAML"}
          actions={<CopyButton text={jsonToYaml.out} />}
        >
          <pre className="p-4 font-mono text-sm min-h-[380px] whitespace-pre-wrap break-all">
            {jsonToYaml.err ? (
              <span className="text-destructive">{jsonToYaml.err}</span>
            ) : (
              jsonToYaml.out
            )}
          </pre>
        </Panel>
      </TabsContent>
    </Tabs>
  );
}

// ---------- CSV ↔ JSON ----------
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') inQ = false;
      else field += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ",") {
        cur.push(field);
        field = "";
      } else if (c === "\n") {
        cur.push(field);
        rows.push(cur);
        cur = [];
        field = "";
      } else if (c === "\r") {
        /* skip */
      } else field += c;
    }
  }
  if (field || cur.length) {
    cur.push(field);
    rows.push(cur);
  }
  return rows;
}

export function CsvJsonConverter() {
  const [csv, setCsv] = useState("name,age,city\nAlice,30,NYC\nBob,25,LA\n");
  const [json, setJson] = useState(
    `[\n  {"name": "Alice", "age": 30},\n  {"name": "Bob", "age": 25}\n]`,
  );

  const csvToJson = useMemo(() => {
    try {
      const rows = parseCsv(csv.trim());
      if (!rows.length) return { out: "[]", err: null as string | null };
      const [head, ...body] = rows;
      const arr = body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])));
      return { out: JSON.stringify(arr, null, 2), err: null };
    } catch (e) {
      return { out: "", err: (e as Error).message };
    }
  }, [csv]);

  const jsonToCsv = useMemo(() => {
    try {
      const arr = JSON.parse(json);
      if (!Array.isArray(arr) || !arr.length)
        return { out: "", err: "Expected an array of objects" };
      const keys = Array.from(new Set(arr.flatMap((o) => Object.keys(o))));
      const esc = (v: unknown) => {
        const s = v == null ? "" : String(v);
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
      };
      const out = [
        keys.join(","),
        ...arr.map((o: Record<string, unknown>) => keys.map((k) => esc(o[k])).join(",")),
      ].join("\n");
      return { out, err: null as string | null };
    } catch (e) {
      return { out: "", err: (e as Error).message };
    }
  }, [json]);

  return (
    <Tabs defaultValue="c2j">
      <TabsList>
        <TabsTrigger value="c2j">CSV → JSON</TabsTrigger>
        <TabsTrigger value="j2c">JSON → CSV</TabsTrigger>
      </TabsList>
      <TabsContent value="c2j" className="grid md:grid-cols-2 gap-4 mt-4">
        <Panel title="CSV">
          <Textarea
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            className="min-h-[380px] border-0 rounded-none focus-visible:ring-0 resize-none font-mono text-sm"
          />
        </Panel>
        <Panel
          title={csvToJson.err ? "Error" : "JSON"}
          actions={<CopyButton text={csvToJson.out} />}
        >
          <pre className="p-4 font-mono text-sm min-h-[380px] whitespace-pre-wrap break-all">
            {csvToJson.err ? (
              <span className="text-destructive">{csvToJson.err}</span>
            ) : (
              csvToJson.out
            )}
          </pre>
        </Panel>
      </TabsContent>
      <TabsContent value="j2c" className="grid md:grid-cols-2 gap-4 mt-4">
        <Panel title="JSON">
          <Textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            className="min-h-[380px] border-0 rounded-none focus-visible:ring-0 resize-none font-mono text-sm"
          />
        </Panel>
        <Panel
          title={jsonToCsv.err ? "Error" : "CSV"}
          actions={
            <>
              <CopyButton text={jsonToCsv.out} />
              <DownloadButton filename="export.csv" content={jsonToCsv.out} mime="text/csv" />
            </>
          }
        >
          <pre className="p-4 font-mono text-sm min-h-[380px] whitespace-pre-wrap break-all">
            {jsonToCsv.err ? (
              <span className="text-destructive">{jsonToCsv.err}</span>
            ) : (
              jsonToCsv.out
            )}
          </pre>
        </Panel>
      </TabsContent>
    </Tabs>
  );
}

// ---------- Number Base Converter ----------
export function NumberBase() {
  const [dec, setDec] = useState("255");
  const { n, err } = useMemo(() => {
    const v = Number(dec);
    if (!Number.isFinite(v) || !Number.isInteger(v) || v < 0)
      return { n: null as number | null, err: "Enter a non-negative integer" };
    return { n: v, err: null as string | null };
  }, [dec]);

  const rows: [string, string][] =
    n == null
      ? []
      : [
          ["Binary", n.toString(2)],
          ["Octal", n.toString(8)],
          ["Decimal", n.toString(10)],
          ["Hexadecimal", "0x" + n.toString(16).toUpperCase()],
          ["Base32", n.toString(32).toUpperCase()],
          ["Base36", n.toString(36).toUpperCase()],
        ];

  return (
    <div className="space-y-4">
      <Field label="Decimal input">
        <Input value={dec} onChange={(e) => setDec(e.target.value)} className="font-mono" />
      </Field>
      {err && <div className="text-sm text-destructive">{err}</div>}
      <Panel title="Conversions">
        <div className="divide-y divide-border">
          {rows.map(([name, val]) => (
            <div
              key={name}
              className="grid grid-cols-[130px_1fr_auto] items-center gap-3 px-3 py-2"
            >
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {name}
              </div>
              <Mono className="text-sm break-all">{val}</Mono>
              <CopyButton text={val} />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

// ---------- Text Diff ----------
export function TextDiff() {
  const [a, setA] = useState("The quick brown fox jumps over the lazy dog.");
  const [b, setB] = useState("The quick red fox jumped over the sleepy dog.");
  const [mode, setMode] = useState<"words" | "lines">("words");
  const parts = useMemo(() => (mode === "words" ? diffWords(a, b) : diffLines(a, b)), [a, b, mode]);
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Original">
          <Textarea
            rows={8}
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="font-mono text-sm"
          />
        </Field>
        <Field label="Changed">
          <Textarea
            rows={8}
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="font-mono text-sm"
          />
        </Field>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={mode === "words" ? "default" : "outline"}
          onClick={() => setMode("words")}
        >
          Words
        </Button>
        <Button
          size="sm"
          variant={mode === "lines" ? "default" : "outline"}
          onClick={() => setMode("lines")}
        >
          Lines
        </Button>
      </div>
      <Panel title="Diff">
        <pre className="p-4 font-mono text-sm whitespace-pre-wrap break-words leading-relaxed">
          {parts.map((p, i) => (
            <span
              key={i}
              className={
                p.added
                  ? "bg-emerald-500/20 text-emerald-300"
                  : p.removed
                    ? "bg-rose-500/20 text-rose-300 line-through"
                    : ""
              }
            >
              {p.value}
            </span>
          ))}
        </pre>
      </Panel>
    </div>
  );
}

// ---------- Text Stats ----------
export function TextStats() {
  const [text, setText] = useState("");
  const stats = useMemo(() => {
    const chars = text.length;
    const noSpaces = text.replace(/\s/g, "").length;
    const words = (text.trim().match(/\S+/g) ?? []).length;
    const lines = text ? text.split(/\r?\n/).length : 0;
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
    const sentences = (text.match(/[.!?]+(?=\s|$)/g) ?? []).length;
    const readMin = Math.max(1, Math.round(words / 200));
    const speakMin = Math.max(1, Math.round(words / 130));
    return { chars, noSpaces, words, lines, paragraphs, sentences, readMin, speakMin };
  }, [text]);
  const cards: [string, string | number][] = [
    ["Characters", stats.chars],
    ["Without spaces", stats.noSpaces],
    ["Words", stats.words],
    ["Sentences", stats.sentences],
    ["Paragraphs", stats.paragraphs],
    ["Lines", stats.lines],
    ["Reading time", `${stats.readMin} min`],
    ["Speaking time", `${stats.speakMin} min`],
  ];
  return (
    <div className="space-y-4">
      <Textarea
        rows={10}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type text…"
        className="font-mono text-sm"
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map(([label, val]) => (
          <div key={label} className="rounded-xl border border-border p-3 bg-card">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
            <div className="mt-1 text-2xl font-mono">{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- HTML Entities ----------
const HTML_ENT: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
function htmlEncode(s: string) {
  return s.replace(/[&<>"']/g, (c) => HTML_ENT[c]);
}
function htmlDecode(s: string) {
  const el = document.createElement("textarea");
  el.innerHTML = s;
  return el.value;
}
export function HtmlEntities() {
  const [text, setText] = useState(`<div class="hero">Hello & welcome</div>`);
  return (
    <div className="space-y-4">
      <Field label="Input">
        <Textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="font-mono text-sm"
        />
      </Field>
      <div className="grid md:grid-cols-2 gap-4">
        <Panel title="Encoded" actions={<CopyButton text={htmlEncode(text)} />}>
          <pre className="p-4 font-mono text-sm whitespace-pre-wrap break-all min-h-[100px]">
            {htmlEncode(text)}
          </pre>
        </Panel>
        <Panel title="Decoded" actions={<CopyButton text={htmlDecode(text)} />}>
          <pre className="p-4 font-mono text-sm whitespace-pre-wrap break-all min-h-[100px]">
            {htmlDecode(text)}
          </pre>
        </Panel>
      </div>
    </div>
  );
}

// ---------- Cron Explainer ----------
function explainCron(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return "Expected 5 fields: minute hour day-of-month month day-of-week";
  const [m, h, dom, mo, dow] = parts;
  const desc = (v: string, name: string, ranges: string) => {
    if (v === "*") return `every ${name}`;
    if (v.startsWith("*/")) return `every ${v.slice(2)} ${name}(s)`;
    if (v.includes(",")) return `at ${name}s ${v}`;
    if (v.includes("-")) return `from ${name} ${v}`;
    return `at ${name} ${v} (${ranges})`;
  };
  return [
    desc(m, "minute", "0-59"),
    desc(h, "hour", "0-23"),
    desc(dom, "day-of-month", "1-31"),
    desc(mo, "month", "1-12"),
    desc(dow, "day-of-week", "0-6, Sun=0"),
  ].join(", ");
}

export function CronExplainer() {
  const [expr, setExpr] = useState("*/15 9-17 * * 1-5");
  const presets: [string, string][] = [
    ["Every minute", "* * * * *"],
    ["Every 15 min", "*/15 * * * *"],
    ["Hourly", "0 * * * *"],
    ["Daily at 3am", "0 3 * * *"],
    ["Weekdays 9-5", "*/30 9-17 * * 1-5"],
    ["First of month", "0 0 1 * *"],
  ];
  return (
    <div className="space-y-4">
      <Field label="Cron expression">
        <Input
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          className="font-mono text-lg"
        />
      </Field>
      <Panel title="Explanation">
        <div className="p-4 text-sm">{explainCron(expr)}</div>
      </Panel>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Presets</div>
        <div className="flex flex-wrap gap-2">
          {presets.map(([name, val]) => (
            <Button key={val} size="sm" variant="outline" onClick={() => setExpr(val)}>
              {name}
              <span className="ml-2 font-mono text-xs text-muted-foreground">{val}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Meta Tag Generator ----------
export function MetaTagGenerator() {
  const [title, setTitle] = useState("My Awesome Site");
  const [desc, setDesc] = useState("A concise description of my site under 160 characters.");
  const [url, setUrl] = useState("https://example.com");
  const [image, setImage] = useState("https://example.com/og.png");
  const [twitter, setTwitter] = useState("@example");

  const html = `<title>${title}</title>
<meta name="description" content="${desc}" />
<link rel="canonical" href="${url}" />

<meta property="og:type" content="website" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${image}" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="${twitter}" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${desc}" />
<meta name="twitter:image" content="${image}" />`;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <Field label="Title" hint={`${title.length}/60`}>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Description" hint={`${desc.length}/160`}>
          <Textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />
        </Field>
        <Field label="Canonical URL">
          <Input value={url} onChange={(e) => setUrl(e.target.value)} />
        </Field>
        <Field label="Social image URL">
          <Input value={image} onChange={(e) => setImage(e.target.value)} />
        </Field>
        <Field label="Twitter handle">
          <Input value={twitter} onChange={(e) => setTwitter(e.target.value)} />
        </Field>
      </div>
      <Panel title="Generated tags" actions={<CopyButton text={html} />}>
        <pre className="p-4 font-mono text-xs whitespace-pre-wrap break-all">{html}</pre>
      </Panel>
    </div>
  );
}

// ---------- Slugify ----------
export function Slugify() {
  const [text, setText] = useState("Hello World! This is my — Article Title #1");
  const [sep, setSep] = useState("-");
  const [lower, setLower] = useState(true);
  const slug = useMemo(() => {
    let s = text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
    s = s
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, sep);
    return lower ? s.toLowerCase() : s;
  }, [text, sep, lower]);
  return (
    <div className="space-y-4">
      <Field label="Input">
        <Input value={text} onChange={(e) => setText(e.target.value)} />
      </Field>
      <div className="flex items-center gap-4">
        <Field label="Separator">
          <Input value={sep} onChange={(e) => setSep(e.target.value)} className="w-24 font-mono" />
        </Field>
        <label className="flex items-center gap-2 text-sm pt-5">
          <input
            type="checkbox"
            checked={lower}
            onChange={(e) => setLower(e.target.checked)}
            className="accent-foreground"
          />{" "}
          lowercase
        </label>
      </div>
      <Panel title="Slug" actions={<CopyButton text={slug} />}>
        <div className="p-4 font-mono text-lg break-all">{slug}</div>
      </Panel>
    </div>
  );
}

// ---------- Favicon (emoji) Generator ----------
export function FaviconGenerator() {
  const [emoji, setEmoji] = useState("🚀");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${emoji}</text></svg>`;
  const dataUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  const link = `<link rel="icon" href="${dataUrl}" />`;
  return (
    <div className="grid md:grid-cols-[240px_1fr] gap-6">
      <div className="space-y-3">
        <Field label="Emoji or character">
          <Input
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            className="text-2xl text-center"
          />
        </Field>
        <div className="rounded-xl border border-border bg-card p-6 grid place-items-center">
          <img src={dataUrl} alt="favicon preview" width={128} height={128} className="rounded" />
        </div>
        <a href={dataUrl} download={`favicon-${Date.now()}.svg`}>
          <Button className="w-full">Download SVG</Button>
        </a>
      </div>
      <Panel title="HTML" actions={<CopyButton text={link} />}>
        <pre className="p-4 font-mono text-xs whitespace-pre-wrap break-all">{link}</pre>
      </Panel>
    </div>
  );
}

// ---------- Image to Base64 ----------
export function ImageBase64() {
  const [data, setData] = useState("");
  const [name, setName] = useState("");
  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setName(f.name);
    const r = new FileReader();
    r.onload = () => setData(String(r.result || ""));
    r.readAsDataURL(f);
  }
  const cssBg = data ? `background-image: url("${data}");` : "";
  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={onFile}
        className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-foreground file:text-background file:px-3 file:py-1.5 file:text-sm file:cursor-pointer"
      />
      {data && (
        <div className="grid md:grid-cols-[240px_1fr] gap-4">
          <div className="rounded-xl border border-border p-3 bg-card grid place-items-center">
            <img src={data} alt={name} className="max-h-[220px] rounded" />
          </div>
          <div className="space-y-3">
            <Panel
              title={`Data URL — ${(data.length / 1024).toFixed(1)} KB`}
              actions={<CopyButton text={data} />}
            >
              <pre className="p-3 font-mono text-[10px] whitespace-pre-wrap break-all max-h-[180px] overflow-auto">
                {data}
              </pre>
            </Panel>
            <Panel title="CSS" actions={<CopyButton text={cssBg} />}>
              <pre className="p-3 font-mono text-xs whitespace-pre-wrap break-all">{cssBg}</pre>
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Timezone Converter ----------
const TZ = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Dhaka",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

export function TimezoneConverter() {
  const [dt, setDt] = useState(new Date().toISOString().slice(0, 16));
  const [from, setFrom] = useState("UTC");

  const baseDate = useMemo(() => {
    // Interpret dt as being in `from` tz — approximate via toLocaleString round-trip.
    const local = new Date(dt);
    if (Number.isNaN(local.getTime())) return null;
    const asFrom = new Date(local.toLocaleString("en-US", { timeZone: from }));
    const diff = local.getTime() - asFrom.getTime();
    return new Date(local.getTime() + diff);
  }, [dt, from]);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Date & time">
          <Input
            type="datetime-local"
            value={dt}
            onChange={(e) => setDt(e.target.value)}
            className="font-mono"
          />
        </Field>
        <Field label="From timezone">
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full h-9 rounded-md border border-border bg-transparent px-3 text-sm"
          >
            {TZ.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Panel title="Converted times">
        <div className="divide-y divide-border">
          {baseDate &&
            TZ.map((z) => {
              const s = baseDate.toLocaleString("en-US", {
                timeZone: z,
                dateStyle: "medium",
                timeStyle: "long",
              });
              return (
                <div
                  key={z}
                  className="grid grid-cols-[200px_1fr_auto] items-center gap-3 px-3 py-2"
                >
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {z}
                  </div>
                  <Mono className="text-sm">{s}</Mono>
                  <CopyButton text={s} />
                </div>
              );
            })}
        </div>
      </Panel>
    </div>
  );
}

// ---------- String Escape ----------
export function StringEscape() {
  const [text, setText] = useState(`Line 1\n"quoted"\tTab`);
  const jsonStr = JSON.stringify(text);
  const jsStr =
    '"' +
    text
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\t/g, "\\t")
      .replace(/\r/g, "\\r") +
    '"';
  const unescaped = (() => {
    try {
      return JSON.parse(text);
    } catch {
      return "(input must be a JSON string with quotes)";
    }
  })();
  return (
    <div className="space-y-4">
      <Field label="Input">
        <Textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="font-mono text-sm"
        />
      </Field>
      <div className="grid md:grid-cols-3 gap-4">
        <Panel title="JSON string" actions={<CopyButton text={jsonStr} />}>
          <pre className="p-3 font-mono text-xs whitespace-pre-wrap break-all min-h-[100px]">
            {jsonStr}
          </pre>
        </Panel>
        <Panel title="JS string" actions={<CopyButton text={jsStr} />}>
          <pre className="p-3 font-mono text-xs whitespace-pre-wrap break-all min-h-[100px]">
            {jsStr}
          </pre>
        </Panel>
        <Panel title="Unescape (JSON)" actions={<CopyButton text={String(unescaped)} />}>
          <pre className="p-3 font-mono text-xs whitespace-pre-wrap break-all min-h-[100px]">
            {String(unescaped)}
          </pre>
        </Panel>
      </div>
    </div>
  );
}
