/**
 * POST /api/contact — server-side endpoint of the portfolio contact form.
 *
 * The very same handler runs in every environment, with no extra dependency:
 *   • Vercel — `api/contact.ts` *is* the serverless function (Node 18+ runtime);
 *   • `npm run dev` / `npm run preview` — mounted by `scripts/vite-plugin-contact-api.ts`;
 *   • any other Node 18+ host through the same import.
 *
 * The validated message is forwarded to Resend (https://resend.com) with a plain
 * `fetch` call. Credentials stay server side only: they are *not* prefixed with
 * `VITE_`, so Vite never inlines them into the client bundle.
 *
 * Required environment variables (see `.env.example`):
 *   RESEND_API_KEY      — API key from https://resend.com/api-keys
 *   CONTACT_EMAIL       — inbox that receives the messages (comma-separated allowed)
 * Optional:
 *   CONTACT_FROM_EMAIL  — verified sender, defaults to Resend's test sender
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/**
 * Resend's shared test sender: works without owning a domain, but only delivers
 * to the address that owns the Resend account. Verify a domain (then set
 * `CONTACT_FROM_EMAIL`) to send from your own address.
 */
const DEFAULT_FROM = "Portfolio Contact <onboarding@resend.dev>";

/** Hard cap on the raw request body — guards against payload flooding. */
export const MAX_BODY_BYTES = 32 * 1024;

/** Length limits, mirrored by `maxLength` on the frontend inputs. */
export const FIELD_LIMITS = {
  name: { min: 2, max: 80 },
  email: { min: 5, max: 254 },
  subject: { min: 3, max: 140 },
  message: { min: 10, max: 5000 },
} as const;

/** Naive in-memory rate limiting — enough to stop casual abuse of a portfolio. */
export const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 } as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

type ContactFields = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof ContactFields, string>>;

type RateBucket = { count: number; resetAt: number };

/** Per-IP counters — module scope, so they survive across requests of one instance. */
const rateBuckets = new Map<string, RateBucket>();

/** Single-line sanitisation: strips control characters (CR/LF included → no header injection). */
function asLine(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Multi-line sanitisation for the message body (keeps `\n`, drops the other controls). */
function asBlock(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Escapes visitor content before it is embedded in the HTML email. */
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);
}

/** Best-effort client IP, compatible with Vercel, Netlify and Cloudflare headers. */
function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return (
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    "unknown"
  );
}

/** Returns `true` once the caller exceeds `RATE_LIMIT.max` inside the window. */
function isRateLimited(ip: string): boolean {
  const now = Date.now();

  if (rateBuckets.size > 1000) {
    for (const [key, bucket] of rateBuckets) {
      if (bucket.resetAt <= now) rateBuckets.delete(key);
    }
  }

  const bucket = rateBuckets.get(ip);
  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT.max;
}

/** Server-side validation — the single source of truth (the client mirrors it). */
function validatePayload(payload: unknown): { data: ContactFields } | { errors: FieldErrors } {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return { errors: { message: "Invalid request body." } };
  }

  const source = payload as Record<string, unknown>;
  const data: ContactFields = {
    name: asLine(source.name),
    email: asLine(source.email).toLowerCase(),
    subject: asLine(source.subject),
    message: asBlock(source.message),
  };

  const errors: FieldErrors = {};

  if (data.name.length < FIELD_LIMITS.name.min) errors.name = "Please enter your name.";
  else if (data.name.length > FIELD_LIMITS.name.max)
    errors.name = `Your name must be ${FIELD_LIMITS.name.max} characters or fewer.`;

  if (!EMAIL_PATTERN.test(data.email)) errors.email = "Please enter a valid email address.";
  else if (data.email.length > FIELD_LIMITS.email.max)
    errors.email = `Your email must be ${FIELD_LIMITS.email.max} characters or fewer.`;

  if (data.subject.length < FIELD_LIMITS.subject.min)
    errors.subject = "Please add a short subject.";
  else if (data.subject.length > FIELD_LIMITS.subject.max)
    errors.subject = `Your subject must be ${FIELD_LIMITS.subject.max} characters or fewer.`;

  if (data.message.length < FIELD_LIMITS.message.min)
    errors.message = "Your message should be at least 10 characters.";
  else if (data.message.length > FIELD_LIMITS.message.max)
    errors.message = `Your message must be ${FIELD_LIMITS.message.max} characters or fewer.`;

  return Object.keys(errors).length > 0 ? { errors } : { data };
}

