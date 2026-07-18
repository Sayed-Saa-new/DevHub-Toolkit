import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, CheckCircle2, ChevronRight, XCircle, Loader2, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Panel, Field, CopyButton } from "./primitives";
import { fetchHtml } from "@/lib/fetch-html.functions";
import { cn } from "@/lib/utils";

type Severity = "error" | "warning" | "info";
type Issue = { severity: Severity; type: string; message: string };
type Block = {
  index: number;
  raw: string;
  parsed: unknown;
  parseError?: string;
  items: ParsedItem[];
};
type ParsedItem = {
  type: string | string[];
  data: Record<string, unknown>;
  issues: Issue[];
};

// Minimum required properties for common Rich-Results-eligible types.
// Source: developers.google.com/search/docs/appearance/structured-data
const REQUIRED: Record<string, string[]> = {
  Article: ["headline", "author", "datePublished"],
  NewsArticle: ["headline", "author", "datePublished"],
  BlogPosting: ["headline", "author", "datePublished"],
  Product: ["name"],
  Recipe: ["name", "image", "recipeIngredient", "recipeInstructions"],
  Event: ["name", "startDate", "location"],
  Organization: ["name"],
  LocalBusiness: ["name", "address"],
  WebSite: ["name", "url"],
  WebPage: ["name"],
  BreadcrumbList: ["itemListElement"],
  FAQPage: ["mainEntity"],
  HowTo: ["name", "step"],
  VideoObject: ["name", "thumbnailUrl", "uploadDate"],
  SoftwareApplication: ["name", "applicationCategory", "operatingSystem"],
  Person: ["name"],
  Review: ["author", "reviewRating"],
  AggregateRating: ["ratingValue", "reviewCount"],
  Offer: ["price", "priceCurrency"],
};

function extractJsonLdBlocks(html: string): string[] {
  const blocks: string[] = [];
  const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html)) !== null) blocks.push(m[1].trim());
  return blocks;
}

function typeOf(node: unknown): string | string[] {
  if (node && typeof node === "object" && "@type" in node) {
    const t = (node as Record<string, unknown>)["@type"];
    if (typeof t === "string" || Array.isArray(t)) return t as string | string[];
  }
  return "Unknown";
}

function validateItem(node: Record<string, unknown>): Issue[] {
  const issues: Issue[] = [];
  if (!node["@context"]) {
    issues.push({ severity: "warning", type: "missing-context", message: "Missing @context (should be https://schema.org)" });
  } else if (typeof node["@context"] === "string" && !/schema\.org/i.test(node["@context"])) {
    issues.push({ severity: "warning", type: "context", message: `@context is "${node["@context"]}" — expected schema.org` });
  }
  const t = node["@type"];
  if (!t) {
    issues.push({ severity: "error", type: "missing-type", message: "Missing @type" });
    return issues;
  }
  const types = Array.isArray(t) ? t : [t];
  for (const typeName of types) {
    const required = REQUIRED[String(typeName)];
    if (required) {
      for (const key of required) {
        if (!(key in node) || node[key] === "" || node[key] === null) {
          issues.push({
            severity: "error",
            type: "missing-required",
            message: `${typeName}: required property "${key}" is missing`,
          });
        }
      }
    }
  }
  // URL sanity
  for (const [k, v] of Object.entries(node)) {
    if (typeof v === "string" && (k === "url" || k === "image" || k === "logo") && v && !/^https?:\/\//i.test(v)) {
      issues.push({ severity: "warning", type: "relative-url", message: `"${k}" is not an absolute URL: ${v}` });
    }
  }
  return issues;
}

function flattenGraph(parsed: unknown): Record<string, unknown>[] {
  if (!parsed) return [];
  if (Array.isArray(parsed)) return parsed.flatMap(flattenGraph);
  if (typeof parsed === "object") {
    const obj = parsed as Record<string, unknown>;
    if (Array.isArray(obj["@graph"])) {
      const rest = { ...obj };
      delete rest["@graph"];
      const parent = Object.keys(rest).length > 1 ? [rest] : [];
      return [...parent, ...(obj["@graph"] as unknown[]).flatMap(flattenGraph)];
    }
    return [obj];
  }
  return [];
}

function parseBlock(raw: string, index: number): Block {
  try {
    const parsed = JSON.parse(raw);
    const items: ParsedItem[] = flattenGraph(parsed).map((node) => ({
      type: typeOf(node),
      data: node,
      issues: validateItem(node),
    }));
    return { index, raw, parsed, items };
  } catch (e) {
    return { index, raw, parsed: null, parseError: (e as Error).message, items: [] };
  }
}

