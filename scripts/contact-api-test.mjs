/**
 * Contact API test suite.
 *
 * Runs the real `POST /api/contact` handler (`api/contact.ts`) and the real Vite
 * dev-server middleware (`scripts/vite-plugin-contact-api.ts`) against a stubbed
 * Resend endpoint: no network access and no API key required.
 *
 * Usage: npm run test:api
 */
import { createServer } from "vite";

const KEY = "re_test_key";
const TO = "owner@example.com";
const VISITOR = "Ada.Lovelace@Example.com";

let failed = false;

function section(title) {
  console.log(`\n${title}`);
}

function check(label, condition, extra = "") {
  if (!condition) failed = true;
  console.log(`${condition ? "✓" : "✗ FAILED"} ${label}${extra ? ` — ${extra}` : ""}`);
}

/* --------------------------- Resend stub ---------------------------------- */

/** Bodies captured from the (stubbed) Resend API calls. */
let sentEmails = [];
/** Response returned by the stubbed Resend API — swapped per test. */
let resendReply = () =>
  new Response(JSON.stringify({ id: "stub-email-id" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

const realFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (url.startsWith("https://api.resend.com")) {
    sentEmails.push(JSON.parse(init?.body ?? "{}"));
    return resendReply();
  }
  return realFetch(input, init);
};

/* --------------------------- Server boot ---------------------------------- */

// Deterministic configuration for the handler (see .env.example for real values).
process.env.RESEND_API_KEY = KEY;
process.env.CONTACT_EMAIL = TO;
delete process.env.CONTACT_FROM_EMAIL;

const vite = await createServer({
  logLevel: "error",
  server: { port: 0, strictPort: false, host: "127.0.0.1" },
});

const { handleContactRequest } = await vite.ssrLoadModule("/api/contact.ts");
await vite.listen();

const baseUrl = vite.resolvedUrls?.local?.[0] ?? "http://127.0.0.1:5173/";
const httpEndpoint = new URL("api/contact", baseUrl).href;
const healthEndpoint = new URL("api/health", baseUrl).href;

/** Calls the handler directly, with an isolated rate-limit bucket per IP. */
function callHandler(payload, options = {}) {
  const { method = "POST", ip = "198.51.100.7", contentType = "application/json", body } = options;
  return handleContactRequest(
    new Request("http://localhost/api/contact", {
      method,
      headers: {
        "Content-Type": contentType,
        Accept: "application/json",
        "x-forwarded-for": ip,
      },
      body: method === "GET" || method === "HEAD" ? undefined : (body ?? JSON.stringify(payload)),
    }),
  );
}

const validPayload = (overrides = {}) => ({
  name: "Ada Lovelace",
  email: VISITOR,
  subject: "Internship opportunity",
  message: "Hello! I would love to discuss an internship with your team.",
  _gotcha: "",
  ...overrides,
});

/** Fresh rate-limit bucket per request, so the limiter never trips unintentionally. */
let ipSeed = 0;
const uniqueIp = () => `198.51.100.${(ipSeed += 1) % 250}`;

/* --------------------------- Happy path ----------------------------------- */

section("Happy path");
sentEmails = [];
{
  const response = await callHandler(validPayload(), { ip: "198.51.100.10" });
  const body = await response.json();
  check(
    "valid submission → 200 { ok: true }",
    response.status === 200 && body.ok === true,
    `status ${response.status}`,
  );
  check("exactly one email handed to Resend", sentEmails.length === 1);

  const email = sentEmails[0] ?? {};
  check(
    "destination = CONTACT_EMAIL",
    Array.isArray(email.to) && email.to[0] === TO,
    JSON.stringify(email.to),
  );
  check(
    "Reply-To = visitor email (lower-cased)",
    email.reply_to === VISITOR.toLowerCase(),
    String(email.reply_to),
  );
  check(
    "subject tags the portfolio + visitor subject",
    typeof email.subject === "string" &&
      email.subject.startsWith("[Portfolio] Internship opportunity"),
    email.subject,
  );
  check(
    "default sender is Resend's test sender",
    String(email.from).includes("onboarding@resend.dev"),
  );
  const html = String(email.html);
  check(
    "HTML email carries name, email, subject, message",
    html.includes("Ada Lovelace") &&
      html.includes(VISITOR.toLowerCase()) &&
      html.includes("Internship opportunity") &&
      html.includes("Hello! I would love"),
  );
  check(
    "HTML email carries the submission date/time",
    /Received<\/td>/.test(html) && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(html),
  );
  check("plain-text alternative generated", /Name: Ada Lovelace/.test(String(email.text)));
}

/* --------------------------- Sanitisation --------------------------------- */

section("Sanitisation");
sentEmails = [];
{
  const response = await callHandler(
    validPayload({
      name: 'Eve <script>alert("x")</script>',
      message: 'Payload <img src=x onerror=alert(1)> and a "quote" & an apostrophe',
      subject: "Bold <b>subject</b>\r\nInjected-Header: 1",
    }),
    { ip: "198.51.100.11" },
  );
  const email = sentEmails[0] ?? {};
  const html = String(email.html);
  check("still accepted", response.status === 200);
  check("raw <script> never reaches the email", !html.includes("<script>"));
  check("HTML is escaped", html.includes("&lt;script&gt;") && html.includes("&lt;img"));
  check(
    "CRLF stripped from the subject (single line → no header injection)",
    !/[\r\n]/.test(String(email.subject)) && String(email.subject).includes("Injected-Header: 1"),
    String(email.subject),
  );
}

/* --------------------------- Validation ----------------------------------- */

section("Validation (400)");
{
  const cases = [
    ["invalid email", { email: "not-an-email" }, "email"],
    ["empty name", { name: "" }, "name"],
    ["too short subject", { subject: "hi" }, "subject"],
    ["too short message", { message: "short" }, "message"],
    ["message over 5000 characters", { message: "x".repeat(5001) }, "message"],
  ];

  for (const [label, override, field] of cases) {
    const response = await callHandler(validPayload(override), { ip: uniqueIp() });
    const body = await response.json();
    check(
      `${label} → 400 with an error on "${field}"`,
      response.status === 400 &&
        body.error === "validation_failed" &&
        Boolean(body.errors?.[field]),
      `status ${response.status}`,
    );
  }

  const empty = await callHandler({}, { ip: uniqueIp() });
  const emptyBody = await empty.json();
  check(
    "empty payload → 400 listing all four fields",
    ["name", "email", "subject", "message"].every((field) => Boolean(emptyBody.errors?.[field])),
  );

  const array = await callHandler([], { ip: uniqueIp() });
  check("array body → 400", array.status === 400);
}

/* --------------------------- Spam & protocol ------------------------------ */

section("Spam protection & protocol");
sentEmails = [];
{
  const bot = await callHandler(validPayload({ _gotcha: "http://spam.example" }), {
    ip: "198.51.100.30",
  });
  const botBody = await bot.json();
  check("filled honeypot → fake 200", bot.status === 200 && botBody.ok === true);
  check("filled honeypot → nothing sent to Resend", sentEmails.length === 0);

  const wrongMethod = await callHandler(null, { method: "GET", ip: "198.51.100.31" });
  check(
    "GET → 405 with `Allow: POST`",
    wrongMethod.status === 405 && wrongMethod.headers.get("allow") === "POST",
    `status ${wrongMethod.status}`,
  );

  const wrongType = await callHandler(null, {
    ip: "198.51.100.32",
    contentType: "text/plain",
    body: "name=x",
  });
  check("non-JSON content type → 415", wrongType.status === 415, `status ${wrongType.status}`);

  const badJson = await callHandler(null, { ip: "198.51.100.33", body: "{ not json" });
  const badJsonBody = await badJson.json();
  check(
    "malformed JSON → 400 invalid_json",
    badJson.status === 400 && badJsonBody.error === "invalid_json",
  );

  const huge = await callHandler(null, {
    ip: "198.51.100.34",
    body: JSON.stringify(validPayload({ message: "x".repeat(40 * 1024) })),
  });
  check("body above 32 KB → 413", huge.status === 413, `status ${huge.status}`);

  const statuses = [];
  for (let index = 0; index < 6; index += 1) {
    const response = await callHandler(validPayload(), { ip: "203.0.113.50" });
    statuses.push(response.status);
  }
  check(
    "6 submissions in a row from one IP → the 6th is 429",
    statuses.slice(0, 5).every((status) => status === 200) && statuses[5] === 429,
    statuses.join(","),
  );

  const limitedResponse = await callHandler(validPayload(), { ip: "203.0.113.50" });
  check(
    "429 carries a Retry-After header",
    limitedResponse.status === 429 && Number(limitedResponse.headers.get("retry-after")) > 0,
    `Retry-After ${limitedResponse.headers.get("retry-after")}`,
  );
}

/* --------------------------- Failures ------------------------------------- */

section("Failure handling");
{
  // The handler reads the configuration at call time, so a missing key is testable.
  delete process.env.RESEND_API_KEY;
  const misconfigured = await callHandler(validPayload(), { ip: "198.51.100.40" });
  const misconfiguredBody = await misconfigured.json();
  process.env.RESEND_API_KEY = KEY;
  check(
    "missing RESEND_API_KEY → 500 server_misconfigured",
    misconfigured.status === 500 && misconfiguredBody.error === "server_misconfigured",
    `status ${misconfigured.status}`,
  );
  check(
    "no secret / env name leaked in the response",
    !JSON.stringify(misconfiguredBody).includes("RESEND"),
  );

  resendReply = () => new Response('{"message":"invalid api key"}', { status: 401 });
  const rejected = await callHandler(validPayload(), { ip: "198.51.100.41" });
  check("Resend 401 → 502 upstream_error", rejected.status === 502, `status ${rejected.status}`);

  resendReply = () => new Response('{"message":"too many requests"}', { status: 429 });
  const throttled = await callHandler(validPayload(), { ip: "198.51.100.42" });
  check(
    "Resend 429 → 429 with Retry-After",
    throttled.status === 429 && Number(throttled.headers.get("retry-after")) > 0,
    `status ${throttled.status}`,
  );

  resendReply = () => {
    throw new TypeError("fetch failed");
  };
  const offline = await callHandler(validPayload(), { ip: "198.51.100.43" });
  check("network failure → 502 upstream_error", offline.status === 502, `status ${offline.status}`);

  resendReply = () =>
    new Response(JSON.stringify({ id: "stub-email-id" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
}

/* --------------------------- HTTP layer (dev middleware) ------------------ */

section("HTTP layer — Vite dev middleware");
{
  const response = await globalThis.fetch(httpEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validPayload({ subject: "Over HTTP" })),
  });
  const body = await response.json();
  check(
    `POST ${httpEndpoint} → 200 { ok: true }`,
    response.status === 200 && body.ok === true,
    `status ${response.status}`,
  );

  const invalid = await globalThis.fetch(httpEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validPayload({ email: "broken" })),
  });
  const invalidBody = await invalid.json();
  check(
    "HTTP validation error → 400 with field details",
    invalid.status === 400 && Boolean(invalidBody.errors?.email),
    `status ${invalid.status}`,
  );

  const wrongMethod = await globalThis.fetch(httpEndpoint);
  check("HTTP GET → 405", wrongMethod.status === 405, `status ${wrongMethod.status}`);
}

/* --------------------------- Health check ---------------------------------- */

section("Health check — GET /api/health");
{
  const configured = await globalThis.fetch(healthEndpoint);
  const configuredBody = await configured.json();
  check(
    "configured server → 200 { ok: true }",
    configured.status === 200 && configuredBody.ok === true,
    `status ${configured.status}`,
  );
  check(
    "reports 1 recipient and the test sender",
    configuredBody.config?.recipientCount === 1 && configuredBody.config?.usingTestSender === true,
  );
  check(
    "never leaks the API key or the env values",
    !JSON.stringify(configuredBody).includes(KEY) && !JSON.stringify(configuredBody).includes(TO),
  );

  // Mirror the production `api/health.ts`: 503 + the list of missing variables.
  delete process.env.RESEND_API_KEY;
  const broken = await globalThis.fetch(healthEndpoint);
  const brokenBody = await broken.json();
  process.env.RESEND_API_KEY = KEY;
  check(
    "missing RESEND_API_KEY → 503 naming the variable",
    broken.status === 503 &&
      brokenBody.ok === false &&
      brokenBody.config?.missing?.includes("RESEND_API_KEY"),
    `status ${broken.status}`,
  );
}

/* --------------------------- Teardown ------------------------------------- */

globalThis.fetch = realFetch;
await vite.close();

console.log(failed ? "\nCONTACT API TEST: FAILED" : "\nCONTACT API TEST: PASSED");
process.exitCode = failed ? 1 : 0;
