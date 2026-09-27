import DOMPurify from "dompurify";

export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined") {
    return "";
  }
  return DOMPurify.sanitize(html);
}
