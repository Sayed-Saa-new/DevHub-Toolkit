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
 * Retrieves the Notion secrets and configuration from the bound environment.
 * Falls back to process.env during local Vite development.
 */
export function getCloudflareEnv(): {
  NOTION_TOKEN?: string;
  NOTION_DATA_SOURCE_ID?: string;
  TURNSTILE_SECRET_KEY?: string;
} {
  if (cloudflareEnv) {
    return cloudflareEnv as {
      NOTION_TOKEN?: string;
      NOTION_DATA_SOURCE_ID?: string;
      TURNSTILE_SECRET_KEY?: string;
    };
  }
  return (process.env || {}) as {
    NOTION_TOKEN?: string;
    NOTION_DATA_SOURCE_ID?: string;
    TURNSTILE_SECRET_KEY?: string;
  };
}
