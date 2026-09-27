import { describe, expect, it } from "bun:test";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { marked } from "marked";

const window = new JSDOM("").window;
const purify = DOMPurify(window as unknown as Window);

describe("HTML Sanitization - DOMPurify", () => {
  it("strips script tags and inline event handlers from HTML", () => {
    const maliciousHtml =
      '<p>Hello <script>alert("xss")</script><img src="x" onerror="alert(1)"></p>';
    const sanitized = purify.sanitize(maliciousHtml);
    expect(sanitized).not.toContain("<script>");
    expect(sanitized).not.toContain("onerror");
    expect(sanitized).toBe('<p>Hello <img src="x"></p>');
  });

  it("sanitizes parsed markdown with embedded XSS payloads", () => {
    const markdownWithXss =
      "# Title\n\n[click me](javascript:alert(1))\n\n<img src=x onerror=alert(2) />";
    const rawHtml = String(marked.parse(markdownWithXss, { async: false }));
    const sanitized = purify.sanitize(rawHtml);

    expect(sanitized).not.toContain("javascript:");
    expect(sanitized).not.toContain("onerror");
  });

  it("preserves safe HTML elements and attributes", () => {
    const safeHtml =
      '<h1>Heading</h1><p>Paragraph with <strong>bold</strong> and <a href="https://example.com">link</a></p>';
    const sanitized = purify.sanitize(safeHtml);
    expect(sanitized).toBe(safeHtml);
  });
});
