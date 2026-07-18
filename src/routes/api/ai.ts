import { createFileRoute } from "@tanstack/react-router";
import { streamText, convertToModelMessages, type UIMessage } from "ai";

import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

type Mode = "explain" | "optimize" | "commit";

const SYSTEM: Record<Mode, string> = {
  explain:
    "You are a senior engineer. Explain the given code clearly and concisely. Structure the response as: 1) One-sentence summary. 2) Line-by-line or block-by-block walkthrough (use bullets). 3) Notable gotchas, complexity, or edge cases. Use markdown. Do not repeat the code back verbatim.",
  optimize:
    "You are a performance-focused senior engineer. Analyze the given code and return an optimized version. Structure: 1) Key issues found (bullets). 2) Optimized code in a single fenced code block. 3) Why it's faster/cleaner. Preserve behavior. Use markdown.",
  commit:
    "You generate Conventional Commit messages from a git diff or change description. Output ONLY the commit message — no explanation, no code fences. Format: `type(scope): subject` on line 1 (<=72 chars), blank line, optional body with bullets. Types: feat, fix, refactor, perf, docs, test, chore, style, build, ci.",
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

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const mode = body.mode ?? "explain";
        const system = SYSTEM[mode] ?? SYSTEM.explain;

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3.5-flash");

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