## 2026-07-27 - XSS Vulnerability in Markdown / HTML Preview Renderers via dangerouslySetInnerHTML

**Vulnerability:** Unsanitized parsed HTML output (from `marked.parse()`) was directly injected into DOM preview nodes using `dangerouslySetInnerHTML` in `text-to-markdown.tsx`, `markdown-editor.tsx`, `docx-to-markdown.tsx`, and `ai.tsx`. Malicious input containing `<script>`, event handlers like `onerror`, or `javascript:` links could execute arbitrary JavaScript in the victim's browser session.
**Learning:** Parsing markdown or HTML using libraries like `marked` or `mammoth` does not sanitize HTML content or embedded script tags/event handlers by default. Rendering raw HTML output with `dangerouslySetInnerHTML` requires explicit HTML sanitization.
**Prevention:** Sanitize all dynamic HTML content using DOMPurify before setting `dangerouslySetInnerHTML`. Implement a global helper function (`sanitizeHtml`) that handles window DOM context availability and strips malicious script tags and event handlers.

## 2026-03-30 - SSRF Filter Bypasses via IPv6 Brackets, IPv4-Mapped IPv6, and Multi-Hop Redirects

**Vulnerability:** The server function `fetchHtml` in `src/lib/fetch-html.functions.ts` prevented SSRF using regex checks on hostnames, but `new URL("http://[::1]").hostname` returned bracketed `[::1]` and `[::ffff:127.0.0.1]`, which bypassed the regex patterns. In addition, `redirect: "follow"` in the redirect handler allowed multi-hop redirect chains (e.g. public URL -> public redirector -> internal host) to bypass host validation on subsequent hops.
**Learning:** URL parser `hostname` properties preserve brackets for IPv6 literals and preserve `::ffff:` notation. Furthermore, relying on native `redirect: "follow"` delegates subsequent redirect hops to `fetch` without invoking server-side validation callbacks.
**Prevention:** Normalize hostnames by stripping `[]` brackets and converting IPv4-mapped IPv6 addresses (`::ffff:`) prior to pattern checks. Use `redirect: "manual"` in a loop (capped at max redirects) to validate protocol and hostname before every HTTP request hop.
