/**
 * GET /api/health — deployment diagnostic for the contact form.
 *
 * The form can only report a generic "unable to send" to visitors, which makes a
 * broken production deploy hard to debug from the browser alone. This endpoint
 * answers whether the serverless function is actually receiving the environment
 * variables it needs. It reports the *presence* of the variables only — never
 * their values, and never the API key.
 *
 * Open https://<your-domain>/api/health in a browser after deploying.
 */
import { getConfigStatus } from "./contact";
import {
  BodyTooLargeError,
  isWebRequest,
  sendWebResponse,
  type NodeLikeRequest,
  type NodeLikeResponse,
} from "./_node-bridge";

/** Body of the diagnostic, shared by both calling conventions. */
function healthPayload() {
  const status = getConfigStatus();
  return {
    body: JSON.stringify(
      {
        ok: status.configured,
        service: "portfolio-contact-api",
        config: status,
        hint: status.configured
          ? "Configuration OK. If sending still fails, check the Vercel function logs for the Resend response."
          : `Missing environment variable(s): ${status.missing.join(", ")}. Add them in Vercel → Project → Settings → Environment Variables, then redeploy.`,
      },
      null,
      2,
    ),
    status: status.configured ? 200 : 503,
  };
}

/**
 * Accepts both the Node `(req, res)` pair and a Web `Request`, so the endpoint
 * answers the same way on every runtime (see `./_node-bridge`).
 */
export default async function handler(
  input: Request | NodeLikeRequest,
  nodeResponse?: NodeLikeResponse,
): Promise<Response | void> {
  if (nodeResponse === undefined && isWebRequest(input)) {
    const payload = healthPayload();
    return new Response(payload.body, {
      status: payload.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  if (!nodeResponse) {
    return new Response(JSON.stringify({ ok: false, error: "internal_error" }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  try {
    const payload = healthPayload();
    await sendWebResponse(
      new Response(payload.body, {
        status: payload.status,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      }),
      nodeResponse,
    );
  } catch (error) {
    const tooLarge = error instanceof BodyTooLargeError;
    if (!nodeResponse.headersSent) {
      nodeResponse.statusCode = tooLarge ? 413 : 500;
      nodeResponse.setHeader("Content-Type", "application/json; charset=utf-8");
      nodeResponse.end(
        JSON.stringify({ ok: false, error: tooLarge ? "payload_too_large" : "internal_error" }),
      );
    }
    if (!tooLarge) console.error("[health] invocation failed:", error);
  }
}