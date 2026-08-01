import { z } from "zod";
import { getCloudflareEnv } from "./server-env";

// Input validation schema with length constraints (10,000 characters limit)
export const feedbackInputSchema = z.object({
  feedback: z
    .string()
    .min(1, "Feedback is required.")
    .max(10000, "Feedback cannot exceed 10,000 characters."),
  type: z.enum(["Bug", "Feature", "UX", "Praise"]),
  tool: z.string().max(100).optional().or(z.literal("")),
  source: z.string().max(20).default("Beta"),
  website: z.string().max(100).optional(), // Honeypot field
  browser: z.string().max(150).optional(),
  deviceOrOs: z.string().max(150).optional(),
  stepsToReproduce: z
    .string()
    .max(10000, "Steps to reproduce cannot exceed 10,000 characters.")
    .optional(),
  turnstileToken: z.string().optional(),
});

export type FeedbackInput = z.infer<typeof feedbackInputSchema>;

// Simple script tag sanitization
function sanitizeString(val: string): string {
  if (!val) return "";
  return val.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
}

// Splits long strings into Unicode-safe chunks
function splitIntoChunks(text: string, maxLen: number = 1900): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = start + maxLen;
    if (end > text.length) {
      end = text.length;
    } else {
      const code = text.charCodeAt(end - 1);
      // If end-1 falls on a high surrogate, back up to keep the pair together
      if (code >= 0xd800 && code <= 0xdbff && end > start + 1) {
        end--;
      }
    }
    chunks.push(text.substring(start, end));
    start = end;
  }
  return chunks;
}

// Converts a string field into standard paragraph blocks for Notion, split if too long
function createParagraphBlocks(text: string, title?: string): Record<string, unknown>[] {
  const cleanText = sanitizeString(text);
  if (!cleanText) return [];

  const blocks: Record<string, unknown>[] = [];
  if (title) {
    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [{ type: "text", text: { content: title } }],
      },
    });
  }

  const chunks = splitIntoChunks(cleanText, 1900);
  for (const chunk of chunks) {
    blocks.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [{ type: "text", text: { content: chunk } }],
      },
    });
  }
  return blocks;
}

// IP-based request rate limiting (max 3 submissions per minute per IP within a single worker isolate)
const ipCache = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipCache.get(ip) ?? [];
  const activeTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  if (activeTimestamps.length >= MAX_REQUESTS) {
    return true;
  }
  activeTimestamps.push(now);
  ipCache.set(ip, activeTimestamps);
  return false;
}

/**
 * Validates, sanitizes, and submits the feedback data to the Notion API database.
 */
