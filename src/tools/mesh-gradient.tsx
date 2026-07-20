import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Panel, Field, CopyButton } from "./primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Shuffle, Download, Eye, RotateCcw } from "lucide-react";
import { downloadFile } from "@/lib/utils";

type Point = { id: string; x: number; y: number; color: string; size: number };

type Fx = {
  blur: number;        // px, 0-80
  grain: number;       // 0-100 opacity
  grainScale: number;  // 0.3 - 2 baseFrequency
  grainBlend: "overlay" | "soft-light" | "multiply" | "screen" | "normal";
  vignette: number;    // 0-100
  brightness: number;  // 50-150
  contrast: number;    // 50-200
  saturate: number;    // 0-200
  hue: number;         // -180..180
  aspect: "16/9" | "1/1" | "4/3" | "21/9" | "9/16" | "3/4";
};

const DEFAULT_FX: Fx = {
  blur: 0,
  grain: 0,
  grainScale: 0.9,
  grainBlend: "overlay",
  vignette: 0,
  brightness: 100,
  contrast: 100,
  saturate: 100,
  hue: 0,
  aspect: "16/9",
};

const ASPECTS: Record<Fx["aspect"], { w: number; h: number; cls: string }> = {
  "16/9": { w: 1600, h: 900, cls: "aspect-[16/9]" },
  "1/1": { w: 1200, h: 1200, cls: "aspect-square" },
  "4/3": { w: 1600, h: 1200, cls: "aspect-[4/3]" },
  "21/9": { w: 2100, h: 900, cls: "aspect-[21/9]" },
  "9/16": { w: 900, h: 1600, cls: "aspect-[9/16]" },
  "3/4": { w: 1200, h: 1600, cls: "aspect-[3/4]" },
};

function filterString(fx: Fx) {
  const parts: string[] = [];
  if (fx.brightness !== 100) parts.push(`brightness(${fx.brightness}%)`);
  if (fx.contrast !== 100) parts.push(`contrast(${fx.contrast}%)`);
  if (fx.saturate !== 100) parts.push(`saturate(${fx.saturate}%)`);
  if (fx.hue !== 0) parts.push(`hue-rotate(${fx.hue}deg)`);
  if (fx.blur > 0) parts.push(`blur(${fx.blur}px)`);
  return parts.join(" ");
}

const PRESETS: { name: string; base: string; points: Omit<Point, "id">[] }[] = [
  {
    name: "Aurora",
    base: "#0b0b12",
    points: [
      { x: 15, y: 20, color: "#8b5cf6", size: 60 },
      { x: 85, y: 15, color: "#ec4899", size: 55 },
      { x: 25, y: 85, color: "#3b82f6", size: 70 },
      { x: 80, y: 80, color: "#06b6d4", size: 60 },
    ],
  },
  {
    name: "Sunset",
    base: "#1a0b0b",
    points: [
      { x: 10, y: 30, color: "#f97316", size: 65 },
      { x: 90, y: 20, color: "#eab308", size: 55 },
      { x: 30, y: 90, color: "#ef4444", size: 70 },
      { x: 75, y: 70, color: "#f43f5e", size: 60 },
    ],
  },
  {
    name: "Mint",
    base: "#f8fafc",
    points: [
      { x: 20, y: 25, color: "#10b981", size: 55 },
      { x: 80, y: 30, color: "#06b6d4", size: 60 },
      { x: 40, y: 80, color: "#a7f3d0", size: 70 },
      { x: 85, y: 85, color: "#22d3ee", size: 55 },
    ],
  },
  {
    name: "Peach",
    base: "#fff7ed",
    points: [
      { x: 15, y: 20, color: "#fda4af", size: 60 },
      { x: 85, y: 25, color: "#fdba74", size: 60 },
      { x: 25, y: 85, color: "#fbcfe8", size: 65 },
      { x: 80, y: 80, color: "#fde68a", size: 60 },
    ],
  },
  {
    name: "Monochrome",
    base: "#050505",
    points: [
      { x: 20, y: 20, color: "#404040", size: 65 },
      { x: 80, y: 30, color: "#737373", size: 55 },
      { x: 30, y: 85, color: "#171717", size: 70 },
      { x: 85, y: 75, color: "#525252", size: 60 },
    ],
  },
  {
    name: "Vaporwave",
    base: "#0f0524",
    points: [
      { x: 20, y: 25, color: "#ff71ce", size: 60 },
      { x: 80, y: 20, color: "#01cdfe", size: 55 },
      { x: 30, y: 85, color: "#05ffa1", size: 70 },
      { x: 85, y: 80, color: "#b967ff", size: 60 },
    ],
  },
];

