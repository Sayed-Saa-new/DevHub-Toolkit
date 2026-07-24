import { useMemo, useState } from "react";
import { Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Panel, CopyButton, DownloadButton } from "./primitives";

// ---------- curl parser ----------

type CurlRequest = {
  method: string;
  url: string;
  headers: Record<string, string>;
  cookies: Record<string, string>;
  auth?: { user: string; pass: string };
  body?: string;
  bodyIsJson: boolean;
  bodyIsForm: boolean;
  formFields: Record<string, string>;
  followRedirects: boolean;
  insecure: boolean;
};

function tokenize(input: string): string[] {
  const src = input.replace(/\\\r?\n/g, " ").trim();
  const tokens: string[] = [];
  let buf = "";
  let quote: '"' | "'" | null = null;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quote) {
      if (ch === "\\" && quote === '"' && i + 1 < src.length) {
        buf += src[++i];
      } else if (ch === quote) {
        quote = null;
      } else {
        buf += ch;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch as '"' | "'";
      continue;
    }
    if (ch === "\\" && i + 1 < src.length) {
      buf += src[++i];
      continue;
    }
    if (/\s/.test(ch)) {
      if (buf) {
        tokens.push(buf);
        buf = "";
      }
      continue;
    }
    buf += ch;
  }
  if (buf) tokens.push(buf);
  return tokens;
}

function parseCurl(input: string): CurlRequest | { error: string } {
  const raw = input.trim();
  if (!raw) return { error: "Paste a curl command to get started." };
  const tokens = tokenize(raw);
  if (tokens.length === 0 || tokens[0].toLowerCase() !== "curl") {
    return { error: "Command must start with `curl`." };
  }
  const req: CurlRequest = {
    method: "GET",
    url: "",
    headers: {},
    cookies: {},
    body: undefined,
    bodyIsJson: false,
    bodyIsForm: false,
    formFields: {},
    followRedirects: false,
    insecure: false,
  };
  const dataParts: string[] = [];
  let methodSet = false;

  for (let i = 1; i < tokens.length; i++) {
    const t = tokens[i];
    const next = () => tokens[++i];
    switch (t) {
      case "-X":
      case "--request":
        req.method = next().toUpperCase();
        methodSet = true;
        break;
      case "-H":
      case "--header": {
        const h = next();
        const idx = h.indexOf(":");
        if (idx > 0) req.headers[h.slice(0, idx).trim()] = h.slice(idx + 1).trim();
        break;
      }
      case "-A":
      case "--user-agent":
        req.headers["User-Agent"] = next();
        break;
      case "-e":
      case "--referer":
        req.headers["Referer"] = next();
        break;
      case "-b":
      case "--cookie": {
        const c = next();
        for (const pair of c.split(";")) {
          const [k, ...v] = pair.trim().split("=");
          if (k) req.cookies[k] = v.join("=");
        }
        break;
      }
      case "-u":
      case "--user": {
        const val = next();
        const [user, ...rest] = val.split(":");
        req.auth = { user, pass: rest.join(":") };
        break;
      }
      case "-d":
      case "--data":
      case "--data-raw":
      case "--data-ascii":
        dataParts.push(next());
        if (!methodSet) req.method = "POST";
        break;
      case "--data-binary":
      case "--data-urlencode":
        dataParts.push(next());
        if (!methodSet) req.method = "POST";
        break;
      case "-F":
      case "--form": {
        const f = next();
        const eq = f.indexOf("=");
        if (eq > 0) req.formFields[f.slice(0, eq)] = f.slice(eq + 1);
        req.bodyIsForm = true;
        if (!methodSet) req.method = "POST";
        break;
      }
      case "-L":
      case "--location":
        req.followRedirects = true;
        break;
      case "-k":
      case "--insecure":
        req.insecure = true;
        break;
      case "-I":
      case "--head":
        req.method = "HEAD";
        methodSet = true;
        break;
      case "-G":
      case "--get":
        req.method = "GET";
        methodSet = true;
        break;
      case "-i":
      case "--include":
      case "-s":
      case "--silent":
      case "-v":
      case "--verbose":
      case "-o":
      case "--output":
      case "--compressed":
      case "--max-time":
      case "--connect-timeout":
        // accept & ignore (consume value where needed)
        if (t === "-o" || t === "--output" || t === "--max-time" || t === "--connect-timeout")
          next();
        break;
      default:
        if (t.startsWith("-")) {
          // unknown flag with value — try to skip a paired value if present
          if (i + 1 < tokens.length && !tokens[i + 1].startsWith("-")) next();
        } else if (!req.url) {
          req.url = t;
        }
    }
  }

  if (!req.url) return { error: "No URL found in the curl command." };
  if (dataParts.length) {
    req.body = dataParts.join("&");
    // try json
    const trimmed = req.body.trim();
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        JSON.parse(trimmed);
        req.bodyIsJson = true;
        req.body = trimmed;
      } catch {
        /* not json */
      }
    }
  }
  return req;
}

