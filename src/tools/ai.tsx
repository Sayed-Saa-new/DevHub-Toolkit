import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Loader2, Send, Sparkles, StopCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { marked } from "marked";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton, Field, Panel } from "./primitives";

type Mode =
  | "explain"
  | "optimize"
  | "commit"
  | "sql"
  | "convert"
  | "error"
  | "regex"
  | "tests";

function extractText(messages: UIMessage[]): string {
  const last = [...messages].reverse().find((m) => m.role === "assistant");
  if (!last) return "";
  return last.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");
}

function AiWorkbench({
  mode,
  placeholder,
  submitLabel,
  outputTitle,
  inputTitle = "Input",
  inputRows = 12,
}: {
  mode: Mode;
  placeholder: string;
  submitLabel: string;
  outputTitle: string;
  inputTitle?: string;
  inputRows?: number;
}) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai",
        prepareSendMessagesRequest: ({ messages }) => ({
          body: { mode, messages },
        }),
      }),
    [mode],
  );

  const { messages, sendMessage, status, stop, error, setMessages } = useChat({
    id: `ai-${mode}`,
    transport,
  });

  const [input, setInput] = useState("");
  const busy = status === "submitted" || status === "streaming";
  const output = extractText(messages);
  const isCommit = mode === "commit";
  const html = useMemo(() => {
    if (isCommit || !output) return "";
    try {
      return marked.parse(output, { async: false, gfm: true, breaks: true }) as string;
    } catch {
      return "";
    }
  }, [output, isCommit]);

  const onRun = () => {
    const text = input.trim();
    if (!text || busy) return;
    sendMessage({ text });
  };

  const onClear = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-3">
        <Field label={inputTitle}>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            rows={inputRows}
            className="font-mono text-sm"
          />
        </Field>
        <div className="flex items-center gap-2">
          <Button onClick={onRun} disabled={busy || !input.trim()} className="gap-2">
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
            {busy ? "Generating…" : submitLabel}
          </Button>
          {busy && (
            <Button variant="outline" size="sm" onClick={() => stop()} className="gap-1.5">
              <StopCircle className="size-3.5" /> Stop
            </Button>
          )}
          {(output || messages.length > 0) && !busy && (
            <Button variant="ghost" size="sm" onClick={onClear}>
              Clear
            </Button>
          )}
          <span className="ml-auto text-[10px] text-muted-foreground flex items-center gap-1">
            <Sparkles className="size-3" /> Powered by Lovable AI
          </span>
        </div>
        {error && (
          <div className="text-xs text-destructive border border-destructive/40 rounded-md px-3 py-2">
            {error.message || "Something went wrong. Try again."}
          </div>
        )}
      </div>

      <Panel
        title={outputTitle}
        actions={output ? <CopyButton text={output} /> : null}
      >
        <div className="p-4 min-h-64 max-h-[600px] overflow-auto">
          {output ? (
            isCommit ? (
              <pre className="whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed">
                {output}
              </pre>
            ) : (
              <div
                className="prose-md"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            )
          ) : (
            <div className="text-sm text-muted-foreground flex items-center gap-2 h-full">
              <Sparkles className="size-4 opacity-60" />
              {busy ? "Thinking…" : "Output will appear here."}
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}

export function AiExplainer() {
  return (
    <AiWorkbench
      mode="explain"
      inputTitle="Paste code"
      placeholder={"function memo(fn) {\n  const cache = new Map();\n  return (x) => cache.get(x) ?? cache.set(x, fn(x)).get(x);\n}"}
      submitLabel="Explain code"
      outputTitle="Explanation"
    />
  );
}

export function AiOptimizer() {
  return (
    <AiWorkbench
      mode="optimize"
      inputTitle="Paste code to optimize"
      placeholder={"// e.g. a slow loop, nested map, or unbatched fetch\nfor (const id of ids) {\n  const u = await fetch('/api/user/' + id).then(r => r.json());\n  users.push(u);\n}"}
      submitLabel="Optimize"
      outputTitle="Optimized version"
    />
  );
}

export function AiCommit() {
  return (
    <AiWorkbench
      mode="commit"
      inputTitle="Paste git diff or describe changes"
      placeholder={"git diff output, or:\n- added dark mode toggle in header\n- fixed race condition in useAuth"}
      submitLabel="Generate commit"
      outputTitle="Commit message"
      inputRows={10}
    />
  );
}

export function AiSql() {
  return (
    <AiWorkbench
      mode="sql"
      inputTitle="Describe the query"
      placeholder={"Top 10 users by total order value in the last 30 days, joined with their country."}
      submitLabel="Generate SQL"
      outputTitle="SQL query"
      inputRows={8}
    />
  );
}

export function AiConvert() {
  return (
    <AiWorkbench
      mode="convert"
      inputTitle="Paste code + target language"
      placeholder={"// from: python to: typescript\ndef fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a"}
      submitLabel="Convert"
      outputTitle="Translated code"
    />
  );
}

export function AiErrorExplainer() {
  return (
    <AiWorkbench
      mode="error"
      inputTitle="Paste error message or stack trace"
      placeholder={"TypeError: Cannot read properties of undefined (reading 'map')\n    at UserList (UserList.tsx:14:22)\n    ..."}
      submitLabel="Explain error"
      outputTitle="Diagnosis & fix"
    />
  );
}

export function AiRegex() {
  return (
    <AiWorkbench
      mode="regex"
      inputTitle="Describe the pattern"
      placeholder={"Match a valid international phone number starting with + followed by 8 to 15 digits."}
      submitLabel="Generate regex"
      outputTitle="Regex pattern"
      inputRows={6}
    />
  );
}

export function AiTests() {
  return (
    <AiWorkbench
      mode="tests"
      inputTitle="Paste function or module"
      placeholder={"export function slugify(input: string): string {\n  return input.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');\n}"}
      submitLabel="Generate tests"
      outputTitle="Test file (Vitest)"
    />
  );
}