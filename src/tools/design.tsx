import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyButton, Field, Mono, Panel } from "./primitives";

// ---------- Color ----------
function hexToRgb(hex: string) {
  const m = hex.replace("#", "").match(/^([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("");
}
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function ColorTool() {
  const [hex, setHex] = useState("#7c3aed");
  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hsl = useMemo(() => (rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null), [rgb]);

  const values = rgb && hsl ? {
    hex: hex.toUpperCase(),
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
  } : null;

  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-6">
      <div>
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="aspect-square" style={{ background: hex }} />
          <div className="p-3 flex gap-2">
            <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="h-9 w-12 rounded border border-border bg-transparent cursor-pointer" />
            <Input value={hex} onChange={(e) => setHex(e.target.value)} className="font-mono uppercase" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {values ? (
          (Object.entries(values) as [string, string][]).map(([k, v]) => (
            <Panel key={k} title={k}>
              <div className="flex items-center gap-3 px-3 py-2">
                <Mono className="flex-1">{v}</Mono>
                <CopyButton text={v} />
              </div>
            </Panel>
          ))
        ) : (
          <div className="text-sm text-destructive">Invalid HEX color.</div>
        )}
      </div>
    </div>
  );
}

// ---------- Gradient ----------
export function GradientTool() {
  const [c1, setC1] = useState("#0ea5e9");
  const [c2, setC2] = useState("#a855f7");
  const [angle, setAngle] = useState(135);
  const css = `background: linear-gradient(${angle}deg, ${c1}, ${c2});`;
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border h-56" style={{ background: `linear-gradient(${angle}deg, ${c1}, ${c2})` }} />
      <div className="grid sm:grid-cols-3 gap-3">
        <Field label="Color 1"><div className="flex gap-2"><input type="color" value={c1} onChange={(e) => setC1(e.target.value)} className="h-9 w-12 rounded border border-border bg-transparent" /><Input value={c1} onChange={(e) => setC1(e.target.value)} className="font-mono" /></div></Field>
        <Field label="Color 2"><div className="flex gap-2"><input type="color" value={c2} onChange={(e) => setC2(e.target.value)} className="h-9 w-12 rounded border border-border bg-transparent" /><Input value={c2} onChange={(e) => setC2(e.target.value)} className="font-mono" /></div></Field>
        <Field label={`Angle — ${angle}°`}><input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-foreground" /></Field>
      </div>
      <Panel title="CSS" actions={<CopyButton text={css} />}>
        <pre className="p-4 font-mono text-sm">{css}</pre>
      </Panel>
    </div>
  );
}

// ---------- Box shadow ----------
export function BoxShadowTool() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(20);
  const [blur, setBlur] = useState(40);
  const [spread, setSpread] = useState(-10);
  const [color, setColor] = useState("#000000");
  const [opacity, setOpacity] = useState(40);

  const shadowColor = color + Math.round((opacity / 100) * 255).toString(16).padStart(2, "0");
  const css = `box-shadow: ${x}px ${y}px ${blur}px ${spread}px ${shadowColor};`;

  return (
    <div className="grid md:grid-cols-[1fr_320px] gap-6">
      <div className="rounded-xl border border-border bg-muted/20 min-h-[360px] grid place-items-center p-8">
        <div className="size-40 rounded-2xl bg-card border border-border" style={{ boxShadow: `${x}px ${y}px ${blur}px ${spread}px ${shadowColor}` }} />
      </div>
      <div className="space-y-4">
        {([
          ["X offset", x, setX, -100, 100],
          ["Y offset", y, setY, -100, 100],
          ["Blur", blur, setBlur, 0, 200],
          ["Spread", spread, setSpread, -100, 100],
          ["Opacity %", opacity, setOpacity, 0, 100],
        ] as [string, number, (n: number) => void, number, number][]).map(([label, val, set, min, max]) => (
          <Field key={label} label={`${label} — ${val}`}>
            <input type="range" min={min} max={max} value={val} onChange={(e) => set(Number(e.target.value))} className="w-full accent-foreground" />
          </Field>
        ))}
        <Field label="Color">
          <div className="flex gap-2">
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-12 rounded border border-border bg-transparent" />
            <Input value={color} onChange={(e) => setColor(e.target.value)} className="font-mono" />
          </div>
        </Field>
        <Panel title="CSS" actions={<CopyButton text={css} />}>
          <pre className="p-3 font-mono text-xs whitespace-pre-wrap break-all">{css}</pre>
        </Panel>
      </div>
    </div>
  );
}

// ---------- Border radius ----------
export function BorderRadiusTool() {
  const [tl, setTl] = useState(24);
  const [tr, setTr] = useState(24);
  const [br, setBr] = useState(24);
  const [bl, setBl] = useState(24);
  const style = { borderRadius: `${tl}px ${tr}px ${br}px ${bl}px` };
  const css = `border-radius: ${tl}px ${tr}px ${br}px ${bl}px;`;

  return (
    <div className="grid md:grid-cols-[1fr_320px] gap-6">
      <div className="rounded-xl border border-border bg-muted/20 min-h-[360px] grid place-items-center p-8">
        <div className="size-52 bg-foreground/90" style={style} />
      </div>
      <div className="space-y-4">
        {([["Top-left", tl, setTl],["Top-right", tr, setTr],["Bottom-right", br, setBr],["Bottom-left", bl, setBl]] as [string, number, (n: number) => void][]).map(([l, v, s]) => (
          <Field key={l} label={`${l} — ${v}px`}>
            <input type="range" min={0} max={200} value={v} onChange={(e) => s(Number(e.target.value))} className="w-full accent-foreground" />
          </Field>
        ))}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { setTl(24); setTr(24); setBr(24); setBl(24); }}>Reset</Button>
          <Button variant="outline" size="sm" onClick={() => { setTl(9999); setTr(9999); setBr(9999); setBl(9999); }}>Pill</Button>
        </div>
        <Panel title="CSS" actions={<CopyButton text={css} />}>
          <pre className="p-3 font-mono text-xs">{css}</pre>
        </Panel>
      </div>
    </div>
  );
}