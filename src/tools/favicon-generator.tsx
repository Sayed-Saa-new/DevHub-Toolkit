import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Download, Upload, RefreshCw, ImagePlus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { downloadFile } from "@/lib/utils";

import { Field, Panel, CopyButton } from "./primitives";

const PNG_SIZES = [16, 32, 48, 64, 96, 128, 180, 192, 256, 384, 512] as const;
const ICO_SIZES = [16, 32, 48] as const;

type Mode = "image" | "text";
type Shape = "square" | "rounded" | "circle";

const FONT_STACKS: { id: string; label: string; css: string }[] = [
  { id: "sans", label: "Sans", css: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" },
  { id: "serif", label: "Serif", css: "Georgia, 'Times New Roman', serif" },
  { id: "mono", label: "Mono", css: "'JetBrains Mono', 'SF Mono', Consolas, monospace" },
  { id: "display", label: "Display", css: "'Space Grotesk', 'Inter', sans-serif" },
];

async function buildIco(pngBlobs: { size: number; blob: Blob }[]): Promise<Blob> {
  const entries = await Promise.all(
    pngBlobs.map(async ({ size, blob }) => ({
      size,
      data: new Uint8Array(await blob.arrayBuffer()),
    })),
  );
  const header = 6;
  const dirSize = 16 * entries.length;
  let offset = header + dirSize;
  const total = offset + entries.reduce((s, e) => s + e.data.length, 0);
  const buf = new ArrayBuffer(total);
  const view = new DataView(buf);
  const bytes = new Uint8Array(buf);

  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, entries.length, true);

  entries.forEach((e, i) => {
    const o = header + i * 16;
    view.setUint8(o + 0, e.size >= 256 ? 0 : e.size);
    view.setUint8(o + 1, e.size >= 256 ? 0 : e.size);
    view.setUint8(o + 2, 0);
    view.setUint8(o + 3, 0);
    view.setUint16(o + 4, 1, true);
    view.setUint16(o + 6, 32, true);
    view.setUint32(o + 8, e.data.length, true);
    view.setUint32(o + 12, offset, true);
    bytes.set(e.data, offset);
    offset += e.data.length;
  });

  return new Blob([buf], { type: "image/x-icon" });
}

function canvasToBlob(canvas: HTMLCanvasElement, type = "image/png"): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Canvas export failed"))), type);
  });
}

type RenderOpts = {
  size: number;
  mode: Mode;
  shape: Shape;
  bg: string;
  fg: string;
  padding: number;
  radius: number;
  text: string;
  fontStack: string;
  fontWeight: number;
  image?: HTMLImageElement | null;
  transparent: boolean;
};

function drawFavicon(canvas: HTMLCanvasElement, o: RenderOpts) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = o.size;
  canvas.height = o.size;
  ctx.clearRect(0, 0, o.size, o.size);

  ctx.save();
  const r =
    o.shape === "circle" ? o.size / 2 : o.shape === "rounded" ? (o.radius / 100) * o.size : 0;
  if (r > 0) {
    ctx.beginPath();
    const x = 0,
      y = 0,
      w = o.size,
      h = o.size;
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.clip();
  }

  if (!o.transparent) {
    ctx.fillStyle = o.bg;
    ctx.fillRect(0, 0, o.size, o.size);
  }

  const pad = (o.padding / 100) * o.size;
  const inner = o.size - pad * 2;

  if (o.mode === "image" && o.image) {
    const img = o.image;
    const ratio = Math.min(inner / img.width, inner / img.height);
    const w = img.width * ratio;
    const h = img.height * ratio;
    ctx.drawImage(img, (o.size - w) / 2, (o.size - h) / 2, w, h);
  } else if (o.mode === "text") {
    const text = (o.text || "").slice(0, 3);
    ctx.fillStyle = o.fg;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let fs = inner;
    ctx.font = `${o.fontWeight} ${fs}px ${o.fontStack}`;
    while (fs > 8 && ctx.measureText(text).width > inner) {
      fs -= 2;
      ctx.font = `${o.fontWeight} ${fs}px ${o.fontStack}`;
    }
    ctx.fillText(text, o.size / 2, o.size / 2 + fs * 0.04);
  }

  ctx.restore();
}