/** Reads the server-side configuration. Never logged, never returned to the client. */
function readConfig():
  { apiKey: string; recipients: string[]; from: string } | { missing: string[] } {
  const apiKey = (process.env.RESEND_API_KEY ?? "").trim();
  const recipients = (process.env.CONTACT_EMAIL ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const from = (process.env.CONTACT_FROM_EMAIL ?? "").trim() || DEFAULT_FROM;

  const missing: string[] = [];
  if (!apiKey) missing.push("RESEND_API_KEY");
  if (recipients.length === 0) missing.push("CONTACT_EMAIL");

  return missing.length > 0 ? { missing } : { apiKey, recipients, from };
}

/** Builds the subject + text + HTML body of the notification email. */
function buildEmail(data: ContactFields, submittedAt: Date) {
  const iso = submittedAt.toISOString();
  const readable = submittedAt.toUTCString();

  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Subject", data.subject],
    ["Received", `${readable} (${iso})`],
  ];

  const text = [
    "New message from your portfolio contact form",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    data.message,
    "",
    `Answer this email to reply directly to ${data.name}.`,
    "",
  ].join("\n");

  const htmlRows = rows
    .map(
      ([label, value]) =>
        "<tr>" +
        `<td style="padding:6px 16px 6px 0;color:#64748b;font:600 12px/1.5 system-ui,sans-serif;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;vertical-align:top">${label}</td>` +
        `<td style="padding:6px 0;color:#0f172a;font:400 14px/1.6 system-ui,sans-serif">${escapeHtml(value)}</td>` +
        "</tr>",
    )
    .join("");

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f1f5f9">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:28px">
      <h1 style="margin:0 0 4px;color:#0f172a;font:700 18px/1.4 system-ui,sans-serif">New message from your portfolio</h1>
      <p style="margin:0 0 20px;color:#64748b;font:400 13px/1.6 system-ui,sans-serif">Reply to this email to answer ${escapeHtml(data.name)} directly.</p>
      <table role="presentation" style="border-collapse:collapse;width:100%">${htmlRows}</table>
      <div style="margin-top:20px;padding-top:20px;border-top:1px solid #e2e8f0;color:#0f172a;font:400 14px/1.7 system-ui,sans-serif">${escapeHtml(
        data.message,
      ).replace(/\n/g, "<br />")}</div>
    </div>
  </body>
</html>`;

  return {
    subject: `[Portfolio] ${data.subject} — ${data.name}`,
    text,
    html,
  };
}

function json(body: unknown, status: number, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
}

/**
 * Web-standard request handler: `Request` in, `Response` out.
 * Status codes: 200 · 400 · 405 · 413 · 415 · 429 · 500 · 502.
 */
export async function handleContactRequest(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return json({ ok: false, error: "method_not_allowed" }, 405, { Allow: "POST" });
  }

  const contentType = (request.headers.get("content-type") ?? "").toLowerCase();
  if (!contentType.includes("application/json")) {
    return json({ ok: false, error: "unsupported_media_type" }, 415);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return json({ ok: false, error: "payload_too_large" }, 413);
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return json({ ok: false, error: "invalid_body" }, 400);
  }

  if (raw.length > MAX_BODY_BYTES) {
    return json({ ok: false, error: "payload_too_large" }, 413);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  // Honeypot filled → almost certainly a bot: answer "ok" but send nothing.
  const honey =
    parsed !== null && typeof parsed === "object"
      ? (parsed as Record<string, unknown>)._gotcha
      : undefined;
  if (typeof honey === "string" && honey.trim() !== "") {
    return json({ ok: true }, 200);
  }

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return json({ ok: false, error: "rate_limited" }, 429, {
      "Retry-After": String(Math.ceil(RATE_LIMIT.windowMs / 1000)),
    });
  }

  const validation = validatePayload(parsed);
  if ("errors" in validation) {
    return json({ ok: false, error: "validation_failed", errors: validation.errors }, 400);
  }

  const config = readConfig();
  if ("missing" in config) {
    console.error(`[contact] server misconfigured — missing: ${config.missing.join(", ")}`);
    return json({ ok: false, error: "server_misconfigured" }, 500);
  }

  const submittedAt = new Date();
  const email = buildEmail(validation.data, submittedAt);

  let upstream: Response;
  try {
    upstream = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: config.recipients,
        // The visitor's address becomes Reply-To → you answer in one click.
        reply_to: validation.data.email,
        subject: email.subject,
        html: email.html,
        text: email.text,
      }),
    });
  } catch (error) {
    console.error("[contact] Resend request failed:", error);
    return json({ ok: false, error: "upstream_error" }, 502);
  }

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "");
    console.error(`[contact] Resend responded ${upstream.status}: ${detail.slice(0, 300)}`);
    return upstream.status === 429
      ? json({ ok: false, error: "rate_limited" }, 429, { "Retry-After": "60" })
      : json({ ok: false, error: "upstream_error" }, 502);
  }

  console.log(
    `[contact] message from ${validation.data.email} delivered at ${submittedAt.toISOString()}`,
  );
  return json({ ok: true }, 200);
}

/**
 * Vercel entry point (its Node 18+ runtime natively supports the Web signature).
 * The named export above is reused by the Vite dev/preview middleware.
 */
export default async function handler(request: Request): Promise<Response> {
  return handleContactRequest(request);
}
