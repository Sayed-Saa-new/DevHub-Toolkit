---
title: New tool — SQL Formatter
publishedAt: 2026-07-20
tag: New tool
summary: Beautify or minify SQL across 17 dialects — Postgres, MySQL, BigQuery, Snowflake, T-SQL, Oracle and more.
---

Meet **`/t/sql-formatter`** — a proper SQL beautifier that respects the dialect you actually write.

## Dialects

Standard SQL, PostgreSQL, MySQL, MariaDB, SQLite, BigQuery, Snowflake, Redshift, Spark SQL, T-SQL (MSSQL), PL/SQL (Oracle), DB2, N1QL, Hive, Trino / Presto, SingleStore and TiDB.

## Controls

- **Keyword case** — `UPPER`, `lower` or preserve
- **Indent** — 1–8 spaces, standard / tabular-left / tabular-right layouts
- **Expression width** — soft-wrap long expressions from 30 to 120 chars
- **Lines between queries** — for multi-statement scripts
- **Format ↔ Minify** — one-click switch, comment-aware minifier that strips `--` and `/* ... */` while preserving string literals

## Feedback loop

Live syntax errors surface inline as you type, and the header shows statement + line counts on the input and characters saved when minifying.

Copy the result or download as `.sql` — nothing leaves your browser.
