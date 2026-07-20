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
      { title: "Natural language → SQL", body: "Write what you want in English (or Bangla). The model returns a working SQL query with the right joins, filters and grouping." },
      { title: "Dialect aware", body: "PostgreSQL, MySQL, SQLite, SQL Server and BigQuery syntax — including window functions, CTEs and JSON operators." },
      { title: "Schema hints", body: "Paste your CREATE TABLE statements or a short schema description to get queries that reference real columns and foreign keys." },
      { title: "Explains itself", body: "Every generated query is annotated so you understand each clause — great for learning SQL or reviewing AI output before you ship." },
      { title: "Optimize & refactor", body: "Ask for a faster version, an index suggestion, or a rewrite using CTEs instead of subqueries." },
      { title: "Private by default", body: "Prompts are sent to the AI provider only for the current request. Nothing is stored server-side and there is no account required." },
    ],
    howTo: {
      name: "How to generate SQL from natural language",
      steps: [
        { name: "Describe the query", text: "Type what you want in plain English — for example 'top 10 customers by revenue in the last 30 days'." },
        { name: "Add schema context (optional)", text: "Paste your CREATE TABLE statements or column names so the AI uses real identifiers." },
        { name: "Pick a dialect", text: "Mention PostgreSQL, MySQL, SQLite, T-SQL or BigQuery in the prompt so the output uses the right syntax." },
        { name: "Generate & review", text: "Click Generate SQL. Read the query and its explanation, then copy it into your database client." },
        { name: "Iterate", text: "Ask follow-ups like 'add a monthly breakdown' or 'rewrite with a CTE' to refine the result." },
      ],
    },
    useCases: [
      { title: "Analytics & reporting", body: "Turn a stakeholder question into a query without hand-writing five joins. Perfect for ad-hoc dashboards and Metabase / Superset cards." },
      { title: "Learning SQL", body: "Compare your own query to the AI's version and read the explanation — a fast way to level up on window functions and CTEs." },
      { title: "Data migrations", body: "Generate INSERT ... SELECT statements, backfills and one-off cleanup queries with the right WHERE conditions." },
      { title: "ORM escape hatch", body: "When Prisma, Drizzle or ActiveRecord can't express what you need, describe it in English and drop the raw SQL into a $queryRaw call." },
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
        a: "It's a focused, single-purpose workspace: no chat setup, no system-prompt tuning, dialect-aware output, and it's grouped with 55+ other developer tools you already use — formatters, converters, generators — on the same site.",
      },
    ],
    related: [
      { slug: "sql-formatter", label: "SQL Formatter" },
      { slug: "mock-data", label: "Mock Data Generator" },
      { slug: "json-to-ts", label: "JSON → TypeScript" },
      { slug: "ai-explainer", label: "AI Code Explainer" },
    ],
  },
};