const uid = () => Math.random().toString(36).slice(2, 9);
const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const randHex = () => "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");

function buildCss(points: Point[], base: string) {
  const layers = points
    .map((p) => `radial-gradient(at ${p.x}% ${p.y}%, ${p.color} 0px, transparent ${p.size}%)`)
    .join(",\n    ");
  return `background-color: ${base};\nbackground-image:\n    ${layers};`;
}

function buildStyle(points: Point[], base: string): React.CSSProperties {
  return {
    backgroundColor: base,
    backgroundImage: points
      .map((p) => `radial-gradient(at ${p.x}% ${p.y}%, ${p.color} 0px, transparent ${p.size}%)`)
      .join(", "),
  };
}

function makeRandom(count = 4): { base: string; points: Point[] } {
  const dark = Math.random() > 0.5;
  const base = dark ? "#0a0a0a" : "#fafafa";
  const points: Point[] = Array.from({ length: count }, () => ({
    id: uid(),
    x: Math.round(rand(5, 95)),
    y: Math.round(rand(5, 95)),
    color: randHex(),
    size: Math.round(rand(45, 75)),
  }));
  return { base, points };
}

export function MeshGradient() {
  const [base, setBase] = useState("#0b0b12");
  const [points, setPoints] = useState<Point[]>(() =>
    PRESETS[0].points.map((p) => ({ ...p, id: uid() })),
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [format, setFormat] = useState<"css" | "tailwind" | "svg">("css");
  const [fx, setFx] = useState<Fx>(DEFAULT_FX);
  const setFxField = <K extends keyof Fx>(k: K, v: Fx[K]) => setFx((s) => ({ ...s, [k]: v }));
  const stageRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<string | null>(null);

  const css = useMemo(() => buildCss(points, base), [points, base]);
  const style = useMemo(() => buildStyle(points, base), [points, base]);
  const filterCss = useMemo(() => filterString(fx), [fx]);
  const grainSvgUrl = useMemo(
    () =>
      `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${fx.grainScale}' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
    [fx.grainScale],
  );

  const output = useMemo(() => {
    const filterLine = filterCss ? `\n  filter: ${filterCss};` : "";
    if (format === "css") return `.mesh {\n  ${css.replace(/\n/g, "\n  ")}${filterLine}\n}`;
    if (format === "tailwind") {
      const filterProp = filterCss ? `,\n    filter: "${filterCss}"` : "";
      return `<div\n  className="mesh"\n  style={{\n    backgroundColor: "${base}",\n    backgroundImage: \`${points
        .map((p) => `radial-gradient(at ${p.x}% ${p.y}%, ${p.color} 0px, transparent ${p.size}%)`)
        .join(", ")}\`${filterProp},\n  }}\n/>`;
    }
    // SVG
    const stops = points
      .map(
        (p, i) =>
          `  <radialGradient id="g${i}" cx="${p.x}%" cy="${p.y}%" r="${p.size}%"><stop offset="0%" stop-color="${p.color}"/><stop offset="100%" stop-color="${p.color}" stop-opacity="0"/></radialGradient>`,
      )
      .join("\n");
    const rects = points.map((_, i) => `  <rect width="100%" height="100%" fill="url(#g${i})"/>`).join("\n");
    const grainDef = fx.grain > 0
      ? `\n  <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${fx.grainScale}" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 0"/></filter>`
      : "";
    const blurDef = fx.blur > 0
      ? `\n  <filter id="blur"><feGaussianBlur stdDeviation="${fx.blur}"/></filter>`
      : "";
    const groupOpen = fx.blur > 0 ? `<g filter="url(#blur)">` : "";
    const groupClose = fx.blur > 0 ? `</g>` : "";
    const grainRect = fx.grain > 0
      ? `\n  <rect width="100%" height="100%" fill="#fff" filter="url(#grain)" opacity="${fx.grain / 100}" style="mix-blend-mode:${fx.grainBlend}"/>`
      : "";
    const vignetteDef = fx.vignette > 0
      ? `\n  <radialGradient id="vig" cx="50%" cy="50%" r="75%"><stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="${fx.vignette / 100}"/></radialGradient>`
      : "";
    const vignetteRect = fx.vignette > 0 ? `\n  <rect width="100%" height="100%" fill="url(#vig)"/>` : "";
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">\n<defs>\n${stops}${grainDef}${blurDef}${vignetteDef}\n</defs>\n  ${groupOpen}<rect width="100%" height="100%" fill="${base}"/>\n${rects}\n${groupClose}${grainRect}${vignetteRect}\n</svg>`;
  }, [css, points, base, format, filterCss, fx]);

  const addPoint = () => {
    if (points.length >= 8) return;
    const p: Point = { id: uid(), x: Math.round(rand(20, 80)), y: Math.round(rand(20, 80)), color: randHex(), size: 60 };
    setPoints((s) => [...s, p]);
    setSelected(p.id);
  };

  const removePoint = (id: string) => {
    setPoints((s) => s.filter((p) => p.id !== id));
    if (selected === id) setSelected(null);
  };

  const updatePoint = (id: string, patch: Partial<Point>) => {
    setPoints((s) => s.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const randomize = () => {
    const r = makeRandom(points.length || 4);
    setBase(r.base);
    setPoints(r.points);
  };

  const applyPreset = (i: number) => {
    const p = PRESETS[i];
    setBase(p.base);
    setPoints(p.points.map((x) => ({ ...x, id: uid() })));
  };

  const onPointerDown = (id: string) => (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    draggingRef.current = id;
    setSelected(id);
  };

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const id = draggingRef.current;
    if (!id || !stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100));
    setPoints((s) => s.map((p) => (p.id === id ? { ...p, x: Math.round(x), y: Math.round(y) } : p)));
  }, []);

  const onPointerUp = () => {
    draggingRef.current = null;
  };

  const buildExportSvg = (w: number, h: number) => {
    const defs = `${points
      .map(
        (p, i) =>
          `<radialGradient id="g${i}" cx="${p.x}%" cy="${p.y}%" r="${p.size}%"><stop offset="0%" stop-color="${p.color}"/><stop offset="100%" stop-color="${p.color}" stop-opacity="0"/></radialGradient>`,
      )
      .join("")}${fx.blur > 0 ? `<filter id="blur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${(fx.blur * w) / 1600}"/></filter>` : ""}${fx.grain > 0 ? `<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="${fx.grainScale}" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 0"/></filter>` : ""}${fx.vignette > 0 ? `<radialGradient id="vig" cx="50%" cy="50%" r="75%"><stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="${fx.vignette / 100}"/></radialGradient>` : ""}`;
    const filterAttr = filterCss ? ` style="filter:${filterCss.replace(/blur\([^)]+\)\s*/, "")}"` : "";
    const groupOpen = fx.blur > 0 ? `<g filter="url(#blur)">` : "";
    const groupClose = fx.blur > 0 ? `</g>` : "";
    const layers = points.map((_, i) => `<rect width="100%" height="100%" fill="url(#g${i})"/>`).join("");
    const grainRect = fx.grain > 0 ? `<rect width="100%" height="100%" fill="#fff" filter="url(#grain)" opacity="${fx.grain / 100}" style="mix-blend-mode:${fx.grainBlend}"/>` : "";
    const vignetteRect = fx.vignette > 0 ? `<rect width="100%" height="100%" fill="url(#vig)"/>` : "";
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"${filterAttr}><defs>${defs}</defs>${groupOpen}<rect width="100%" height="100%" fill="${base}"/>${layers}${groupClose}${grainRect}${vignetteRect}</svg>`;
  };

  const exportPng = async () => {
    const { w, h } = ASPECTS[fx.aspect];
    const svg = buildExportSvg(w, h);
    const img = new window.Image();
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(url);
    canvas.toBlob((b) => {
      if (b) downloadFile("mesh-gradient.png", b, "image/png");
    }, "image/png");
  };

  const exportSvg = () => {
    const { w, h } = ASPECTS[fx.aspect];
    downloadFile("mesh-gradient.svg", buildExportSvg(w, h), "image/svg+xml");
  };

  const sel = points.find((p) => p.id === selected) ?? null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "r" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        randomize();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points.length]);

  return (
    <div className="space-y-4">
      <Panel
        title="Canvas"
        actions={
          <>
            <Button size="sm" variant="ghost" className="h-7 gap-1.5 text-xs" onClick={randomize}>
              <Shuffle className="size-3" /> Random
            </Button>
            <Button size="sm" variant="ghost" className="h-7 gap-1.5 text-xs" onClick={addPoint} disabled={points.length >= 8}>
              <Plus className="size-3" /> Add point
            </Button>
            <Button size="sm" variant="ghost" className="h-7 gap-1.5 text-xs" onClick={exportSvg}>
              <Download className="size-3" /> SVG
            </Button>
            <Button size="sm" variant="ghost" className="h-7 gap-1.5 text-xs" onClick={exportPng}>
              <Download className="size-3" /> PNG
            </Button>
          </>
        }
      >
        <div
          ref={stageRef}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onClick={() => setSelected(null)}
          className={`relative w-full ${ASPECTS[fx.aspect].cls} cursor-crosshair overflow-hidden bg-black`}
        >
          <div className="pointer-events-none absolute inset-0" style={{ ...style, filter: filterCss || undefined }} />
          {fx.grain > 0 && (
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                opacity: fx.grain / 100,
                mixBlendMode: fx.grainBlend,
                backgroundImage: grainSvgUrl,
              }}
            />
          )}
          {fx.vignette > 0 && (
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,${fx.vignette / 100}) 100%)`,
              }}
            />
          )}
          {points.map((p) => (
            <button
              key={p.id}
              onPointerDown={onPointerDown(p.id)}
              onClick={(e) => {
                e.stopPropagation();
                setSelected(p.id);
              }}
              className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 size-6 rounded-full ring-2 shadow-lg transition-transform hover:scale-110 ${
                selected === p.id ? "ring-white scale-110" : "ring-white/60"
              }`}
              style={{ left: `${p.x}%`, top: `${p.y}%`, background: p.color }}
              aria-label={`Gradient point at ${p.x}%, ${p.y}%`}
            />
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Panel title="Output" actions={<CopyButton text={output} />}>
          <div className="p-3 space-y-3">
            <Tabs value={format} onValueChange={(v) => setFormat(v as typeof format)}>
              <TabsList className="h-8">
                <TabsTrigger value="css" className="text-xs">CSS</TabsTrigger>
                <TabsTrigger value="tailwind" className="text-xs">React / JSX</TabsTrigger>
                <TabsTrigger value="svg" className="text-xs">SVG</TabsTrigger>
              </TabsList>
            </Tabs>
            <pre className="text-xs font-mono bg-muted/40 rounded-md p-3 overflow-x-auto max-h-72 border border-border">{output}</pre>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel
            title="Stage & Effects"
            actions={
              <Button size="sm" variant="ghost" className="h-7 gap-1.5 text-xs" onClick={() => setFx(DEFAULT_FX)}>
                <RotateCcw className="size-3" /> Reset
              </Button>
            }
          >
            <div className="p-3 grid gap-3">
              <Field label="Base color">
                <div className="flex gap-2">
                  <input type="color" value={base} onChange={(e) => setBase(e.target.value)} className="h-9 w-12 rounded-md border border-border bg-transparent" />
                  <Input value={base} onChange={(e) => setBase(e.target.value)} className="h-9 font-mono text-xs" />
                </div>
              </Field>
              <Field label="Aspect ratio">
                <div className="grid grid-cols-6 gap-1">
                  {(Object.keys(ASPECTS) as Fx["aspect"][]).map((a) => (
                    <button
                      key={a}
                      onClick={() => setFxField("aspect", a)}
                      className={`h-8 rounded-md border text-[10px] font-mono transition ${
                        fx.aspect === a ? "border-foreground bg-foreground/10" : "border-border hover:border-foreground/40"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label={`Blur (${fx.blur}px)`}>
                <Slider value={[fx.blur]} onValueChange={(v) => setFxField("blur", v[0])} max={80} step={1} />
              </Field>
              <Field label={`Noise (${fx.grain}%)`}>
                <Slider value={[fx.grain]} onValueChange={(v) => setFxField("grain", v[0])} max={100} step={1} />
              </Field>
              {fx.grain > 0 && (
                <>
                  <Field label={`Noise scale (${fx.grainScale.toFixed(2)})`}>
                    <Slider value={[fx.grainScale * 100]} onValueChange={(v) => setFxField("grainScale", v[0] / 100)} min={20} max={200} step={1} />
                  </Field>
                  <Field label="Noise blend">
                    <div className="grid grid-cols-5 gap-1">
                      {(["overlay","soft-light","multiply","screen","normal"] as Fx["grainBlend"][]).map((b) => (
                        <button
                          key={b}
                          onClick={() => setFxField("grainBlend", b)}
                          className={`h-8 rounded-md border text-[9px] transition ${
                            fx.grainBlend === b ? "border-foreground bg-foreground/10" : "border-border hover:border-foreground/40"
                          }`}
                          title={b}
                        >
                          {b === "soft-light" ? "soft" : b.slice(0, 5)}
                        </button>
                      ))}
                    </div>
                  </Field>
                </>
              )}
              <Field label={`Vignette (${fx.vignette}%)`}>
                <Slider value={[fx.vignette]} onValueChange={(v) => setFxField("vignette", v[0])} max={100} step={1} />
              </Field>
              <div className="pt-2 border-t border-border grid gap-3">
                <Field label={`Brightness (${fx.brightness}%)`}>
                  <Slider value={[fx.brightness]} onValueChange={(v) => setFxField("brightness", v[0])} min={50} max={150} step={1} />
                </Field>
                <Field label={`Contrast (${fx.contrast}%)`}>
                  <Slider value={[fx.contrast]} onValueChange={(v) => setFxField("contrast", v[0])} min={50} max={200} step={1} />
                </Field>
                <Field label={`Saturation (${fx.saturate}%)`}>
                  <Slider value={[fx.saturate]} onValueChange={(v) => setFxField("saturate", v[0])} min={0} max={200} step={1} />
                </Field>
                <Field label={`Hue (${fx.hue}°)`}>
                  <Slider value={[fx.hue + 180]} onValueChange={(v) => setFxField("hue", v[0] - 180)} min={0} max={360} step={1} />
                </Field>
              </div>
            </div>
          </Panel>

          <Panel title="Presets">
            <div className="p-3 grid grid-cols-2 gap-2">
              {PRESETS.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(i)}
                  className="group relative aspect-[3/2] rounded-md overflow-hidden border border-border hover:border-foreground/40 transition"
                  style={buildStyle(p.points.map((x) => ({ ...x, id: "" })), p.base)}
                >
                  <span className="absolute bottom-1 left-1.5 text-[10px] font-medium text-white drop-shadow-md">{p.name}</span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel
            title={sel ? `Point #${points.indexOf(sel) + 1}` : "Points"}
            actions={
              sel && (
                <Button size="sm" variant="ghost" className="h-7 gap-1.5 text-xs text-destructive" onClick={() => removePoint(sel.id)}>
                  <Trash2 className="size-3" /> Delete
                </Button>
              )
            }
          >
            <div className="p-3 space-y-3">
              {sel ? (
                <>
                  <Field label="Color">
                    <div className="flex gap-2">
                      <input type="color" value={sel.color} onChange={(e) => updatePoint(sel.id, { color: e.target.value })} className="h-9 w-12 rounded-md border border-border bg-transparent" />
                      <Input value={sel.color} onChange={(e) => updatePoint(sel.id, { color: e.target.value })} className="h-9 font-mono text-xs" />
                    </div>
                  </Field>
                  <Field label={`X: ${sel.x}%`}>
                    <Slider value={[sel.x]} onValueChange={(v) => updatePoint(sel.id, { x: v[0] })} max={100} step={1} />
                  </Field>
                  <Field label={`Y: ${sel.y}%`}>
                    <Slider value={[sel.y]} onValueChange={(v) => updatePoint(sel.id, { y: v[0] })} max={100} step={1} />
                  </Field>
                  <Field label={`Size: ${sel.size}%`}>
                    <Slider value={[sel.size]} onValueChange={(v) => updatePoint(sel.id, { size: v[0] })} min={10} max={100} step={1} />
                  </Field>
                </>
              ) : (
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Eye className="size-3.5" /> Click a point on the canvas to edit — or drag to move.
                </div>
              )}
              <div className="pt-2 border-t border-border">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">All points ({points.length}/8)</Label>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {points.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => setSelected(p.id)}
                      className={`size-6 rounded-md border-2 transition ${selected === p.id ? "border-foreground scale-110" : "border-border"}`}
                      style={{ background: p.color }}
                      title={`Point ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}