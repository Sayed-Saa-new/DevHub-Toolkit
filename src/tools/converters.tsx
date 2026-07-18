import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CopyButton, DownloadButton, Field, Panel, Mono } from "./primitives";
import { copyToClipboard } from "@/lib/utils";

export function JsonFormatter() {
  const [input, setInput] = useState(`{"hello":"world","list":[1,2,3]}`);
  const [indent, setIndent] = useState(2);
  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null as string | null };
    try {
      return { output: JSON.stringify(JSON.parse(input), null, indent), error: null };
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  }, [input, indent]);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Panel title="Input" actions={<>
        <Button variant="ghost" size="sm" onClick={() => setInput("")} className="h-7 text-xs">Clear</Button>
      </>}>
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[420px] font-mono text-sm border-0 rounded-none focus-visible:ring-0 resize-none" placeholder="Paste JSON here…" />
      </Panel>
      <Panel title={error ? "Error" : "Output"} actions={<>
        <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="h-7 text-xs bg-transparent border border-border rounded px-2">
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
          <option value={0}>Minify</option>
        </select>
        <CopyButton text={output} />
        <DownloadButton filename="formatted.json" content={output} mime="application/json" />
      </>}>
        {error ? (
          <div className="p-4 font-mono text-sm text-destructive whitespace-pre-wrap min-h-[420px]">{error}</div>
        ) : (
          <pre className="p-4 font-mono text-sm min-h-[420px] whitespace-pre-wrap break-all overflow-auto max-h-[600px]">{output || <span className="text-muted-foreground">Formatted JSON appears here.</span>}</pre>
        )}
      </Panel>
    </div>
  );
}

export function Base64Tool() {
  const [text, setText] = useState("");
  const [b64, setB64] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  function run() {
    try {
      if (mode === "encode") setB64(btoa(unescape(encodeURIComponent(text))));
      else setText(decodeURIComponent(escape(atob(b64))));
    } catch {
      if (mode === "encode") setB64("Error: cannot encode");
      else setText("Error: invalid Base64");
    }
  }

  return (
    <Tabs value={mode} onValueChange={(v) => setMode(v as "encode" | "decode")}>
      <TabsList>
        <TabsTrigger value="encode">Encode</TabsTrigger>
        <TabsTrigger value="decode">Decode</TabsTrigger>
      </TabsList>
      <TabsContent value="encode" className="space-y-3 mt-4">
        <Field label="Plain text">
          <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className="font-mono text-sm" placeholder="Text to encode" />
        </Field>
        <Button onClick={run}>Encode →</Button>
        <Panel title="Base64 output" actions={<CopyButton text={b64} />}>
          <pre className="p-4 font-mono text-sm whitespace-pre-wrap break-all min-h-[120px]">{b64 || <span className="text-muted-foreground">Base64 result appears here.</span>}</pre>
        </Panel>
      </TabsContent>
      <TabsContent value="decode" className="space-y-3 mt-4">
        <Field label="Base64 input">
          <Textarea value={b64} onChange={(e) => setB64(e.target.value)} rows={6} className="font-mono text-sm" placeholder="Base64 to decode" />
        </Field>
        <Button onClick={run}>Decode →</Button>
        <Panel title="Plain text output" actions={<CopyButton text={text} />}>
          <pre className="p-4 font-mono text-sm whitespace-pre-wrap break-all min-h-[120px]">{text || <span className="text-muted-foreground">Decoded text appears here.</span>}</pre>
        </Panel>
      </TabsContent>
    </Tabs>
  );
}

export function UrlCodec() {
  const [text, setText] = useState("hello world?foo=bar&x=1");
  const encoded = useMemo(() => { try { return encodeURIComponent(text); } catch { return ""; } }, [text]);
  const decoded = useMemo(() => { try { return decodeURIComponent(text); } catch { return "(invalid)"; } }, [text]);
  return (
    <div className="space-y-4">
      <Field label="Input">
        <Textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} className="font-mono text-sm" />
      </Field>
      <div className="grid md:grid-cols-2 gap-4">
        <Panel title="Encoded" actions={<CopyButton text={encoded} />}>
          <pre className="p-4 font-mono text-sm whitespace-pre-wrap break-all min-h-[120px]">{encoded}</pre>
        </Panel>
        <Panel title="Decoded" actions={<CopyButton text={decoded} />}>
          <pre className="p-4 font-mono text-sm whitespace-pre-wrap break-all min-h-[120px]">{decoded}</pre>
        </Panel>
      </div>
    </div>
  );
}