export function SchemaValidator() {
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [scannedUrl, setScannedUrl] = useState<string | null>(null);
  const fetchHtmlFn = useServerFn(fetchHtml);

  async function analyzeUrl() {
    setLoading(true);
    setErr(null);
    setBlocks([]);
    setScannedUrl(null);
    try {
      const { html, finalUrl } = await fetchHtmlFn({ data: { url: url.trim() } });
      const raws = extractJsonLdBlocks(html);
      setBlocks(raws.map((r, i) => parseBlock(r, i)));
      setScannedUrl(finalUrl);
      if (raws.length === 0) setErr("No JSON-LD (<script type=\"application/ld+json\">) blocks found on the page.");
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function analyzeSource() {
    setErr(null);
    setScannedUrl(null);
    const text = source.trim();
    if (!text) return setBlocks([]);
    // Support raw HTML OR a bare JSON-LD payload
    const raws = text.includes("<script") ? extractJsonLdBlocks(text) : [text];
    if (raws.length === 0) {
      setBlocks([]);
      setErr("No JSON-LD blocks detected in the pasted source.");
      return;
    }
    setBlocks(raws.map((r, i) => parseBlock(r, i)));
  }

  const allItems = blocks.flatMap((b) => b.items);
  const totals = {
    items: allItems.length,
    errors: allItems.reduce((s, i) => s + i.issues.filter((x) => x.severity === "error").length, 0),
    warnings: allItems.reduce((s, i) => s + i.issues.filter((x) => x.severity === "warning").length, 0),
    parseErrors: blocks.filter((b) => b.parseError).length,
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="url">
        <TabsList>
          <TabsTrigger value="url">Fetch URL</TabsTrigger>
          <TabsTrigger value="paste">Paste HTML / JSON-LD</TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="space-y-3 mt-3">
          <Field label="Page URL" hint="We fetch the page server-side and extract JSON-LD">
            <div className="flex gap-2">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/page"
                onKeyDown={(e) => e.key === "Enter" && !loading && url && analyzeUrl()}
              />
              <Button onClick={analyzeUrl} disabled={loading || !url.trim()}>
                {loading ? <Loader2 className="size-4 animate-spin" /> : "Test"}
              </Button>
            </div>
          </Field>
        </TabsContent>

        <TabsContent value="paste" className="space-y-3 mt-3">
          <Field label="HTML source or raw JSON-LD">
            <Textarea
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder={`<script type="application/ld+json">{ ... }</script>\n\nor paste JSON directly`}
              className="min-h-48 font-mono text-xs"
            />
          </Field>
          <Button onClick={analyzeSource} disabled={!source.trim()}>Validate</Button>
        </TabsContent>
      </Tabs>

      {err && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive flex items-start gap-2">
          <AlertTriangle className="size-4 mt-0.5 shrink-0" />
          <div>{err}</div>
        </div>
      )}

      {blocks.length > 0 && (
        <>
          <Panel title="Summary">
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Stat label="Detected items" value={totals.items} />
              <Stat label="Errors" value={totals.errors} tone={totals.errors ? "error" : "ok"} />
              <Stat label="Warnings" value={totals.warnings} tone={totals.warnings ? "warn" : "ok"} />
              <Stat label="Parse errors" value={totals.parseErrors} tone={totals.parseErrors ? "error" : "ok"} />
            </div>
            {scannedUrl && (
              <div className="px-4 pb-3 -mt-2 text-xs text-muted-foreground flex items-center gap-1">
                <ExternalLink className="size-3" />
                <a href={scannedUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4 truncate">
                  {scannedUrl}
                </a>
              </div>
            )}
          </Panel>

          <div className="space-y-3">
            {blocks.map((b) => (
              <BlockCard key={b.index} block={b} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, tone = "ok" }: { label: string; value: number; tone?: "ok" | "warn" | "error" }) {
  const toneClass =
    tone === "error" ? "text-destructive" : tone === "warn" ? "text-amber-500" : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-background/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("text-2xl font-semibold tabular-nums mt-1", toneClass)}>{value}</div>
    </div>
  );
}

function BlockCard({ block }: { block: Block }) {
  const title = block.parseError
    ? `Block #${block.index + 1} — Invalid JSON`
    : `Block #${block.index + 1} — ${block.items.length} item${block.items.length === 1 ? "" : "s"}`;
  return (
    <Panel title={title} actions={<CopyButton text={block.raw} label="Copy" />}>
      {block.parseError ? (
        <div className="p-4 text-sm text-destructive flex items-start gap-2">
          <XCircle className="size-4 mt-0.5 shrink-0" />
          <div className="font-mono">{block.parseError}</div>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {block.items.map((item, i) => (
            <ItemView key={i} item={item} />
          ))}
        </div>
      )}
    </Panel>
  );
}

function ItemView({ item }: { item: ParsedItem }) {
  const [open, setOpen] = useState(true);
  const types = Array.isArray(item.type) ? item.type : [item.type];
  const errs = item.issues.filter((i) => i.severity === "error").length;
  const warns = item.issues.filter((i) => i.severity === "warning").length;
  const ok = errs === 0 && warns === 0;

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-3 hover:bg-muted/30 text-left"
      >
        <ChevronRight className={cn("size-4 text-muted-foreground transition", open && "rotate-90")} />
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          {types.map((t) => (
            <Badge key={t} variant="outline" className="font-mono text-[10px]">{t}</Badge>
          ))}
          {ok ? (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-500">
              <CheckCircle2 className="size-3.5" /> Valid
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 text-xs">
              {errs > 0 && (
                <span className="inline-flex items-center gap-1 text-destructive">
                  <XCircle className="size-3.5" /> {errs} error{errs === 1 ? "" : "s"}
                </span>
              )}
              {warns > 0 && (
                <span className="inline-flex items-center gap-1 text-amber-500">
                  <AlertTriangle className="size-3.5" /> {warns} warning{warns === 1 ? "" : "s"}
                </span>
              )}
            </span>
          )}
        </div>
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-3">
          {item.issues.length > 0 && (
            <ul className="space-y-1 text-xs">
              {item.issues.map((iss, idx) => (
                <li
                  key={idx}
                  className={cn(
                    "flex items-start gap-2 rounded border px-2 py-1.5",
                    iss.severity === "error"
                      ? "border-destructive/40 bg-destructive/5 text-destructive"
                      : "border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400",
                  )}
                >
                  {iss.severity === "error" ? <XCircle className="size-3.5 mt-0.5 shrink-0" /> : <AlertTriangle className="size-3.5 mt-0.5 shrink-0" />}
                  <span>{iss.message}</span>
                </li>
              ))}
            </ul>
          )}
          <pre className="text-xs font-mono bg-muted/30 rounded-lg p-3 overflow-auto max-h-96 border border-border">
            {JSON.stringify(item.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}