export async function submitFeedbackToNotion(
  data: FeedbackInput,
  clientIp: string,
): Promise<{ success: boolean; error?: string }> {
  // 1. Honeypot check: If the hidden 'website' field has value, assume spam bot.
  // Return success to the client to trick the spammer, but drop the payload.
  if (data.website && data.website.trim().length > 0) {
    console.warn(
      `[Spam Blocked] Honeypot field populated from IP: ${clientIp}. Value: "${data.website}"`,
    );
    return { success: true };
  }

  // 2. Local IP-based rate limiting
  if (isRateLimited(clientIp)) {
    console.warn(`[Rate Limited] IP: ${clientIp} sent too many feedback requests.`);
    return {
      success: false,
      error: "Too many submissions. Please wait a minute and try again.",
    };
  }

  // 3. Load secrets from Cloudflare bindings / process.env (done once, reused below)
  const env = getCloudflareEnv();

  // 4. Verify Cloudflare Turnstile token
  // If TURNSTILE_SECRET_KEY is configured, the token is required and must pass verification.
  const turnstileSecretKey = env.TURNSTILE_SECRET_KEY;
  if (turnstileSecretKey) {
    const token = data.turnstileToken ?? "";
    if (!token) {
      return {
        success: false,
        error: "Bot verification token missing. Please refresh the page and try again.",
      };
    }
    try {
      const formData = new FormData();
      formData.append("secret", turnstileSecretKey);
      formData.append("response", token);
      formData.append("remoteip", clientIp);
      const tsRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: formData,
      });
      const tsJson = (await tsRes.json()) as { success: boolean };
      if (!tsJson.success) {
        console.warn(`[Turnstile Failed] IP: ${clientIp}`);
        return {
          success: false,
          error: "Bot verification failed. Please try again.",
        };
      }
    } catch (err) {
      // Fail open: if the Turnstile endpoint is unreachable, allow the submission
      // rather than blocking legitimate users during a CF outage.
      console.error("Turnstile verification error (failing open):", err);
    }
  }

  // 5. Validate that Notion secrets are present
  const notionToken = env.NOTION_TOKEN;
  const notionDbId = env.NOTION_DATA_SOURCE_ID;

  if (!notionToken || !notionDbId) {
    console.error(
      "Notion Integration Error: NOTION_TOKEN or NOTION_DATA_SOURCE_ID is not configured on the server.",
    );
    return {
      success: false,
      error: "Feedback database is not configured. Please try again later.",
    };
  }

  // 6. Validate conditional inputs if Type is Bug
  if (data.type === "Bug") {
    if (!data.browser || !data.deviceOrOs || !data.stepsToReproduce) {
      return {
        success: false,
        error: "Missing browser, device, or steps to reproduce for the bug report.",
      };
    }
  }

  // 7. Sanitize string inputs
  const cleanFeedback = sanitizeString(data.feedback);
  const cleanTool = data.tool ? sanitizeString(data.tool) : "";
  const cleanBrowser = data.browser ? sanitizeString(data.browser) : "";
  const cleanDevice = data.deviceOrOs ? sanitizeString(data.deviceOrOs) : "";

  // 8. Build Notion properties
  // The database primary key title (Feedback) is truncated to 100 characters for list views.
  const truncatedTitle =
    cleanFeedback.length > 100 ? cleanFeedback.substring(0, 97) + "..." : cleanFeedback;

  const isoDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const priority = data.type === "Bug" ? "Medium" : "Low";

  const properties: Record<string, unknown> = {
    Feedback: {
      title: [{ text: { content: truncatedTitle } }],
    },
    Type: { select: { name: data.type } },
    Source: { select: { name: data.source || "Beta" } },
    Status: { status: { name: "New" } },
    Date: { date: { start: isoDate } },
    Priority: { select: { name: priority } },
    "Request Count": { number: 1 },
  };

  if (cleanTool) {
    properties.Tool = {
      rich_text: [{ text: { content: cleanTool } }],
    };
  }

  // 9. Build Notion page body (children blocks) with Unicode-safe chunk splitting
  const children: Record<string, unknown>[] = [];

  // Append full feedback message (split into chunks of 1900 chars under the 2000 Notion limit)
  children.push(...createParagraphBlocks(data.feedback, "Feedback Message"));

  // For Bugs, add detailed system reports
  if (data.type === "Bug") {
    children.push(
      {
        object: "block",
        type: "heading_2",
        heading_2: { rich_text: [{ type: "text", text: { content: "Bug Diagnostics" } }] },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: `Browser: ${cleanBrowser}` } }],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: `Device/OS: ${cleanDevice}` } }],
        },
      },
    );

    if (data.stepsToReproduce) {
      children.push(...createParagraphBlocks(data.stepsToReproduce, "Steps to Reproduce"));
    }
  }

  // 10. Submit to Notion API
  try {
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionToken}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: notionDbId },
        properties,
        children,
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      let errorCode = "unknown";
      let errorMessage = "No error details available";
      try {
        const errorJson = JSON.parse(errorDetails);
        errorCode = errorJson.code || "unknown";
        errorMessage = errorJson.message || "No error details available";
      } catch {
        errorMessage = errorDetails.substring(0, 200);
      }
      console.error(
        `Notion API Error — Status: ${response.status}, Code: ${errorCode}, Message: ${errorMessage}`,
      );
      return { success: false, error: "Unable to submit feedback. Please try again later." };
    }

    return { success: true };
  } catch (err) {
    console.error("Exception during feedback submission to Notion API:", err);
    return { success: false, error: "Internal server error. Please try again later." };
  }
}