// ---------- language generators ----------

function q(s: string) {
  return JSON.stringify(s);
}
function pyStr(s: string) {
  return JSON.stringify(s);
}
function goStr(s: string) {
  return JSON.stringify(s);
}

function headersWithCookies(req: CurlRequest): Record<string, string> {
  const h = { ...req.headers };
  const cookieEntries = Object.entries(req.cookies);
  if (cookieEntries.length) {
    h["Cookie"] = cookieEntries.map(([k, v]) => `${k}=${v}`).join("; ");
  }
  if (req.auth) {
    const token = btoa(`${req.auth.user}:${req.auth.pass}`);
    h["Authorization"] = `Basic ${token}`;
  }
  return h;
}

function toFetch(req: CurlRequest): string {
  const headers = headersWithCookies(req);
  const opts: string[] = [];
  opts.push(`  method: ${q(req.method)}`);
  if (Object.keys(headers).length) {
    opts.push(`  headers: ${JSON.stringify(headers, null, 4).replace(/\n/g, "\n  ")}`);
  }
  if (req.bodyIsForm) {
    const lines = ["const form = new FormData();"];
    for (const [k, v] of Object.entries(req.formFields))
      lines.push(`form.append(${q(k)}, ${q(v)});`);
    opts.push(`  body: form`);
    return `${lines.join("\n")}\n\nconst res = await fetch(${q(req.url)}, {\n${opts.join(",\n")},\n});\nconst data = await res.text();`;
  }
  if (req.body !== undefined) {
    if (req.bodyIsJson) opts.push(`  body: JSON.stringify(${req.body})`);
    else opts.push(`  body: ${q(req.body)}`);
  }
  return `const res = await fetch(${q(req.url)}, {\n${opts.join(",\n")},\n});\nconst data = await res.${req.bodyIsJson ? "json" : "text"}();`;
}

function toAxios(req: CurlRequest): string {
  const headers = headersWithCookies(req);
  const cfg: string[] = [];
  cfg.push(`  method: ${q(req.method.toLowerCase())}`);
  cfg.push(`  url: ${q(req.url)}`);
  if (Object.keys(headers).length)
    cfg.push(`  headers: ${JSON.stringify(headers, null, 4).replace(/\n/g, "\n  ")}`);
  if (req.bodyIsForm) {
    const lines = [
      `import axios from "axios";`,
      `import FormData from "form-data";`,
      ``,
      `const form = new FormData();`,
    ];
    for (const [k, v] of Object.entries(req.formFields))
      lines.push(`form.append(${q(k)}, ${q(v)});`);
    cfg.push(`  data: form`);
    cfg.push(`  headers: { ...form.getHeaders?.() }`);
    return `${lines.join("\n")}\n\nconst res = await axios({\n${cfg.join(",\n")},\n});`;
  }
  if (req.body !== undefined) {
    if (req.bodyIsJson) cfg.push(`  data: ${req.body}`);
    else cfg.push(`  data: ${q(req.body)}`);
  }
  return `import axios from "axios";\n\nconst res = await axios({\n${cfg.join(",\n")},\n});`;
}

