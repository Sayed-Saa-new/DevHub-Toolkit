import { useCallback, useMemo, useRef, useState } from "react";
import mammoth from "mammoth/mammoth.browser";
import TurndownService from "turndown";
import { marked } from "marked";
import JSZip from "jszip";
import {
  FileText,
  Upload,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Download,
  Package,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import { CopyButton, Field, Panel } from "./primitives";
import { copyToClipboard, downloadFile } from "@/lib/utils";

type BulletMarker = "-" | "*" | "+";
type HeadingStyle = "atx" | "setext";
type ImageMode = "inline" | "skip" | "placeholder";

type JobStatus = "queued" | "running" | "done" | "error";

type Job = {
  id: string;
  file: File;
  size: number;
  status: JobStatus;
  progress: number;
  markdown?: string;
  html?: string;
  warnings?: string[];
  error?: string;
  images?: number;
  wordCount?: number;
  durationMs?: number;
};

const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50 MB per file
const MAX_TOTAL_BYTES = 150 * 1024 * 1024; // 150 MB combined

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function baseName(name: string) {
  return name.replace(/\.docx?$/i, "");
}

function makeTurndown(opts: {
  bullet: BulletMarker;
  heading: HeadingStyle;
  gfm: boolean;
}) {
  const svc = new TurndownService({
    headingStyle: opts.heading,
    bulletListMarker: opts.bullet,
    codeBlockStyle: "fenced",
    fence: "```",
    emDelimiter: "_",
    strongDelimiter: "**",
    linkStyle: "inlined",
  });
  svc.remove(["script", "style", "noscript"]);
  if (opts.gfm) {
    svc.addRule("strikethrough", {
      filter: ["del", "s"],
      replacement: (c) => `~~${c}~~`,
    });
    svc.addRule("table", {
      filter: "table",
      replacement: (_c, node) => {
        const table = node as HTMLTableElement;
        const rows = Array.from(table.rows);
        if (!rows.length) return "";
        const cells = rows.map((r) =>
          Array.from(r.cells).map((c) =>
            (c.textContent ?? "").trim().replace(/\|/g, "\\|").replace(/\n+/g, " "),
          ),
        );
        const width = Math.max(...cells.map((r) => r.length));
        cells.forEach((r) => {
          while (r.length < width) r.push("");
        });
        const head = cells[0];
        const body = cells.slice(1);
        const sep = new Array(width).fill("---");
        return `\n\n| ${head.join(" | ")} |\n| ${sep.join(" | ")} |\n${body
          .map((r) => `| ${r.join(" | ")} |`)
          .join("\n")}\n\n`;
      },
    });
  }
  return svc;
}

export function DocxToMarkdown() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [preview, setPreview] = useState<"markdown" | "rendered">("markdown");
  const [previewHtml, setPreviewHtml] = useState("");
  const [running, setRunning] = useState(false);

  // Options
  const [bullet, setBullet] = useState<BulletMarker>("-");
  const [heading, setHeading] = useState<HeadingStyle>("atx");
  const [gfm, setGfm] = useState(true);
  const [imageMode, setImageMode] = useState<ImageMode>("inline");
  const [preserveStyles, setPreserveStyles] = useState(true);

  const dropRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalBytes = useMemo(
    () => jobs.reduce((n, j) => n + j.size, 0),
    [jobs],
  );
  const active = jobs.find((j) => j.id === activeId) ?? null;

  // Update rendered preview whenever active markdown changes / preview mode toggles
  useMemo(() => {
    if (!active?.markdown) {
      setPreviewHtml("");
      return;
    }
    (async () => setPreviewHtml(String(await marked.parse(active.markdown!))))();
  }, [active?.markdown]);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const list = Array.from(files);
      const accepted: Job[] = [];
      let currentTotal = totalBytes;
      for (const f of list) {
        const isDocx = /\.docx$/i.test(f.name);
        if (!isDocx) {
          toast.error(`${f.name}: not a .docx file (legacy .doc not supported)`);
          continue;
        }
        if (f.size > MAX_FILE_BYTES) {
          toast.error(`${f.name}: ${formatBytes(f.size)} exceeds 50 MB limit`);
          continue;
        }
        if (currentTotal + f.size > MAX_TOTAL_BYTES) {
          toast.error(`Total batch would exceed 150 MB — skipping ${f.name}`);
          continue;
        }
        currentTotal += f.size;
        accepted.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file: f,
          size: f.size,
          status: "queued",
          progress: 0,
        });
      }
      if (accepted.length) {
        setJobs((prev) => {
          const next = [...prev, ...accepted];
          if (!activeId) setActiveId(accepted[0].id);
          return next;
        });
        toast.success(`Added ${accepted.length} file${accepted.length > 1 ? "s" : ""}`);
      }
    },
    [activeId, totalBytes],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dropRef.current?.classList.remove("ring-2", "ring-foreground/40");
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  async function convertOne(job: Job): Promise<Job> {
    const start = performance.now();
    try {
      const buffer = await job.file.arrayBuffer();
      let imageCount = 0;
      const convertImage =
        imageMode === "skip"
          ? mammoth.images.imgElement(() => Promise.resolve({ src: "" }))
          : imageMode === "placeholder"
          ? mammoth.images.imgElement((img) => {
              imageCount++;
              const alt = (img as unknown as { altText?: string }).altText ?? `image-${imageCount}`;
              return Promise.resolve({ src: `#image-${imageCount}`, alt });
            })
          : mammoth.images.imgElement(async (img) => {
              imageCount++;
              const data = await img.read("base64");
              return { src: `data:${img.contentType};base64,${data}` };
            });

      const result = await mammoth.convertToHtml(
        { arrayBuffer: buffer },
        {
          convertImage,
          styleMap: preserveStyles
            ? [
                "p[style-name='Title'] => h1:fresh",
                "p[style-name='Subtitle'] => h2:fresh",
                "p[style-name='Quote'] => blockquote:fresh",
                "p[style-name='Intense Quote'] => blockquote:fresh",
                "p[style-name='Code'] => pre:fresh",
                "r[style-name='Code Char'] => code",
              ]
            : undefined,
        },
      );

      // Post-process: strip empty <img src=""> when skipping
      let html = result.value as string;
      if (imageMode === "skip") {
        html = html.replace(/<img[^>]*src=""[^>]*>/g, "");
      }

      const svc = makeTurndown({ bullet, heading, gfm });
      const markdown = svc.turndown(html).trim() + "\n";
      const wordCount = markdown.trim().split(/\s+/).filter(Boolean).length;

      return {
        ...job,
        status: "done",
        progress: 100,
        html,
        markdown,
        warnings: (result.messages ?? []).map((m: { message: string }) => m.message),
        images: imageCount,
        wordCount,
        durationMs: performance.now() - start,
      };
    } catch (e) {
      return {
        ...job,
        status: "error",
        progress: 100,
        error: (e as Error).message || "Conversion failed",
        durationMs: performance.now() - start,
      };
    }
  }

  async function runAll() {
    if (running) return;
    const queue = jobs.filter((j) => j.status === "queued" || j.status === "error");
    if (!queue.length) return;
    setRunning(true);
    for (const j of queue) {
      setJobs((prev) =>
        prev.map((p) => (p.id === j.id ? { ...p, status: "running", progress: 20 } : p)),
      );
      // Yield to browser so UI updates
      await new Promise((r) => setTimeout(r, 30));
      const done = await convertOne(j);
      setJobs((prev) => prev.map((p) => (p.id === j.id ? done : p)));
      if (!activeId || activeId === j.id) setActiveId(done.id);
    }
    setRunning(false);
    toast.success("All files converted");
  }

  function removeJob(id: string) {
    setJobs((prev) => {
      const next = prev.filter((j) => j.id !== id);
      if (activeId === id) setActiveId(next[0]?.id ?? null);
      return next;
    });
  }

  function clearAll() {
    setJobs([]);
    setActiveId(null);
  }

  async function downloadZip() {
    const done = jobs.filter((j) => j.status === "done" && j.markdown);
    if (!done.length) {
      toast.error("Nothing converted yet");
      return;
    }
    const zip = new JSZip();
    const seen = new Map<string, number>();
    for (const j of done) {
      let name = `${baseName(j.file.name)}.md`;
      const c = seen.get(name) ?? 0;
      if (c > 0) name = `${baseName(j.file.name)}-${c}.md`;
      seen.set(name, c + 1);
      zip.file(name, j.markdown!);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    downloadFile("markdown-batch.zip", blob, "application/zip");
    toast.success(`Zipped ${done.length} file${done.length > 1 ? "s" : ""}`);
  }

  const doneCount = jobs.filter((j) => j.status === "done").length;
  const errCount = jobs.filter((j) => j.status === "error").length;

  return (
    <div className="space-y-4">
      {/* Options bar */}
      <div className="rounded-xl border border-border bg-card p-3 flex flex-wrap items-end gap-3">
        <Field label="Bullet">
          <Select value={bullet} onValueChange={(v) => setBullet(v as BulletMarker)}>
            <SelectTrigger className="h-9 w-20"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="-">- dash</SelectItem>
              <SelectItem value="*">* star</SelectItem>
              <SelectItem value="+">+ plus</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Heading style">
          <Select value={heading} onValueChange={(v) => setHeading(v as HeadingStyle)}>
            <SelectTrigger className="h-9 w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="atx"># ATX</SelectItem>
              <SelectItem value="setext">Setext ===</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Images">
          <Select value={imageMode} onValueChange={(v) => setImageMode(v as ImageMode)}>
            <SelectTrigger className="h-9 w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="inline">Inline base64</SelectItem>
              <SelectItem value="placeholder">Placeholder refs</SelectItem>
              <SelectItem value="skip">Skip images</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Switch checked={gfm} onCheckedChange={setGfm} /> GFM tables & strike
        </label>
        <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Switch checked={preserveStyles} onCheckedChange={setPreserveStyles} /> Map Word styles
        </label>
        <div className="ml-auto flex items-center gap-2">
          <Button
            onClick={runAll}
            disabled={running || jobs.every((j) => j.status === "done")}
            size="sm"
            className="h-8 gap-1.5"
          >
            {running ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
            Convert {jobs.filter((j) => j.status !== "done").length || "all"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadZip}
            disabled={doneCount < 2}
            className="h-8 gap-1.5"
          >
            <Package className="size-3.5" /> ZIP ({doneCount})
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            disabled={!jobs.length}
            className="h-8 gap-1.5"
          >
            <Trash2 className="size-3.5" /> Clear
          </Button>
        </div>
      </div>

      {/* Dropzone */}
      <div
        ref={dropRef}
        onDragOver={(e) => {
          e.preventDefault();
          dropRef.current?.classList.add("ring-2", "ring-foreground/40");
        }}
        onDragLeave={() => dropRef.current?.classList.remove("ring-2", "ring-foreground/40")}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className="rounded-xl border-2 border-dashed border-border bg-card/40 p-6 text-center cursor-pointer hover:bg-card transition"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <Upload className="size-8 mx-auto text-muted-foreground mb-2" />
        <div className="text-sm font-medium">Drop .docx files or click to browse</div>
        <div className="text-xs text-muted-foreground mt-1">
          Up to 50 MB per file, 150 MB total. 100% client-side — files never leave your browser.
        </div>
        {jobs.length > 0 && (
          <div className="mt-3 flex items-center justify-center gap-3 text-[11px] font-mono text-muted-foreground">
            <span>{jobs.length} file{jobs.length > 1 ? "s" : ""}</span>
            <span>{formatBytes(totalBytes)}</span>
            {doneCount > 0 && <span className="text-emerald-500">✓ {doneCount} done</span>}
            {errCount > 0 && <span className="text-red-500">✗ {errCount} failed</span>}
          </div>
        )}
      </div>

      {jobs.length > 0 && (
        <div className="grid lg:grid-cols-[280px_1fr] gap-4">
          {/* File list */}
          <Panel title="Files">
            <div className="max-h-[540px] overflow-auto divide-y divide-border">
              {jobs.map((j) => (
                <button
                  key={j.id}
                  onClick={() => setActiveId(j.id)}
                  className={`w-full text-left px-3 py-2.5 flex items-center gap-2 hover:bg-muted/30 transition ${
                    activeId === j.id ? "bg-muted/50" : ""
                  }`}
                >
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{j.file.name}</div>
                    <div className="text-[10px] font-mono text-muted-foreground flex items-center gap-1.5">
                      <span>{formatBytes(j.size)}</span>
                      {j.status === "done" && j.wordCount != null && (
                        <span>· {j.wordCount.toLocaleString()} words</span>
                      )}
                      {j.status === "done" && j.images != null && j.images > 0 && (
                        <span>· {j.images} img</span>
                      )}
                    </div>
                  </div>
                  {j.status === "running" && <Loader2 className="size-3.5 animate-spin text-muted-foreground shrink-0" />}
                  {j.status === "done" && <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />}
                  {j.status === "error" && <AlertCircle className="size-3.5 text-red-500 shrink-0" />}
                  {j.status === "queued" && (
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 font-mono">
                      queued
                    </Badge>
                  )}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeJob(j.id);
                    }}
                    className="opacity-40 hover:opacity-100 transition p-0.5 -mr-1"
                    aria-label={`Remove ${j.file.name}`}
                  >
                    <Trash2 className="size-3" />
                  </span>
                </button>
              ))}
            </div>
          </Panel>

          {/* Preview */}
          <Panel
            title={
              active
                ? `${active.file.name}${active.durationMs ? ` — ${(active.durationMs / 1000).toFixed(2)}s` : ""}`
                : "Select a file"
            }
            actions={
              active?.markdown ? (
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
                  <CopyButton text={active.markdown} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      downloadFile(`${baseName(active.file.name)}.md`, active.markdown!, "text/markdown")
                    }
                    className="h-7 gap-1.5 text-xs"
                  >
                    <Download className="size-3" /> .md
                  </Button>
                </>
              ) : null
            }
          >
            {!active ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                Select a file from the list.
              </div>
            ) : active.status === "error" ? (
              <div className="p-4 text-sm space-y-2">
                <div className="flex items-center gap-2 text-red-500 font-medium">
                  <AlertCircle className="size-4" /> Conversion failed
                </div>
                <pre className="p-3 rounded-md bg-muted/50 text-xs font-mono whitespace-pre-wrap">
                  {active.error}
                </pre>
              </div>
            ) : active.status !== "done" ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                {active.status === "running" ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" /> Converting…
                  </span>
                ) : (
                  <>Click <strong>Convert</strong> to process this file.</>
                )}
              </div>
            ) : preview === "markdown" ? (
              <pre
                className="p-4 font-mono text-sm whitespace-pre-wrap break-words min-h-[440px] max-h-[560px] overflow-auto"
                onDoubleClick={() => active.markdown && copyToClipboard(active.markdown)}
              >
                {active.markdown}
              </pre>
            ) : (
              <div
                className="p-4 md-preview min-h-[440px] max-h-[560px] overflow-auto text-sm"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            )}

            {active?.warnings && active.warnings.length > 0 && (
              <div className="border-t border-border p-3 text-[11px] text-muted-foreground max-h-32 overflow-auto space-y-0.5">
                <div className="font-medium mb-1">
                  {active.warnings.length} conversion notice{active.warnings.length > 1 ? "s" : ""}:
                </div>
                {active.warnings.slice(0, 12).map((w, i) => (
                  <div key={i} className="font-mono">· {w}</div>
                ))}
                {active.warnings.length > 12 && (
                  <div className="italic">…and {active.warnings.length - 12} more</div>
                )}
              </div>
            )}
          </Panel>
        </div>
      )}

      <div className="text-xs text-muted-foreground text-center">
        Powered by <span className="font-mono">mammoth.js</span> + <span className="font-mono">turndown</span>.
        Everything runs in your browser — no uploads, no accounts.
      </div>

      <style>{`.md-preview h1{font-size:1.5rem;font-weight:600;margin:.75rem 0}.md-preview h2{font-size:1.2rem;font-weight:600;margin:.75rem 0}.md-preview h3{font-size:1.05rem;font-weight:600;margin:.6rem 0}.md-preview p{margin:.5rem 0;line-height:1.6}.md-preview ul{list-style:disc;margin:.5rem 0 .5rem 1.25rem}.md-preview ol{list-style:decimal;margin:.5rem 0 .5rem 1.25rem}.md-preview code{background:oklch(1 0 0/8%);padding:.1rem .35rem;border-radius:.25rem;font-family:var(--font-mono)}.md-preview pre{background:oklch(1 0 0/6%);padding:.75rem;border-radius:.5rem;overflow:auto;font-family:var(--font-mono);font-size:.85rem;margin:.5rem 0}.md-preview a{text-decoration:underline;text-underline-offset:3px}.md-preview img{max-width:100%;border-radius:.375rem;margin:.5rem 0}.md-preview table{border-collapse:collapse;margin:.5rem 0}.md-preview th,.md-preview td{border:1px solid oklch(1 0 0/12%);padding:.35rem .6rem}.md-preview blockquote{border-left:3px solid oklch(1 0 0/20%);padding-left:.75rem;color:oklch(1 0 0/70%);margin:.5rem 0}`}</style>
    </div>
  );
}