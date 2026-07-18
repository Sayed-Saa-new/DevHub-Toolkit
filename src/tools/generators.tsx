import { md5 } from "js-md5";
import QRCode from "qrcode";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton, DownloadButton, Field, Mono, Panel } from "./primitives";
import { copyToClipboard } from "@/lib/utils";

export function UuidGenerator() {
  const [count, setCount] = useState(10);
  const [items, setItems] = useState<string[]>(() => Array.from({ length: 10 }, () => crypto.randomUUID()));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input type="number" min={1} max={500} value={count} onChange={(e) => setCount(Math.min(500, Math.max(1, Number(e.target.value) || 1)))} className="w-24 font-mono" />
        <Button onClick={() => setItems(Array.from({ length: count }, () => crypto.randomUUID()))}>Generate</Button>
        <Button variant="outline" onClick={() => copyToClipboard(items.join("\n"), `${items.length} UUIDs copied`)}>Copy all</Button>
      </div>
      <Panel title={`${items.length} UUIDs`}>
        <div className="max-h-[500px] overflow-auto divide-y divide-border">
          {items.map((u, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-1.5 hover:bg-accent/30 group">
              <span className="text-[10px] text-muted-foreground font-mono w-8">{i + 1}</span>
              <Mono className="flex-1">{u}</Mono>
              <button onClick={() => copyToClipboard(u)} className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground transition">copy</button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

async function sha(algo: "SHA-1" | "SHA-256" | "SHA-512", text: string) {
  const buf = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest(algo, buf);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function HashGenerator() {
  const [text, setText] = useState("hello world");
  const [hashes, setHashes] = useState<{ md5: string; sha1: string; sha256: string; sha512: string }>({ md5: "", sha1: "", sha256: "", sha512: "" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [sha1, sha256, sha512] = await Promise.all([sha("SHA-1", text), sha("SHA-256", text), sha("SHA-512", text)]);
      if (!cancelled) setHashes({ md5: md5(text), sha1, sha256, sha512 });
    })();
    return () => { cancelled = true; };
  }, [text]);

  const rows: [string, string][] = [
    ["MD5", hashes.md5],
    ["SHA-1", hashes.sha1],
    ["SHA-256", hashes.sha256],
    ["SHA-512", hashes.sha512],
  ];

  return (
    <div className="space-y-4">
      <Field label="Input text">
        <Textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} className="font-mono text-sm" />
      </Field>
      <Panel title="Hashes">
        <div className="divide-y divide-border">
          {rows.map(([name, val]) => (
            <div key={name} className="grid grid-cols-[80px_1fr_auto] items-center gap-3 px-3 py-2">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{name}</div>
              <Mono className="text-xs break-all">{val}</Mono>
              <CopyButton text={val} />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export function QrCodeTool() {
  const [text, setText] = useState("https://devhub.example.com");
  const [dataUrl, setDataUrl] = useState("");
  const [size, setSize] = useState(320);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, text || " ", { width: size, margin: 2, color: { dark: "#ffffff", light: "#0a0a0a00" } }, () => {});
    QRCode.toDataURL(text || " ", { width: size, margin: 2, color: { dark: "#000000", light: "#ffffff" } }).then(setDataUrl).catch(() => setDataUrl(""));
  }, [text, size]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Field label="Content">
          <Textarea rows={5} value={text} onChange={(e) => setText(e.target.value)} className="font-mono text-sm" placeholder="URL or any text" />
        </Field>
        <Field label={`Size — ${size}px`}>
          <input type="range" min={128} max={640} step={16} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-foreground" />
        </Field>
        <div className="flex gap-2">
          <a href={dataUrl} download="qrcode.png"><Button disabled={!dataUrl}>Download PNG</Button></a>
          <Button variant="outline" onClick={() => copyToClipboard(text)}>Copy content</Button>
        </div>
      </div>
      <Panel title="Preview">
        <div className="p-6 grid place-items-center bg-[oklch(0.08_0_0)] min-h-[380px]">
          <canvas ref={canvasRef} className="rounded" />
        </div>
      </Panel>
    </div>
  );
}