function toNodeHttps(req: CurlRequest): string {
  const u = safeUrl(req.url);
  const headers = headersWithCookies(req);
  return `import https from "node:https";\n\nconst options = {\n  hostname: ${q(u.hostname)},\n  port: ${u.port || (u.protocol === "https:" ? 443 : 80)},\n  path: ${q(u.pathname + u.search)},\n  method: ${q(req.method)},\n  headers: ${JSON.stringify(headers, null, 2).replace(/\n/g, "\n  ")},\n};\n\nconst req = https.request(options, (res) => {\n  let data = "";\n  res.on("data", (chunk) => (data += chunk));\n  res.on("end", () => console.log(data));\n});\n${req.body !== undefined ? `req.write(${q(req.body)});\n` : ""}req.end();`;
}

function toPython(req: CurlRequest): string {
  const headers = headersWithCookies(req);
  const lines = [`import requests`, ``];
  const args: string[] = [pyStr(req.url)];
  if (Object.keys(headers).length) args.push(`headers=${pyDict(headers)}`);
  if (req.bodyIsForm) args.push(`files=${pyDict(req.formFields)}`);
  else if (req.bodyIsJson && req.body) args.push(`json=${req.body}`);
  else if (req.body !== undefined) args.push(`data=${pyStr(req.body)}`);
  if (req.auth) args.push(`auth=(${pyStr(req.auth.user)}, ${pyStr(req.auth.pass)})`);
  lines.push(`response = requests.${req.method.toLowerCase()}(\n    ${args.join(",\n    ")},\n)`);
  lines.push(`print(response.${req.bodyIsJson ? "json()" : "text"})`);
  return lines.join("\n");
}

function pyDict(obj: Record<string, string>): string {
  const entries = Object.entries(obj).map(([k, v]) => `        ${pyStr(k)}: ${pyStr(v)}`);
  return `{\n${entries.join(",\n")},\n    }`;
}

function toGo(req: CurlRequest): string {
  const headers = headersWithCookies(req);
  const bodyExpr = req.body !== undefined ? `strings.NewReader(${goStr(req.body)})` : "nil";
  const setHeaders = Object.entries(headers)
    .map(([k, v]) => `\treq.Header.Set(${goStr(k)}, ${goStr(v)})`)
    .join("\n");
  return `package main\n\nimport (\n\t"fmt"\n\t"io"\n\t"net/http"\n\t"strings"\n)\n\nfunc main() {\n\treq, _ := http.NewRequest(${goStr(req.method)}, ${goStr(req.url)}, ${bodyExpr})\n${setHeaders}\n\n\tres, err := http.DefaultClient.Do(req)\n\tif err != nil { panic(err) }\n\tdefer res.Body.Close()\n\n\tbody, _ := io.ReadAll(res.Body)\n\tfmt.Println(string(body))\n}`;
}

function toPhp(req: CurlRequest): string {
  const headers = headersWithCookies(req);
  const hArr = Object.entries(headers)
    .map(([k, v]) => `    ${JSON.stringify(`${k}: ${v}`)}`)
    .join(",\n");
  const bodyLine =
    req.body !== undefined
      ? `curl_setopt($ch, CURLOPT_POSTFIELDS, ${JSON.stringify(req.body)});\n`
      : "";
  return `<?php\n$ch = curl_init(${JSON.stringify(req.url)});\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\ncurl_setopt($ch, CURLOPT_CUSTOMREQUEST, ${JSON.stringify(req.method)});\ncurl_setopt($ch, CURLOPT_HTTPHEADER, [\n${hArr}\n]);\n${bodyLine}$response = curl_exec($ch);\ncurl_close($ch);\necho $response;`;
}

