import { useCallback, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { Panel, Field } from "./primitives";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Format = "auto" | "image/jpeg" | "image/webp" | "image/png";

type Row = {
  id: string;
  name: string;
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

export function ImageCompressor() {
  const [rows, setRows] = useState<Row[]>([]);
  const [quality, setQuality] = useState(0.75);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxSizeMB, setMaxSizeMB] = useState(1);
  const [format, setFormat] = useState<Format>("auto");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const next: Row[] = list.map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      originalSize: f.size,
      originalUrl: URL.createObjectURL(f),
      status: "queued",
    }));
    setRows((r) => [...r, ...next]);
    // Kick off compression
    void (async () => {
      setBusy(true);
      for (let i = 0; i < list.length; i++) {
        const file = list[i];
        const id = next[i].id;
        setRows((r) => r.map((x) => (x.id === id ? { ...x, status: "processing" } : x)));
        try {
          const outType =
            format === "auto"
              ? file.type === "image/png"
                ? "image/png"
                : "image/jpeg"
              : format;
          const compressed = await imageCompression(file, {
            maxSizeMB,
            maxWidthOrHeight: maxWidth,
            initialQuality: quality,
            useWebWorker: true,
            fileType: outType,
          });
          const url = URL.createObjectURL(compressed);
          setRows((r) =>
            r.map((x) =>
              x.id === id
                ? { ...x, status: "done", outBlob: compressed, outSize: compressed.size, outUrl: url, outType }
                : x
            )
          );
        } catch (err) {
          setRows((r) =>
            r.map((x) =>
              x.id === id ? { ...x, status: "error", error: err instanceof Error ? err.message : "Failed" } : x
            )
          );
        }
      }
      setBusy(false);
    })();
  }, [format, maxSizeMB, maxWidth, quality]);

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

  const download = (row: Row) => {
    if (!row.outBlob) return;
    const a = document.createElement("a");
    a.href = row.outUrl!;
    const base = row.name.replace(/\.[^.]+$/, "");
    a.download = `${base}.min.${extFor(row.outType, "jpg")}`;
    a.click();
  };

  const downloadAll = async () => {
    for (const row of rows) if (row.status === "done") download(row);
  };

  const totalIn = rows.reduce((s, r) => s + r.originalSize, 0);
  const totalOut = rows.reduce((s, r) => s + (r.outSize ?? 0), 0);
  const saved = totalIn > 0 && totalOut > 0 ? Math.round((1 - totalOut / totalIn) * 100) : 0;

  return (
    <div className="space-y-4">
      <Panel title="Settings">
        <div className="grid gap-4 p-3 md:grid-cols-4">
          <Field label="Quality" hint={`${Math.round(quality * 100)}%`}>
            <Slider min={0.1} max={1} step={0.05} value={[quality]} onValueChange={(v) => setQuality(v[0])} />
          </Field>
          <Field label="Max width/height (px)">
            <Input type="number" value={maxWidth} onChange={(e) => setMaxWidth(+e.target.value || 1920)} />
          </Field>
          <Field label="Max size (MB)">
            <Input type="number" step="0.1" value={maxSizeMB} onChange={(e) => setMaxSizeMB(+e.target.value || 1)} />
          </Field>
          <Field label="Output format">
            <Tabs value={format} onValueChange={(v) => setFormat(v as Format)}>
              <TabsList className="h-8">
                <TabsTrigger value="auto" className="text-xs">Auto</TabsTrigger>
                <TabsTrigger value="image/jpeg" className="text-xs">JPEG</TabsTrigger>
                <TabsTrigger value="image/webp" className="text-xs">WebP</TabsTrigger>
                <TabsTrigger value="image/png" className="text-xs">PNG</TabsTrigger>
              </TabsList>
            </Tabs>
          </Field>
        </div>
      </Panel>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/40 p-8 text-center cursor-pointer transition-colors hover:bg-card"
        )}
      >
        <Upload className="size-6 text-muted-foreground" />
        <div className="text-sm font-medium">Drop images here or click to upload</div>
        <div className="text-xs text-muted-foreground">JPEG · PNG · WebP · GIF · AVIF — batch supported, runs 100% locally</div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
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
              <Button size="sm" variant="ghost" className="h-7 gap-1.5 text-xs" onClick={downloadAll} disabled={busy}>
                <Download className="size-3" /> Download all
              </Button>
            </>
          }
        >
          <ul className="divide-y divide-border">
            {rows.map((row) => {
              const pct =
                row.outSize && row.originalSize
                  ? Math.round((1 - row.outSize / row.originalSize) * 100)
                  : 0;
              return (
                <li key={row.id} className="flex items-center gap-3 p-3">
                  <div className="size-12 shrink-0 overflow-hidden rounded-md border border-border bg-muted/30 flex items-center justify-center">
                    {row.outUrl || row.originalUrl ? (
                      <img src={row.outUrl ?? row.originalUrl} alt="" className="h-full w-full object-cover" />
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
                          <span className={cn(pct > 0 ? "text-emerald-500" : "text-muted-foreground")}>
                            ({pct > 0 ? `-${pct}%` : `+${Math.abs(pct)}%`})
                          </span>
                        </>
                      )}
                      {row.status === "processing" && <span className="ml-1">· compressing…</span>}
                      {row.status === "error" && <span className="ml-1 text-red-500">· {row.error}</span>}
                    </div>
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
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => remove(row.id)}>
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _label = Label; // keep import stable if needed elsewhere