export function FaviconGenerator() {
  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("D");
  const [bg, setBg] = useState("#0a0a0a");
  const [fg, setFg] = useState("#ffffff");
  const [shape, setShape] = useState<Shape>("rounded");
  const [radius, setRadius] = useState(22);
  const [padding, setPadding] = useState(12);
  const [fontStack, setFontStack] = useState(FONT_STACKS[3].css);
  const [fontWeight, setFontWeight] = useState(700);
  const [transparent, setTransparent] = useState(false);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [imgName, setImgName] = useState<string>("");
  const [siteName, setSiteName] = useState("My App");
  const [themeColor, setThemeColor] = useState("#0a0a0a");
  const [building, setBuilding] = useState(false);

  const previewRefs = useRef<Record<number, HTMLCanvasElement | null>>({});
  const previewSizes = [16, 32, 64, 180, 512];

  const opts: Omit<RenderOpts, "size"> = useMemo(
    () => ({
      mode,
      shape,
      bg,
      fg,
      padding,
      radius,
      text,
      fontStack,
      fontWeight,
      image: img,
      transparent,
    }),
    [mode, shape, bg, fg, padding, radius, text, fontStack, fontWeight, img, transparent],
  );

  useEffect(() => {
    for (const size of previewSizes) {
      const c = previewRefs.current[size];
      if (c) drawFavicon(c, { ...opts, size });
    }
  }, [opts]);

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setImg(image);
      setImgName(file.name);
      setMode("image");
      URL.revokeObjectURL(url);
    };
    image.src = url;
  };

  const clearImage = () => {
    setImg(null);
    setImgName("");
    setMode("text");
  };

  const renderPng = async (size: number): Promise<Blob> => {
    const c = document.createElement("canvas");
    drawFavicon(c, { ...opts, size });
    return canvasToBlob(c, "image/png");
  };

  const downloadOne = async (size: number) => {
    const blob = await renderPng(size);
    downloadFile(`favicon-${size}x${size}.png`, blob, "image/png");
  };

  const downloadIco = async () => {
    const pngs = await Promise.all(
      ICO_SIZES.map(async (s) => ({ size: s, blob: await renderPng(s) })),
    );
    const ico = await buildIco(pngs);
    downloadFile("favicon.ico", ico, "image/x-icon");
  };

  const htmlSnippet = useMemo(
    () =>
      `<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="${themeColor}" />`,
    [themeColor],
  );

  const downloadZip = async () => {
    setBuilding(true);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      const icoPngs = await Promise.all(
        ICO_SIZES.map(async (s) => ({ size: s, blob: await renderPng(s) })),
      );
      const ico = await buildIco(icoPngs);
      zip.file("favicon.ico", ico);
      for (const s of PNG_SIZES) {
        const b = await renderPng(s);
        const name =
          s === 180
            ? "apple-touch-icon.png"
            : s === 192
              ? "android-chrome-192x192.png"
              : s === 512
                ? "android-chrome-512x512.png"
                : `favicon-${s}x${s}.png`;
        zip.file(name, b);
      }
      zip.file(
        "site.webmanifest",
        JSON.stringify(
          {
            name: siteName,
            short_name: siteName,
            icons: [
              { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
              { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
            ],
            theme_color: themeColor,
            background_color: transparent ? "#ffffff" : bg,
            display: "standalone",
          },
          null,
          2,
        ),
      );
      zip.file("html-snippet.html", htmlSnippet);
      zip.file(
        "README.txt",
        "Favicon pack generated with DevHub Toolkit.\nDrop these files into your site root, then paste the html-snippet.html contents into <head>.\n",
      );
      const blob = await zip.generateAsync({ type: "blob" });
      downloadFile("favicons.zip", blob, "application/zip");
    } finally {
      setBuilding(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-4">
      <div className="space-y-4">
        <Panel
          title="Live preview"
          actions={
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 text-xs"
              onClick={() => {
                setText("D");
                setBg("#0a0a0a");
                setFg("#ffffff");
                setShape("rounded");
                setRadius(22);
                setPadding(12);
                setTransparent(false);
                clearImage();
              }}
            >
              <RefreshCw className="size-3" /> Reset
            </Button>
          }
        >
          <div className="p-6 flex flex-wrap items-end gap-6 justify-center bg-[repeating-conic-gradient(#111_0%_25%,#0a0a0a_0%_50%)] bg-[length:20px_20px]">
            {previewSizes.map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <canvas
                  ref={(el) => {
                    previewRefs.current[s] = el;
                  }}
                  style={{
                    width: Math.min(s, 128),
                    height: Math.min(s, 128),
                    imageRendering: s <= 32 ? "pixelated" : "auto",
                  }}
                  className="rounded-sm ring-1 ring-white/10"
                />
                <span className="text-[10px] font-mono text-white/60">{s}px</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="In the browser tab">
          <div className="p-4 bg-muted/20">
            <div className="inline-flex items-center gap-2 rounded-t-md bg-background border border-b-0 border-border px-3 py-2 text-xs max-w-full">
              <BrowserTabIcon opts={opts} />
              <span className="truncate">{siteName || "My App"}</span>
              <span className="text-muted-foreground">×</span>
            </div>
          </div>
        </Panel>

        <Panel title="HTML snippet" actions={<CopyButton text={htmlSnippet} />}>
          <pre className="p-3 text-xs font-mono overflow-x-auto whitespace-pre">{htmlSnippet}</pre>
        </Panel>
      </div>

      <div className="space-y-3">
        <Panel title="Export">
          <div className="p-3 space-y-2">
            <Button className="w-full gap-2" onClick={downloadZip} disabled={building}>
              <Download className="size-4" />
              {building ? "Packing…" : "Download favicon pack (.zip)"}
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={downloadIco}>
                favicon.ico
              </Button>
              <Button variant="outline" size="sm" onClick={() => downloadOne(512)}>
                512×512 PNG
              </Button>
              <Button variant="outline" size="sm" onClick={() => downloadOne(180)}>
                apple-touch-icon
              </Button>
              <Button variant="outline" size="sm" onClick={() => downloadOne(32)}>
                32×32 PNG
              </Button>
            </div>
          </div>
        </Panel>

        <Panel title="Source">
          <div className="p-3 space-y-3">
            <div className="grid grid-cols-2 gap-1 rounded-md border border-border p-1">
              <button
                onClick={() => setMode("text")}
                className={`text-xs h-7 rounded ${mode === "text" ? "bg-foreground text-background" : "hover:bg-accent"}`}
              >
                Text
              </button>
              <button
                onClick={() => setMode("image")}
                className={`text-xs h-7 rounded ${mode === "image" ? "bg-foreground text-background" : "hover:bg-accent"}`}
              >
                Image
              </button>
            </div>

            {mode === "text" ? (
              <>
                <Field label="Letters" hint="1–3 chars">
                  <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={3}
                    className="h-8"
                  />
                </Field>
                <Field label="Font">
                  <select
                    value={fontStack}
                    onChange={(e) => setFontStack(e.target.value)}
                    className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
                  >
                    {FONT_STACKS.map((f) => (
                      <option key={f.id} value={f.css}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={`Weight — ${fontWeight}`}>
                  <Slider
                    min={300}
                    max={900}
                    step={100}
                    value={[fontWeight]}
                    onValueChange={(v) => setFontWeight(v[0])}
                  />
                </Field>
              </>
            ) : (
              <>
                <label className="flex items-center justify-center gap-2 h-20 rounded-md border border-dashed border-border cursor-pointer hover:bg-accent/40 text-xs text-muted-foreground">
                  {img ? <ImagePlus className="size-4" /> : <Upload className="size-4" />}
                  {img ? `Replace — ${imgName}` : "Upload PNG / SVG / JPG"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    onChange={onFile}
                    className="hidden"
                  />
                </label>
                {img && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full gap-1.5 text-xs h-7"
                    onClick={clearImage}
                  >
                    <Trash2 className="size-3" /> Remove image
                  </Button>
                )}
              </>
            )}
          </div>
        </Panel>

        <Panel title="Style">
          <div className="p-3 space-y-3">
            <Field label="Shape">
              <div className="grid grid-cols-3 gap-1 rounded-md border border-border p-1">
                {(["square", "rounded", "circle"] as Shape[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setShape(s)}
                    className={`text-xs h-7 rounded capitalize ${shape === s ? "bg-foreground text-background" : "hover:bg-accent"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Field>
            {shape === "rounded" && (
              <Field label={`Corner radius — ${radius}%`}>
                <Slider
                  min={0}
                  max={50}
                  step={1}
                  value={[radius]}
                  onValueChange={(v) => setRadius(v[0])}
                />
              </Field>
            )}
            <Field label={`Padding — ${padding}%`}>
              <Slider
                min={0}
                max={40}
                step={1}
                value={[padding]}
                onValueChange={(v) => setPadding(v[0])}
              />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Background">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bg}
                    onChange={(e) => setBg(e.target.value)}
                    className="h-8 w-10 rounded border border-input bg-transparent"
                    disabled={transparent}
                  />
                  <Input
                    value={bg}
                    onChange={(e) => setBg(e.target.value)}
                    className="h-8 font-mono text-xs"
                    disabled={transparent}
                  />
                </div>
              </Field>
              <Field label="Foreground">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fg}
                    onChange={(e) => setFg(e.target.value)}
                    className="h-8 w-10 rounded border border-input bg-transparent"
                  />
                  <Input
                    value={fg}
                    onChange={(e) => setFg(e.target.value)}
                    className="h-8 font-mono text-xs"
                  />
                </div>
              </Field>
            </div>
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={transparent}
                onChange={(e) => setTransparent(e.target.checked)}
                className="size-3.5"
              />
              Transparent background
            </label>
          </div>
        </Panel>

        <Panel title="Manifest">
          <div className="p-3 space-y-3">
            <Field label="Site name">
              <Input
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="h-8"
              />
            </Field>
            <Field label="Theme color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="h-8 w-10 rounded border border-input bg-transparent"
                />
                <Input
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="h-8 font-mono text-xs"
                />
              </div>
            </Field>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function BrowserTabIcon({ opts }: { opts: Omit<RenderOpts, "size"> }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (ref.current) drawFavicon(ref.current, { ...opts, size: 16 });
  }, [opts]);
  return <canvas ref={ref} style={{ width: 16, height: 16, imageRendering: "pixelated" }} />;
}