function toRuby(req: CurlRequest): string {
  const headers = headersWithCookies(req);
  const setHeaders = Object.entries(headers)
    .map(([k, v]) => `req[${JSON.stringify(k)}] = ${JSON.stringify(v)}`)
    .join("\n");
  const bodyLine = req.body !== undefined ? `req.body = ${JSON.stringify(req.body)}\n` : "";
  const klass = req.method[0] + req.method.slice(1).toLowerCase();
  return `require "net/http"\nrequire "uri"\n\nuri = URI(${JSON.stringify(req.url)})\nhttp = Net::HTTP.new(uri.host, uri.port)\nhttp.use_ssl = uri.scheme == "https"\n\nreq = Net::HTTP::${klass}.new(uri)\n${setHeaders}\n${bodyLine}res = http.request(req)\nputs res.body`;
}

function toRust(req: CurlRequest): string {
  const headers = headersWithCookies(req);
  const setHeaders = Object.entries(headers)
    .map(([k, v]) => `        .header(${JSON.stringify(k)}, ${JSON.stringify(v)})`)
    .join("\n");
  const bodyLine = req.body !== undefined ? `        .body(${JSON.stringify(req.body)})\n` : "";
  return `// Cargo.toml: reqwest = { version = "0.12", features = ["blocking", "json"] }\nuse reqwest::blocking::Client;\n\nfn main() -> Result<(), Box<dyn std::error::Error>> {\n    let client = Client::new();\n    let res = client\n        .${req.method.toLowerCase()}(${JSON.stringify(req.url)})\n${setHeaders}\n${bodyLine}        .send()?;\n    println!("{}", res.text()?);\n    Ok(())\n}`;
}

function toJava(req: CurlRequest): string {
  const headers = headersWithCookies(req);
  const setHeaders = Object.entries(headers)
    .map(([k, v]) => `    .header(${JSON.stringify(k)}, ${JSON.stringify(v)})`)
    .join("\n");
  const bodyLine =
    req.body !== undefined
      ? `HttpRequest.BodyPublishers.ofString(${JSON.stringify(req.body)})`
      : `HttpRequest.BodyPublishers.noBody()`;
  return `import java.net.URI;\nimport java.net.http.*;\n\nHttpClient client = HttpClient.newHttpClient();\nHttpRequest request = HttpRequest.newBuilder()\n    .uri(URI.create(${JSON.stringify(req.url)}))\n    .method(${JSON.stringify(req.method)}, ${bodyLine})\n${setHeaders}\n    .build();\n\nHttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());\nSystem.out.println(response.body());`;
}

function toCSharp(req: CurlRequest): string {
  const headers = headersWithCookies(req);
  const addHeaders = Object.entries(headers)
    .map(
      ([k, v]) =>
        `request.Headers.TryAddWithoutValidation(${JSON.stringify(k)}, ${JSON.stringify(v)});`,
    )
    .join("\n");
  const contentLine =
    req.body !== undefined
      ? `request.Content = new StringContent(${JSON.stringify(req.body)}, System.Text.Encoding.UTF8, ${JSON.stringify(req.bodyIsJson ? "application/json" : "text/plain")});\n`
      : "";
  return `using System.Net.Http;\n\nvar client = new HttpClient();\nvar request = new HttpRequestMessage(new HttpMethod(${JSON.stringify(req.method)}), ${JSON.stringify(req.url)});\n${addHeaders}\n${contentLine}var response = await client.SendAsync(request);\nvar body = await response.Content.ReadAsStringAsync();\nConsole.WriteLine(body);`;
}

function toPowershell(req: CurlRequest): string {
  const headers = headersWithCookies(req);
  const hLines = Object.entries(headers)
    .map(([k, v]) => `  ${JSON.stringify(k)} = ${JSON.stringify(v)}`)
    .join("\n");
  const bodyLine = req.body !== undefined ? ` -Body ${JSON.stringify(req.body)}` : "";
  return `$headers = @{\n${hLines}\n}\n\nInvoke-RestMethod -Uri ${JSON.stringify(req.url)} -Method ${req.method} -Headers $headers${bodyLine}`;
}

