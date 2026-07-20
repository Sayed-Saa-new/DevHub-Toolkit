import {
  Braces, Binary, Link2, KeyRound, FingerprintPattern as Fingerprint, Hash, Clock, Regex,
  QrCode, Palette, Blend, SquareDashed as BoxSelect, Squircle, FileCode as FileCode2, FileText,
  CirclePlay as PlayCircle, Globe, GitBranch, Terminal, Keyboard, Sparkles, Zap,
  MessageSquareCode, Lock, Type, CaseSensitive, FileBraces as FileJson, Table2,
  Calculator, GitCompare, TextAlignStart as AlignLeft, Code as Code2, CalendarClock, Image,
  Link, Smile, Globe as Globe2, Database, Languages, Bug, ScanSearch, FlaskConical,
  ShieldCheck, Boxes, SquareTerminal as TerminalSquare, Database as DatabaseZap,
  Diff,
  Ruler,
  ImageDown,
  KeySquare,
  FileType as FileType2,
  FileText as FileWord,
  GitCompareArrows,
} from "lucide-react-motion";
import type { ComponentType, SVGProps } from "react";

type LucideIcon = ComponentType<{ className?: string; size?: number } & Record<string, unknown>>;

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
  isNew?: boolean;
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
  { slug: "ai-explainer", name: "AI Code Explainer", description: "Explain any code snippet.", category: "ai", icon: Sparkles, keywords: ["ai", "explain", "code"] },
  { slug: "ai-optimizer", name: "AI Code Optimizer", description: "Suggest performance improvements.", category: "ai", icon: Zap, keywords: ["ai", "optimize", "refactor"] },
  { slug: "ai-commit", name: "AI Commit Messages", description: "Generate conventional commit messages.", category: "ai", icon: MessageSquareCode, keywords: ["ai", "git", "commit", "conventional"] },
  { slug: "ai-sql", name: "AI SQL Generator", description: "Natural language → SQL queries.", category: "ai", icon: Database, keywords: ["ai", "sql", "query", "database", "postgres", "text2sql"] },
  { slug: "ai-convert", name: "AI Code Converter", description: "Translate code between languages.", category: "ai", icon: Languages, keywords: ["ai", "convert", "translate", "python", "typescript", "language"] },
  { slug: "ai-error", name: "AI Error Explainer", description: "Paste a stack trace, get a plain-English fix.", category: "ai", icon: Bug, keywords: ["ai", "error", "debug", "stack trace", "fix"] },
  { slug: "ai-regex", name: "AI Regex Generator", description: "Describe a pattern, get a regex.", category: "ai", icon: ScanSearch, keywords: ["ai", "regex", "pattern", "generate"] },
  { slug: "ai-tests", name: "AI Unit Test Generator", description: "Generate Vitest test suites from a function.", category: "ai", icon: FlaskConical, keywords: ["ai", "tests", "unit", "vitest", "jest", "tdd"] },

  // ---- Upgraded extras ----
  { slug: "password", name: "Password Generator", description: "Cryptographically strong passwords with entropy meter.", category: "generators", icon: Lock, keywords: ["password", "secure", "random", "entropy"] },
  { slug: "lorem", name: "Lorem Ipsum", description: "Generate placeholder paragraphs on demand.", category: "generators", icon: Type, keywords: ["lorem", "ipsum", "placeholder", "dummy"] },
  { slug: "case-converter", name: "Case Converter", description: "camelCase, snake_case, kebab-case & more.", category: "converters", icon: CaseSensitive, keywords: ["case", "camel", "snake", "kebab", "pascal"] },
  { slug: "yaml-json", name: "YAML ↔ JSON", description: "Convert between YAML and JSON structures.", category: "converters", icon: FileJson, keywords: ["yaml", "json", "yml", "convert"] },
  { slug: "csv-json", name: "CSV ↔ JSON", description: "Convert tabular CSV to JSON and back.", category: "converters", icon: Table2, keywords: ["csv", "json", "table", "convert"] },
  { slug: "number-base", name: "Number Base", description: "Binary, octal, decimal, hex, base32/36.", category: "converters", icon: Calculator, keywords: ["binary", "hex", "octal", "base", "number"] },
  { slug: "text-diff", name: "Text Diff", description: "Word- and line-level diff viewer.", category: "editors", icon: GitCompare, keywords: ["diff", "compare", "text"] },
  { slug: "text-stats", name: "Text Statistics", description: "Word, character, reading-time analyzer.", category: "editors", icon: AlignLeft, keywords: ["word count", "characters", "reading", "stats"] },
  { slug: "html-entities", name: "HTML Entities", description: "Encode / decode HTML entity references.", category: "converters", icon: Code2, keywords: ["html", "entities", "escape", "encode"] },
  { slug: "cron", name: "Cron Explainer", description: "Explain and preset cron expressions.", category: "reference", icon: CalendarClock, keywords: ["cron", "schedule", "job", "linux"] },
  { slug: "meta-tags", name: "Meta Tag Generator", description: "SEO + Open Graph + Twitter card tags.", category: "generators", icon: Globe2, keywords: ["seo", "meta", "og", "twitter", "opengraph"] },
  { slug: "slugify", name: "Slugify", description: "URL-safe slugs with custom separators.", category: "converters", icon: Link, keywords: ["slug", "url", "seo"] },
  { slug: "favicon", name: "Emoji Favicon", description: "Turn any emoji into a favicon SVG.", category: "generators", icon: Smile, keywords: ["favicon", "emoji", "icon"] },
  { slug: "image-base64", name: "Image → Base64", description: "Convert images to inline Data URLs.", category: "converters", icon: Image, keywords: ["image", "base64", "data url", "inline"] },
  { slug: "timezone", name: "Timezone Converter", description: "Convert a moment across world timezones.", category: "converters", icon: Globe, keywords: ["timezone", "tz", "utc", "world clock"] },
  { slug: "string-escape", name: "String Escape", description: "Escape and unescape JSON / JS strings.", category: "converters", icon: Binary, keywords: ["escape", "unescape", "json string", "js string"] },
  { slug: "schema-validator", name: "Schema.org Validator", description: "Test JSON-LD structured data like Google Rich Results.", category: "editors", icon: ShieldCheck, keywords: ["schema", "json-ld", "structured data", "rich results", "seo", "google", "validator"] },
  { slug: "json-to-ts", name: "JSON → TypeScript", description: "Generate TypeScript interfaces, types, or Zod schemas from JSON.", category: "converters", icon: FileJson, keywords: ["json to typescript", "json to ts", "json to interface", "json to zod", "type generator", "quicktype"], isNew: true },
  { slug: "mock-data", name: "Mock Data Generator", description: "Design a schema and generate JSON, CSV, SQL, TS or XML mock data.", category: "generators", icon: Boxes, keywords: ["mock data", "fake data", "faker", "test data", "seed data", "dummy json", "json generator", "sql insert generator"], isNew: true },
  { slug: "curl-converter", name: "cURL → Code", description: "Convert any curl command to fetch, axios, Python, Go, Rust, Java, C#, and more.", category: "converters", icon: TerminalSquare, keywords: ["curl to code", "curl to fetch", "curl to axios", "curl to python", "curl to go", "curl converter", "curl to requests", "http client generator"], isNew: true },
  { slug: "sql-formatter", name: "SQL Formatter", description: "Beautify, minify and lint SQL for 17 dialects — Postgres, MySQL, BigQuery, Snowflake, T-SQL & more.", category: "editors", icon: DatabaseZap, keywords: ["sql formatter", "sql beautifier", "format sql online", "sql pretty print", "sql minifier", "postgres formatter", "mysql formatter", "bigquery formatter", "tsql formatter", "snowflake formatter"], isNew: true },
  { slug: "json-diff", name: "JSON Diff", description: "Compare two JSON documents structurally — see added, removed and changed keys with paths.", category: "editors", icon: Diff, keywords: ["json diff", "compare json", "json compare", "json difference", "diff json online", "json patch", "structural diff"], isNew: true },
  { slug: "clamp-calculator", name: "CSS Clamp Calculator", description: "Fluid typography and spacing with CSS clamp() — px/rem output and live preview.", category: "design", icon: Ruler, keywords: ["css clamp", "clamp calculator", "fluid typography", "fluid type", "responsive font size", "clamp generator", "utopia clamp"], isNew: true },
  { slug: "image-compressor", name: "Image Compressor", description: "Compress JPEG, PNG, WebP & AVIF in your browser — batch, resize, convert to WebP, 100% local.", category: "converters", icon: ImageDown, keywords: ["image compressor", "compress image", "compress jpeg", "compress png", "webp converter", "image optimizer", "resize image", "bulk compress"], isNew: true },
  { slug: "jwt-generator", name: "JWT Generator", description: "Sign HS256/384/512 JSON Web Tokens with claim helpers, random secret and live cURL — 100% client-side.", category: "generators", icon: KeySquare, keywords: ["jwt generator", "sign jwt", "create jwt", "hs256 generator", "hs512 generator", "json web token generator", "jwt builder", "jwt maker"], isNew: true },
  { slug: "text-to-markdown", name: "Text → Markdown", description: "Convert plain text, HTML, or rich pasted content into clean GFM Markdown — with live preview.", category: "converters", icon: FileType2, keywords: ["text to markdown", "html to markdown", "rich text to markdown", "convert to md", "paste to markdown", "turndown", "gfm converter"], isNew: true },
  { slug: "docx-to-markdown", name: "DOCX → Markdown", description: "Convert Word .docx files to clean Markdown in your browser — batch, images, tables, 100% client-side.", category: "converters", icon: FileWord, keywords: ["docx to markdown", "word to markdown", "docx converter", "word to md", "docx to md", "convert docx", "mammoth", "batch docx"], isNew: true },
  { slug: "diff-checker", name: "Diff Checker", description: "Compare text, code or files side-by-side or unified — line, word or char diff, patch export, 100% local.", category: "editors", icon: GitCompareArrows, keywords: ["diff checker", "text diff", "compare text", "code diff", "file compare", "compare two files", "diff tool online", "unified diff", "side by side diff", "diff viewer"], isNew: true },
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