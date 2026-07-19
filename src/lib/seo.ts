// Per-tool SEO overrides — grounded in Semrush keyword research (Nov 2026).
// Volumes / KDIs recorded inline as comments so future edits stay evidence-based.
// Format goal: primary keyword in <title>, primary + supporting keywords in
// description, long-tail + intent modifiers in keywords list.

export type ToolSeo = {
  title: string;       // <60 chars ideal, primary keyword first
  description: string; // <160 chars, natural sentence, primary + 1-2 supporting kws
  keywords: string[];  // long-tail phrases users actually search
};

export const TOOL_SEO: Record<string, ToolSeo> = {
  // High-volume, high-KDI — target with "online free no signup" modifiers.
  "json-formatter": {
    title: "JSON Formatter & Validator — Online, Free",
    description:
      "Free online JSON formatter, validator and minifier. Pretty-print JSON, fix syntax errors, and copy the result — no signup, works offline.",
    keywords: ["json formatter", "json validator", "json beautifier", "json pretty print", "json linter", "minify json", "format json online", "json viewer"],
  }, // json formatter — 90,500/mo, KDI 62
  "base64": {
    title: "Base64 Encode & Decode — Online Tool",
    description:
      "Encode text to Base64 or decode Base64 to text instantly. Free browser-based Base64 encoder / decoder — no upload, no tracking.",
    keywords: ["base64 decode", "base64 encode", "base64 encoder", "base64 decoder", "base64 to text", "text to base64", "b64 decode online"],
  }, // base64 decode — 40,500/mo, KDI 60
  "url-codec": {
    title: "URL Encoder & Decoder — Percent Encoding Online",
    description:
      "Encode and decode URL / URI components with percent-encoding. Free online URL decoder and encoder — safe for query strings and slugs.",
    keywords: ["url decoder", "url encoder", "url encode", "url decode", "percent encoding", "uri encode", "decode url online"],
  }, // url decoder — 8,100/mo, KDI 63
  "jwt-decoder": {
    title: "JWT Decoder — Inspect JSON Web Tokens Online",
    description:
      "Decode and inspect JWT tokens instantly — view header, payload, signature and expiry. Free online JWT decoder, nothing sent to a server.",
    keywords: ["jwt decoder", "decode jwt", "jwt parser", "json web token decoder", "jwt inspector", "verify jwt online"],
  }, // jwt decoder — 5,400/mo, KDI 44 (winnable)
  "uuid": {
    title: "UUID Generator — v4 UUIDs Online, Bulk",
    description:
      "Generate random UUID v4 identifiers instantly, one or in bulk. Free online UUID / GUID generator with copy-to-clipboard and download.",
    keywords: ["uuid generator", "guid generator", "uuid v4", "generate uuid", "random uuid", "bulk uuid"],
  }, // uuid generator — 14,800/mo, KDI 46 (winnable)
  "hash": {
    title: "Hash Generator — MD5, SHA-1, SHA-256, SHA-512",
    description:
      "Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from any text. Free online hash generator and checksum tool — 100% client-side.",
    keywords: ["hash generator", "md5 generator", "sha256 generator", "sha1 hash", "checksum generator", "text to md5"],
  }, // hash generator — 720/mo, KDI 48
  "timestamp": {
    title: "Unix Timestamp Converter — Epoch to Date",
    description:
      "Convert Unix timestamps to human dates and back, in your local timezone or UTC. Free online epoch converter with ISO 8601 output.",
    keywords: ["timestamp converter", "unix timestamp", "epoch converter", "unix time", "timestamp to date", "epoch to date"],
  }, // timestamp converter — 5,400/mo, KDI 57
  "regex": {
    title: "Regex Tester — Live Match Highlighting",
    description:
      "Test regular expressions online with live match highlighting, capture groups and flags. Free regex tester for JavaScript, PCRE-compatible syntax.",
    keywords: ["regex tester", "regex online", "regular expression tester", "regex101 alternative", "test regex", "regex match"],
  }, // regex tester — 18,100/mo, KDI 67
  "qrcode": {
    title: "QR Code Generator — Download PNG & SVG",
    description:
      "Generate a free QR code for any URL, Wi-Fi, text or vCard. Download as PNG or SVG, high resolution, no watermark, no signup.",
    keywords: ["qr code generator", "generate qr code", "qr code maker", "free qr code", "qr code png", "qr code svg"],
  }, // qr code generator — 1M/mo, KDI 96 (aspirational; long-tail focus)
  "color": {
    title: "Color Picker & HEX / RGB / HSL Converter",
    description:
      "Pick a color and convert between HEX, RGB, HSL and CSS values instantly. Free online color picker with clipboard copy.",
    keywords: ["color picker", "hex to rgb", "rgb to hex", "hex to hsl", "color converter", "css color picker"],
  }, // color picker — 301,000/mo, KDI 90
  "gradient": {
    title: "CSS Gradient Generator — Linear & Radial",
    description:
      "Design smooth CSS linear and radial gradients with a visual editor. Copy production-ready CSS — free online gradient generator.",
    keywords: ["css gradient generator", "linear gradient", "radial gradient", "gradient maker", "css background gradient"],
  }, // css gradient generator — 1,900/mo, KDI 73
  "box-shadow": {
    title: "CSS Box Shadow Generator — Live Preview",
    description:
      "Build layered CSS box-shadows visually with offsets, blur, spread and color. Copy the CSS instantly — free online box-shadow generator.",
    keywords: ["box shadow generator", "css box shadow", "shadow generator", "elevation css", "box-shadow maker"],
  }, // box shadow generator — 1,000/mo, KDI 40 (winnable)
  "border-radius": {
    title: "CSS Border Radius Generator — Preview & Copy",
    description:
      "Visualize CSS border-radius on each corner with a live preview. Copy the CSS in one click — free online border-radius generator.",
    keywords: ["border radius generator", "css border radius", "rounded corners css", "border-radius preview"],
  },
  "svg-optimizer": {
    title: "SVG Optimizer — Minify SVG Online",
    description:
      "Optimize and minify SVG source code — strip metadata, collapse groups, shrink file size. Free online SVG optimizer, runs in your browser.",
    keywords: ["svg optimizer", "minify svg", "svg minifier", "svg compressor", "clean svg", "optimize svg online"],
  }, // svg optimizer — 720/mo, KDI 49
  "markdown": {
    title: "Markdown Editor — Live Preview, GFM",
    description:
      "Write Markdown with a live side-by-side preview. GitHub-flavored syntax, code blocks, tables. Free online Markdown editor, no signup.",
    keywords: ["markdown editor", "markdown preview", "online markdown", "md editor", "github markdown editor", "gfm preview"],
  }, // markdown editor — 8,100/mo, KDI 85
  "playground": {
    title: "HTML CSS JS Playground — Live Code Sandbox",
    description:
      "Free online HTML, CSS and JavaScript playground with live preview. Test snippets in a sandboxed iframe — no signup, share via URL.",
    keywords: ["html playground", "css playground", "javascript playground", "html css js sandbox", "code playground online", "codepen alternative"],
  }, // html playground — 2,400/mo, KDI 64
  "http-status": {
    title: "HTTP Status Codes — Complete Reference",
    description:
      "Every HTTP status code explained — 1xx, 2xx, 3xx, 4xx, 5xx — with descriptions and use cases. Fast, searchable HTTP status reference.",
    keywords: ["http status codes", "http response codes", "status code reference", "http codes list", "401 vs 403", "http 200"],
  },
  "git-cheatsheet": {
    title: "Git Cheat Sheet — Essential Commands",
    description:
      "The Git commands you actually use — commit, branch, rebase, stash, reset. Copyable one-liner reference for daily version-control work.",
    keywords: ["git cheat sheet", "git commands", "git reference", "git commands cheat sheet", "common git commands"],
  },
  "linux-cheatsheet": {
    title: "Linux Commands Cheat Sheet — Bash Reference",
    description:
      "The most used Linux and Bash commands, grouped by task — files, processes, permissions, networking. Copyable Linux command reference.",
    keywords: ["linux commands cheat sheet", "bash commands", "linux command reference", "unix commands", "terminal commands"],
  },
  "vscode-shortcuts": {
    title: "VS Code Shortcuts — Keyboard Reference",
    description:
      "Every essential VS Code keyboard shortcut for macOS, Windows and Linux. Fast, searchable VS Code shortcut cheat sheet.",
    keywords: ["vscode shortcuts", "vs code keyboard shortcuts", "vscode cheat sheet", "visual studio code shortcuts"],
  },

  // AI tools — very low volume but very easy KDI. Rank fast, then grow with content.
  "ai-explainer": {
    title: "AI Code Explainer — Understand Any Snippet",
    description:
      "Paste any code snippet and get a plain-English explanation, line by line. Free AI code explainer for JavaScript, Python, Go, Rust and more.",
    keywords: ["ai code explainer", "explain code ai", "code to english", "ai code explanation", "explain this code"],
  }, // ai code explainer — 40/mo, KDI 26 (very easy win)
  "ai-optimizer": {
    title: "AI Code Optimizer — Refactor & Improve Code",
    description:
      "Get AI-powered suggestions to make your code faster, cleaner and more idiomatic. Free AI code refactoring and optimizer tool.",
    keywords: ["ai code optimizer", "ai refactor code", "code optimizer", "improve code ai", "ai code review"],
  },
  "ai-commit": {
    title: "AI Commit Message Generator — Conventional Commits",
    description:
      "Turn a git diff into a clean Conventional Commit message with AI. Free AI commit message generator — supports feat, fix, chore, docs and more.",
    keywords: ["ai commit message generator", "conventional commit generator", "git commit ai", "commit message ai", "generate commit message"],
  },
  "ai-sql": {
    title: "AI SQL Generator — Text to SQL Query",
    description:
      "Describe what you want and get a working SQL query — SELECT, JOIN, GROUP BY. Free AI SQL generator for PostgreSQL, MySQL and SQLite.",
    keywords: ["ai sql generator", "text to sql", "natural language to sql", "sql generator ai", "english to sql", "chat to sql"],
  }, // ai sql generator — KDI 0
  "ai-convert": {
    title: "AI Code Converter — Translate Between Languages",
    description:
      "Convert code between Python, TypeScript, Go, Rust, Java and more with AI. Free code translator that preserves logic and idioms.",
    keywords: ["ai code converter", "code translator", "python to typescript", "convert code between languages", "translate code ai"],
  },
  "ai-error": {
    title: "AI Error Explainer — Stack Trace to Fix",
    description:
      "Paste a stack trace or error message and get a plain-English diagnosis plus a suggested fix. Free AI-powered debugging assistant.",
    keywords: ["ai error explainer", "explain error message", "stack trace explainer", "debug error ai", "fix error ai"],
  },
  "ai-regex": {
    title: "AI Regex Generator — Describe → Pattern",
    description:
      "Describe the pattern in plain English and get a working regular expression, with an explanation. Free AI regex generator.",
    keywords: ["ai regex generator", "regex from english", "natural language regex", "generate regex ai", "regex builder ai"],
  }, // ai regex generator — KDI 11
  "ai-tests": {
    title: "AI Unit Test Generator — Vitest & Jest",
    description:
      "Paste a function and get a Vitest / Jest test suite covering the main paths and edge cases. Free AI unit test generator.",
    keywords: ["ai unit test generator", "generate unit tests ai", "vitest generator", "jest test generator", "ai test writer"],
  },

  "password": {
    title: "Password Generator — Strong, Secure, Free",
    description:
      "Generate strong random passwords with configurable length, symbols and an entropy meter. 100% client-side — nothing leaves your browser.",
    keywords: ["password generator", "strong password generator", "random password", "secure password", "password creator"],
  }, // password generator — 368,000/mo, KDI 77
  "lorem": {
    title: "Lorem Ipsum Generator — Placeholder Text",
    description:
      "Generate Lorem Ipsum placeholder paragraphs, sentences or words on demand. Free copyable dummy text generator for designers and developers.",
    keywords: ["lorem ipsum generator", "lorem ipsum", "placeholder text generator", "dummy text", "lipsum"],
  },
  "case-converter": {
    title: "Case Converter — camelCase, snake_case, kebab-case",
    description:
      "Convert text between camelCase, snake_case, kebab-case, PascalCase, CONSTANT_CASE and Title Case. Free online case converter.",
    keywords: ["case converter", "camelcase converter", "snake case converter", "kebab case converter", "convert text case"],
  },
  "yaml-json": {
    title: "YAML to JSON Converter — Bidirectional",
    description:
      "Convert YAML to JSON and JSON to YAML instantly, with syntax validation. Free online YAML ↔ JSON converter, runs in your browser.",
    keywords: ["yaml to json", "json to yaml", "yaml converter", "convert yaml online", "yml to json"],
  }, // yaml to json — 1,900/mo, KDI 26 (easy win)
  "csv-json": {
    title: "CSV to JSON Converter — Bidirectional",
    description:
      "Convert CSV to JSON and JSON to CSV with header detection and custom delimiters. Free online CSV ↔ JSON converter.",
    keywords: ["csv to json", "json to csv", "csv converter", "convert csv online", "csv parser"],
  }, // csv to json — 2,900/mo, KDI 59
  "number-base": {
    title: "Number Base Converter — Binary, Hex, Decimal, Octal",
    description:
      "Convert numbers between binary, octal, decimal, hexadecimal, base32 and base36. Free online number base converter.",
    keywords: ["number base converter", "binary to decimal", "decimal to hex", "hex to binary", "base converter"],
  },
  "text-diff": {
    title: "Text Diff Checker — Word & Line Comparison",
    description:
      "Compare two blocks of text with word- and line-level diff highlighting. Free online text diff tool, no upload required.",
    keywords: ["text diff", "diff checker", "compare text online", "text comparison tool", "diff tool"],
  }, // text diff — 2,900/mo, KDI 67
  "text-stats": {
    title: "Word Counter — Character, Reading Time Stats",
    description:
      "Count words, characters, sentences, paragraphs and reading time in any text. Free online word and character counter.",
    keywords: ["word counter", "character counter", "text statistics", "reading time calculator", "count characters online"],
  },
  "html-entities": {
    title: "HTML Entity Encoder & Decoder",
    description:
      "Encode text to HTML entities (&amp;, &lt;, &gt;) or decode HTML back to plain text. Free online HTML entity converter.",
    keywords: ["html entity encoder", "html entity decoder", "html escape", "html unescape", "encode html entities"],
  },
  "cron": {
    title: "Cron Expression Generator & Explainer",
    description:
      "Explain any cron expression in plain English and browse common presets — hourly, daily, weekly. Free online cron builder.",
    keywords: ["cron expression", "cron generator", "cron explainer", "crontab generator", "cron schedule"],
  }, // cron expression — 5,400/mo, KDI 67
  "meta-tags": {
    title: "Meta Tag Generator — SEO, Open Graph, Twitter",
    description:
      "Generate SEO meta tags, Open Graph and Twitter Card markup from a form. Free meta tag generator — copy-paste ready HTML.",
    keywords: ["meta tag generator", "open graph generator", "twitter card generator", "seo meta tags", "og tag generator"],
  },
  "slugify": {
    title: "Slugify — URL-Safe Slug Generator",
    description:
      "Convert any string into a clean URL-safe slug with custom separators and transliteration. Free online slugify tool.",
    keywords: ["slugify online", "url slug generator", "slug converter", "seo slug generator", "text to slug"],
  }, // slugify — 1,000/mo, KDI 38 (winnable)
  "favicon": {
    title: "Emoji Favicon Generator — SVG in One Click",
    description:
      "Turn any emoji into a browser-ready favicon SVG. Copy the <link> tag or download the file. Free emoji favicon generator.",
    keywords: ["emoji favicon generator", "favicon from emoji", "svg favicon", "emoji to favicon", "favicon maker"],
  },
  "image-base64": {
    title: "Image to Base64 — Data URL Encoder",
    description:
      "Convert any image (PNG, JPG, GIF, SVG, WebP) to a Base64 Data URL you can inline in CSS or HTML. Free client-side image encoder.",
    keywords: ["image to base64", "png to base64", "jpg to base64", "image data url", "base64 image encoder"],
  },
  "timezone": {
    title: "Timezone Converter — World Clock",
    description:
      "Convert any moment across world timezones — IANA names, UTC offset, DST-aware. Free online timezone converter.",
    keywords: ["timezone converter", "world clock", "utc converter", "convert time between timezones", "tz converter"],
  },
  "string-escape": {
    title: "String Escape / Unescape — JSON & JavaScript",
    description:
      "Escape and unescape JSON and JavaScript strings — quotes, newlines, unicode. Free online string escape tool.",
    keywords: ["json string escape", "javascript string escape", "unescape json", "escape string online", "js string escape"],
  },
  "schema-validator": {
    title: "Schema.org Validator — JSON-LD Structured Data Test",
    description:
      "Test JSON-LD structured data like Google Rich Results Test. Fetch a URL or paste HTML — see detected types, required-field errors and warnings.",
    keywords: ["schema validator", "json-ld tester", "structured data test", "rich results test", "schema.org validator", "google rich results", "seo structured data"],
  },
  "json-to-ts": {
    title: "JSON to TypeScript — Interface, Type & Zod Generator",
    description:
      "Convert JSON to TypeScript interfaces, type aliases or Zod schemas instantly. Handles nested objects, arrays, unions and nullables — free, in-browser.",
    keywords: ["json to typescript", "json to ts", "json to interface", "json to type", "json to zod", "typescript type generator", "quicktype alternative", "json schema to typescript"],
  },
  "mock-data": {
    title: "Mock Data Generator — Fake JSON, CSV & SQL Test Data",
    description:
      "Design a schema and generate realistic mock data as JSON, CSV, SQL INSERT, TypeScript or XML. Seedable, deterministic, and free — no signup.",
    keywords: ["mock data generator", "fake data generator", "test data generator", "json generator", "csv generator", "sql insert generator", "seed data", "dummy data online", "faker alternative"],
  },
  "curl-converter": {
    title: "cURL to Code — fetch, axios, Python, Go, Rust & more",
    description:
      "Convert any curl command to fetch, axios, Node, Python requests, Go, PHP, Ruby, Rust, Java, C# or PowerShell. Paste, pick a language, copy — free.",
    keywords: ["curl to code", "curl to fetch", "curl to axios", "curl to python", "curl to requests", "curl to go", "curl to php", "curl to c#", "curl converter online", "curl builder"],
  },
  "sql-formatter": {
    title: "SQL Formatter & Beautifier — 17 Dialects, Free Online",
    description:
      "Format, beautify and minify SQL for Postgres, MySQL, T-SQL, BigQuery, Snowflake, Oracle and more. Configurable indent, keyword case, expression width — free.",
    keywords: ["sql formatter", "sql beautifier", "format sql online", "sql pretty print", "sql minifier", "postgres sql formatter", "mysql formatter", "bigquery sql formatter", "snowflake sql formatter", "tsql formatter", "pl/sql formatter", "sql prettier"],
  }, // sql formatter — 22,200/mo, KDI 51
};
