## 2026-03-30 - DOM XSS Prevention in Client-Side Markdown Rendering

**Vulnerability:** In `src/tools/markdown-editor.tsx`, raw HTML produced by `marked.parse` was assigned directly to state and passed into React's `dangerouslySetInnerHTML`. An attacker providing user input containing embedded `<script>`, `<iframe>`, `onerror` handlers, or `javascript:` links could trigger DOM XSS execution in the browser.
**Learning:** Parsing Markdown to HTML using libraries like `marked` does not automatically strip unsafe HTML tags or JavaScript event attributes embedded within the input markdown string. Passing raw `marked` output into `dangerouslySetInnerHTML` allows arbitrary script execution.
**Prevention:** Always pass generated HTML through HTML sanitization (such as `DOMPurify.sanitize(...)` via `isomorphic-dompurify`) before setting inner HTML in React components.

## 2026-03-30 - SSRF Filter Bypasses via IPv6 Brackets, IPv4-Mapped IPv6, and Multi-Hop Redirects

**Vulnerability:** The server function `fetchHtml` in `src/lib/fetch-html.functions.ts` prevented SSRF using regex checks on hostnames, but `new URL("http://[::1]").hostname` returned bracketed `[::1]` and `[::ffff:127.0.0.1]`, which bypassed the regex patterns. In addition, `redirect: "follow"` in the redirect handler allowed multi-hop redirect chains (e.g. public URL -> public redirector -> internal host) to bypass host validation on subsequent hops.
**Learning:** URL parser `hostname` properties preserve brackets for IPv6 literals and preserve `::ffff:` notation. Furthermore, relying on native `redirect: "follow"` delegates subsequent redirect hops to `fetch` without invoking server-side validation callbacks.
**Prevention:** Normalize hostnames by stripping `[]` brackets and converting IPv4-mapped IPv6 addresses (`::ffff:`) prior to pattern checks. Use `redirect: "manual"` in a loop (capped at max redirects) to validate protocol and hostname before every HTTP request hop.
