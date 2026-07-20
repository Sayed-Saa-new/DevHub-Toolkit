# DevHub Toolkit

> 56 free, fast, keyboard-first developer utilities in one clean interface. Inspired by Vercel, Linear, and Raycast.

Live: **[devhub.flinkeo.online](https://devhub.flinkeo.online)**

![DevHub Toolkit](https://devhub.flinkeo.online/icon-512.png)

## Features

- **56 tools** — JSON, Base64, JWT, UUID, hashes, regex, QR, color, gradient, shadow, markdown, playground, cheat sheets, and more
- **AI-powered** — SQL, regex, code explainer, optimizer, commit messages, tests, code converter, error fixer (Gemini)
- **Global search** — `⌘K` / `Ctrl+K` to jump to any tool
- **Favorites & recents** — persisted locally
- **SEO-first** — unique metadata, JSON-LD, sitemap, dynamic per-tool routes
- **Fully client-side** — no tracking, no signup
- **Responsive** — mobile-first, keyboard-friendly, dark mode

## Tech Stack

- **Framework**: TanStack Start (React 19 + Vite 7)
- **Styling**: Tailwind CSS v4
- **UI**: shadcn/ui + Radix
- **AI**: Google Gemini via AI SDK
- **Deploy**: Cloudflare Workers

## Getting Started

```bash
bun install
bun run dev
```

Open [http://localhost:8080](http://localhost:8080).

### Environment

Create `.env` with:

```
GEMINI_API_KEY=your_google_ai_studio_key
```

Get a free key at [aistudio.google.com](https://aistudio.google.com/apikey).

## Build

```bash
bun run build
```

## Deploy

Deploys to Cloudflare Workers out of the box. Push to GitHub, connect the repo in Cloudflare Workers & Pages, and add `GEMINI_API_KEY` as an environment variable.

## Keyboard Shortcuts

- `⌘K` / `Ctrl+K` — Open command palette
- `?` — Show all shortcuts
- `g h` — Go home
- `g f` — Go to favorites

## License

MIT © DevHub