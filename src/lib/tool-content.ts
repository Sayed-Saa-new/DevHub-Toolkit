import { TOOLS } from "@/lib/tools";

// Long-form, SEO-optimized page content for high-priority tools.
// Rendered below the tool UI and mirrored to structured data (FAQ / HowTo).

export type ToolContent = {
  intro: string;
  headings?: Partial<Record<"features" | "examples" | "useCases" | "faq" | "related", string>>;
  features: { title: string; body: string }[];
  howTo: { name: string; steps: { name: string; text: string }[] };
  useCases: { title: string; body: string }[];
  examples: { prompt: string; sql: string; dialect: string }[];
  faq: { q: string; a: string }[];
  related?: { slug: string; label: string }[];
};

export const TOOL_CONTENT: Record<string, ToolContent> = {
  "json-formatter": {
    intro:
      "DevHub's JSON Formatter & Validator is a fast, 100% in-browser tool to pretty print, validate, lint, repair, and minify JSON data. Paste raw JSON payloads from APIs, database queries, or logs, and get structured output with collapsible tree views, precise syntax error highlighting, and one-click copy. No data is ever sent to a server.",
    headings: {
      features: "Features of the online JSON formatter & validator",
      examples: "JSON formatting & minification examples",
      useCases: "Common use cases for formatting & validating JSON",
      faq: "JSON Formatter & Validator — FAQ",
      related: "Related JSON & developer tools",
    },
    features: [
      {
        title: "Pretty print & custom indentation",
        body: "Format unreadable JSON with 2-space, 4-space, or tab indentation for clean readability.",
      },
      {
        title: "Syntax error detection & repair",
        body: "Locate syntax errors with line and column highlighting. Automatically fix common JSON issues like trailing commas or unquoted keys.",
      },
      {
        title: "Interactive tree view",
        body: "Expand and collapse deeply nested JSON objects and arrays to quickly inspect complex API structures.",
      },
      {
        title: "Fast minification",
        body: "Strip whitespaces and newlines to compress JSON for efficient payload transmission or storage.",
      },
      {
        title: "100% Client-side privacy",
        body: "All validation and formatting happen locally in your browser so sensitive tokens, keys, and PII stay secure.",
      },
    ],
    howTo: {
      name: "How to format and validate JSON online",
      steps: [
        {
          name: "Paste your raw JSON",
          text: "Copy unformatted JSON text from a terminal, network response, or file into the input pane.",
        },
        {
          name: "Validate & format",
          text: "Click Format / Beautify to pretty-print your JSON or view inline error markers if syntax is invalid.",
        },
        {
          name: "Explore or minify",
          text: "Toggle tree view to inspect nested keys or click Minify to compact your JSON string.",
        },
        {
          name: "Copy or export",
          text: "Copy the formatted JSON to your clipboard with one click.",
        },
      ],
    },
    useCases: [
      {
        title: "Debugging REST & GraphQL APIs",
        body: "Unpack minified API responses, verify status payloads, and inspect nested structures during development.",
      },
      {
        title: "Cleaning up config files",
        body: "Format package.json, tsconfig.json, or app settings with consistent spacing.",
      },
      {
        title: "Validating webhook payloads",
        body: "Ensure incoming webhook events adhere to strict JSON formatting before writing test handlers.",
      },
    ],
    examples: [
      {
        dialect: "Unformatted JSON",
        prompt: "Minified API response string",
        sql: `{"status":200,"data":{"user":{"id":101,"name":"Alice","roles":["admin","editor"]}}}`,
      },
      {
        dialect: "Formatted JSON (2 spaces)",
        prompt: "Pretty-printed JSON result",
        sql: `{
  "status": 200,
  "data": {
    "user": {
      "id": 101,
      "name": "Alice",
      "roles": [
        "admin",
        "editor"
      ]
    }
  }
}`,
      },
    ],
    faq: [
      {
        q: "Is this JSON Formatter free to use?",
        a: "Yes, 100% free with no limits, rate restrictions, or account signups.",
      },
      {
        q: "Is my JSON payload sent to any server?",
        a: "No. All formatting, validation, and tree rendering happen locally in your browser.",
      },
      {
        q: "How does the JSON validator fix syntax errors?",
        a: "The built-in parser identifies common mistakes like trailing commas, missing quotes around keys, or single quote usage and offers automatic correction options.",
      },
      {
        q: "Can I format very large JSON files?",
        a: "Yes. Files up to several megabytes process in milliseconds directly inside browser memory.",
      },
    ],
    related: [
      { slug: "json-diff", label: "JSON Diff" },
      { slug: "json-to-ts", label: "JSON → TypeScript" },
      { slug: "yaml-json", label: "YAML ↔ JSON" },
      { slug: "csv-json", label: "CSV ↔ JSON" },
    ],
  },
  base64: {
    intro:
      "DevHub's Base64 Encoder & Decoder lets you encode plain text to Base64 format or decode Base64 strings back to human-readable text instantly. It fully supports UTF-8 multi-byte characters (including Bangla, Arabic, Chinese, and emojis) and URL-safe Base64 variants. 100% client-side execution ensures your strings and tokens are never uploaded anywhere.",
    headings: {
      features: "Features of the online Base64 tool",
      examples: "Base64 encoding and decoding examples",
      useCases: "Common use cases for Base64 encoding",
      faq: "Base64 Encoder & Decoder — FAQ",
      related: "Related conversion & security tools",
    },
    features: [
      {
        title: "Bidirectional conversion",
        body: "Encode text to Base64 or decode Base64 strings in one click without page reloads.",
      },
      {
        title: "Full UTF-8 & Emoji support",
        body: "Correctly handles multi-byte UTF-8 character sets, special symbols, and emojis without encoding corruption.",
      },
      {
        title: "URL-safe variant toggle",
        body: "Optionally replace '+' with '-' and '/' with '_' for safe inclusion in query parameters and URLs.",
      },
      {
        title: "Live real-time output",
        body: "Output updates as you type with instant character count and size comparisons.",
      },
    ],
    howTo: {
      name: "How to encode or decode Base64 online",
      steps: [
        {
          name: "Select mode",
          text: "Choose whether to Encode text to Base64 or Decode Base64 to text.",
        },
        {
          name: "Enter your input",
          text: "Paste your raw text or Base64 string into the input text area.",
        },
        {
          name: "Copy converted output",
          text: "Click the Copy button to copy the converted result to your clipboard.",
        },
      ],
    },
    useCases: [
      {
        title: "Basic authentication headers",
        body: "Encode username:password credentials for HTTP Basic Auth headers.",
      },
      {
        title: "Embedding binary data in text",
        body: "Safe transport of raw strings, API signatures, or payload parameters inside JSON and URLs.",
      },
      {
        title: "Inspecting encoded API tokens",
        body: "Quickly decode opaque Base64 strings in URL parameters or webhooks.",
      },
    ],
    examples: [
      {
        dialect: "Text → Base64",
        prompt: "Encoding string with unicode",
        sql: "Input: Hello World! 👋\nBase64: SGVsbG8gV29ybGQhIPCfkYI=",
      },
      {
        dialect: "Base64 → Text",
        prompt: "Decoding Basic Auth credential",
        sql: "Base64: YWRtaW46c2VjcmV0MTIz\nDecoded: admin:secret123",
      },
    ],
    faq: [
      {
        q: "Is Base64 encryption?",
        a: "No. Base64 is an encoding scheme, not encryption. Anyone can decode a Base64 string back to plaintext without a key.",
      },
      {
        q: "Does this tool support Bangla and Unicode characters?",
        a: "Yes. It uses proper UTF-8 byte encoding so Bangla, emojis, and non-ASCII text convert seamlessly.",
      },
      {
        q: "Is it safe to decode tokens here?",
        a: "Yes. All processing happens locally in your browser with zero network requests.",
      },
    ],
    related: [
      { slug: "url-codec", label: "URL Encoder" },
      { slug: "jwt-decoder", label: "JWT Decoder" },
      { slug: "image-base64", label: "Image → Base64" },
      { slug: "string-escape", label: "String Escape" },
    ],
  },
  uuid: {
    title: "",
    intro:
      "DevHub's UUID Generator creates cryptographically strong Version 4 (v4) and Version 7 (v7) Universally Unique Identifiers (UUIDs) individually or in bulk. Features include customizable uppercase/lowercase toggle, hyphen removal, bracket wrapping, and instant copy/download as text or JSON. Powered by window.crypto for guaranteed randomness.",
    features: [
      {
        title: "Bulk generation",
        body: "Generate up to 1,000 UUIDs at once with zero latency.",
      },
      {
        title: "UUID v4 & v7 support",
        body: "Generate standard random UUID v4 or time-ordered UUID v7 for database-friendly indexing.",
      },
      {
        title: "Formatting options",
        body: "Toggle hyphens, uppercase lettering, and bracket enclosing to match your database or API schema.",
      },
      {
        title: "Crypto-grade randomness",
        body: "Uses native Web Crypto API for collision-resistant unique ID generation.",
      },
    ],
    howTo: {
      name: "How to generate UUIDs in bulk",
      steps: [
        {
          name: "Select quantity & version",
          text: "Choose how many UUIDs you need and select UUID v4 or v7.",
        },
        {
          name: "Customize formatting",
          text: "Toggle uppercase, hyphens, or quotes as required.",
        },
        {
          name: "Copy or download",
          text: "Click Copy All or Download to save the generated list.",
        },
      ],
    },
    useCases: [
      {
        title: "Database primary keys",
        body: "Generate unique IDs for database seed scripts, Postgres UUID columns, and MongoDB documents.",
      },
      {
        title: "API test mocks",
        body: "Populate mock API requests and fixture files with realistic, unique identifiers.",
      },
    ],
    examples: [
      {
        dialect: "UUID v4",
        prompt: "Standard random UUID",
        sql: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      },
      {
        dialect: "UUID v7",
        prompt: "Time-ordered sortable UUID",
        sql: "018f3a5b-8912-71a2-93bc-49e0b82f1234",
      },
    ],
    faq: [
      {
        q: "What is the difference between UUID v4 and UUID v7?",
        a: "UUID v4 is completely random. UUID v7 embeds a Unix timestamp prefix, making it chronological and ideal for database primary key indexing.",
      },
      {
        q: "Can UUID v4 collide?",
        a: "The probability of a UUID v4 collision is practically zero — requiring billions of UUIDs generated per second for centuries.",
      },
    ],
    related: [
      { slug: "hash", label: "Hash Generator" },
      { slug: "password", label: "Password Generator" },
      { slug: "mock-data", label: "Mock Data Generator" },
    ],
  },
  regex: {
    intro:
      "DevHub's Regex Tester & Debugger provides real-time pattern matching with live visual match highlighting, capture group extraction, and regex flags toggling (g, i, m, s, u, y). Built for JavaScript regex testing, it helps developers build and test regular expressions instantly in their browser.",
    features: [
      {
        title: "Live match highlighting",
        body: "Highlights regex matches and capturing groups in real time as you type.",
      },
      {
        title: "Capture group breakdown",
        body: "Displays full match indices, named capture groups, and substring matches in an easy table.",
      },
      {
        title: "Flag toggles",
        body: "Easily enable global (g), case-insensitive (i), multiline (m), dotAll (s), unicode (u), and sticky (y) flags.",
      },
      {
        title: "Common cheatsheet presets",
        body: "Quick preset insertion for email validation, URLs, IP addresses, dates, and phone numbers.",
      },
    ],
    howTo: {
      name: "How to test regular expressions online",
      steps: [
        {
          name: "Enter pattern & flags",
          text: "Type your regular expression in the search bar and select active flags.",
        },
        {
          name: "Paste test text",
          text: "Insert sample text into the editor pane to see live match highlights.",
        },
        {
          name: "Inspect match results",
          text: "Check match counts, capture groups, and index offsets below the editor.",
        },
      ],
    },
    useCases: [
      {
        title: "Form input validation",
        body: "Test expressions for emails, passwords, usernames, and phone numbers before adding to client code.",
      },
      {
        title: "Text parsing & extractions",
        body: "Extract log timestamps, URLs, or specific ID patterns from raw server logs.",
      },
    ],
    examples: [
      {
        dialect: "Email Regex",
        prompt: "Standard email pattern",
        sql: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`,
      },
    ],
    faq: [
      {
        q: "Is this Regex tester JavaScript compatible?",
        a: "Yes. It utilizes the native JavaScript RegExp engine running directly inside your browser.",
      },
      {
        q: "Does it support named capture groups?",
        a: "Yes. Named capture groups like (?<year>\\d{4}) are fully supported and displayed in the breakdown.",
      },
    ],
    related: [
      { slug: "ai-regex", label: "AI Regex Generator" },
      { slug: "slugify", label: "Slugify" },
      { slug: "case-converter", label: "Case Converter" },
    ],
  },
  "json-diff": {
    intro:
      "DevHub's JSON Diff Checker compares two JSON documents or objects structurally. It highlights added, removed, and modified keys along with exact JSON paths (e.g., $.users[0].email), allowing developers to debug API payload changes, environment configuration drifts, and schema migrations easily. Includes key sorting and JSON patch exports.",
    features: [
      {
        title: "Structural comparison",
        body: "Compares JSON by semantic structure rather than raw text line diffing.",
      },
      {
        title: "Full JSON path tracking",
        body: "Displays full JSON pointer paths for every detected change.",
      },
      {
        title: "Key sorting & formatting",
        body: "Optionally sort object keys before comparison to avoid false diffs caused by key ordering.",
      },
      {
        title: "Side-by-side & unified view",
        body: "Switch between dual pane visual diffs or compact summary lists.",
      },
    ],
    howTo: {
      name: "How to compare two JSON files online",
      steps: [
        {
          name: "Paste Left & Right JSON",
          text: "Paste the original JSON document in the left pane and modified JSON in the right pane.",
        },
        {
          name: "Compare differences",
          text: "View color-coded additions (green), removals (red), and changes (yellow).",
        },
        {
          name: "Copy JSON Patch",
          text: "Export or copy the JSON Patch (RFC 6902) delta string.",
        },
      ],
    },
    useCases: [
      {
        title: "API response diffing",
        body: "Compare staging vs production API responses to detect unexpected field regressions.",
      },
      {
        title: "Config file auditing",
        body: "Compare Kubernetes manifests, tsconfig files, or appsettings.json across environments.",
      },
    ],
    examples: [
      {
        dialect: "JSON Delta",
        prompt: "Property change detection",
        sql: `Left:  {"version": 1, "status": "active"}
Right: {"version": 2, "status": "active", "newKey": true}

Diff:
+ $.newKey: true
~ $.version: 1 -> 2`,
      },
    ],
    faq: [
      {
        q: "How is JSON Diff different from a regular text diff?",
        a: "Text diffs fail if keys are reordered or whitespace changes. Structural JSON diff compares semantic key-value pairs regardless of key order.",
      },
      {
        q: "Is my JSON comparison private?",
        a: "Yes. Both JSON documents are parsed and diffed entirely inside your local browser memory.",
      },
    ],
    related: [
      { slug: "json-formatter", label: "JSON Formatter" },
      { slug: "diff-checker", label: "Diff Checker" },
      { slug: "json-to-ts", label: "JSON → TypeScript" },
    ],
  },
  "diff-checker": {
    intro:
      "DevHub's Diff Checker lets you compare text, code snippets, or configuration files side-by-side or in unified diff format. Features include line-by-line, word-level, and character-level diff highlighting, case/whitespace toggles, and instant unified patch file exports. Ideal for comparing source code, Markdown drafts, or SQL logs without uploading files.",
    features: [
      {
        title: "Side-by-side & unified views",
        body: "Toggle between dual-pane split view or unified inline diff view.",
      },
      {
        title: "Granular diff levels",
        body: "Highlight differences at line, word, or character granularity.",
      },
      {
        title: "Whitespace & case options",
        body: "Ignore trailing whitespaces, blank lines, or character case to focus on meaningful changes.",
      },
      {
        title: "Unified patch export",
        body: "Download standard .patch files ready for git apply.",
      },
    ],
    howTo: {
      name: "How to compare two text files online",
      steps: [
        {
          name: "Paste text or upload files",
          text: "Insert original text in the left box and revised text in the right box.",
        },
        {
          name: "Select diff settings",
          text: "Choose Side-by-Side or Unified view, and pick Word or Line diff mode.",
        },
        {
          name: "Inspect & export",
          text: "Review highlighted differences or export the patch.",
        },
      ],
    },
    useCases: [
      {
        title: "Code review sanity checks",
        body: "Compare modified code files before committing when working without Git UI tools.",
      },
      {
        title: "Copywriting & document auditing",
        body: "Inspect edits made between versions of blog posts, documentation, or legal contracts.",
      },
    ],
    examples: [
      {
        dialect: "Unified Diff",
        prompt: "Line change sample",
        sql: `--- Original
+++ Revised
@@ -1,3 +1,3 @@
 const port = 3000;
-console.log("Starting server...");
+console.log("Server listening on port " + port);`,
      },
    ],
    faq: [
      {
        q: "Are my compared files uploaded to any server?",
        a: "No. Diff comparison runs entirely in your browser using local JavaScript diffing algorithms.",
      },
      {
        q: "Can I compare large files?",
        a: "Yes. Files with thousands of lines process smoothly in-browser.",
      },
    ],
    related: [
      { slug: "json-diff", label: "JSON Diff" },
      { slug: "text-diff", label: "Text Diff" },
      { slug: "text-stats", label: "Text Statistics" },
    ],
  },
  "sql-formatter": {
    intro:
      "DevHub's SQL Formatter & Beautifier formats, cleans, and minifies SQL queries across 17 database dialects including PostgreSQL, MySQL, MariaDB, SQLite, SQL Server (T-SQL), Oracle (PL/SQL), BigQuery, Snowflake, and Redshift. Customize indent size, keyword casing (UPPERCASE/lowercase), comma placement, and query width for consistent SQL code style.",
    features: [
      {
        title: "17 SQL Dialects",
        body: "Native support for Postgres, MySQL, BigQuery, Snowflake, T-SQL, PL/SQL, SQLite, Hive, Spark, and more.",
      },
      {
        title: "Customizable formatting rules",
        body: "Set keyword case (UPPERCASE, lowercase, preserve), indentation (2 or 4 spaces, tabs), and expression line wrapping.",
      },
      {
        title: "SQL Minification",
        body: "Compress queries into single-line strings for inline code embedding or ORM strings.",
      },
      {
        title: "Syntax error detection",
        body: "Highlights invalid SQL syntax before formatting.",
      },
    ],
    howTo: {
      name: "How to format SQL online",
      steps: [
        {
          name: "Paste SQL query",
          text: "Copy messy or minified SQL queries into the editor.",
        },
        {
          name: "Select dialect & options",
          text: "Choose PostgreSQL, MySQL, BigQuery, etc., and configure keyword casing.",
        },
        {
          name: "Format & copy",
          text: "Click Format SQL and copy the beautified query.",
        },
      ],
    },
    useCases: [
      {
        title: "Cleaning up ORM & log queries",
        body: "Unpack messy SQL generated by Prisma, TypeORM, Hibernate, or database query logs.",
      },
      {
        title: "Database documentation",
        body: "Format complex queries with JOINs and CTEs for clear pull requests and internal wikis.",
      },
    ],
    examples: [
      {
        dialect: "PostgreSQL",
        prompt: "Beautifying complex SELECT",
        sql: `SELECT u.id, u.email, COUNT(o.id) AS total_orders
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.status = 'active'
GROUP BY u.id, u.email
HAVING COUNT(o.id) > 5
ORDER BY total_orders DESC;`,
      },
    ],
    faq: [
      {
        q: "Is this SQL Formatter free?",
        a: "Yes. Completely free with no limits or signups required.",
      },
      {
        q: "Is my SQL query stored or sent to a database?",
        a: "No. Query formatting runs entirely client-side inside your browser session.",
      },
    ],
    related: [
      { slug: "ai-sql", label: "AI SQL Generator" },
      { slug: "mock-data", label: "Mock Data Generator" },
      { slug: "json-formatter", label: "JSON Formatter" },
    ],
  },
  "image-compressor": {
    intro:
      "DevHub's Image Compressor & Converter lets you compress JPEG, PNG, WebP, and AVIF images right inside your browser with zero quality loss. Features include batch image processing, custom quality sliders, dimension resizing, convert to WebP/AVIF options, and instant bulk ZIP downloads. 100% private — your images are never uploaded to any server.",
    features: [
      {
        title: "100% Local in-browser compression",
        body: "Uses Canvas and WebAssembly to compress images on your computer. Ultra fast, zero data usage, and complete privacy.",
      },
      {
        title: "Batch compression & resizing",
        body: "Compress multiple images at once and resize by maximum width or height.",
      },
      {
        title: "Format conversion (WebP / AVIF)",
        body: "Convert legacy PNG or JPEG files into lightweight modern WebP or AVIF formats for faster web page loads.",
      },
      {
        title: "Live size comparison",
        body: "Preview original vs compressed file size and reduction percentage in real time.",
      },
    ],
    howTo: {
      name: "How to compress images online without losing quality",
      steps: [
        {
          name: "Upload images",
          text: "Drag and drop PNG, JPEG, WebP, or AVIF files into the browser box.",
        },
        {
          name: "Adjust quality & format",
          text: "Set the compression quality slider (e.g., 80%) and choose an optional target format like WebP.",
        },
        {
          name: "Download compressed files",
          text: "Download compressed images individually or as a single ZIP archive.",
        },
      ],
    },
    useCases: [
      {
        title: "Optimizing web performance",
        body: "Shrink image sizes for blogs, e-commerce stores, and landing pages to boost Google Lighthouse scores.",
      },
      {
        title: "Email & attachment size limits",
        body: "Compress large photos and screenshots before attaching them to emails or support tickets.",
      },
    ],
    examples: [
      {
        dialect: "JPEG → WebP",
        prompt: "Compression sample",
        sql: "Original: 2.4 MB (3840x2160 JPEG)\nCompressed: 340 KB (WebP @ 80% quality)\nSaved: 85.8%",
      },
    ],
    faq: [
      {
        q: "Are my images uploaded to any server?",
        a: "No! Compression runs 100% locally on your computer using browser APIs. Your images never leave your browser.",
      },
      {
        q: "What format gives the best compression?",
        a: "WebP and AVIF offer 30% to 70% smaller file sizes compared to JPEG and PNG at equivalent visual quality.",
      },
    ],
    related: [
      { slug: "image-base64", label: "Image → Base64" },
      { slug: "svg-optimizer", label: "SVG Optimizer" },
      { slug: "favicon-generator", label: "Favicon Generator" },
    ],
  },
  "curl-converter": {
    intro:
      "DevHub's cURL to Code Converter translates cURL command line requests into production-ready code snippets across 12+ programming languages and frameworks. Convert cURL commands into JavaScript (fetch, Axios), Node.js, Python (requests, http.client), Go, PHP, Rust, Java, C# (.NET), Ruby, PowerShell, and Wget in seconds.",
    features: [
      {
        title: "12+ Language outputs",
        body: "Generate fetch, Axios, Python requests, Go http, PHP curl, Rust reqwest, Java HttpClient, and C# RestSharp.",
      },
      {
        title: "Full cURL flag parsing",
        body: "Parses headers (-H), request method (-X POST/PUT/DELETE), JSON payload (-d/--data), basic auth (-u), and cookies.",
      },
      {
        title: "Copy-paste ready code",
        body: "Generates clean, indented code blocks with proper error handling and header objects.",
      },
    ],
    howTo: {
      name: "How to convert cURL to Python or JavaScript online",
      steps: [
        {
          name: "Paste cURL command",
          text: "Copy a cURL command from Chrome Network DevTools, Postman, or API documentation.",
        },
        {
          name: "Select target language",
          text: "Choose Python, JavaScript Fetch, Axios, Go, PHP, etc.",
        },
        {
          name: "Copy code snippet",
          text: "Copy the generated code snippet directly into your codebase.",
        },
      ],
    },
    useCases: [
      {
        title: "Browser DevTools to Code",
        body: "Copy network requests as cURL from Chrome DevTools and convert them into frontend fetch calls or backend scripts.",
      },
      {
        title: "API Integration",
        body: "Convert cURL code snippets from Stripe, OpenAI, or Twilio docs into your project's programming language.",
      },
    ],
    examples: [
      {
        dialect: "cURL → Python",
        prompt: "POST request with JSON payload",
        sql: `# Input: curl -X POST https://api.example.com/data -H "Authorization: Bearer token" -d '{"key":"val"}'

import requests

headers = {"Authorization": "Bearer token", "Content-Type": "application/json"}
data = {"key": "val"}
response = requests.post("https://api.example.com/data", headers=headers, json=data)`,
      },
    ],
    faq: [
      {
        q: "Is this cURL converter free?",
        a: "Yes, 100% free and client-side. Your authorization keys and headers are never sent to a server.",
      },
      {
        q: "How do I copy a cURL command from Chrome?",
        a: "Open Chrome DevTools -> Network tab -> Right-click any request -> Copy -> Copy as cURL, then paste it here.",
      },
    ],
    related: [
      { slug: "json-to-ts", label: "JSON → TypeScript" },
      { slug: "ai-convert", label: "AI Code Converter" },
      { slug: "json-formatter", label: "JSON Formatter" },
    ],
  },
  markdown: {
    intro:
      "DevHub's Markdown Editor is a fast online GitHub-Flavored Markdown (GFM) writer featuring a live side-by-side preview, formatting toolbar, live word and character counters, local storage autosave, and export options to .md or .html files. Ideal for drafting READMEs, documentation, and blog posts.",
    features: [
      {
        title: "Live split-view preview",
        body: "Render Markdown syntax side-by-side in real time as you write.",
      },
      {
        title: "GitHub-Flavored Markdown (GFM)",
        body: "Full support for tables, task lists, fenced code blocks with syntax highlighting, blockquotes, and footnotes.",
      },
      {
        title: "Local autosave & history",
        body: "Drafts are stored locally in browser storage so your work is never lost when closing the tab.",
      },
      {
        title: "Export to MD & HTML",
        body: "Export your formatted Markdown as a clean .md file or compiled HTML string.",
      },
    ],
    howTo: {
      name: "How to edit and preview Markdown online",
      steps: [
        {
          name: "Type Markdown text",
          text: "Write Markdown directly or use toolbar buttons for bold, italics, headers, lists, and tables.",
        },
        {
          name: "Review live preview",
          text: "Check the rendered HTML output in the right preview pane.",
        },
        {
          name: "Copy or export",
          text: "Download your file as .md or .html, or copy compiled HTML.",
        },
      ],
    },
    useCases: [
      {
        title: "Writing GitHub README.md files",
        body: "Draft repository READMEs with tables, badges, and code blocks before pushing to Git.",
      },
      {
        title: "Blogging & static site content",
        body: "Write articles for Astro, Next.js, Hugo, or Gatsby blog engines.",
      },
    ],
    examples: [
      {
        dialect: "GFM Markdown",
        prompt: "Table and code block sample",
        sql: `# Project Title

| Feature | Status |
| ------- | ------ |
| Auth    | ✅ Done |

\`\`\`typescript
const greeting = "Hello DevHub!";
\`\`\``,
      },
    ],
    faq: [
      {
        q: "Is my draft stored on any server?",
        a: "No. Autosave uses your browser's local storage exclusively.",
      },
      {
        q: "Does it support code syntax highlighting?",
        a: "Yes. Fenced code blocks render formatted syntax preview.",
      },
    ],
    related: [
      { slug: "text-to-markdown", label: "Text → Markdown" },
      { slug: "docx-to-markdown", label: "DOCX → Markdown" },
      { slug: "slugify", label: "Slugify" },
    ],
  },
  "csv-json": {
    intro:
      "DevHub's CSV ↔ JSON Converter provides fast bidirectional conversion between CSV spreadsheet data and JSON objects or arrays. Features automatic header detection, configurable delimiters (comma, tab, semicolon, pipe), quote handling, nested JSON flattening, and instant download as .json or .csv files.",
    features: [
      {
        title: "Bidirectional conversion",
        body: "Convert CSV to JSON or JSON to CSV seamlessly with one click.",
      },
      {
        title: "Custom delimiter support",
        body: "Supports commas (,), tabs (\\t), semicolons (;), and pipes (|) for TSV and custom CSV exports.",
      },
      {
        title: "Automatic type inference",
        body: "Optionally converts numeric and boolean strings into native JSON numbers and booleans.",
      },
      {
        title: "Download converted files",
        body: "Export converted data directly as .json or .csv files.",
      },
    ],
    howTo: {
      name: "How to convert CSV to JSON online",
      steps: [
        {
          name: "Paste CSV or JSON",
          text: "Paste tabular CSV data or a JSON array of objects into the editor.",
        },
        {
          name: "Configure conversion",
          text: "Set delimiter (comma, tab, pipe) and header row options.",
        },
        {
          name: "Copy or download",
          text: "Copy the formatted output or download the converted file.",
        },
      ],
    },
    useCases: [
      {
        title: "Importing Excel/CSV into database seed files",
        body: "Convert client spreadsheets into JSON arrays for MongoDB, Firebase, or Postgres seeders.",
      },
      {
        title: "Exporting API JSON to CSV for Excel",
        body: "Turn JSON API responses into downloadable CSV files for business reporting in Excel.",
      },
    ],
    examples: [
      {
        dialect: "CSV → JSON",
        prompt: "Conversion example",
        sql: `CSV Input:
id,name,role
1,Alice,Admin
2,Bob,User

JSON Output:
[
  {"id": 1, "name": "Alice", "role": "Admin"},
  {"id": 2, "name": "Bob", "role": "User"}
]`,
      },
    ],
    faq: [
      {
        q: "Does it support Tab-Separated Values (TSV)?",
        a: "Yes. Select Tab as the delimiter to convert TSV data from Excel or Google Sheets.",
      },
      {
        q: "Is my spreadsheet data kept private?",
        a: "Yes. All processing occurs locally in your browser memory.",
      },
    ],
    related: [
      { slug: "yaml-json", label: "YAML ↔ JSON" },
      { slug: "json-formatter", label: "JSON Formatter" },
      { slug: "mock-data", label: "Mock Data Generator" },
    ],
  },
  "ai-sql": {
    intro:
      "DevHub's AI SQL Generator turns plain English into production-ready SQL. Describe the result you want — a report, a join, an aggregation, a window function — and get a clean, dialect-aware query you can paste straight into psql, MySQL Workbench, DBeaver, TablePlus or your ORM. It's free, needs no signup, and works for PostgreSQL, MySQL, SQLite, SQL Server and BigQuery.",
    features: [
      {
        title: "Natural language → SQL",
        body: "Write what you want in English (or Bangla). The model returns a working SQL query with the right joins, filters and grouping.",
      },
      {
        title: "Dialect aware",
        body: "PostgreSQL, MySQL, SQLite, SQL Server and BigQuery syntax — including window functions, CTEs and JSON operators.",
      },
      {
        title: "Schema hints",
        body: "Paste your CREATE TABLE statements or a short schema description to get queries that reference real columns and foreign keys.",
      },
      {
        title: "Explains itself",
        body: "Every generated query is annotated so you understand each clause — great for learning SQL or reviewing AI output before you ship.",
      },
      {
        title: "Optimize & refactor",
        body: "Ask for a faster version, an index suggestion, or a rewrite using CTEs instead of subqueries.",
      },
      {
        title: "Private by default",
        body: "Prompts are sent to the AI provider only for the current request. Nothing is stored server-side and there is no account required.",
      },
    ],
    howTo: {
      name: "How to generate SQL from natural language",
      steps: [
        {
          name: "Describe the query",
          text: "Type what you want in plain English — for example 'top 10 customers by revenue in the last 30 days'.",
        },
        {
          name: "Add schema context (optional)",
          text: "Paste your CREATE TABLE statements or column names so the AI uses real identifiers.",
        },
        {
          name: "Pick a dialect",
          text: "Mention PostgreSQL, MySQL, SQLite, T-SQL or BigQuery in the prompt so the output uses the right syntax.",
        },
        {
          name: "Generate & review",
          text: "Click Generate SQL. Read the query and its explanation, then copy it into your database client.",
        },
        {
          name: "Iterate",
          text: "Ask follow-ups like 'add a monthly breakdown' or 'rewrite with a CTE' to refine the result.",
        },
      ],
    },
    useCases: [
      {
        title: "Analytics & reporting",
        body: "Turn a stakeholder question into a query without hand-writing five joins. Perfect for ad-hoc dashboards and Metabase / Superset cards.",
      },
      {
        title: "Learning SQL",
        body: "Compare your own query to the AI's version and read the explanation — a fast way to level up on window functions and CTEs.",
      },
      {
        title: "Data migrations",
        body: "Generate INSERT ... SELECT statements, backfills and one-off cleanup queries with the right WHERE conditions.",
      },
      {
        title: "ORM escape hatch",
        body: "When Prisma, Drizzle or ActiveRecord can't express what you need, describe it in English and drop the raw SQL into a $queryRaw call.",
      },
    ],
    examples: [
      {
        dialect: "PostgreSQL",
        prompt: "Top 10 customers by total revenue in the last 30 days, with their country.",
        sql: `SELECT c.id, c.name, c.country, SUM(o.total) AS revenue
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.created_at >= NOW() - INTERVAL '30 days'
GROUP BY c.id, c.name, c.country
ORDER BY revenue DESC
LIMIT 10;`,
      },
      {
        dialect: "MySQL",
        prompt: "Monthly signups for 2026, filling gaps with zero.",
        sql: `WITH RECURSIVE months (m) AS (
  SELECT '2026-01-01'
  UNION ALL SELECT DATE_ADD(m, INTERVAL 1 MONTH) FROM months WHERE m < '2026-12-01'
)
SELECT DATE_FORMAT(m, '%Y-%m') AS month,
       COUNT(u.id)             AS signups
FROM months
LEFT JOIN users u
  ON DATE_FORMAT(u.created_at, '%Y-%m') = DATE_FORMAT(m, '%Y-%m')
GROUP BY month
ORDER BY month;`,
      },
      {
        dialect: "BigQuery",
        prompt: "7-day rolling active users from an events table.",
        sql: `SELECT event_date,
       COUNT(DISTINCT user_id) OVER (
         ORDER BY UNIX_DATE(event_date)
         RANGE BETWEEN 6 PRECEDING AND CURRENT ROW
       ) AS rolling_7d_users
FROM (
  SELECT DATE(event_timestamp) AS event_date, user_id
  FROM \`project.dataset.events\`
  GROUP BY event_date, user_id
)
ORDER BY event_date;`,
      },
    ],
    faq: [
      {
        q: "Is the AI SQL Generator free?",
        a: "Yes — DevHub's AI SQL Generator is free to use, no signup required. There are fair-use limits to keep the service running.",
      },
      {
        q: "Which SQL dialects are supported?",
        a: "PostgreSQL, MySQL, MariaDB, SQLite, Microsoft SQL Server (T-SQL) and BigQuery. Mention the dialect in your prompt and the generator adapts the syntax — window functions, JSON operators, string functions and quoting all follow the target engine.",
      },
      {
        q: "How do I get better SQL from the generator?",
        a: "Paste your schema (CREATE TABLE statements or a short list of tables and columns), name the dialect, and be specific about filters and the shape of the result. The more context you give, the more accurate the generated JOINs and WHERE clauses will be.",
      },
      {
        q: "Is my data or schema stored?",
        a: "No. Your prompt is sent to the AI provider for the current request only. DevHub does not store schemas, prompts or generated queries server-side.",
      },
      {
        q: "Can it write UPDATE, INSERT and DELETE queries?",
        a: "Yes — you can ask for INSERT, UPDATE, DELETE and DDL like CREATE TABLE or ALTER TABLE. Always review destructive queries and run them inside a transaction on production data.",
      },
      {
        q: "Does it handle joins, CTEs and window functions?",
        a: "Yes. The generator produces multi-table JOINs, common table expressions (WITH ...), window functions (ROW_NUMBER, RANK, running totals) and recursive CTEs when the request calls for them.",
      },
      {
        q: "Is AI-generated SQL safe to run in production?",
        a: "Treat it like any code review: read the query, check the JOIN keys and WHERE conditions, run it against a staging database first, and wrap writes in a transaction. AI is a fast first draft, not a substitute for review.",
      },
      {
        q: "How is this different from ChatGPT for SQL?",
        a: `It's a focused, single-purpose workspace: no chat setup, no system-prompt tuning, dialect-aware output, and it's grouped with the full ${TOOLS.length}-tool DevHub toolkit — formatters, converters, generators — on the same site.`,
      },
    ],
    related: [
      { slug: "sql-formatter", label: "SQL Formatter" },
      { slug: "mock-data", label: "Mock Data Generator" },
      { slug: "json-to-ts", label: "JSON → TypeScript" },
      { slug: "ai-explainer", label: "AI Code Explainer" },
    ],
  },
  "yaml-json": {
    intro:
      "DevHub's YAML ↔ JSON converter turns YAML into JSON and JSON into YAML instantly, in your browser. Paste a Kubernetes manifest, a GitHub Actions workflow, a docker-compose file or an OpenAPI spec — get valid, formatted output with syntax highlighting, error messages that point at the exact line, and one-click copy or download. It's free, works offline after first load, and never sends your data to a server.",
    features: [
      {
        title: "Two-way conversion",
        body: "YAML → JSON and JSON → YAML in the same workspace. Swap direction with one click without losing your input.",
      },
      {
        title: "Runs in your browser",
        body: "Parsing and serialization happen client-side with js-yaml. Your configs, secrets and manifests never leave your machine.",
      },
      {
        title: "Precise error messages",
        body: "Invalid indentation, duplicate keys, tab characters and unclosed quotes are surfaced with the exact line and column — no guessing.",
      },
      {
        title: "Handles real-world YAML",
        body: "Multi-document streams (---), anchors and aliases (&, *), block scalars (|, >), flow style and quoted keys are all supported.",
      },
      {
        title: "Pretty output",
        body: "JSON is emitted with configurable indentation. YAML uses block style with sensible line widths so diffs stay small.",
      },
      {
        title: "Copy, download, share",
        body: "Copy to clipboard, download as .json / .yaml, or paste a raw URL — DevHub handles the fetch and conversion.",
      },
    ],
    howTo: {
      name: "How to convert YAML to JSON (and back)",
      steps: [
        {
          name: "Paste your source",
          text: "Drop your YAML or JSON into the input pane. Files up to a few MB work without lag.",
        },
        {
          name: "Pick a direction",
          text: "Choose YAML → JSON or JSON → YAML. The converter auto-detects the input format if you're unsure.",
        },
        {
          name: "Review the output",
          text: "The formatted result appears on the right. Errors are shown inline with line and column numbers.",
        },
        {
          name: "Tune the format",
          text: "Set JSON indentation (2 or 4 spaces) or YAML block style options to match your project conventions.",
        },
        {
          name: "Copy or download",
          text: "Copy to clipboard for a quick paste, or download the file to drop straight into your repo.",
        },
      ],
    },
    useCases: [
      {
        title: "Kubernetes & Helm",
        body: "Convert a JSON API response from kubectl into readable YAML, or turn a Helm values.yaml into JSON for a script that expects JSON input.",
      },
      {
        title: "GitHub Actions & CI",
        body: "Debug a workflow file by converting it to JSON and pretty-printing the resulting object graph — much easier than eyeballing indentation.",
      },
      {
        title: "OpenAPI / Swagger",
        body: "Swap between openapi.yaml and openapi.json depending on which tool you're feeding — Redoc, Swagger UI, Postman, code generators.",
      },
      {
        title: "Config migrations",
        body: "Moving from a JSON-based config to YAML (or vice versa) across a codebase — convert files in bulk without hand-rewriting.",
      },
    ],
    examples: [
      {
        dialect: "YAML → JSON",
        prompt: "A simple Kubernetes Deployment",
        sql: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels: { app: web }
  template:
    metadata: { labels: { app: web } }
    spec:
      containers:
        - name: web
          image: nginx:1.27
          ports: [{ containerPort: 80 }]`,
      },
      {
        dialect: "JSON → YAML",
        prompt: "A package.json scripts block",
        sql: `{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest run"
  }
}`,
      },
      {
        dialect: "YAML anchors",
        prompt: "Shared config with anchors and aliases",
        sql: `defaults: &defaults
  timeout: 30
  retries: 3

production:
  <<: *defaults
  host: api.example.com

staging:
  <<: *defaults
  host: staging.example.com`,
      },
    ],
    faq: [
      {
        q: "Is the YAML to JSON converter free?",
        a: "Yes — completely free, no signup, no ads, no rate limits. Everything runs client-side in your browser.",
      },
      {
        q: "Is my data sent to a server?",
        a: "No. Conversion happens locally in your browser using js-yaml. Your YAML and JSON never leave your machine, so it's safe for internal configs and secrets.",
      },
      {
        q: "Does it support YAML 1.2, anchors and multi-document streams?",
        a: "Yes. The converter handles YAML 1.2 syntax including anchors (&), aliases (*), merge keys (<<), block scalars (| and >), flow style, and multi-document streams separated by ---.",
      },
      {
        q: "Why do I get 'duplicate key' or 'bad indentation' errors?",
        a: "YAML is strict about indentation (spaces only, never tabs) and forbids duplicate keys at the same level. The error message shows the exact line and column — fix that spot and re-run.",
      },
      {
        q: "Can I convert a whole file, not just a snippet?",
        a: "Yes. Drag a .yaml, .yml or .json file into the input pane, or paste the entire contents. Files up to several megabytes convert instantly.",
      },
      {
        q: "How is YAML different from JSON?",
        a: "JSON is a strict data format optimized for machines — quoted keys, brackets, commas. YAML is a superset designed for humans — indentation-based, comments allowed, anchors for reuse. Both represent the same underlying data structures (objects, arrays, strings, numbers, booleans, null).",
      },
      {
        q: "Which tools accept YAML vs JSON?",
        a: "Kubernetes, Helm, GitHub Actions, GitLab CI, Ansible, Docker Compose and OpenAPI accept both but prefer YAML. Most REST APIs, package.json, tsconfig.json and Terraform state files use JSON. Converting between the two is common in day-to-day DevOps work.",
      },
      {
        q: "Does it preserve comments when converting YAML to JSON?",
        a: "No — JSON has no comment syntax, so YAML comments are dropped on conversion. When converting JSON back to YAML you can add comments manually in the output pane before downloading.",
      },
    ],
    related: [
      { slug: "json-formatter", label: "JSON Formatter" },
      { slug: "json-to-ts", label: "JSON → TypeScript" },
      { slug: "json-diff", label: "JSON Diff" },
      { slug: "env-json", label: ".env ↔ JSON" },
    ],
  },
};

TOOL_CONTENT["json-to-ts"] = {
  intro:
    "DevHub's JSON to TypeScript converter turns any JSON payload — an API response, a config file, a Firestore document — into accurate TypeScript interfaces and types in one click. It infers unions, optional properties, nested objects, arrays of mixed shapes and tuple types, and gives you clean, ready-to-paste code. Free, client-side, no signup.",
  headings: {
    features: "What the JSON to TypeScript converter does",
    examples: "JSON to TypeScript examples (interface, union & Zod)",
    useCases: "When to convert JSON to TypeScript types",
    faq: "JSON to TypeScript — frequently asked questions",
    related: "Related JSON and TypeScript tools",
  },
  features: [
    {
      title: "Accurate type inference",
      body: "Detects strings, numbers, booleans, null, arrays, nested objects, unions and tuples — including mixed arrays where each element has a different shape.",
    },
    {
      title: "Interfaces or type aliases",
      body: "Choose `interface` or `type` output to match your project's style guide. Root name is configurable.",
    },
    {
      title: "Zod schema output",
      body: "Switch the output to a Zod schema and get runtime validation plus `z.infer` types from the same JSON — ideal for API boundaries, forms and tRPC.",
    },
    {
      title: "Optional & nullable handling",
      body: "Fields missing from some objects become optional (?:). Explicit nulls become union types like `string | null`.",
    },
    {
      title: "Nested type extraction",
      body: "Nested objects are lifted into their own named types so you can import and reuse them across your codebase.",
    },
    {
      title: "Runs in your browser",
      body: "Inference happens locally. Your JSON, tokens, PII and internal API shapes never touch a server.",
    },
    {
      title: "Copy-ready output",
      body: "Formatted with two-space indentation, sorted keys and JSDoc-friendly output that plays nicely with Prettier and ESLint.",
    },
  ],
  howTo: {
    name: "How to convert JSON to TypeScript interfaces",
    steps: [
      {
        name: "Paste JSON",
        text: "Drop your JSON payload — an API response, mock, or fixture — into the input pane.",
      },
      {
        name: "Name the root type",
        text: "Set the root interface name (e.g. `User`, `ApiResponse`) so nested types get consistent names.",
      },
      {
        name: "Pick output style",
        text: "Choose `interface` or `type` and whether to inline or extract nested types.",
      },
      {
        name: "Convert",
        text: "The generated TypeScript appears instantly with fully typed nested structures.",
      },
      {
        name: "Copy into your project",
        text: "Paste into `types.ts` or a `.d.ts` file and import wherever you consume that JSON.",
      },
    ],
  },
  useCases: [
    {
      title: "Typing third-party APIs",
      body: "Stripe, GitHub, OpenAI, Notion — capture a real response, generate types, and get autocomplete plus compile-time safety instantly.",
    },
    {
      title: "Frontend / backend contracts",
      body: "Share generated interfaces between your React app and Node/Bun API so a schema change breaks the build, not production.",
    },
    {
      title: "Firestore & MongoDB documents",
      body: "Turn a document sample into a strongly-typed model without hand-writing every field.",
    },
    {
      title: "Prototyping",
      body: "Sketch a JSON shape, generate types, and scaffold components against real interfaces in minutes.",
    },
  ],
  examples: [
    {
      dialect: "Simple object",
      prompt: "User profile",
      sql: `{
  "id": 42,
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "isAdmin": false
}

// →

export interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}`,
    },
    {
      dialect: "Nested & optional",
      prompt: "API response with nested address",
      sql: `{
  "user": {
    "id": 1,
    "name": "Ada",
    "address": { "city": "London", "zip": null }
  }
}

// →

export interface Address {
  city: string;
  zip: string | null;
}

export interface UserInfo {
  id: number;
  name: string;
  address: Address;
}

export interface Root {
  user: UserInfo;
}`,
    },
    {
      dialect: "Mixed arrays",
      prompt: "Array with varying item shapes",
      sql: `{
  "events": [
    { "type": "click", "x": 10, "y": 20 },
    { "type": "keypress", "key": "Enter" }
  ]
}

// →

export type Event =
  | { type: "click"; x: number; y: number }
  | { type: "keypress"; key: string };

export interface Root {
  events: Event[];
}`,
    },
    {
      dialect: "Zod schema",
      prompt: "Runtime validation from the same JSON",
      sql: `{
  "id": 42,
  "email": "ada@example.com",
  "tags": ["admin", "beta"],
  "deletedAt": null
}

// →

import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
  tags: z.array(z.string()),
  deletedAt: z.string().nullable(),
});

