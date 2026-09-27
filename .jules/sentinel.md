## 2026-03-30 - SSRF Filter Bypasses via IPv6 Brackets, IPv4-Mapped IPv6, and Multi-Hop Redirects

**Vulnerability:** The server function `fetchHtml` in `src/lib/fetch-html.functions.ts` prevented SSRF using regex checks on hostnames, but `new URL("http://[::1]").hostname` returned bracketed `[::1]` and `[::ffff:127.0.0.1]`, which bypassed the regex patterns. In addition, `redirect: "follow"` in the redirect handler allowed multi-hop redirect chains (e.g. public URL -> public redirector -> internal host) to bypass host validation on subsequent hops.
**Learning:** URL parser `hostname` properties preserve brackets for IPv6 literals and preserve `::ffff:` notation. Furthermore, relying on native `redirect: "follow"` delegates subsequent redirect hops to `fetch` without invoking server-side validation callbacks.
**Prevention:** Normalize hostnames by stripping `[]` brackets and converting IPv4-mapped IPv6 addresses (`::ffff:`) prior to pattern checks. Use `redirect: "manual"` in a loop (capped at max redirects) to validate protocol and hostname before every HTTP request hop.

## 2026-03-30 - Client-side XSS via Dangerously Set Inner HTML in Markdown Renderers

**Vulnerability:** `src/tools/docx-to-markdown.tsx`, `src/tools/text-to-markdown.tsx`, `src/tools/markdown-editor.tsx`, and `src/tools/ai.tsx` rendered converted DOCX/Markdown HTML directly into the DOM using `dangerouslySetInnerHTML` without sanitization. Embedded script tags or inline event attributes in DOCX files or markdown markup could execute malicious client-side JavaScript.
**Learning:** Parsing markdown or converting HTML with `marked` or `mammoth` does not sanitize unsafe HTML elements or attributes like `<script>` or `onerror=...`.
**Prevention:** Always wrap HTML output from `marked.parse(...)` with `DOMPurify.sanitize(...)` before rendering with `dangerouslySetInnerHTML`.
