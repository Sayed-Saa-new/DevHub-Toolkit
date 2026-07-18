---
title: New tool — cURL → Code
publishedAt: 2026-07-19
summary: Paste any curl command, get equivalent code in fetch, axios, Node, Python, Go, PHP, Ruby, Rust, Java, C# or PowerShell.
tag: New tool
---

Meet **`/t/curl-converter`** — a one-shot converter that turns any `curl` command into working code for your language of choice.

## Supported outputs

- **JavaScript** — `fetch`, `axios`, native Node `https`
- **Python** — `requests`
- **Go** — `net/http`
- **PHP** — `curl` extension
- **Ruby** — `net/http`
- **Rust** — `reqwest` (blocking)
- **Java** — `HttpClient`
- **C#** — `HttpClient`
- **PowerShell** — `Invoke-RestMethod`

## What it handles

- Methods (`-X`, `--request`, auto-`POST` on `-d`/`-F`)
- Headers (`-H`), cookies (`-b`), user-agent (`-A`), referer (`-e`)
- Basic auth (`-u user:pass`) → `Authorization: Basic ...`
- Bodies — `--data`, `--data-raw`, `--data-binary`, `--data-urlencode`
- Multipart forms (`-F key=value`)
- Auto-detects **JSON bodies** and emits `JSON.stringify` / `json=` accordingly
- Ignores harmless flags like `-L`, `-k`, `-i`, `-s`, `-v`, `--compressed`

A tiny inline parser + status line shows detected method, URL, header count and body size so you can confirm the request before copying.