import { useEffect, useMemo, useState } from "react";
import {
  format as formatSql,
  type FormatOptionsWithLanguage,
  type SqlLanguage,
} from "sql-formatter";
import { Wand2, Minimize2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Field, Panel, CopyButton, DownloadButton } from "./primitives";

type Dialect = SqlLanguage;
type KeywordCase = NonNullable<FormatOptionsWithLanguage["keywordCase"]>;
type IndentStyle = NonNullable<FormatOptionsWithLanguage["indentStyle"]>;

const DIALECTS: { id: Dialect; label: string }[] = [
  { id: "sql", label: "Standard SQL" },
  { id: "postgresql", label: "PostgreSQL" },
  { id: "mysql", label: "MySQL" },
  { id: "mariadb", label: "MariaDB" },
  { id: "sqlite", label: "SQLite" },
  { id: "bigquery", label: "BigQuery" },
  { id: "snowflake", label: "Snowflake" },
  { id: "redshift", label: "Redshift" },
  { id: "spark", label: "Spark SQL" },
  { id: "transactsql", label: "T-SQL (MSSQL)" },
  { id: "plsql", label: "PL/SQL (Oracle)" },
  { id: "db2", label: "DB2" },
  { id: "n1ql", label: "N1QL" },
  { id: "hive", label: "Hive" },
  { id: "trino", label: "Trino / Presto" },
  { id: "singlestoredb", label: "SingleStore" },
  { id: "tidb", label: "TiDB" },
];

const KEYWORD_CASE: { id: KeywordCase; label: string }[] = [
  { id: "upper", label: "UPPER" },
  { id: "lower", label: "lower" },
  { id: "preserve", label: "Preserve" },
];

const SAMPLE = `select u.id, u.email, count(o.id) as order_count, sum(o.total) as revenue
from users u left join orders o on o.user_id = u.id
where u.created_at > '2026-01-01' and o.status in ('paid','shipped')
group by u.id, u.email having count(o.id) > 3 order by revenue desc limit 25;`;

