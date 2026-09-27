/**
 * Exposes `api/contact.ts` on `/api/contact` during `npm run dev` and
 * `npm run preview`, so the contact form can be tested locally against the very
 * handler that runs in production — no second server, no extra dependency.
 *
 * Environment variables from `.env*` are copied into `process.env` for the
 * server process only (Vite still exposes just the `VITE_*` ones to the browser).
 */
import { loadEnv, type Connect, type Plugin } from "vite";

import { MAX_BODY_BYTES, handleContactRequest } from "../api/contact";

const ROUTE = "/api/contact";

/** Loads `.env*` for the current mode without clobbering real process env (CI, prod). */
function applyEnv(root: string, mode: string): void {
  for (const [key, value] of Object.entries(loadEnv(mode, root, ""))) {
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function payloadTooLarge(): Response {
  return new Response(JSON.stringify({ ok: false, error: "payload_too_large" }), {
    status: 413,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

/** Reads the Node request body, refusing anything above `MAX_BODY_BYTES`. */
async function readBody(req: Connect.IncomingMessage): Promise<string | null> {
  const chunks: Buffer[] = [];
  let size = 0;

  for await (const chunk of req) {
    const buffer = chunk as Buffer;
    size += buffer.length;
    if (size > MAX_BODY_BYTES) return null;
    chunks.push(buffer);
  }

  return Buffer.concat(chunks).toString("utf8");
}

/** Connect middleware translating Node req/res into the Web-standard handler. */
function createHandler(): Connect.NextHandleFunction {
  return async function contactApi(req, res, next) {
    try {
      const method = (req.method ?? "GET").toUpperCase();
      const hasBody = method !== "GET" && method !== "HEAD";

      let body = "";
      if (hasBody) {
        const read = await readBody(req);
        if (read === null) {
          const tooLarge = payloadTooLarge();
          res.statusCode = tooLarge.status;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(Buffer.from(await tooLarge.arrayBuffer()));
          return;
        }
        body = read;
      }

      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (typeof value === "string") headers.set(key, value);
        else if (Array.isArray(value)) headers.set(key, value.join(", "));
      }
      // Forward the client IP so the handler's rate limiter behaves like in production.
      if (!headers.has("x-forwarded-for")) {
        headers.set("x-forwarded-for", req.socket.remoteAddress ?? "unknown");
      }

      const response = await handleContactRequest(
        new Request(new URL(req.url ?? ROUTE, "http://localhost"), {
          method,
          headers,
          body: hasBody ? body : undefined,
        }),
      );

      res.statusCode = response.status;
      response.headers.forEach((value, key) => res.setHeader(key, value));
      res.end(Buffer.from(await response.arrayBuffer()));
    } catch (error) {
      console.error("[contact] dev middleware error:", error);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
      }
      res.end(JSON.stringify({ ok: false, error: "internal_error" }));
      void next;
    }
  };
}

export function contactApiPlugin(): Plugin {
  let root = process.cwd();
  let mode = "development";

  return {
    name: "portfolio:contact-api",
    apply: "serve",
    configResolved(config) {
      root = config.root;
      mode = config.mode;
    },
    configureServer(server) {
      applyEnv(root, mode);
      server.middlewares.use(ROUTE, createHandler());
    },
    configurePreviewServer(server) {
      applyEnv(root, mode);
      server.middlewares.use(ROUTE, createHandler());
    },
  };
}
