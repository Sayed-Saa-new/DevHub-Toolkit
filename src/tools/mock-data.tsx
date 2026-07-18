import { useMemo, useState } from "react";
import { Plus, Trash2, RefreshCw, Shuffle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Panel, Field, CopyButton, DownloadButton } from "./primitives";

// ---------- Deterministic PRNG (mulberry32) ----------
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashSeed(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

// ---------- Data pools ----------
const FIRST = ["Ada","Alan","Grace","Linus","Ken","Guido","James","Bjarne","Dennis","Rob","Yukihiro","Rasmus","Anders","Brendan","Tim","Margaret","Barbara","Radia","Katherine","Hedy"];
const LAST = ["Lovelace","Turing","Hopper","Torvalds","Thompson","Rossum","Gosling","Stroustrup","Ritchie","Pike","Matsumoto","Lerdorf","Hejlsberg","Eich","Berners-Lee","Hamilton","Liskov","Perlman","Johnson","Lamarr"];
const DOMAINS = ["example.com","mail.io","devhub.dev","proton.me","fastmail.com"];
const COMPANIES = ["Vercel","Linear","Raycast","GitHub","Stripe","Figma","Notion","Cloudflare","Supabase","OpenAI"];
const CITIES = ["Tokyo","Berlin","Lisbon","Austin","Dhaka","Toronto","Amsterdam","Singapore","Nairobi","Barcelona"];
const COUNTRIES = ["Japan","Germany","Portugal","USA","Bangladesh","Canada","Netherlands","Singapore","Kenya","Spain"];
const WORDS = "the quick brown fox jumps over a lazy dog lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua".split(" ");
const JOBS = ["Software Engineer","Designer","Product Manager","Data Scientist","DevOps","Founder","CTO","Writer","Marketer","Researcher"];
const COLORS = ["red","blue","green","black","white","amber","violet","rose","emerald","slate"];

function pick<T>(r: () => number, arr: T[]): T { return arr[Math.floor(r() * arr.length)]; }
function intBetween(r: () => number, min: number, max: number) { return Math.floor(r() * (max - min + 1)) + min; }

// ---------- Field types ----------
type FieldType =
  | "uuid" | "autoIncrement" | "firstName" | "lastName" | "fullName"
  | "email" | "username" | "avatar" | "phone" | "company" | "jobTitle"
  | "city" | "country" | "streetAddress" | "zipCode"
  | "int" | "float" | "boolean" | "date" | "isoDate" | "timestamp"
  | "url" | "domain" | "ipv4" | "ipv6" | "userAgent" | "color" | "hexColor"
  | "sentence" | "paragraph" | "word" | "custom";

type Field = { id: string; name: string; type: FieldType; min?: number; max?: number; custom?: string };

const TYPE_GROUPS: { label: string; items: { value: FieldType; label: string }[] }[] = [
  { label: "Identifier", items: [
    { value: "uuid", label: "UUID v4" },
    { value: "autoIncrement", label: "Auto Increment" },
  ]},
  { label: "Person", items: [
    { value: "firstName", label: "First Name" },
    { value: "lastName", label: "Last Name" },
    { value: "fullName", label: "Full Name" },
    { value: "email", label: "Email" },
    { value: "username", label: "Username" },
    { value: "avatar", label: "Avatar URL" },
    { value: "phone", label: "Phone" },
    { value: "jobTitle", label: "Job Title" },
  ]},
  { label: "Company & Location", items: [
    { value: "company", label: "Company" },
    { value: "city", label: "City" },
    { value: "country", label: "Country" },
    { value: "streetAddress", label: "Street Address" },
    { value: "zipCode", label: "Zip Code" },
  ]},
  { label: "Numbers & Time", items: [
    { value: "int", label: "Integer (min/max)" },
    { value: "float", label: "Float (min/max)" },
    { value: "boolean", label: "Boolean" },
    { value: "date", label: "Date (YYYY-MM-DD)" },
    { value: "isoDate", label: "ISO 8601 DateTime" },
    { value: "timestamp", label: "Unix Timestamp" },
  ]},
  { label: "Web & Network", items: [
    { value: "url", label: "URL" },
    { value: "domain", label: "Domain" },
    { value: "ipv4", label: "IPv4" },
    { value: "ipv6", label: "IPv6" },
    { value: "userAgent", label: "User Agent" },
    { value: "color", label: "Color Name" },
    { value: "hexColor", label: "Hex Color" },
  ]},
  { label: "Text", items: [
    { value: "sentence", label: "Sentence" },
    { value: "paragraph", label: "Paragraph" },
    { value: "word", label: "Word" },
    { value: "custom", label: "Custom (comma list)" },
  ]},
];

function genValue(f: Field, r: () => number, i: number): unknown {
  switch (f.type) {
    case "uuid": {
      const b = Array.from({ length: 16 }, () => Math.floor(r() * 256));
      b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80;
      const hex = b.map((x) => x.toString(16).padStart(2, "0")).join("");
      return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
    }
    case "autoIncrement": return i + (f.min ?? 1);
    case "firstName": return pick(r, FIRST);
    case "lastName": return pick(r, LAST);
    case "fullName": return `${pick(r, FIRST)} ${pick(r, LAST)}`;
    case "email": return `${pick(r, FIRST).toLowerCase()}.${pick(r, LAST).toLowerCase()}${intBetween(r,1,99)}@${pick(r, DOMAINS)}`;
    case "username": return `${pick(r, FIRST).toLowerCase()}_${intBetween(r,10,9999)}`;
    case "avatar": return `https://i.pravatar.cc/128?u=${intBetween(r,1,10000)}`;
    case "phone": return `+${intBetween(r,1,99)} ${intBetween(r,100,999)}-${intBetween(r,100,999)}-${intBetween(r,1000,9999)}`;
    case "company": return pick(r, COMPANIES);
    case "jobTitle": return pick(r, JOBS);
    case "city": return pick(r, CITIES);
    case "country": return pick(r, COUNTRIES);
    case "streetAddress": return `${intBetween(r,1,9999)} ${pick(r, LAST)} St`;
    case "zipCode": return String(intBetween(r,10000,99999));
    case "int": return intBetween(r, f.min ?? 0, f.max ?? 100);
    case "float": {
      const min = f.min ?? 0, max = f.max ?? 1;
      return Number((r() * (max - min) + min).toFixed(2));
    }
    case "boolean": return r() > 0.5;
    case "date": {
      const d = new Date(Date.now() - intBetween(r,0,365*5) * 86400000);
      return d.toISOString().slice(0,10);
    }
    case "isoDate": return new Date(Date.now() - intBetween(r,0,365*5) * 86400000).toISOString();
    case "timestamp": return Math.floor((Date.now() - intBetween(r,0,365*5) * 86400000) / 1000);
    case "url": return `https://${pick(r, DOMAINS)}/${pick(r, WORDS)}/${intBetween(r,1,999)}`;
    case "domain": return pick(r, DOMAINS);
    case "ipv4": return `${intBetween(r,1,255)}.${intBetween(r,0,255)}.${intBetween(r,0,255)}.${intBetween(r,0,255)}`;
    case "ipv6": return Array.from({length:8}, () => intBetween(r,0,65535).toString(16)).join(":");
    case "userAgent": return `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/${intBetween(r,90,140)}.0.0.0 Safari/537.36`;
    case "color": return pick(r, COLORS);
    case "hexColor": return "#" + intBetween(r,0,0xffffff).toString(16).padStart(6,"0");
    case "word": return pick(r, WORDS);
    case "sentence": {
      const n = intBetween(r, 5, 12);
      const s = Array.from({length:n}, () => pick(r, WORDS)).join(" ");
      return s[0].toUpperCase() + s.slice(1) + ".";
    }
    case "paragraph": {
      return Array.from({length: intBetween(r,3,6)}, () => {
        const n = intBetween(r, 6, 14);
        const s = Array.from({length:n}, () => pick(r, WORDS)).join(" ");
        return s[0].toUpperCase() + s.slice(1) + ".";
      }).join(" ");
    }
    case "custom": {
      const opts = (f.custom ?? "").split(",").map((s) => s.trim()).filter(Boolean);
      return opts.length ? pick(r, opts) : "";
    }
  }
}

// ---------- Serializers ----------
function toJSON(rows: Record<string, unknown>[]) { return JSON.stringify(rows, null, 2); }
function csvEscape(v: unknown) {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function toCSV(rows: Record<string, unknown>[], fields: Field[]) {
  const header = fields.map((f) => f.name).join(",");
  const body = rows.map((r) => fields.map((f) => csvEscape(r[f.name])).join(",")).join("\n");
  return `${header}\n${body}`;
}
function toSQL(rows: Record<string, unknown>[], fields: Field[], table = "mock_data") {
  const cols = fields.map((f) => `"${f.name}"`).join(", ");
  const lines = rows.map((r) => {
    const values = fields.map((f) => {
      const v = r[f.name];
      if (v === null || v === undefined) return "NULL";
      if (typeof v === "number" || typeof v === "boolean") return String(v);
      return `'${String(v).replace(/'/g, "''")}'`;
    }).join(", ");
    return `INSERT INTO ${table} (${cols}) VALUES (${values});`;
  });
  return lines.join("\n");
}
function toTS(rows: Record<string, unknown>[]) { return `export const data = ${JSON.stringify(rows, null, 2)} as const;\n`; }
function toXML(rows: Record<string, unknown>[]) {
  const esc = (s: string) => s.replace(/[<>&]/g, (c) => ({ "<":"&lt;",">":"&gt;","&":"&amp;" }[c]!));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rows>\n${rows.map((r) =>
    `  <row>\n${Object.entries(r).map(([k,v]) => `    <${k}>${esc(String(v ?? ""))}</${k}>`).join("\n")}\n  </row>`
  ).join("\n")}\n</rows>`;
}

type Format = "json" | "csv" | "sql" | "ts" | "xml";
const FORMAT_META: Record<Format, { ext: string; mime: string; label: string }> = {
  json: { ext: "json", mime: "application/json", label: "JSON" },
  csv:  { ext: "csv",  mime: "text/csv", label: "CSV" },
  sql:  { ext: "sql",  mime: "application/sql", label: "SQL" },
  ts:   { ext: "ts",   mime: "text/typescript", label: "TypeScript" },
  xml:  { ext: "xml",  mime: "application/xml", label: "XML" },
};

const uid = () => Math.random().toString(36).slice(2, 9);

const DEFAULT_FIELDS: Field[] = [
  { id: uid(), name: "id", type: "uuid" },
  { id: uid(), name: "name", type: "fullName" },
  { id: uid(), name: "email", type: "email" },
  { id: uid(), name: "age", type: "int", min: 18, max: 65 },
  { id: uid(), name: "active", type: "boolean" },
  { id: uid(), name: "createdAt", type: "isoDate" },
];

export function MockData() {
  const [fields, setFields] = useState<Field[]>(DEFAULT_FIELDS);
  const [count, setCount] = useState(25);
  const [seed, setSeed] = useState("devhub");
  const [format, setFormat] = useState<Format>("json");
  const [tableName, setTableName] = useState("mock_data");

  const rows = useMemo(() => {
    const r = rng(hashSeed(seed || "seed"));
    const safeCount = Math.min(Math.max(1, count | 0), 5000);
    return Array.from({ length: safeCount }, (_, i) => {
      const row: Record<string, unknown> = {};
      for (const f of fields) if (f.name.trim()) row[f.name.trim()] = genValue(f, r, i);
      return row;
    });
  }, [fields, count, seed]);

  const output = useMemo(() => {
    switch (format) {
      case "json": return toJSON(rows);
      case "csv":  return toCSV(rows, fields);
      case "sql":  return toSQL(rows, fields, tableName || "mock_data");
      case "ts":   return toTS(rows);
      case "xml":  return toXML(rows);
    }
  }, [rows, format, fields, tableName]);

  function updateField(id: string, patch: Partial<Field>) {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }
  function removeField(id: string) { setFields((prev) => prev.filter((f) => f.id !== id)); }
  function addField() { setFields((prev) => [...prev, { id: uid(), name: `field_${prev.length + 1}`, type: "word" }]); }
  function reseed() { setSeed(Math.random().toString(36).slice(2, 10)); }

  const meta = FORMAT_META[format];

  return (
    <div className="space-y-4">
      <Panel
        title="Schema"
        actions={<Button size="sm" variant="ghost" onClick={addField} className="h-7 gap-1.5 text-xs"><Plus className="size-3" /> Add field</Button>}
      >
        <div className="divide-y divide-border">
          {fields.map((f) => (
            <FieldRow key={f.id} field={f} onChange={(p) => updateField(f.id, p)} onRemove={() => removeField(f.id)} />
          ))}
          {fields.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">Add a field to start generating data.</div>
          )}
        </div>
      </Panel>

      <div className="grid gap-3 md:grid-cols-3">
        <Field label="Rows" hint="1 — 5000">
          <Input type="number" min={1} max={5000} value={count} onChange={(e) => setCount(Number(e.target.value))} />
        </Field>
        <Field label="Seed" hint="deterministic">
          <div className="flex gap-1.5">
            <Input value={seed} onChange={(e) => setSeed(e.target.value)} />
            <Button variant="outline" size="icon" onClick={reseed} aria-label="Randomize seed"><Shuffle className="size-4" /></Button>
          </div>
        </Field>
        {format === "sql" ? (
          <Field label="Table name">
            <Input value={tableName} onChange={(e) => setTableName(e.target.value)} />
          </Field>
        ) : (
          <Field label="Preview">
            <div className="flex h-9 items-center rounded-md border border-border bg-muted/30 px-3 text-xs text-muted-foreground font-mono">
              {rows.length} rows · {new Blob([output]).size.toLocaleString()} B
            </div>
          </Field>
        )}
      </div>

      <Panel
        title={`Output · ${meta.label}`}
        actions={
          <div className="flex items-center gap-1">
            <CopyButton text={output} />
            <DownloadButton filename={`mock-data.${meta.ext}`} content={output} mime={meta.mime} />
            <Button variant="ghost" size="sm" onClick={reseed} className="h-7 gap-1.5 text-xs"><RefreshCw className="size-3" /> Regenerate</Button>
          </div>
        }
      >
        <div className="px-3 pt-3">
          <Tabs value={format} onValueChange={(v) => setFormat(v as Format)}>
            <TabsList className="h-8">
              {(Object.keys(FORMAT_META) as Format[]).map((k) => (
                <TabsTrigger key={k} value={k} className="h-6 px-2.5 text-xs">{FORMAT_META[k].label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <Textarea readOnly value={output} className="min-h-[320px] rounded-none border-0 border-t border-border bg-background font-mono text-xs mt-3" />
      </Panel>
    </div>
  );
}

function FieldRow({ field, onChange, onRemove }: { field: Field; onChange: (p: Partial<Field>) => void; onRemove: () => void }) {
  const needsRange = field.type === "int" || field.type === "float";
  const needsCustom = field.type === "custom";
  return (
    <div className="grid grid-cols-12 gap-2 p-2.5 items-center">
      <Input
        className="col-span-4 md:col-span-3 h-8 text-sm"
        value={field.name}
        onChange={(e) => onChange({ name: e.target.value })}
        placeholder="field name"
      />
      <div className="col-span-6 md:col-span-4">
        <Select value={field.type} onValueChange={(v) => onChange({ type: v as FieldType })}>
          <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            {TYPE_GROUPS.map((g) => (
              <div key={g.label}>
                <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">{g.label}</div>
                {g.items.map((it) => (
                  <SelectItem key={it.value} value={it.value} className="text-sm">{it.label}</SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-12 md:col-span-4 flex gap-1.5">
        {needsRange && (
          <>
            <Input type="number" placeholder="min" className="h-8 text-sm" value={field.min ?? ""} onChange={(e) => onChange({ min: e.target.value === "" ? undefined : Number(e.target.value) })} />
            <Input type="number" placeholder="max" className="h-8 text-sm" value={field.max ?? ""} onChange={(e) => onChange({ max: e.target.value === "" ? undefined : Number(e.target.value) })} />
          </>
        )}
        {needsCustom && (
          <Input placeholder="apple, banana, cherry" className="h-8 text-sm" value={field.custom ?? ""} onChange={(e) => onChange({ custom: e.target.value })} />
        )}
        {!needsRange && !needsCustom && <div className="hidden md:block flex-1" />}
      </div>
      <Button variant="ghost" size="icon" onClick={onRemove} className="col-span-2 md:col-span-1 h-8 w-8 justify-self-end text-muted-foreground hover:text-destructive" aria-label="Remove field">
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

// unused imports guard
void Label;
