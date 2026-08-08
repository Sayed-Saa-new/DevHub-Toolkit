import { useCallback, useEffect, useState } from "react";

export type ByokProvider = "google" | "openai" | "openrouter" | "groq";

export type ByokSettings = {
  provider: ByokProvider;
  apiKey: string;
  model: string;
};

export const BYOK_PROVIDERS: {
  id: ByokProvider;
  label: string;
  defaultModel: string;
  models: string[];
  keyPrefix: string;
  keyUrl: string;
  note: string;
}[] = [
  {
    id: "google",
    label: "Google Gemini",
    defaultModel: "gemini-flash-latest",
    models: ["gemini-flash-latest", "gemini-2.5-flash", "gemini-2.5-pro"],
    keyPrefix: "AIza…",
    keyUrl: "https://aistudio.google.com/app/apikey",
    note: "Generous free tier — best starting point.",
  },
  {
    id: "openai",
    label: "OpenAI",
    defaultModel: "gpt-4o-mini",
    models: ["gpt-4o-mini", "gpt-4o", "gpt-4.1-mini"],
    keyPrefix: "sk-…",
    keyUrl: "https://platform.openai.com/api-keys",
    note: "Pay as you go, billed by OpenAI.",
  },
  {
    id: "openrouter",
    label: "OpenRouter",
    defaultModel: "google/gemini-2.5-flash",
    models: ["google/gemini-2.5-flash", "openai/gpt-4o-mini", "anthropic/claude-3.5-haiku"],
    keyPrefix: "sk-or-…",
    keyUrl: "https://openrouter.ai/keys",
    note: "One key, many models.",
  },
  {
    id: "groq",
    label: "Groq",
    defaultModel: "llama-3.3-70b-versatile",
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"],
    keyPrefix: "gsk_…",
    keyUrl: "https://console.groq.com/keys",
    note: "Extremely fast inference.",
  },
];

export function providerMeta(id: ByokProvider) {
  return BYOK_PROVIDERS.find((p) => p.id === id) ?? BYOK_PROVIDERS[0];
}

const KEY = "devhub:byok";

const EMPTY: ByokSettings = { provider: "google", apiKey: "", model: "gemini-flash-latest" };

function read(): ByokSettings {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<ByokSettings>;
    const provider = (parsed.provider ?? "google") as ByokProvider;
    return {
      provider,
      apiKey: typeof parsed.apiKey === "string" ? parsed.apiKey : "",
      model: parsed.model || providerMeta(provider).defaultModel,
    };
  } catch {
    return EMPTY;
  }
}

/** BYOK settings live only in this browser's localStorage — never on our servers. */
export function useByok() {
  const [settings, setSettings] = useState<ByokSettings>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSettings(read());
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setSettings(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = useCallback((next: ByokSettings) => {
    setSettings(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const clear = useCallback(() => {
    setSettings(EMPTY);
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return { settings, ready, save, clear, hasKey: settings.apiKey.trim().length > 0 };
}

export function maskKey(key: string) {
  const k = key.trim();
  if (k.length <= 8) return "••••";
  return `${k.slice(0, 4)}••••${k.slice(-4)}`;
}