export type User = z.infer<typeof UserSchema>;`,
    },
  ],
  faq: [
    {
      q: "Can it convert JSON to a Zod schema?",
      a: "Yes. Switch the output mode to Zod and you get a `z.object({ ... })` schema plus a `z.infer` type alias, so one JSON sample gives you both compile-time types and runtime validation.",
    },
    {
      q: "How do I turn an API response into TypeScript types?",
      a: "Copy a real response from your network tab or `curl`, paste it here, name the root type (e.g. `StripeCharge`), and copy the generated interfaces into a `types.ts` or `.d.ts` file. Because inference runs locally, it's safe to paste authenticated responses.",
    },
    {
      q: "Is the JSON to TypeScript converter free?",
      a: "Yes — 100% free, no signup, no rate limits. Runs entirely in your browser.",
    },
    {
      q: "Is my JSON sent to a server?",
      a: "No. All parsing and type inference happens client-side in your browser, so it's safe for internal API responses, tokens and PII.",
    },
    {
      q: "Does it generate interfaces or type aliases?",
      a: "Both. Choose `interface` for extendable object shapes, or `type` for aliases, unions and tuples. The default is `interface` because that matches most style guides.",
    },
    {
      q: "How are optional and nullable fields handled?",
      a: "Fields present in some samples but missing in others become optional (`?:`). Fields with explicit `null` become union types like `string | null`. If you paste an array of samples, the converter merges them intelligently.",
    },
    {
      q: "Can it handle deeply nested JSON?",
      a: "Yes. Nested objects are lifted into their own named interfaces so you can import and reuse them across your codebase — no giant inline types.",
    },
    {
      q: "What about arrays of different shapes?",
      a: "Mixed arrays are inferred as discriminated unions when possible, so you get exhaustive `switch` support and proper narrowing in TypeScript.",
    },
    {
      q: "Does the output work with Prettier and ESLint?",
      a: "Yes. Output is 2-space indented, uses double quotes, semicolons and sorted keys — matching the defaults of Prettier and the recommended TypeScript ESLint rules.",
    },
    {
      q: "How is this different from quicktype?",
      a: `Same underlying idea, but focused on developer speed: paste-and-copy in one screen, no schema wizard, and grouped with the full ${TOOLS.length}-tool DevHub toolkit (JSON formatter, JSON diff, YAML converter, mock data) you already use daily.`,
    },
    {
      q: "How do I convert JSON to a TypeScript interface online?",
      a: "Paste your JSON into the input pane above, set a root name such as `User`, keep the output mode on `interface`, and copy the generated TypeScript. Nothing is uploaded — the whole JSON to TypeScript conversion runs in your browser.",
    },
    {
      q: "Can I generate a .d.ts declaration file from JSON?",
      a: "Yes. Generate the interfaces, then paste them into a `types.d.ts` file and add `export` (or `declare`) as needed. The output is plain TypeScript, so it works in `.ts`, `.tsx` and `.d.ts` files alike.",
    },
    {
      q: "Does it convert JSON Schema to TypeScript too?",
      a: "This tool infers types from a JSON *sample* (an actual payload), which is what most developers have on hand. For a JSON Schema document, paste a representative example instance instead — you'll get the same interfaces without writing a schema config.",
    },
    {
      q: "Can I convert an array of JSON objects into one type?",
      a: "Yes. Paste the whole array and the converter merges every element into a single interface: shared fields stay required, fields that appear in only some items become optional, and conflicting primitive types become unions.",
    },
    {
      q: "Does it support snake_case keys and invalid identifiers?",
      a: "Yes. Keys like `created_at`, `user-id` or `2fa_enabled` are preserved and quoted where TypeScript requires it, so the generated types match your API exactly instead of silently renaming fields.",
    },
    {
      q: "Is there a limit on JSON size?",
      a: "No hard limit. Payloads of a few megabytes convert in well under a second because inference is local; very large files are only bounded by your browser's memory.",
    },
  ],
  related: [
    { slug: "json-formatter", label: "JSON Formatter" },
    { slug: "yaml-json", label: "YAML ↔ JSON" },
    { slug: "json-diff", label: "JSON Diff" },
    { slug: "mock-data", label: "Mock Data Generator" },
  ],
};

TOOL_CONTENT["slugify"] = {
  intro:
    "DevHub's Slugify tool turns any headline, product name or filename into a clean, URL-safe slug you can drop straight into your router, CMS or database. It transliterates Unicode (Bangla, Arabic, Chinese, emoji), collapses whitespace, strips punctuation and enforces a consistent separator — the same rules WordPress, Ghost, Notion and Next.js use for pretty URLs. Free, no signup, runs 100% in your browser.",
  features: [
    {
      title: "Unicode transliteration",
      body: "Bangla, Arabic, Cyrillic, Chinese, Japanese, emoji and accented Latin all collapse to safe ASCII (হ্যালো → hyalo, café → cafe, 你好 → ni-hao).",
    },
    {
      title: "Custom separator",
      body: "Pick hyphen (-), underscore (_) or dot (.) to match your framework — hyphens for SEO, underscores for filenames, dots for package paths.",
    },
    {
      title: "Case control",
      body: "Lowercase, uppercase or preserve original case. Lowercase is the default because Google treats /About and /about as the same URL but many CDNs don't.",
    },
    {
      title: "Length limit",
      body: "Cap slugs at 60-80 chars to fit Google's title truncation and avoid ugly URL wrapping in emails and Slack previews.",
    },
    {
      title: "Bulk mode",
      body: "Paste a list of titles, one per line, and get back a matching list of slugs — perfect for CSV imports, sitemap generation and content migrations.",
    },
    {
      title: "Private by default",
      body: "Everything happens in your browser. Nothing is uploaded, logged or stored. Safe for internal product names and unreleased content.",
    },
  ],
  howTo: {
    name: "How to convert text to a URL slug",
    steps: [
      {
        name: "Paste your text",
        text: "Drop a title, headline or filename into the input — a single line or a full list.",
      },
      {
        name: "Choose a separator",
        text: "Hyphen (-) for web URLs and SEO, underscore (_) for filenames or database keys.",
      },
      {
        name: "Pick a case",
        text: "Lowercase is the standard for URLs. Keep original case only for case-sensitive systems.",
      },
      {
        name: "Set a max length (optional)",
        text: "60-80 characters keeps slugs readable and inside Google's title cutoff.",
      },
      {
        name: "Copy the result",
        text: "Click Copy and paste it into your CMS, Next.js route, Markdown frontmatter or database seed.",
      },
    ],
  },
  useCases: [
    {
      title: "Blog & CMS URLs",
      body: "Convert post titles into permalinks for Next.js, Astro, Ghost, WordPress or any headless CMS — matching what editors expect.",
    },
    {
      title: "Product & SKU slugs",
      body: "Generate stable, human-readable identifiers for e-commerce products, courses and marketplace listings.",
    },
    {
      title: "File & folder names",
      body: "Sanitize user-uploaded filenames before saving to S3, R2 or the local filesystem — no spaces, no unicode surprises.",
    },
    {
      title: "Database seeds & migrations",
      body: "Bulk-slugify a CSV of legacy titles when migrating from an old CMS to a new stack.",
    },
  ],
  examples: [
    {
      dialect: "Default (hyphen, lowercase)",
      prompt: "Hello World! This is a Test Post.",
      sql: "hello-world-this-is-a-test-post",
    },
    {
      dialect: "Unicode transliteration",
      prompt: "Café — Résumé for São Paulo (2026)",
      sql: "cafe-resume-for-sao-paulo-2026",
    },
    {
      dialect: "Bulk mode",
      prompt: `10 Best React Libraries in 2026
