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

export default function handler(): Response {
  const status = getConfigStatus();

  return new Response(
    JSON.stringify(
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
    {
      status: status.configured ? 200 : 503,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}