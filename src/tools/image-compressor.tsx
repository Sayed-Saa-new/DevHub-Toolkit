import { useCallback, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { Panel, Field } from "./primitives";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, X, Image as ImageIcon, RefreshCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Format = "auto" | "image/jpeg" | "image/webp" | "image/png";

type Row = {
  id: string;
  name: string;
  file: File;
  originalSize: number;
  originalUrl: string;
  outSize?: number;
  outUrl?: string;
  outBlob?: Blob;
  outType?: string;
  status: "queued" | "processing" | "done" | "error";
  error?: string;
};

function human(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function extFor(type: string | undefined, fallback: string) {
  if (!type) return fallback;
  if (type.includes("webp")) return "webp";
  if (type.includes("jpeg")) return "jpg";
  if (type.includes("png")) return "png";
  return fallback;
}

function resolveOutType(format: Format, sourceType: string): string {
  if (format !== "auto") return format;
  // Preserve source type when it's a lossy/lossless format we support.
  if (sourceType === "image/png") return "image/png";
  if (sourceType === "image/webp") return "image/webp";
  return "image/jpeg";
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export function ImageCompressor() {
  const [rows, setRows] = useState<Row[]>([]);
  const [quality, setQuality] = useState(0.75);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxSizeMB, setMaxSizeMB] = useState(1);
  const [format, setFormat] = useState<Format>("auto");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const compressRows = useCallback(
    async (ids: string[], sourceRows: Row[]) => {
      setBusy(true);
      for (const id of ids) {
        const row = sourceRows.find((r) => r.id === id);
        if (!row) continue;
        setRows((r) =>
          r.map((x) =>
            x.id === id
              ? {
                  ...x,
                  status: "processing",
                  error: undefined,
                  outUrl: undefined,
                  outBlob: undefined,
                  outSize: undefined,
                }
              : x,
          ),
        );
        try {
          const outType = resolveOutType(format, row.file.type);
          const compressed = await imageCompression(row.file, {
            maxSizeMB,
            maxWidthOrHeight: maxWidth,
            initialQuality: quality,
            useWebWorker: true,
            fileType: outType,
          });
          const url = URL.createObjectURL(compressed);
          setRows((r) =>
            r.map((x) => {
              if (x.id !== id) return x;
              if (x.outUrl) URL.revokeObjectURL(x.outUrl);
              return {
                ...x,
                status: "done",
                outBlob: compressed,
                outSize: compressed.size,
                outUrl: url,
                outType,
              };
            }),
          );
        } catch (err) {
          setRows((r) =>
            r.map((x) =>
              x.id === id
                ? { ...x, status: "error", error: err instanceof Error ? err.message : "Failed" }
                : x,
            ),
          );
        }
      }
      setBusy(false);
    },
    [format, maxSizeMB, maxWidth, quality],
  );

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (!list.length) return;
      const next: Row[] = list.map((f) => ({
        id: crypto.randomUUID(),
        name: f.name,
        file: f,
        originalSize: f.size,
        originalUrl: URL.createObjectURL(f),
        status: "queued",
      }));
      setRows((r) => [...r, ...next]);
      void compressRows(
        next.map((n) => n.id),
        next,
      );
    },
    [compressRows],
  );

  const recompressAll = useCallback(() => {
    if (!rows.length) return;
    void compressRows(
      rows.map((r) => r.id),
      rows,
    );
  }, [rows, compressRows]);

  const remove = (id: string) => {
    setRows((r) => {
      const row = r.find((x) => x.id === id);
      if (row) {
        URL.revokeObjectURL(row.originalUrl);
        if (row.outUrl) URL.revokeObjectURL(row.outUrl);
      }
      return r.filter((x) => x.id !== id);
    });
  };

  const clearAll = () => {
    for (const row of rows) {
      URL.revokeObjectURL(row.originalUrl);
      if (row.outUrl) URL.revokeObjectURL(row.outUrl);
    }
    setRows([]);
  };

  const download = (row: Row) => {
    if (!row.outBlob) return;
    const a = document.createElement("a");
    a.href = row.outUrl!;
    const base = row.name.replace(/\.[^.]+$/, "");
    a.download = `${base}.min.${extFor(row.outType, "jpg")}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const downloadAll = async () => {
    for (const row of rows) {
      if (row.status === "done") {
        download(row);
        // Stagger so browsers don't block subsequent downloads.
        await sleep(180);
      }
    }
  };

  const totalIn = rows.reduce((s, r) => s + r.originalSize, 0);
  const totalOut = rows.reduce((s, r) => s + (r.outSize ?? 0), 0);
  const saved = totalIn > 0 && totalOut > 0 ? Math.round((1 - totalOut / totalIn) * 100) : 0;

  return (
    <div className="space-y-4">
      <Panel
        title="Settings"
        actions={
          rows.length > 0 ? (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 gap-1.5 text-xs"
              onClick={recompressAll}
              disabled={busy}
            >
              <RefreshCw className={cn("size-3", busy && "animate-spin")} /> Re-compress all
            </Button>
          ) : null
        }
      >
        <div className="grid gap-4 p-3 md:grid-cols-4">
          <Field label="Quality" hint={`${Math.round(quality * 100)}%`}>
            <Slider
              min={0.1}
              max={1}
              step={0.05}
              value={[quality]}
              onValueChange={(v) => setQuality(v[0])}
            />
          </Field>
          <Field label="Max width/height (px)">
            <Input
              type="number"
              min={16}
              value={maxWidth}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                setMaxWidth(Number.isFinite(v) && v > 0 ? v : 1920);
              }}
            />
          </Field>
          <Field label="Max size (MB)">
            <Input
              type="number"
              step="0.1"
              min={0.05}
              value={maxSizeMB}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setMaxSizeMB(Number.isFinite(v) && v > 0 ? v : 1);
              }}
            />
          </Field>
          <Field label="Output format">
            <Tabs value={format} onValueChange={(v) => setFormat(v as Format)}>
              <TabsList className="h-8">
                <TabsTrigger value="auto" className="text-xs">
                  Auto
                </TabsTrigger>
                <TabsTrigger value="image/jpeg" className="text-xs">
                  JPEG
                </TabsTrigger>
                <TabsTrigger value="image/webp" className="text-xs">
                  WebP
                </TabsTrigger>
                <TabsTrigger value="image/png" className="text-xs">
                  PNG
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </Field>
        </div>
        {format === "image/png" && (
          <div className="border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
            PNG output is lossless — the quality slider is ignored. Use JPEG or WebP for stronger
            compression.
          </div>
        )}
      </Panel>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/40 p-8 text-center cursor-pointer transition-colors hover:bg-card",
        )}
      >
        <Upload className="size-6 text-muted-foreground" />
        <div className="text-sm font-medium">Drop images here or click to upload</div>
        <div className="text-xs text-muted-foreground">
          JPEG · PNG · WebP · GIF · AVIF — batch supported, runs 100% locally
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            // Reset so re-selecting the same file re-triggers change.
            e.target.value = "";
          }}
        />
      </div>

      {rows.length > 0 && (
        <Panel
          title={`Files (${rows.length})`}
          actions={
            <>
              <div className="text-[11px] text-muted-foreground mr-2">
                {human(totalIn)} → {human(totalOut)} · saved {saved}%
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 gap-1.5 text-xs"
                onClick={downloadAll}
                disabled={busy}
              >
                <Download className="size-3" /> Download all
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 gap-1.5 text-xs"
                onClick={clearAll}
                disabled={busy}
              >
                <Trash2 className="size-3" /> Clear
              </Button>
            </>
          }
        >
          <ul className="divide-y divide-border">
            {rows.map((row) => {
              const pct =
                row.outSize != null && row.originalSize
                  ? Math.round((1 - row.outSize / row.originalSize) * 100)
                  : 0;
              const grew = pct < 0;
              return (
                <li key={row.id} className="flex items-center gap-3 p-3">
                  <div className="size-12 shrink-0 overflow-hidden rounded-md border border-border bg-muted/30 flex items-center justify-center">
                    {row.outUrl || row.originalUrl ? (
                      <img
                        src={row.outUrl ?? row.originalUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="size-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{row.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {human(row.originalSize)}
                      {row.outSize != null && (
                        <>
                          {" → "}
                          <span className="text-foreground">{human(row.outSize)}</span>{" "}
                          <span
                            className={cn(
                              grew
                                ? "text-amber-500"
                                : pct > 0
                                  ? "text-emerald-500"
                                  : "text-muted-foreground",
                            )}
                          >
                            ({grew ? `+${Math.abs(pct)}%` : pct > 0 ? `-${pct}%` : "0%"})
                          </span>
                        </>
                      )}
                      {row.status === "processing" && <span className="ml-1">· compressing…</span>}
                      {row.status === "error" && (
                        <span className="ml-1 text-red-500">· {row.error}</span>
                      )}
                    </div>
                    {row.status === "done" && grew && (
                      <div className="text-[10px] text-amber-500/90 mt-0.5">
                        Already smaller than target — try a lower quality or smaller max width.
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 gap-1.5 text-xs"
                    disabled={row.status !== "done"}
                    onClick={() => download(row)}
                  >
                    <Download className="size-3" /> Save
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => remove(row.id)}
                  >
                    <X className="size-3" />
                  </Button>
                </li>
              );
            })}
          </ul>
        </Panel>
      )}
    </div>
  );
}
