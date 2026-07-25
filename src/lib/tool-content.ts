import { TOOLS } from "@/lib/tools";

// Long-form, SEO-optimized page content for high-priority tools.
// Rendered below the tool UI and mirrored to structured data (FAQ / HowTo).

export type ToolContent = {
  intro: string;
  features: { title: string; body: string }[];
  howTo: { name: string; steps: { name: string; text: string }[] };
  useCases: { title: string; body: string }[];
  examples: { prompt: string; sql: string; dialect: string }[];
  faq: { q: string; a: string }[];
  related?: { slug: string; label: string }[];
};

export const TOOL_CONTENT: Record<string, ToolContent> = {
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
  ],
  faq: [
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
