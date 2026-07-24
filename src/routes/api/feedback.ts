import { createFileRoute } from "@tanstack/react-router";
import { submitFeedbackToNotion, feedbackInputSchema } from "@/lib/feedback.server";

export const Route = createFileRoute("/api/feedback")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Enforce payload size limit from the Content-Length header (max 64KB = 65536 bytes)
        const contentLength = request.headers.get("content-length");
        if (contentLength && parseInt(contentLength, 10) > 65536) {
          return new Response(JSON.stringify({ success: false, error: "Payload too large." }), {
            status: 413,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const contentType = request.headers.get("content-type") ?? "";
          if (!contentType.includes("application/json")) {
            return new Response(
              JSON.stringify({ success: false, error: "Content-Type must be application/json." }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          // Read body as text first to strictly check raw byte size
          const rawBody = await request.text();
          if (new Blob([rawBody]).size > 65536) {
            return new Response(JSON.stringify({ success: false, error: "Payload too large." }), {
              status: 413,
              headers: { "Content-Type": "application/json" },
            });
          }

          let body;
          try {
            body = JSON.parse(rawBody);
          } catch {
            return new Response(
              JSON.stringify({ success: false, error: "Malformed JSON payload." }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          // Validate fields with Zod
          const parsed = feedbackInputSchema.safeParse(body);
          if (!parsed.success) {
            return new Response(
              JSON.stringify({
                success: false,
                error: "Invalid input fields.",
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          // Extract Client IP (prefers Cloudflare connecting IP, then standard fallback)
          const clientIp =
            request.headers.get("cf-connecting-ip") ||
            request.headers.get("x-real-ip") ||
            "127.0.0.1";

          // Delegate to Notion Integration Service
          const result = await submitFeedbackToNotion(parsed.data, clientIp);

          if (!result.success) {
            return new Response(JSON.stringify({ success: false, error: result.error }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("Unhandled endpoint error in /api/feedback POST handler:", err);
          return new Response(
            JSON.stringify({ success: false, error: "An unexpected error occurred." }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
