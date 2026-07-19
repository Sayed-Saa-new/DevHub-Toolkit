import { useMemo, useState } from "react";
import { Panel, Field, CopyButton } from "./primitives";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

type Unit = "rem" | "px";

function round(n: number, d = 4) {
  return Math.round(n * 10 ** d) / 10 ** d;
}

export function ClampCalculator() {
  const [minSize, setMinSize] = useState(16);
  const [maxSize, setMaxSize] = useState(24);
  const [minVw, setMinVw] = useState(360);
  const [maxVw, setMaxVw] = useState(1280);
  const [unit, setUnit] = useState<Unit>("rem");
  const [base, setBase] = useState(16);

  const clamp = useMemo(() => {
    const slope = (maxSize - minSize) / (maxVw - minVw);
    const intercept = minSize - slope * minVw;
    const vw = round(slope * 100);
    if (unit === "rem") {
      return {
        min: `${round(minSize / base)}rem`,
        pref: `${round(intercept / base)}rem + ${vw}vw`,
        max: `${round(maxSize / base)}rem`,
      };
    }
    return {
      min: `${round(minSize)}px`,
      pref: `${round(intercept)}px + ${vw}vw`,
      max: `${round(maxSize)}px`,
    };
  }, [minSize, maxSize, minVw, maxVw, unit, base]);

  const css = `clamp(${clamp.min}, ${clamp.pref}, ${clamp.max})`;

  const previews = [360, 480, 768, 1024, 1280, 1536].map((vw) => {
    const size = Math.min(maxSize, Math.max(minSize, minSize + ((maxSize - minSize) * (vw - minVw)) / (maxVw - minVw)));
    return { vw, size: round(size, 2) };
  });

  return (
    <div className="space-y-4">
      <Panel title="Range">
        <div className="grid gap-4 p-3 md:grid-cols-4">
          <Field label="Min size (px)">
            <Input type="number" value={minSize} onChange={(e) => setMinSize(+e.target.value)} />
          </Field>
          <Field label="Max size (px)">
            <Input type="number" value={maxSize} onChange={(e) => setMaxSize(+e.target.value)} />
          </Field>
          <Field label="Min viewport (px)">
            <Input type="number" value={minVw} onChange={(e) => setMinVw(+e.target.value)} />
          </Field>
          <Field label="Max viewport (px)">
            <Input type="number" value={maxVw} onChange={(e) => setMaxVw(+e.target.value)} />
          </Field>
          <Field label="Output unit">
            <Tabs value={unit} onValueChange={(v) => setUnit(v as Unit)}>
              <TabsList className="h-8">
                <TabsTrigger value="rem" className="text-xs">rem</TabsTrigger>
                <TabsTrigger value="px" className="text-xs">px</TabsTrigger>
              </TabsList>
            </Tabs>
          </Field>
          {unit === "rem" && (
            <Field label="Root font-size (px)">
              <Input type="number" value={base} onChange={(e) => setBase(+e.target.value)} />
            </Field>
          )}
        </div>
      </Panel>

      <Panel title="CSS output" actions={<CopyButton text={css} />}>
        <pre className="p-4 font-mono text-sm overflow-auto">font-size: {css};</pre>
      </Panel>

      <Panel title="Live preview">
        <div className="space-y-3 p-4">
          {previews.map((p) => (
            <div key={p.vw} className="flex items-baseline gap-4 border-b border-border pb-2 last:border-0">
              <Label className="w-24 shrink-0 font-mono text-xs text-muted-foreground">{p.vw}px vw</Label>
              <span className="font-mono text-xs text-muted-foreground w-16 shrink-0">{p.size}px</span>
              <span style={{ fontSize: `${p.size}px` }} className="truncate">The quick brown fox</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}