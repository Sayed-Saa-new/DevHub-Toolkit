let cloudflareEnv: Record<string, unknown> | null = null;

/**
 * Stores the Cloudflare bindings env object inside the request context.
 * Called from the entrypoint fetch handler in server.ts.
 */
export function setCloudflareEnv(env: unknown) {
  if (env && typeof env === "object") {
    cloudflareEnv = env as Record<string, unknown>;
  }
}

/**
 * Retrieves secrets and configuration from the bound environment.
 * Falls back to process.env during local Vite development.
 */
export function getCloudflareEnv(): {
  GEMINI_API_KEY?: string;
  NOTION_TOKEN?: string;
  NOTION_DATA_SOURCE_ID?: string;
  TURNSTILE_SECRET_KEY?: string;
} {
  if (cloudflareEnv) {
    return cloudflareEnv as {
      GEMINI_API_KEY?: string;
      NOTION_TOKEN?: string;
      NOTION_DATA_SOURCE_ID?: string;
      TURNSTILE_SECRET_KEY?: string;
    };
  }
  return (process.env || {}) as {
    GEMINI_API_KEY?: string;
    NOTION_TOKEN?: string;
    NOTION_DATA_SOURCE_ID?: string;
    TURNSTILE_SECRET_KEY?: string;
  };
}
