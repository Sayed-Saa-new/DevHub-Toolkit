import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// ---------------------------------------------------------------------------
// SSRF prevention: block private/loopback/link-local/metadata hostnames and
// IP ranges before making any outbound request.
// ---------------------------------------------------------------------------
const BLOCKED_HOST_PATTERNS: RegExp[] = [
  /^localhost$/i,
  /^127\.\d+\.\d+\.\d+$/, // 127.0.0.0/8 loopback
  /^0\.0\.0\.0$/,
  /^::1$/, // IPv6 loopback
  /^10\.\d+\.\d+\.\d+$/, // RFC-1918 10.0.0.0/8
  /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/, // RFC-1918 172.16-31.x.x
  /^192\.168\.\d+\.\d+$/, // RFC-1918 192.168.0.0/16
  /^169\.254\.\d+\.\d+$/, // link-local / AWS instance metadata
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.\d+\.\d+$/, // CGNAT 100.64/10
  /^fc[0-9a-f]{2}:/i, // IPv6 ULA fc00::/7
  /^fd[0-9a-f]{2}:/i,
  /^fe80:/i, // IPv6 link-local
  /^metadata\.google\.internal$/i, // GCP metadata
  /^metadata$/i,
  /^kubernetes\.default$/i,
  /^kubernetes\.default\.svc$/i,
];

export function isBlockedHost(hostname: string): boolean {
  // Strip IPv6 bracket notation if present
  let cleanHost = hostname.replace(/^\[|\]$/g, "").toLowerCase();

  // Handle IPv4-mapped IPv6 address (e.g., ::ffff:127.0.0.1 or ::ffff:7f00:1)
  if (cleanHost.startsWith("::ffff:")) {
    cleanHost = cleanHost.slice(7);
    if (cleanHost.includes(":")) {
      const parts = cleanHost.split(":").map((p) => parseInt(p, 16));
      if (parts.length === 2 && !parts.some(isNaN)) {
        cleanHost = `${(parts[0] >> 8) & 0xff}.${parts[0] & 0xff}.${(parts[1] >> 8) & 0xff}.${parts[1] & 0xff}`;
      }
    }
  }

  return BLOCKED_HOST_PATTERNS.some((p) => p.test(cleanHost));
}

const MAX_RESPONSE_BYTES = 2 * 1024 * 1024; // 2 MB response cap
const FETCH_TIMEOUT_MS = 10_000; // 10 s timeout
const MAX_REDIRECTS = 5;

export const fetchHtml = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ url: z.string().url() }).parse(data))
  .handler(async ({ data }) => {
    let currentUrl = data.url;
    let redirectCount = 0;
    let res: Response;

    while (true) {
      const parsed = new URL(currentUrl);

      // 1. Allow only http and https schemes
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new Error("Only http and https URLs are allowed.");
      }

      // 2. Block private/internal hosts
      if (isBlockedHost(parsed.hostname)) {
        throw new Error("Requests to internal hosts are not allowed.");
      }

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

      try {
        res = await fetch(currentUrl, {
          headers: {
            "User-Agent": "DevHubToolkit-SchemaValidator/1.0 (+https://devhub.flinkeo.online)",
            Accept: "text/html,application/xhtml+xml",
          },
          // Handle redirects manually so every hop is validated against SSRF rules
          redirect: "manual",
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timer);
      }

      // Check if redirect response (300..399)
      if (res.status >= 300 && res.status < 400) {
        redirectCount++;
        if (redirectCount > MAX_REDIRECTS) {
          throw new Error("Too many redirects.");
        }
        const location = res.headers.get("location");
        if (!location) throw new Error("Redirect with no Location header.");
        currentUrl = new URL(location, currentUrl).toString();
      } else {
        break;
      }
    }

    if (!res.ok) {
      throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
    }

    // 5. Cap response body size to prevent large payload abuse
    const reader = res.body?.getReader();
    if (!reader) throw new Error("No response body.");

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_RESPONSE_BYTES) {
        await reader.cancel();
        throw new Error("Response too large (max 2 MB).");
      }
      chunks.push(value);
    }

    // Reassemble the chunks into a single string
    const combined = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      combined.set(chunk, offset);
      offset += chunk.byteLength;
    }
    const html = new TextDecoder().decode(combined);

    return { html, finalUrl: currentUrl, status: res.status };
  });