How to Deploy Next.js to Cloudflare
GraphQL vs REST: The Real Story`,
      sql: `10-best-react-libraries-in-2026
how-to-deploy-next-js-to-cloudflare
graphql-vs-rest-the-real-story`,
    },
  ],
  faq: [
    {
      q: "Is the slugify tool free?",
      a: "Yes — 100% free, no signup, no rate limits. Everything runs in your browser.",
    },
    {
      q: "Is my text sent to a server?",
      a: "No. All slugification happens client-side, so it's safe for unreleased product names, internal titles and confidential drafts.",
    },
    {
      q: "Does it handle non-English characters?",
      a: "Yes. Bangla, Arabic, Cyrillic, Chinese, Japanese, accented Latin and emoji are all transliterated to safe ASCII using a comprehensive Unicode mapping.",
    },
    {
      q: "Should I use hyphens or underscores in URLs?",
      a: "Hyphens. Google treats hyphens as word separators, but underscores as part of a single word — so 'my-post' ranks better than 'my_post' for the phrase 'my post'.",
    },
    {
      q: "What's the ideal slug length?",
      a: "3-5 words, under 60 characters. Long slugs get truncated in Google results and look messy when shared in emails or Slack.",
    },
    {
      q: "Should slugs be lowercase?",
      a: "Yes. Lowercase avoids duplicate URLs (/About vs /about) and works consistently across CDNs, load balancers and case-sensitive filesystems.",
    },
    {
      q: "Can I use numbers and dates in slugs?",
      a: "Absolutely — numbers are safe and often helpful (e.g. 'react-19-release-notes'). Avoid leading zeros unless they're meaningful.",
    },
    {
      q: "How is this different from a Node.js slugify library?",
      a: "Same output — but with zero setup, a live preview, bulk mode and no npm install. Great for one-off content migrations or when you're not in a Node project.",
    },
  ],
  related: [
    { slug: "url-codec", label: "URL Encoder" },
    { slug: "case-converter", label: "Case Converter" },
    { slug: "text-to-markdown", label: "Text to Markdown" },
    { slug: "json-formatter", label: "JSON Formatter" },
  ],
};

TOOL_CONTENT["clamp-calculator"] = {
  intro:
    "The CSS clamp() calculator builds fluid typography and spacing in one step: give it a minimum size, a maximum size and the viewport range they should scale between, and it returns a ready-to-paste clamp() value with correct rem math. No media queries, no magic numbers, and a live preview so you can see the scaling before you ship it.",
  headings: {
    features: "What the CSS clamp calculator does",
    examples: "CSS clamp() examples for fluid type and spacing",
    useCases: "When to use clamp() instead of media queries",
    faq: "CSS clamp() — frequently asked questions",
    related: "Related CSS and design tools",
  },
  features: [
    {
      title: "Accurate rem math",
      body: "Slope and intercept are computed from your min/max viewport widths, so the value hits your exact sizes at both ends of the range.",
    },
    {
      title: "px or rem output",
      body: "Switch units without recalculating. rem output respects a 16px root by default and stays accessible when users zoom.",
    },
    {
      title: "Live preview",
      body: "Resize the preview to watch the text or spacing interpolate — no need to guess how it behaves at 768px.",
    },
    {
      title: "Copy-ready CSS",
      body: "One click copies font-size: clamp(...) or any property you are scaling, ready for Tailwind arbitrary values too.",
    },
  ],
  howTo: {
    name: "How to calculate a CSS clamp() value",
    steps: [
      {
        name: "Set min and max size",
        text: "Enter the smallest size for mobile and the largest size for desktop, e.g. 16px and 24px.",
      },
      {
        name: "Set the viewport range",
        text: "Pick the viewport widths the scaling happens between — 320px to 1280px covers most sites.",
      },
      {
        name: "Choose the unit",
        text: "Use rem for typography so browser zoom and user font-size settings still work.",
      },
      {
        name: "Copy the clamp() value",
        text: "Paste the generated clamp() into your CSS, Tailwind config or arbitrary class.",
      },
    ],
  },
  useCases: [
    {
      title: "Fluid typography",
      body: "Scale headings smoothly from mobile to desktop without three breakpoints per heading level.",
    },
    {
      title: "Fluid spacing",
      body: "Use clamp() on padding, margin and gap so section rhythm compresses gracefully on small screens.",
    },
    {
      title: "Design systems",
      body: "Generate a full type scale once and store the clamp values as CSS custom properties or design tokens.",
    },
  ],
  examples: [
    {
      prompt: "Fluid heading: 28px at 320px viewport, 56px at 1280px",
      dialect: "CSS",
      sql: "h1 {\n  font-size: clamp(1.75rem, 1.167rem + 2.917vw, 3.5rem);\n}",
    },
    {
      prompt: "Fluid section padding: 24px to 96px",
      dialect: "CSS",
      sql: ".section {\n  padding-block: clamp(1.5rem, 0.75rem + 3.75vw, 6rem);\n}",
    },
  ],
  faq: [
    {
      q: "How does clamp() work in CSS?",
      a: "clamp(MIN, PREFERRED, MAX) returns the preferred value but never below MIN or above MAX. The preferred value usually mixes a rem base with a vw slope so it scales with the viewport.",
    },
    {
      q: "How do I calculate the middle value for clamp?",
      a: "Slope = (maxSize - minSize) / (maxViewport - minViewport); the vw part is slope x 100 and the rem part is minSize - slope x minViewport. This calculator does that math for you.",
    },
    {
      q: "Should I use px or rem in clamp()?",
      a: "Use rem for the min and max so the value respects the user's browser font size. Keeping px there can break accessibility when someone increases default text size.",
    },
    {
      q: "Does clamp() replace media queries?",
      a: "For sizing, mostly yes. Media queries are still better for layout changes such as switching a grid from one column to three.",
    },
    {
      q: "Is clamp() supported in all browsers?",
      a: "Yes — Chrome, Edge, Firefox and Safari have supported clamp() since 2020, so it is safe for production.",
    },
  ],
  related: [
    { slug: "box-shadow", label: "Box Shadow Generator" },
    { slug: "border-radius", label: "Border Radius" },
    { slug: "mesh-gradient", label: "Mesh Gradient" },
    { slug: "color", label: "Color Converter" },
  ],
};

TOOL_CONTENT["image-base64"] = {
  intro:
    "Convert any image to a Base64 data URL right in your browser. Drop a PNG, JPG, SVG, WebP or GIF and get an inline data:image string you can paste into CSS, HTML, JSON or an email template. Nothing is uploaded — the encoding happens locally with the FileReader API.",
  headings: {
    features: "What the image to Base64 converter does",
    examples: "Base64 image examples for HTML and CSS",
    useCases: "When to inline images as Base64",
    faq: "Image to Base64 — frequently asked questions",
    related: "Related encoding tools",
  },
  features: [
    {
      title: "Any common format",
      body: "PNG, JPEG, WebP, GIF, SVG and ICO are all encoded to a valid data URL with the correct MIME type.",
    },
    {
      title: "100% client-side",
      body: "Your image never leaves the browser, so it is safe for private assets, logos and screenshots.",
    },
    {
      title: "Ready-made snippets",
      body: "Copy the raw Base64, a full data URL, an <img> tag or a CSS background-image rule.",
    },
    {
      title: "Size feedback",
      body: "See the encoded size before you paste — Base64 adds roughly 33% overhead to the original file.",
    },
  ],
  howTo: {
    name: "How to convert an image to Base64",
    steps: [
      {
        name: "Select the image",
        text: "Drag and drop a file or click to browse. Small icons and logos work best.",
      },
      {
        name: "Let it encode",
        text: "The data URL appears instantly; nothing is uploaded to a server.",
      },
      { name: "Pick the output", text: "Choose raw Base64, a data URL, an img tag or a CSS rule." },
      {
        name: "Copy and paste",
        text: "Drop the snippet into your HTML, CSS, JSON payload or email template.",
      },
    ],
  },
  useCases: [
    {
      title: "Inline icons in CSS",
      body: "Avoid an extra HTTP request for tiny icons, spinners and pattern backgrounds.",
    },
    {
      title: "Email templates",
      body: "Some email clients need inline images; a data URL keeps the asset inside the HTML.",
    },
    {
      title: "Single-file demos",
      body: "Ship a self-contained HTML file, CodePen or bug report with the image embedded.",
    },
  ],
  examples: [
    {
      prompt: "Inline an image in HTML",
      dialect: "HTML",
      sql: '<img src="data:image/png;base64,iVBORw0KGgoAAAANS..." alt="Logo" />',
    },
    {
      prompt: "Use a data URL as a CSS background",
      dialect: "CSS",
      sql: ".hero {\n  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0...');\n}",
    },
  ],
  faq: [
    {
      q: "How do I convert an image to Base64?",
      a: "Upload it here and copy the generated data URL, or in JavaScript use FileReader.readAsDataURL(file) — this tool is that API with a UI around it.",
    },
    {
      q: "How do I add a Base64 image to HTML?",
      a: 'Put the whole data URL in the src attribute: <img src="data:image/png;base64,..." alt="..." />. Same string works in CSS url().',
    },
    {
      q: "Does Base64 make images bigger?",
      a: "Yes, about 33% larger than the binary file. Inline only small assets — anything above ~10KB is usually better served as a normal file.",
    },
    {
      q: "Is my image uploaded anywhere?",
      a: "No. Encoding runs in your browser with the FileReader API, so the file never touches a server.",
    },
    {
      q: "How do I convert Base64 back to an image?",
      a: "Paste the data URL into your browser address bar, or decode the Base64 string to a Blob with atob() and createObjectURL().",
    },
  ],
  related: [
    { slug: "base64", label: "Base64 Encoder" },
    { slug: "image-compressor", label: "Image Compressor" },
    { slug: "svg-optimizer", label: "SVG Optimizer" },
    { slug: "favicon-generator", label: "Favicon Generator" },
  ],
};

TOOL_CONTENT["jwt-decoder"] = {
  intro:
    "Paste a JSON Web Token and instantly see its header, payload and signature, with expiry and issued-at timestamps rendered as readable dates. Decoding runs entirely in your browser, so you can safely inspect tokens from staging and production without pasting secrets into a remote service.",
  headings: {
    features: "What the JWT decoder shows you",
    examples: "JWT structure examples",
    useCases: "When to decode a JWT",
    faq: "JWT decoding — frequently asked questions",
    related: "Related auth and encoding tools",
  },
  features: [
    {
      title: "Header, payload, signature",
      body: "Each of the three Base64URL segments is decoded and pretty-printed as JSON.",
    },
    {
      title: "Human-readable claims",
      body: "exp, iat and nbf are converted to local dates so you can see at a glance whether a token is expired.",
    },
    {
      title: "Algorithm detection",
      body: "Shows the alg and typ from the header — handy when debugging HS256 vs RS256 mismatches.",
    },
    {
      title: "Offline and private",
      body: "No network request. Tokens from your own systems stay on your machine.",
    },
  ],
  howTo: {
    name: "How to decode a JWT",
    steps: [
      {
        name: "Copy the token",
        text: "Grab it from an Authorization: Bearer header, a cookie or your auth provider dashboard.",
      },
      {
        name: "Paste it in",
        text: "Drop the full token — the three dot-separated segments — into the input.",
      },
      {
        name: "Read the claims",
        text: "Inspect sub, role, exp and any custom claims in the decoded payload.",
      },
      {
        name: "Check the expiry",
        text: "Compare exp with the current time to confirm whether the token is still valid.",
      },
    ],
  },
  useCases: [
    {
      title: "Debugging 401s",
      body: "Confirm whether the token is expired, issued by the wrong issuer or missing a required claim.",
    },
    {
      title: "Checking roles and scopes",
      body: "Verify that your backend is embedding the role, tenant or permission claims your API expects.",
    },
    {
      title: "Learning how JWTs work",
      body: "See exactly how the header and payload are Base64URL-encoded and why the signature matters.",
    },
  ],
  examples: [
    { prompt: "Decoded header", dialect: "JSON", sql: '{\n  "alg": "HS256",\n  "typ": "JWT"\n}' },
    {
      prompt: "Decoded payload",
      dialect: "JSON",
      sql: '{\n  "sub": "user_123",\n  "role": "admin",\n  "iat": 1735689600,\n  "exp": 1735776000\n}',
    },
  ],
  faq: [
    {
      q: "Is decoding a JWT the same as verifying it?",
      a: "No. Decoding only reads the Base64URL payload — anyone can do that. Verification checks the signature with the secret or public key and must happen server-side.",
    },
    {
      q: "Is it safe to paste a token here?",
      a: "Decoding happens fully in your browser and nothing is sent to a server. Still, treat live production tokens as credentials.",
    },
    {
      q: "Why is my JWT payload unreadable?",
      a: "It is probably a JWE (encrypted token) rather than a signed JWS, or the token was truncated when copied.",
    },
    {
      q: "What do exp, iat and nbf mean?",
      a: "exp is expiry, iat is issued-at and nbf is not-before — all Unix timestamps in seconds. The decoder renders them as dates.",
    },
    {
      q: "Can I create a token here too?",
      a: "Yes — use the JWT Generator tool to sign HS256 tokens with your own secret and custom claims.",
    },
  ],
  related: [
    { slug: "jwt-generator", label: "JWT Generator" },
    { slug: "base64", label: "Base64 Encoder" },
    { slug: "hash", label: "Hash Generator" },
    { slug: "uuid", label: "UUID Generator" },
  ],
};

TOOL_CONTENT["hash"] = {
  intro:
    "Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from any text in your browser. Useful for verifying checksums, comparing file fingerprints, building cache keys or testing how a hashing algorithm behaves. Everything runs locally with the Web Crypto API.",
  headings: {
    features: "What the hash generator supports",
    examples: "Hash output examples",
    useCases: "When to generate a hash",
    faq: "Hashing — frequently asked questions",
    related: "Related security tools",
  },
  features: [
    {
      title: "Four algorithms",
      body: "MD5, SHA-1, SHA-256 and SHA-512 computed side by side so you can compare digests instantly.",
    },
    {
      title: "Web Crypto powered",
      body: "SHA hashes use the browser's native SubtleCrypto implementation — fast and standards-compliant.",
    },
    {
      title: "Hex output, one-click copy",
      body: "Lowercase hex digests ready to paste into a checksum file, test fixture or config.",
    },
    {
      title: "Nothing leaves the page",
      body: "Input is never sent anywhere, so you can hash internal identifiers safely.",
    },
  ],
  howTo: {
    name: "How to generate a hash",
    steps: [
      {
        name: "Paste your text",
        text: "Enter the string, token or file contents you want to fingerprint.",
      },
      {
        name: "Read the digests",
        text: "MD5, SHA-1, SHA-256 and SHA-512 are all computed as you type.",
      },
      {
        name: "Compare or copy",
        text: "Copy the digest and compare it with the checksum you were given.",
      },
    ],
  },
  useCases: [
    {
      title: "Checksum verification",
      body: "Confirm that a downloaded file or config string matches the published SHA-256 digest.",
    },
    {
      title: "Cache keys and IDs",
      body: "Derive a stable, short key from a longer input for caching or deduplication.",
    },
    {
      title: "Learning and testing",
      body: "See how a one-character change completely alters the digest — the avalanche effect in action.",
    },
  ],
  examples: [
    {
      prompt: 'SHA-256 of "hello"',
      dialect: "SHA-256",
      sql: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
    },
    { prompt: 'MD5 of "hello"', dialect: "MD5", sql: "5d41402abc4b2a76b9719d911017c592" },
  ],
  faq: [
    {
      q: "Is MD5 still safe to use?",
      a: "Not for security. MD5 and SHA-1 are broken against collision attacks — use them only for non-security checks like cache keys, and prefer SHA-256 everywhere else.",
    },
    {
      q: "Can a hash be reversed?",
      a: "No. Hashing is one-way. Short or common inputs can still be found in rainbow tables, which is why passwords need a salted, slow algorithm like bcrypt or Argon2.",
    },
    {
      q: "Should I hash passwords with SHA-256?",
      a: "No. Use bcrypt, scrypt or Argon2 with a per-user salt. Fast hashes like SHA-256 are trivially brute-forced on GPUs.",
    },
    {
      q: "Is my input sent to a server?",
      a: "No — hashing happens in your browser using the Web Crypto API.",
    },
    {
      q: "What is the difference between SHA-256 and SHA-512?",
      a: "Both are from the SHA-2 family; SHA-512 produces a longer 512-bit digest and can be faster on 64-bit hardware. SHA-256 is the common default.",
    },
  ],
  related: [
    { slug: "password", label: "Password Generator" },
    { slug: "uuid", label: "UUID Generator" },
    { slug: "jwt-decoder", label: "JWT Decoder" },
    { slug: "base64", label: "Base64 Encoder" },
  ],
};

TOOL_CONTENT["password"] = {
  intro:
    "Create strong, random passwords with a live entropy meter. Choose length and character sets, exclude lookalike characters, and generate as many as you need — all with the browser's cryptographically secure random number generator. Nothing is logged or transmitted.",
  headings: {
    features: "What the password generator offers",
    examples: "Password strength examples",
    useCases: "When to use a generated password",
    faq: "Password security — frequently asked questions",
    related: "Related security tools",
  },
  features: [
    {
      title: "Crypto-secure randomness",
      body: "Uses crypto.getRandomValues(), not Math.random(), so the output is unpredictable.",
    },
    {
      title: "Entropy meter",
      body: "See the bit-strength of each password so you know whether it resists offline cracking.",
    },
    {
      title: "Character set control",
      body: "Toggle uppercase, lowercase, numbers and symbols, and exclude ambiguous characters like 0/O and l/1.",
    },
    {
      title: "Bulk generation",
      body: "Produce a batch of passwords at once for seeding accounts or test environments.",
    },
  ],
  howTo: {
    name: "How to generate a strong password",
    steps: [
      {
        name: "Pick a length",
        text: "16 characters or more is a good baseline; 20+ for anything critical.",
      },
      {
        name: "Choose character sets",
        text: "Include symbols and numbers unless the target system rejects them.",
      },
      { name: "Check the entropy", text: "Aim for 80 bits or higher for accounts that matter." },
      {
        name: "Copy and store it",
        text: "Save it straight into a password manager instead of reusing it anywhere.",
      },
    ],
  },
  useCases: [
    {
      title: "New account signups",
      body: "Generate a unique password per service so one breach cannot cascade.",
    },
    {
      title: "Service credentials",
      body: "Create database passwords, API secrets and admin logins for servers and CI.",
    },
    {
      title: "Test data",
      body: "Seed staging environments with realistic but throwaway credentials.",
    },
  ],
  examples: [
    { prompt: "16 chars, all sets (~104 bits)", dialect: "Strong", sql: "T7#qLm2!vZx9$Rb4" },
    {
      prompt: "24 chars, no ambiguous chars (~142 bits)",
      dialect: "Very strong",
      sql: "hK9wZq3xTm7Rb2Vn8Ldy4Pcs",
    },
  ],
  faq: [
    {
      q: "How long should a password be?",
      a: "At least 16 characters for normal accounts and 20+ for email, banking and infrastructure. Length beats complexity rules.",
    },
    {
      q: "Is this password generator safe?",
      a: "Yes — passwords are generated locally with the Web Crypto API and never sent over the network or stored.",
    },
    {
      q: "What is password entropy?",
      a: "A measure in bits of how unpredictable a password is. 80 bits is solid, 100+ bits is effectively uncrackable with current hardware.",
    },
    {
      q: "Should I use a passphrase instead?",
      a: "A long random passphrase is fine and easier to type. What matters is that it is random and unique per site.",
    },
    {
      q: "Do I still need 2FA?",
      a: "Yes. A strong password protects against guessing; 2FA protects you if the password leaks in a breach or phishing attack.",
    },
  ],
  related: [
    { slug: "hash", label: "Hash Generator" },
    { slug: "uuid", label: "UUID Generator" },
    { slug: "jwt-generator", label: "JWT Generator" },
    { slug: "lorem", label: "Lorem Ipsum" },
  ],
};

TOOL_CONTENT["number-base"] = {
  intro:
    "Convert numbers between binary, octal, decimal, hexadecimal, base32 and base36 in one view. Type in any base and every other representation updates live — handy for bitmasks, colour values, permissions, file formats and low-level debugging.",
  headings: {
    features: "What the number base converter does",
    examples: "Number base conversion examples",
    useCases: "When you need base conversion",
    faq: "Number bases — frequently asked questions",
    related: "Related converter tools",
  },
  features: [
    {
      title: "Six bases at once",
      body: "Binary, octal, decimal, hex, base32 and base36 stay in sync as you type.",
    },
    {
      title: "Big number safe",
      body: "Conversions use BigInt where needed, so large values do not lose precision.",
    },
    {
      title: "Input validation",
      body: "Invalid digits for the chosen base are flagged instead of silently producing wrong output.",
    },
    {
      title: "Copy any representation",
      body: "One click copies the value in whichever base you need.",
    },
  ],
  howTo: {
    name: "How to convert between number bases",
    steps: [
      {
        name: "Choose an input base",
        text: "Pick the base your value is currently in — for example hex for a colour code.",
      },
      {
        name: "Enter the value",
        text: "Type or paste the number; prefixes like 0x and 0b are handled.",
      },
      { name: "Read the conversions", text: "All other bases update instantly." },
      {
        name: "Copy what you need",
        text: "Grab the binary for a bitmask or the decimal for a config file.",
      },
    ],
  },
  useCases: [
    {
      title: "Bitmasks and flags",
      body: "Translate permission flags between decimal and binary to see which bits are set.",
    },
    {
      title: "Colour and byte values",
      body: "Move between hex and decimal when working with CSS colours or raw bytes.",
    },
    {
      title: "Unix file permissions",
      body: "Read octal modes like 0755 and see the exact bit pattern behind them.",
    },
  ],
  examples: [
    {
      prompt: "Decimal 255",
      dialect: "Conversions",
      sql: "binary  11111111\noctal   377\nhex     FF\nbase36  73",
    },
    {
      prompt: "Hex 1F4",
      dialect: "Conversions",
      sql: "decimal 500\nbinary  111110100\noctal   764",
    },
  ],
  faq: [
    {
      q: "How do I convert decimal to binary?",
      a: "Divide by 2 repeatedly and read the remainders bottom-up — or just type the decimal value here and read the binary field.",
    },
    {
      q: "Why is hexadecimal used in programming?",
      a: "One hex digit maps exactly to four bits, so bytes and colours stay compact and readable compared with long binary strings.",
    },
    {
      q: "What is base36 used for?",
      a: "Base36 uses 0-9 and a-z to encode numbers compactly — common for short IDs and URL slugs.",
    },
    {
      q: "Does the converter handle very large numbers?",
      a: "Yes, BigInt-based conversion keeps precision well beyond JavaScript's safe integer limit.",
    },
    {
      q: "Can I paste 0x or 0b prefixes?",
      a: "Yes — standard prefixes are recognised and stripped automatically.",
    },
  ],
  related: [
    { slug: "base64", label: "Base64 Encoder" },
    { slug: "color", label: "Color Converter" },
    { slug: "hash", label: "Hash Generator" },
    { slug: "timestamp", label: "Timestamp Converter" },
  ],
};

TOOL_CONTENT["html-entities"] = {
  intro:
    "Encode text to HTML entities or decode entities back to plain characters. Escape &, <, >, quotes and Unicode symbols so user content renders safely, or clean up a scraped page full of &amp;amp; noise. Runs entirely in your browser.",
  headings: {
    features: "What the HTML entity encoder does",
    examples: "HTML entity examples",
    useCases: "When to escape HTML entities",
    faq: "HTML entities — frequently asked questions",
    related: "Related text tools",
  },
  features: [
    {
      title: "Encode and decode",
      body: "Switch direction instantly — escape raw text or unescape an entity-heavy string.",
    },
    {
      title: "Named and numeric",
      body: "Choose readable named entities (&amp;) or numeric references (&#38;) for maximum compatibility.",
    },
    {
      title: "Unicode aware",
      body: "Emoji, accented characters and non-Latin scripts convert correctly in both directions.",
    },
    {
      title: "Handles double-encoding",
      body: "Decode repeatedly to clean up strings that were escaped more than once.",
    },
  ],
  howTo: {
    name: "How to encode or decode HTML entities",
    steps: [
      { name: "Paste your text", text: "Drop in raw text or a string full of entity references." },
      {
        name: "Pick a direction",
        text: "Encode to escape special characters, decode to turn entities back into characters.",
      },
      {
        name: "Choose the entity style",
        text: "Named entities are readable; numeric ones work everywhere.",
      },
      { name: "Copy the result", text: "Paste the safe string into your template, CMS or email." },
    ],
  },
  useCases: [
    {
      title: "Preventing XSS in templates",
      body: "Escape user-generated content before it is injected into HTML markup.",
    },
    {
      title: "Cleaning scraped content",
      body: "Decode &amp;amp;lt; noise from feeds, exports and legacy CMS data.",
    },
    {
      title: "Showing code samples",
      body: "Escape angle brackets so HTML snippets display as text instead of rendering.",
    },
  ],
  examples: [
    {
      prompt: "Encode a code snippet",
      dialect: "Encode",
      sql: 'input:  <div class="a">Tom & Jerry</div>\noutput: &lt;div class=&quot;a&quot;&gt;Tom &amp; Jerry&lt;/div&gt;',
    },
    {
      prompt: "Decode entity noise",
      dialect: "Decode",
      sql: "input:  Caf&eacute; &amp; Bar\noutput: Café & Bar",
    },
  ],
  faq: [
    {
      q: "Which characters must be escaped in HTML?",
      a: "At minimum &, <, > and, inside attributes, single and double quotes. Escaping those prevents markup injection.",
    },
    {
      q: "Named or numeric entities — which is better?",
      a: "Named entities are easier to read; numeric references are safer for obscure characters and non-HTML contexts like XML.",
    },
    {
      q: "Why does my text show &amp;amp;?",
      a: "It was encoded twice. Decode it a second time to get the original string.",
    },
    {
      q: "Does escaping fully prevent XSS?",
      a: "It is essential but context-dependent. HTML, attribute, JavaScript and URL contexts each need the right escaping strategy.",
    },
    { q: "Is my text uploaded?", a: "No — encoding and decoding happen locally in your browser." },
  ],
  related: [
    { slug: "url-codec", label: "URL Encoder" },
    { slug: "string-escape", label: "String Escape" },
    { slug: "base64", label: "Base64 Encoder" },
    { slug: "markdown", label: "Markdown Editor" },
  ],
};

TOOL_CONTENT["ai-convert"] = {
  intro:
    "Paste code in one language and get an idiomatic translation in another. The AI code translator converts between Python, JavaScript, TypeScript, Go, Rust, Java, C#, PHP and more — preserving control flow, error handling and naming conventions instead of doing a literal token swap. You bring your own API key, so your code goes straight from your browser to your chosen model provider.",
  headings: {
    features: "What the AI code translator does",
    examples: "Code translation examples",
    useCases: "When to translate code between languages",
    faq: "AI code translation — frequently asked questions",
    related: "Related AI developer tools",
  },
  features: [
    {
      title: "Idiomatic, not literal",
      body: "List comprehensions become map/filter, Go errors become exceptions, and naming follows each language's conventions.",
    },
    {
      title: "12+ languages",
      body: "Python, JavaScript, TypeScript, Go, Rust, Java, Kotlin, C#, C++, PHP, Ruby and SQL in any direction.",
    },
    {
      title: "Keeps structure intact",
      body: "Functions, classes, types and comments are carried across so the translated file stays reviewable.",
    },
    {
      title: "Bring your own key",
      body: "Use your own Gemini, OpenAI, OpenRouter or Groq key — stored locally in your browser, never on our servers.",
    },
  ],
  howTo: {
    name: "How to translate code between languages with AI",
    steps: [
      {
        name: "Paste your code",
        text: "Drop in a function, class or whole file from the source language.",
      },
      {
        name: "Pick source and target",
        text: "Choose what you are converting from and what you want out.",
      },
      {
        name: "Run the translation",
        text: "The model rewrites the code idiomatically in the target language.",
      },
      {
        name: "Review and copy",
        text: "Read the output, adjust imports for your project, then copy it across.",
      },
    ],
  },
  useCases: [
    {
      title: "Porting a script to another stack",
      body: "Move a Python data script to TypeScript so it can run inside an existing Node service.",
    },
    {
      title: "Learning a new language",
      body: "See how code you already understand looks in Rust or Go, written the way that community writes it.",
    },
    {
      title: "Migrating a legacy service",
      body: "Translate PHP or Java modules file by file as a starting point for a modern rewrite.",
    },
    {
      title: "Sharing snippets across teams",
      body: "Give backend and frontend engineers the same algorithm in the language each one works in.",
    },
  ],
  examples: [
    {
      prompt: "Python to TypeScript",
      dialect: "Python → TypeScript",
      sql: "def total(items):\n    return sum(i['price'] for i in items)\n\n// →\nconst total = (items: { price: number }[]) =>\n  items.reduce((sum, i) => sum + i.price, 0);",
    },
    {
      prompt: "JavaScript to Go",
      dialect: "JavaScript → Go",
      sql: 'const greet = (name) => `Hi ${name}`;\n\n// →\nfunc Greet(name string) string {\n\treturn fmt.Sprintf("Hi %s", name)\n}',
    },
  ],
  faq: [
    {
      q: "Can AI translate code between programming languages accurately?",
      a: "For self-contained logic — algorithms, data transforms, utility functions — accuracy is high. Code that depends on framework internals or native libraries needs manual review, because the target language may have no direct equivalent.",
    },
    {
      q: "Which languages are supported?",
      a: "Python, JavaScript, TypeScript, Go, Rust, Java, Kotlin, C#, C++, PHP, Ruby and SQL, in any source-to-target combination.",
    },
    {
      q: "Is the translated code production ready?",
      a: "Treat it as a strong first draft. Compile it, run your tests and check dependencies before shipping.",
    },
    {
      q: "Do I need to pay for anything?",
      a: "The tool is free. You supply your own model API key, so you only pay your provider for the tokens you use.",
    },
    {
      q: "Is my code stored or used for training?",
      a: "We never store it. Your key and request go directly to the provider you selected; nothing is retained by DevHub.",
    },
    {
      q: "What is the size limit for a translation?",
      a: "It depends on your model's context window. For large files, translate one class or module at a time for the best results.",
    },
  ],
  related: [
    { slug: "ai-sql", label: "AI SQL Generator" },
    { slug: "ai-error", label: "AI Error Explainer" },
    { slug: "json-to-ts", label: "JSON to TypeScript" },
    { slug: "curl-to-code", label: "cURL to Code" },
  ],
};

TOOL_CONTENT["qrcode"] = {
  intro:
    "Create a QR code for a link, plain text, Wi-Fi network or contact card and download it as a crisp PNG or infinitely scalable SVG. Adjust size, margin and error-correction level, then export artwork that stays sharp from a business card to a shop window. Everything is generated in your browser — no signup, no tracking, no expiring codes.",
  headings: {
    features: "What the QR code generator does",
    examples: "QR code examples",
    useCases: "When to generate a QR code",
    faq: "QR codes — frequently asked questions",
    related: "Related generator tools",
  },
  features: [
    {
      title: "PNG and SVG download",
      body: "Export a raster PNG for the web or a vector SVG that scales to print and large-format signage without blurring.",
    },
    {
      title: "Error correction levels",
      body: "Pick L, M, Q or H — higher levels keep the code scannable even when part of it is damaged or covered by a logo.",
    },
    {
      title: "Size and margin control",
      body: "Set the pixel size and the quiet zone so scanners lock on reliably at any distance.",
    },
    {
      title: "Permanent, static codes",
      body: "The data is encoded in the image itself. No redirect service, so the code never expires and is never rate-limited.",
    },
  ],
  howTo: {
    name: "How to create and download a QR code",
    steps: [
      {
        name: "Enter your content",
        text: "Paste a URL or type the text you want the code to carry.",
      },
      {
        name: "Set size and correction",
        text: "Choose the pixel size and an error-correction level to suit where it will be used.",
      },
      {
        name: "Check the preview",
        text: "Scan the live preview with your phone to confirm it resolves correctly.",
      },
      {
        name: "Download PNG or SVG",
        text: "Save the PNG for screens, or the SVG for print and vector editing.",
      },
    ],
  },
  useCases: [
    {
      title: "Print and packaging",
      body: "Use the SVG so the code prints razor-sharp on labels, posters and packaging at any size.",
    },
    {
      title: "Menus and signage",
      body: "Point guests at a digital menu or booking page with a high-correction code that survives wear.",
    },
    {
      title: "Events and tickets",
      body: "Encode ticket links or check-in URLs into PNGs you can drop straight into an email template.",
    },
    {
      title: "Docs and slides",
      body: "Add a scannable link to a deck or PDF so readers can jump to a repo or demo instantly.",
    },
  ],
  examples: [
    {
      prompt: "Encode a website link",
      dialect: "URL",
      sql: "https://devhub.flinkeo.online/tools",
    },
    {
      prompt: "Encode Wi-Fi credentials",
      dialect: "Wi-Fi",
      sql: "WIFI:T:WPA;S:CafeGuest;P:latte2026;;",
    },
  ],
  faq: [
    {
      q: "Can I download a QR code as PNG and SVG?",
      a: "Yes. PNG suits screens and email; SVG is vector, so it scales to any print size without losing sharpness. If your printer asks for EPS, open the SVG in Illustrator, Inkscape or a free converter and export EPS from there.",
    },
    {
      q: "Do these QR codes expire?",
      a: "No. The content is encoded directly into the image, so there is no redirect in the middle and nothing to stop working later.",
    },
    {
      q: "What error correction level should I choose?",
      a: "M is a good default. Use Q or H when the code will be printed small, placed outdoors, or overlaid with a logo.",
    },
    {
      q: "What size should a printed QR code be?",
      a: "A rough rule is one centimetre of code per ten centimetres of scanning distance, with a minimum of about two centimetres square.",
    },
    {
      q: "Is there a scan limit or signup?",
      a: "Neither. The code is a static image you own outright — scan it as often as you like.",
    },
    {
      q: "Is my data sent anywhere?",
      a: "No. The QR code is rendered locally in your browser, so the encoded content never leaves your device.",
    },
  ],
  related: [
    { slug: "uuid", label: "UUID Generator" },
    { slug: "password", label: "Password Generator" },
    { slug: "favicon-generator", label: "Favicon Generator" },
    { slug: "image-base64", label: "Image to Base64" },
  ],
};