export function JwtDecoder() {
  const [token, setToken] = useState("");
  const parsed = useMemo(() => {
    if (!token.trim()) return null;
    const parts = token.trim().split(".");
    if (parts.length < 2) return { error: "Not a valid JWT (need at least 2 parts)" };
    try {
      const decode = (p: string) => {
        const s = p.replace(/-/g, "+").replace(/_/g, "/");
        const padded = s + "=".repeat((4 - (s.length % 4)) % 4);
        return JSON.parse(decodeURIComponent(escape(atob(padded))));
      };
      return { header: decode(parts[0]), payload: decode(parts[1]), signature: parts[2] ?? "" };
    } catch (e) {
      return { error: (e as Error).message };
    }
  }, [token]);

  return (
    <div className="space-y-4">
      <Field label="JWT">
        <Textarea rows={4} value={token} onChange={(e) => setToken(e.target.value)} placeholder="eyJhbGciOi..." className="font-mono text-xs" />
      </Field>
      {parsed && "error" in parsed && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">{parsed.error}</div>
      )}
      {parsed && !("error" in parsed) && (
        <div className="grid md:grid-cols-3 gap-4">
          <Panel title="Header" actions={<CopyButton text={JSON.stringify(parsed.header, null, 2)} />}>
            <pre className="p-3 font-mono text-xs whitespace-pre-wrap break-all">{JSON.stringify(parsed.header, null, 2)}</pre>
          </Panel>
          <Panel title="Payload" actions={<CopyButton text={JSON.stringify(parsed.payload, null, 2)} />}>
            <pre className="p-3 font-mono text-xs whitespace-pre-wrap break-all">{JSON.stringify(parsed.payload, null, 2)}</pre>
          </Panel>
          <Panel title="Signature">
            <pre className="p-3 font-mono text-xs break-all text-muted-foreground">{parsed.signature || "(none)"}</pre>
          </Panel>
        </div>
      )}
    </div>
  );
}

export function TimestampConverter() {
  const [ts, setTs] = useState(String(Math.floor(Date.now() / 1000)));
  const [dateStr, setDateStr] = useState(new Date().toISOString().slice(0, 19));

  const fromTs = useMemo(() => {
    const n = Number(ts);
    if (!Number.isFinite(n)) return null;
    const d = new Date(n < 1e12 ? n * 1000 : n);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [ts]);

  const fromDate = useMemo(() => {
    const d = new Date(dateStr);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [dateStr]);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Panel title="Timestamp → Date">
        <div className="p-4 space-y-3">
          <Field label="Unix timestamp (seconds or ms)">
            <Input value={ts} onChange={(e) => setTs(e.target.value)} className="font-mono" />
          </Field>
          <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-center text-sm">
            <span className="text-muted-foreground text-xs uppercase tracking-wider">Local</span>
            <Mono>{fromTs?.toString() ?? "—"}</Mono>
            <CopyButton text={fromTs?.toString() ?? ""} />
            <span className="text-muted-foreground text-xs uppercase tracking-wider">ISO</span>
            <Mono>{fromTs?.toISOString() ?? "—"}</Mono>
            <CopyButton text={fromTs?.toISOString() ?? ""} />
            <span className="text-muted-foreground text-xs uppercase tracking-wider">UTC</span>
            <Mono>{fromTs?.toUTCString() ?? "—"}</Mono>
            <CopyButton text={fromTs?.toUTCString() ?? ""} />
          </div>
          <Button variant="outline" size="sm" onClick={() => setTs(String(Math.floor(Date.now() / 1000)))}>Now</Button>
        </div>
      </Panel>
      <Panel title="Date → Timestamp">
        <div className="p-4 space-y-3">
          <Field label="Date (ISO-like)">
            <Input value={dateStr} onChange={(e) => setDateStr(e.target.value)} className="font-mono" placeholder="2026-01-01T00:00:00" />
          </Field>
          <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-center text-sm">
            <span className="text-muted-foreground text-xs uppercase tracking-wider">Seconds</span>
            <Mono>{fromDate ? Math.floor(fromDate.getTime() / 1000) : "—"}</Mono>
            <CopyButton text={fromDate ? String(Math.floor(fromDate.getTime() / 1000)) : ""} />
            <span className="text-muted-foreground text-xs uppercase tracking-wider">Millis</span>
            <Mono>{fromDate?.getTime() ?? "—"}</Mono>
            <CopyButton text={fromDate ? String(fromDate.getTime()) : ""} />
          </div>
        </div>
      </Panel>
    </div>
  );
}

export { copyToClipboard };