function safeUrl(url: string): URL {
  try {
    return new URL(url);
  } catch {
    return new URL("http://" + url);
  }
}

// ---------- component ----------

const DEFAULT_CURL = `curl -X POST 'https://api.example.com/v1/users' \\
  -H 'Authorization: Bearer sk_test_abc123' \\
  -H 'Content-Type: application/json' \\
  -d '{"name":"Ada Lovelace","email":"ada@example.com","role":"admin"}'`;

type Lang = {
  id: string;
  label: string;
  ext: string;
  gen: (r: CurlRequest) => string;
};

const LANGS: Lang[] = [
  { id: "fetch", label: "fetch", ext: "js", gen: toFetch },
  { id: "axios", label: "axios", ext: "ts", gen: toAxios },
  { id: "node", label: "Node https", ext: "js", gen: toNodeHttps },
  { id: "python", label: "Python", ext: "py", gen: toPython },
  { id: "go", label: "Go", ext: "go", gen: toGo },
  { id: "php", label: "PHP", ext: "php", gen: toPhp },
  { id: "ruby", label: "Ruby", ext: "rb", gen: toRuby },
  { id: "rust", label: "Rust", ext: "rs", gen: toRust },
  { id: "java", label: "Java", ext: "java", gen: toJava },
  { id: "csharp", label: "C#", ext: "cs", gen: toCSharp },
  { id: "ps", label: "PowerShell", ext: "ps1", gen: toPowershell },
];

export function CurlConverter() {
  const [input, setInput] = useState(DEFAULT_CURL);
  const [lang, setLang] = useState("fetch");

  const parsed = useMemo(() => parseCurl(input), [input]);
  const isError = "error" in (parsed as object);

  const active = LANGS.find((l) => l.id === lang)!;
  const output = !isError ? active.gen(parsed as CurlRequest) : "";

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel
        title="curl command"
        actions={
          <Button
            size="sm"
            variant="ghost"
            className="h-7 gap-1.5 text-xs"
            onClick={() => setInput(DEFAULT_CURL)}
          >
            <Wand2 className="size-3" /> Example
          </Button>
        }
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          className="min-h-[420px] rounded-none border-0 font-mono text-xs resize-none focus-visible:ring-0"
          placeholder="Paste any curl command…"
        />
        {isError && (
          <div className="border-t border-border px-3 py-2 text-xs text-destructive bg-destructive/5">
            {(parsed as { error: string }).error}
          </div>
        )}
        {!isError && (
          <div className="border-t border-border px-3 py-2 text-[11px] font-mono text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
            <span>
              <span className="text-foreground">{(parsed as CurlRequest).method}</span>{" "}
              {(parsed as CurlRequest).url}
            </span>
            <span>{Object.keys((parsed as CurlRequest).headers).length} headers</span>
            {(parsed as CurlRequest).body && (
              <span>{new Blob([(parsed as CurlRequest).body!]).size} B body</span>
            )}
          </div>
        )}
      </Panel>

      <Panel
        title={`Output · ${active.label}`}
        actions={
          <>
            <CopyButton text={output} />
            <DownloadButton filename={`request.${active.ext}`} content={output} />
          </>
        }
      >
        <div className="p-2 border-b border-border">
          <Tabs value={lang} onValueChange={setLang}>
            <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
              {LANGS.map((l) => (
                <TabsTrigger
                  key={l.id}
                  value={l.id}
                  className="h-7 px-2.5 text-xs data-[state=active]:bg-muted"
                >
                  {l.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <pre className="p-4 text-xs font-mono whitespace-pre-wrap overflow-auto min-h-[400px] max-h-[520px]">
          {isError ? "" : output}
        </pre>
      </Panel>
    </div>
  );
}
