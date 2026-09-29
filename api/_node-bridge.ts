/**
 * Node/Web bridge shared by the serverless entry points.
 *
 * Vercel's Node runtime invokes a function with Node's `(req, res)` pair, while
 * this project is written against the Web `Request` → `Response` signature (also
 * used by the Vite dev middleware). Passing a Node request straight into a Web
 * handler crashes the invocation (`FUNCTION_INVOCATION_FAILED`), so the entry
 * points detect the calling convention and adapt through these helpers.
 *
 * The leading underscore keeps Vercel from exposing this file as a route.
 */

/** Structural types: avoids importing `node:http` types into the Web code path. */
export type NodeLikeRequest = {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
  on(event: string, listener: (chunk?: unknown) => void): unknown;
};

export type NodeLikeResponse = {
  statusCode: number;
  headersSent?: boolean;
  setHeader(name: string, value: string): unknown;
  end(chunk?: Uint8Array | string): unknown;
};

/** True when the runtime handed us a Web `Request` rather than a Node request. */
export function isWebRequest(value: unknown): value is Request {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Request;
  return (
    typeof candidate.method === "string" &&
    typeof candidate.text === "function" &&
    typeof candidate.headers?.get === "function"
  );
}

/** Thrown when the incoming body exceeds the caller's `maxBytes` budget. */
export class BodyTooLargeError extends Error {
  constructor() {
    super("payload_too_large");
    this.name = "BodyTooLargeError";
  }
}

/** Reads a Node request body as UTF-8, or `null` when it exceeds `maxBytes`. */
function readNodeBody(request: NodeLikeRequest, maxBytes: number): Promise<string | null> {
  const chunks: Buffer[] = [];
  let size = 0;

  return new Promise<string | null>((resolve, reject) => {
    request.on("data", (chunk?: unknown) => {
      if (chunk === undefined || chunk === null) return;
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk));
      size += buffer.length;
      // Over budget: settle with null and let the caller answer 413.
      if (size > maxBytes) resolve(null);
      else chunks.push(buffer);
    });
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    request.on("error", reject);
  });
}

/** Converts a Node request into the Web `Request` the handlers expect. */
export async function toWebRequest(
  request: NodeLikeRequest,
  options: { maxBytes: number; host: string },
): Promise<Request> {
  const method = (request.method ?? "GET").toUpperCase();
  const hasBody = method !== "GET" && method !== "HEAD";

  const headers = new Headers();
  for (const [key, value] of Object.entries(request.headers)) {
    if (typeof value === "string") headers.set(key, value);
    else if (Array.isArray(value)) headers.set(key, value.join(", "));
  }
  // Preserve the client IP so the rate limiter behaves as it does in production.
  if (!headers.has("x-forwarded-for")) {
    headers.set("x-forwarded-for", request.socket?.remoteAddress ?? "unknown");
  }

  let body: string | undefined;
  if (hasBody) {
    const raw = await readNodeBody(request, options.maxBytes);
    if (raw === null) throw new BodyTooLargeError();
    body = raw;
  }

  return new Request(new URL(request.url ?? "/", options.host), {
    method,
    headers,
    body: hasBody ? body : undefined,
  });
}

/** Writes a Web `Response` back to the Node response object. */
export async function sendWebResponse(
  response: Response,
  nodeResponse: NodeLikeResponse,
): Promise<void> {
  nodeResponse.statusCode = response.status;
  response.headers.forEach((value, key) => nodeResponse.setHeader(key, value));
  nodeResponse.end(Buffer.from(await response.arrayBuffer()));
}