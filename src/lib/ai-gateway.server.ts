import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function createGeminiProvider(apiKey: string) {
  return createGoogleGenerativeAI({ apiKey });
}

export type ByokProviderId = "google" | "openai" | "openrouter" | "groq";

const BASE_URLS: Record<Exclude<ByokProviderId, "google">, string> = {
  openai: "https://api.openai.com/v1",
  openrouter: "https://openrouter.ai/api/v1",
  groq: "https://api.groq.com/openai/v1",
};

export const DEFAULT_MODELS: Record<ByokProviderId, string> = {
  google: "gemini-flash-latest",
  openai: "gpt-4o-mini",
  openrouter: "google/gemini-2.5-flash",
  groq: "llama-3.3-70b-versatile",
};

/**
 * Builds a language model from a user-supplied (BYOK) API key.
 * The key lives only for the duration of this request.
 */
export function createByokModel(provider: ByokProviderId, apiKey: string, model: string) {
  if (provider === "google") {
    return createGoogleGenerativeAI({ apiKey })(model);
  }
  return createOpenAICompatible({
    name: provider,
    baseURL: BASE_URLS[provider],
    apiKey,
  })(model);
}
