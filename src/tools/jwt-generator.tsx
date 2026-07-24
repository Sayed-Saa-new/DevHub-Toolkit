import { useEffect, useMemo, useState } from "react";
import { Sparkles, Copy, Download, Check, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Panel, CopyButton, DownloadButton, Field } from "./primitives";
import { cn } from "@/lib/utils";

type Alg = "HS256" | "HS384" | "HS512";
type SecretEncoding = "utf8" | "base64" | "base64url";

const ALG_HASH: Record<Alg, string> = {
  HS256: "SHA-256",
  HS384: "SHA-384",
  HS512: "SHA-512",
};

function b64urlEncode(bytes: Uint8Array | ArrayBuffer): string {
  const buf = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function b64urlDecodeToBytes(str: string): Uint8Array {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const bin = atob(str.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function encodeSecret(secret: string, encoding: SecretEncoding): Uint8Array {
  if (encoding === "utf8") return new TextEncoder().encode(secret);
  if (encoding === "base64") {
    const bin = atob(secret.replace(/\s+/g, ""));
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  return b64urlDecodeToBytes(secret.replace(/\s+/g, ""));
}

async function signHmac(alg: Alg, key: Uint8Array, data: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key.buffer.slice(key.byteOffset, key.byteOffset + key.byteLength) as ArrayBuffer,
    { name: "HMAC", hash: ALG_HASH[alg] },
    false,
    ["sign"],
  );
  const enc = new TextEncoder().encode(data);
  const sig = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    enc.buffer.slice(enc.byteOffset, enc.byteOffset + enc.byteLength) as ArrayBuffer,
  );
  return b64urlEncode(sig);
}

function safeParse(
  json: string,
): { ok: true; value: Record<string, unknown> } | { ok: false; error: string } {
  try {
    const v = JSON.parse(json);
    if (v === null || typeof v !== "object" || Array.isArray(v)) {
      return { ok: false, error: "Must be a JSON object" };
    }
    return { ok: true, value: v as Record<string, unknown> };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

function nowSec() {
  return Math.floor(Date.now() / 1000);
}

function randomJti() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function formatTimestamp(v: unknown): string | null {
  if (typeof v !== "number" || !Number.isFinite(v)) return null;
  try {
    return new Date(v * 1000).toISOString();
  } catch {
    return null;
  }
}

const DEFAULT_HEADER = (alg: Alg) => JSON.stringify({ alg, typ: "JWT" }, null, 2);
const DEFAULT_PAYLOAD = JSON.stringify(
  {
    sub: "1234567890",
    name: "Jane Developer",
    iat: nowSec(),
  },
  null,
  2,
);

export function JwtGenerator() {
  const [alg, setAlg] = useState<Alg>("HS256");
  const [headerText, setHeaderText] = useState(DEFAULT_HEADER("HS256"));
  const [payloadText, setPayloadText] = useState(DEFAULT_PAYLOAD);
  const [secret, setSecret] = useState("your-256-bit-secret");
  const [secretEncoding, setSecretEncoding] = useState<SecretEncoding>("utf8");
  const [token, setToken] = useState("");
  const [signError, setSignError] = useState<string | null>(null);

  // keep header alg in sync when user picks algorithm dropdown
  useEffect(() => {
    const parsed = safeParse(headerText);
    if (parsed.ok && parsed.value.alg !== alg) {
      const next = { ...parsed.value, alg, typ: parsed.value.typ ?? "JWT" };
      setHeaderText(JSON.stringify(next, null, 2));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alg]);

  const headerParsed = useMemo(() => safeParse(headerText), [headerText]);
  const payloadParsed = useMemo(() => safeParse(payloadText), [payloadText]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!headerParsed.ok || !payloadParsed.ok) {
        setToken("");
        setSignError(null);
        return;
      }
      try {
        const h = b64urlEncode(new TextEncoder().encode(JSON.stringify(headerParsed.value)));
        const p = b64urlEncode(new TextEncoder().encode(JSON.stringify(payloadParsed.value)));
        const signingInput = `${h}.${p}`;
        const keyBytes = encodeSecret(secret, secretEncoding);
        const sig = await signHmac(alg, keyBytes, signingInput);
        if (!cancelled) {
          setToken(`${signingInput}.${sig}`);
          setSignError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setToken("");
          setSignError((e as Error).message);
        }
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [alg, headerParsed, payloadParsed, secret, secretEncoding]);

  const setPayloadClaim = (key: string, value: unknown) => {
    const parsed = safeParse(payloadText);
    const base = parsed.ok ? parsed.value : {};
    const next: Record<string, unknown> = { ...base };
    if (value === undefined) delete next[key];
    else next[key] = value;
    setPayloadText(JSON.stringify(next, null, 2));
  };

  const addExp = (seconds: number) => setPayloadClaim("exp", nowSec() + seconds);
  const setIatNow = () => setPayloadClaim("iat", nowSec());
  const setNbfNow = () => setPayloadClaim("nbf", nowSec());
  const setJti = () => setPayloadClaim("jti", randomJti());

  const generateSecret = () => {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    setSecret(b64urlEncode(bytes));
    setSecretEncoding("base64url");
  };

  const parts = token ? token.split(".") : [];
  const payloadClaims = payloadParsed.ok ? payloadParsed.value : {};
  const expIso = formatTimestamp(payloadClaims.exp);
  const iatIso = formatTimestamp(payloadClaims.iat);
  const nbfIso = formatTimestamp(payloadClaims.nbf);
  const expired = typeof payloadClaims.exp === "number" && payloadClaims.exp * 1000 < Date.now();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Left: inputs */}
      <div className="space-y-4">
        <Panel title="Algorithm & Secret">
          <div className="p-3 space-y-3">
            <Field label="Algorithm">
              <Tabs value={alg} onValueChange={(v) => setAlg(v as Alg)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="HS256">HS256</TabsTrigger>
                  <TabsTrigger value="HS384">HS384</TabsTrigger>
                  <TabsTrigger value="HS512">HS512</TabsTrigger>
                </TabsList>
              </Tabs>
            </Field>
            <Field label="Secret" hint={secretEncoding === "utf8" ? "raw text" : secretEncoding}>
              <div className="flex gap-2">
                <Input
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  className="font-mono text-xs"
                  placeholder="signing secret"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateSecret}
                  className="shrink-0 gap-1.5"
                >
                  <Sparkles className="size-3" /> Random
                </Button>
              </div>
            </Field>
            <Field label="Secret encoding">
              <Tabs
                value={secretEncoding}
                onValueChange={(v) => setSecretEncoding(v as SecretEncoding)}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="utf8">UTF-8</TabsTrigger>
                  <TabsTrigger value="base64">Base64</TabsTrigger>
                  <TabsTrigger value="base64url">Base64URL</TabsTrigger>
                </TabsList>
              </Tabs>
            </Field>
          </div>
        </Panel>

        <Panel
          title="Header"
          actions={
            !headerParsed.ok ? (
              <span className="text-[10px] text-destructive font-mono">Invalid JSON</span>
            ) : (
              <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                <Check className="size-3" /> Valid
              </span>
            )
          }
        >
          <Textarea
            value={headerText}
            onChange={(e) => setHeaderText(e.target.value)}
            className="min-h-[110px] rounded-none border-0 font-mono text-xs resize-none focus-visible:ring-0"
            spellCheck={false}
          />
        </Panel>

        <Panel
          title="Payload"
          actions={
            !payloadParsed.ok ? (
              <span className="text-[10px] text-destructive font-mono">Invalid JSON</span>
            ) : (
              <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                <Check className="size-3" /> Valid
              </span>
            )
          }
        >
          <Textarea
            value={payloadText}
            onChange={(e) => setPayloadText(e.target.value)}
            className="min-h-[220px] rounded-none border-0 font-mono text-xs resize-none focus-visible:ring-0"
            spellCheck={false}
          />
          <div className="border-t border-border bg-muted/20 px-3 py-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mr-1">
              Claims
            </span>
            <Button variant="outline" size="sm" className="h-6 text-[11px]" onClick={setIatNow}>
              iat = now
            </Button>
            <Button variant="outline" size="sm" className="h-6 text-[11px]" onClick={setNbfNow}>
              nbf = now
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-[11px]"
              onClick={() => addExp(60 * 15)}
            >
              exp +15m
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-[11px]"
              onClick={() => addExp(60 * 60)}
            >
              exp +1h
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-[11px]"
              onClick={() => addExp(60 * 60 * 24)}
            >
              exp +1d
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-[11px]"
              onClick={() => addExp(60 * 60 * 24 * 30)}
            >
              exp +30d
            </Button>
            <Button variant="outline" size="sm" className="h-6 text-[11px]" onClick={setJti}>
              jti (random)
            </Button>
          </div>
        </Panel>
      </div>

      {/* Right: output */}
      <div className="space-y-4">
        <Panel
          title="Signed JWT"
          actions={
            <>
              <CopyButton text={token} />
              <DownloadButton filename="token.jwt" content={token} mime="application/jwt" />
            </>
          }
        >
          {signError ? (
            <div className="p-4 text-xs text-destructive font-mono flex items-start gap-2">
              <AlertCircle className="size-4 shrink-0" /> {signError}
            </div>
          ) : token ? (
            <div className="p-3 font-mono text-xs break-all leading-relaxed">
              <span className="text-red-500 dark:text-red-400">{parts[0]}</span>
              <span className="text-muted-foreground">.</span>
              <span className="text-violet-500 dark:text-violet-400">{parts[1]}</span>
              <span className="text-muted-foreground">.</span>
              <span className="text-teal-500 dark:text-teal-400">{parts[2]}</span>
            </div>
          ) : (
            <div className="p-4 text-xs text-muted-foreground">
              Fix JSON errors to generate a token.
            </div>
          )}
        </Panel>

        <Panel title="Claims summary">
          <div className="p-3 grid gap-2 text-xs">
            <SummaryRow
              label="alg"
              value={headerParsed.ok ? String(headerParsed.value.alg ?? "—") : "—"}
            />
            <SummaryRow
              label="typ"
              value={headerParsed.ok ? String(headerParsed.value.typ ?? "—") : "—"}
            />
            <SummaryRow label="iss" value={String(payloadClaims.iss ?? "—")} />
            <SummaryRow label="sub" value={String(payloadClaims.sub ?? "—")} />
            <SummaryRow
              label="aud"
              value={
                Array.isArray(payloadClaims.aud)
                  ? payloadClaims.aud.join(", ")
                  : String(payloadClaims.aud ?? "—")
              }
            />
            <SummaryRow label="iat" value={iatIso ?? "—"} />
            <SummaryRow label="nbf" value={nbfIso ?? "—"} />
            <SummaryRow
              label="exp"
              value={expIso ?? "—"}
              tone={expired ? "warn" : "default"}
              suffix={expired ? "expired" : undefined}
            />
            <SummaryRow label="jti" value={String(payloadClaims.jti ?? "—")} />
          </div>
        </Panel>

        <Panel title="cURL example">
          <div className="p-3">
            <pre className="text-[11px] font-mono whitespace-pre-wrap break-all leading-relaxed">
              {`curl -H "Authorization: Bearer ${token || "<token>"}" \\
  https://api.example.com/me`}
            </pre>
          </div>
        </Panel>

        <p className="text-[11px] text-muted-foreground px-1">
          100% client-side. Secrets and tokens never leave your browser. HS-family only — RS/ES
          asymmetric signing is planned.
        </p>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  tone = "default",
  suffix,
}: {
  label: string;
  value: string;
  tone?: "default" | "warn";
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-10 shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          "font-mono truncate",
          tone === "warn" && "text-amber-600 dark:text-amber-400",
        )}
      >
        {value}
      </span>
      {suffix && (
        <span className="ml-auto rounded border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-mono uppercase text-amber-600 dark:text-amber-400">
          {suffix}
        </span>
      )}
    </div>
  );
}