function minify(sql: string): string {
  // Remove -- line comments and /* block */ comments, collapse whitespace,
  // preserve single-quoted literals.
  let out = "";
  let i = 0;
  while (i < sql.length) {
    const ch = sql[i];
    const nx = sql[i + 1];
    if (ch === "'") {
      out += ch;
      i++;
      while (i < sql.length) {
        out += sql[i];
        if (sql[i] === "'" && sql[i - 1] !== "\\") {
          i++;
          break;
        }
        i++;
      }
      continue;
    }
    if (ch === "-" && nx === "-") {
      while (i < sql.length && sql[i] !== "\n") i++;
      continue;
    }
    if (ch === "/" && nx === "*") {
      i += 2;
      while (i < sql.length && !(sql[i] === "*" && sql[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    out += ch;
    i++;
  }
  return out
    .replace(/\s+/g, " ")
    .replace(/\s*([,;()])\s*/g, "$1")
    .trim();
}

function tokenStats(sql: string) {
  const trimmed = sql.trim();
  const statements = trimmed
    ? trimmed.split(/;\s*(?=(?:[^']*'[^']*')*[^']*$)/).filter((s) => s.trim()).length
    : 0;
  const lines = trimmed ? trimmed.split(/\n/).length : 0;
  return { chars: sql.length, lines, statements };
}

export function SqlFormatter() {
  const [input, setInput] = useState(SAMPLE);
  const [dialect, setDialect] = useState<Dialect>("postgresql");
  const [indent, setIndent] = useState(2);
  const [keywordCase, setKeywordCase] = useState<KeywordCase>("upper");
  const [linesBetweenQueries, setLinesBetweenQueries] = useState(2);
  const [indentStyle, setIndentStyle] = useState<IndentStyle>("standard");
  const [expressionWidth, setExpressionWidth] = useState(60);
  const [mode, setMode] = useState<"format" | "minify">("format");
  const [error, setError] = useState<string | null>(null);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    if (mode === "minify") return minify(input);
    const res = formatSql(input, {
      language: dialect,
      tabWidth: indent,
      useTabs: false,
      keywordCase,
      linesBetweenQueries,
      indentStyle,
      logicalOperatorNewline: "before",
      expressionWidth,
      denseOperators: false,
      newlineBeforeSemicolon: false,
    });
    return res;
  }, [
    input,
    dialect,
    indent,
    keywordCase,
    linesBetweenQueries,
    indentStyle,
    expressionWidth,
    mode,
  ]);

  useEffect(() => {
    try {
      if (input.trim() && mode === "format") {
        formatSql(input, { language: dialect });
      }
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to parse SQL");
    }
  }, [input, dialect, mode]);

  const inStats = tokenStats(input);
  const outStats = tokenStats(output);
  const savedPct =
    input.length && mode === "minify"
      ? Math.max(0, Math.round((1 - output.length / input.length) * 100))
      : 0;

  return (
    <div className="space-y-4">
      <Panel title="Options">
        <div className="p-3 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Field label="Dialect">
            <select
              value={dialect}
              onChange={(e) => setDialect(e.target.value as Dialect)}
              className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm"
            >
              {DIALECTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Keyword case">
            <select
              value={keywordCase}
              onChange={(e) => setKeywordCase(e.target.value as KeywordCase)}
              className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm"
            >
              {KEYWORD_CASE.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label={`Indent (${indent} spaces)`}>
            <input
              type="range"
              min={1}
              max={8}
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="w-full"
            />
          </Field>
          <Field label={`Lines between queries (${linesBetweenQueries})`}>
            <input
              type="range"
              min={1}
              max={4}
              value={linesBetweenQueries}
              onChange={(e) => setLinesBetweenQueries(Number(e.target.value))}
              className="w-full"
            />
          </Field>
          <Field label="Indent style">
            <select
              value={indentStyle}
              onChange={(e) => setIndentStyle(e.target.value as IndentStyle)}
              className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm"
            >
              <option value="standard">Standard</option>
              <option value="tabularLeft">Tabular left</option>
              <option value="tabularRight">Tabular right</option>
            </select>
          </Field>
          <Field label={`Expression width (${expressionWidth})`}>
            <input
              type="range"
              min={30}
              max={120}
              step={5}
              value={expressionWidth}
              onChange={(e) => setExpressionWidth(Number(e.target.value))}
              className="w-full"
            />
          </Field>
          <Field label="Mode">
            <div className="flex gap-1">
              <Button
                variant={mode === "format" ? "default" : "outline"}
                size="sm"
                className="flex-1 gap-1.5"
                onClick={() => setMode("format")}
              >
                <Wand2 className="size-3.5" /> Format
              </Button>
              <Button
                variant={mode === "minify" ? "default" : "outline"}
                size="sm"
                className="flex-1 gap-1.5"
                onClick={() => setMode("minify")}
              >
                <Minimize2 className="size-3.5" /> Minify
              </Button>
            </div>
          </Field>
          <Field label="Actions">
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setInput(SAMPLE)}
              >
                Sample
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setInput("")}>
                Clear
              </Button>
            </div>
          </Field>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel
          title={`Input · ${inStats.statements} stmt · ${inStats.lines} lines`}
          actions={<CopyButton text={input} />}
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste SQL here…"
            className="min-h-[420px] font-mono text-sm border-0 rounded-none focus-visible:ring-0 resize-none"
            spellCheck={false}
          />
        </Panel>

        <Panel
          title={
            mode === "minify"
              ? `Minified · ${outStats.chars} chars · saved ${savedPct}%`
              : `Formatted · ${outStats.lines} lines`
          }
          actions={
            <>
              <CopyButton text={output} />
              <DownloadButton filename="query.sql" content={output} mime="application/sql" />
            </>
          }
        >
          {error && mode === "format" ? (
            <div className="p-4 text-sm text-destructive font-mono whitespace-pre-wrap">
              {error}
            </div>
          ) : (
            <pre className="p-3 min-h-[420px] max-h-[420px] overflow-auto font-mono text-sm whitespace-pre-wrap m-0">
              {output || <span className="text-muted-foreground">Formatted SQL appears here…</span>}
            </pre>
          )}
        </Panel>
      </div>
    </div>
  );
}
