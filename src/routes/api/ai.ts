import { createFileRoute } from "@tanstack/react-router";
import { streamText, convertToModelMessages, type UIMessage } from "ai";

import { createGeminiProvider } from "@/lib/ai-gateway.server";

type Mode =
  | "explain"
  | "optimize"
  | "commit"
  | "sql"
  | "convert"
  | "error"
  | "regex"
  | "tests";

const SYSTEM: Record<Mode, string> = {
  explain:
    "You are a senior engineer. Explain the given code clearly and concisely. Structure the response as: 1) One-sentence summary. 2) Line-by-line or block-by-block walkthrough (use bullets). 3) Notable gotchas, complexity, or edge cases. Use markdown. Do not repeat the code back verbatim.",
  optimize:
    "You are a performance-focused senior engineer. Analyze the given code and return an optimized version. Structure: 1) Key issues found (bullets). 2) Optimized code in a single fenced code block. 3) Why it's faster/cleaner. Preserve behavior. Use markdown.",
  commit:
    "You generate Conventional Commit messages from a git diff or change description. Output ONLY the commit message — no explanation, no code fences. Format: `type(scope): subject` on line 1 (<=72 chars), blank line, optional body with bullets. Types: feat, fix, refactor, perf, docs, test, chore, style, build, ci.",
  sql:
    "You convert natural-language requests into SQL. Structure: 1) A single fenced ```sql code block with a clean, standards-compliant query (PostgreSQL dialect unless the user specifies another). 2) A short bullet list explaining the query, assumed schema, and any caveats. Use markdown.",
  convert:
    "You are a polyglot code translator. The user pastes source code (optionally prefixed with `// from: X to: Y`). Detect source language if unspecified and translate to the target language, preserving behavior and idioms. Output: 1) One fenced code block with the translated code (correct language tag). 2) Short bullet list of notable idiomatic changes. Use markdown.",
  error:
    "You are a debugging expert. The user pastes an error message, stack trace, or log. Explain: 1) Plain-English cause (1-2 sentences). 2) Most likely root causes (bullets). 3) Concrete fix steps with code snippet when applicable. 4) How to prevent it. Use markdown.",
  regex:
    "You generate regular expressions from natural-language descriptions. Output: 1) A single fenced ```regex code block with the pattern (JavaScript flavor unless specified). 2) A breakdown of each token in a bullet list. 3) 3-5 example matches and non-matches. Use markdown.",
  tests:
    "You are a test-writing expert. Given a function or module, generate a comprehensive unit test suite. Default framework: Vitest (TypeScript). Include: happy paths, edge cases, error cases. Output: 1) Single fenced ```ts code block with the full test file. 2) Short bullet list of what's covered. Use markdown.",
};

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as {
          mode?: Mode;
          input?: string;
          messages?: UIMessage[];
        };

        const key = process.env.GEMINI_API_KEY;
        if (!key) return new Response("Missing GEMINI_API_KEY", { status: 500 });

        const mode = body.mode ?? "explain";
        const system = SYSTEM[mode] ?? SYSTEM.explain;

        const google = createGeminiProvider(key);
        const model = google("gemini-flash-latest");

        const messages: UIMessage[] = body.messages ?? [
          {
            id: "u1",
            role: "user",
            parts: [{ type: "text", text: body.input ?? "" }],
          } as UIMessage,
        ];

        try {
          const result = streamText({
            model,
            system,
            messages: await convertToModelMessages(messages),
          });
          return result.toUIMessageStreamResponse({ originalMessages: messages });
        } catch (err) {
          const msg = err instanceof Error ? err.message : "AI request failed";
          return new Response(msg, { status: 500 });
        }
      },
    },
  },
});