import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const fetchHtml = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ url: z.string().url() }).parse(data))
  .handler(async ({ data }) => {
    const res = await fetch(data.url, {
      headers: {
        "User-Agent": "DevHubToolkit-SchemaValidator/1.0 (+https://devhub.flinkeo.online)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    if (!res.ok) {
      throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
    }
    const html = await res.text();
    return { html, finalUrl: res.url, status: res.status };
  });