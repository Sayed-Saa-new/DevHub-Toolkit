import { describe, expect, it } from "bun:test";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

function renderMarkdown(markdown: string): string {
  const rawHtml = String(marked.parse(markdown, { async: false, gfm: true, breaks: false }));
  return DOMPurify.sanitize(rawHtml);
}

describe("MarkdownEditor HTML Sanitization", () => {
  it("renders safe Markdown formatting correctly", () => {
    const input = "# Hello\n\n**Bold** and *Italic* text.";
    const output = renderMarkdown(input);
    expect(output).toContain("<h1>Hello</h1>");
    expect(output).toContain("<strong>Bold</strong>");
    expect(output).toContain("<em>Italic</em>");
  });

  it("strips script tags, inline event handlers, and javascript: URIs from input", () => {
    const input = `# XSS Test
<script>alert('xss')</script>
<img src="x" onerror="alert(1)">
<a href="javascript:alert(1)">Click me</a>
`;
    const output = renderMarkdown(input);
    expect(output).not.toContain("<script>");
    expect(output).not.toContain("onerror");
    expect(output).not.toContain("javascript:");
    expect(output).toContain("<h1>XSS Test</h1>");
    expect(output).toContain("<a>Click me</a>");
  });

  it("sanitizes dangerous HTML attributes while retaining safe content", () => {
    const input = `<iframe src="https://evil.com"></iframe><p style="color: red;">Safe text</p>`;
    const output = renderMarkdown(input);
    expect(output).not.toContain("iframe");
    expect(output).toContain("Safe text");
  });
});
