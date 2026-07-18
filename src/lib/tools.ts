import type { LucideIcon } from "lucide-react";
import {
  Braces, Binary, Link2, KeyRound, Fingerprint, Hash, Clock, Regex,
  QrCode, Palette, Blend, BoxSelect, Squircle, FileCode2, FileText,
  PlayCircle, Globe, GitBranch, Terminal, Keyboard, Sparkles, Zap,
  MessageSquareCode,
} from "lucide-react";

export type Category =
  | "converters"
  | "generators"
  | "design"
  | "editors"
  | "reference"
  | "ai";

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "converters", label: "Converters" },
  { id: "generators", label: "Generators" },
  { id: "design", label: "Design" },
  { id: "editors", label: "Editors" },
  { id: "reference", label: "Reference" },
  { id: "ai", label: "AI" },
];

export type Tool = {
  slug: string;
  name: string;
  description: string;
  category: Category;
  icon: LucideIcon;
  keywords: string[];
  status?: "ready" | "soon";
};

export const TOOLS: Tool[] = [
  { slug: "json-formatter", name: "JSON Formatter", description: "Format, validate, and minify JSON.", category: "editors", icon: Braces, keywords: ["json", "format", "validate", "pretty", "lint"] },
  { slug: "base64", name: "Base64", description: "Encode and decode Base64 strings.", category: "converters", icon: Binary, keywords: ["base64", "encode", "decode", "b64"] },
  { slug: "url-codec", name: "URL Encoder", description: "Encode and decode URL components.", category: "converters", icon: Link2, keywords: ["url", "uri", "encode", "decode", "percent"] },
  { slug: "jwt-decoder", name: "JWT Decoder", description: "Decode and inspect JSON Web Tokens.", category: "converters", icon: KeyRound, keywords: ["jwt", "token", "decode", "auth"] },
  { slug: "uuid", name: "UUID Generator", description: "Generate v4 UUIDs in bulk.", category: "generators", icon: Fingerprint, keywords: ["uuid", "guid", "v4", "id"] },
  { slug: "hash", name: "Hash Generator", description: "MD5, SHA-1, SHA-256, SHA-512 hashes.", category: "generators", icon: Hash, keywords: ["hash", "md5", "sha1", "sha256", "checksum"] },
  { slug: "timestamp", name: "Timestamp Converter", description: "Convert Unix timestamps to dates.", category: "converters", icon: Clock, keywords: ["unix", "timestamp", "epoch", "date", "iso"] },
  { slug: "regex", name: "Regex Tester", description: "Test regular expressions with live matches.", category: "editors", icon: Regex, keywords: ["regex", "regexp", "pattern", "match"] },
  { slug: "qrcode", name: "QR Code Generator", description: "Generate downloadable QR codes.", category: "generators", icon: QrCode, keywords: ["qr", "qrcode", "barcode"] },
  { slug: "color", name: "Color Converter", description: "Pick colors and convert HEX / RGB / HSL.", category: "design", icon: Palette, keywords: ["color", "hex", "rgb", "hsl", "picker"] },
  { slug: "gradient", name: "Gradient Generator", description: "Design smooth CSS gradients.", category: "design", icon: Blend, keywords: ["gradient", "css", "linear", "radial"] },
  { slug: "box-shadow", name: "Box Shadow", description: "Craft layered CSS box-shadows.", category: "design", icon: BoxSelect, keywords: ["shadow", "box-shadow", "css", "elevation"] },
  { slug: "border-radius", name: "Border Radius", description: "Visualize corner radius values.", category: "design", icon: Squircle, keywords: ["radius", "border", "corners", "css"] },
  { slug: "svg-optimizer", name: "SVG Optimizer", description: "Minify SVG source code.", category: "editors", icon: FileCode2, keywords: ["svg", "optimize", "minify"] },
  { slug: "markdown", name: "Markdown Editor", description: "Write markdown with live preview.", category: "editors", icon: FileText, keywords: ["markdown", "md", "preview", "editor"] },
  { slug: "playground", name: "HTML/CSS/JS Playground", description: "Live sandbox for web snippets.", category: "editors", icon: PlayCircle, keywords: ["html", "css", "js", "playground", "sandbox"] },
  { slug: "http-status", name: "HTTP Status Codes", description: "Every status code, explained.", category: "reference", icon: Globe, keywords: ["http", "status", "codes", "rest"] },
  { slug: "git-cheatsheet", name: "Git Cheat Sheet", description: "Essential Git commands.", category: "reference", icon: GitBranch, keywords: ["git", "cheat", "commands", "vcs"] },
  { slug: "linux-cheatsheet", name: "Linux Commands", description: "Common Linux/Unix commands.", category: "reference", icon: Terminal, keywords: ["linux", "bash", "shell", "unix"] },
  { slug: "vscode-shortcuts", name: "VS Code Shortcuts", description: "Keyboard shortcuts reference.", category: "reference", icon: Keyboard, keywords: ["vscode", "shortcuts", "editor"] },
  { slug: "ai-explainer", name: "AI Code Explainer", description: "Explain any code snippet.", category: "ai", icon: Sparkles, keywords: ["ai", "explain", "code"], status: "soon" },
  { slug: "ai-optimizer", name: "AI Code Optimizer", description: "Suggest performance improvements.", category: "ai", icon: Zap, keywords: ["ai", "optimize", "refactor"], status: "soon" },
  { slug: "ai-commit", name: "AI Commit Messages", description: "Generate conventional commit messages.", category: "ai", icon: MessageSquareCode, keywords: ["ai", "git", "commit", "conventional"], status: "soon" },
];

export const TOOLS_BY_SLUG: Record<string, Tool> = Object.fromEntries(
  TOOLS.map((t) => [t.slug, t]),
);

export function searchTools(query: string): Tool[] {
  const q = query.trim().toLowerCase();
  if (!q) return TOOLS;
  return TOOLS.filter((t) => {
    const hay = `${t.name} ${t.description} ${t.keywords.join(" ")} ${t.category}`.toLowerCase();
    return hay.includes(q);
  });
}