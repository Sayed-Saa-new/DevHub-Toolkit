import { describe, expect, it } from "bun:test";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

describe("HTML Sanitization", () => {
  it("sanitizes dangerous XSS scripts in HTML", () => {
    const window = new JSDOM("").window;
    const purify = DOMPurify(window as unknown as Window);
    const dirty =
      '<img src="x" onerror="alert(1)"> <script>alert("xss")</script> <a href="javascript:alert(1)">click</a>';
    const clean = purify.sanitize(dirty);
    expect(clean).not.toContain("onerror");
    expect(clean).not.toContain("<script>");
    expect(clean).not.toContain("javascript:");
    expect(clean).toContain('<img src="x">');
  });
});
