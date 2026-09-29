import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Check, Copy, Github, Linkedin, Mail, Phone, Send, TriangleAlert } from "lucide-react";

import { ActionButton, IconLink, Reveal, Section } from "@/components/ui";
import { profile } from "@/data";
import { useCopyToClipboard } from "@/hooks";
import { isPlaceholder, linkProps, mailtoLink, telLink } from "@/lib/links";
import { cn } from "@/lib/utils";

type FormValues = { name: string; email: string; subject: string; message: string };
type SubmitStatus = "idle" | "sending" | "sent" | "error";

const EMPTY_FORM: FormValues = { name: "", email: "", subject: "", message: "" };

/**
 * Endpoint receiving the submission.
 * Defaults to the bundled serverless function (`api/contact.ts`: server-side
 * validation + delivery through Resend) and can be redirected to any external
 * service with `VITE_CONTACT_ENDPOINT`. No secret ever lives in the frontend.
 */
const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT?.trim() || "/api/contact";

const FIELDS: {
  name: keyof FormValues;
  label: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
  textarea?: boolean;
  /** Mirrors `FIELD_LIMITS` of `api/contact.ts` so both sides agree. */
  maxLength: number;
}[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Your name",
    autoComplete: "name",
    maxLength: 80,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "email",
    maxLength: 254,
  },
  {
    name: "subject",
    label: "Subject",
    type: "text",
    placeholder: "Internship, collaboration, question…",
    maxLength: 140,
  },
  {
    name: "message",
    label: "Message",
    type: "text",
    placeholder: "Tell me about your project or the opportunity…",
    textarea: true,
    maxLength: 5000,
  },
];

function validate(values: FormValues) {
  const errors: Partial<Record<keyof FormValues, string>> = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (values.subject.trim().length < 3) errors.subject = "Please add a short subject.";
  if (values.message.trim().length < 10)
    errors.message = "Your message should be at least 10 characters.";
  return errors;
}

const STATUS_MESSAGES: Record<Exclude<SubmitStatus, "idle">, string> = {
  sending: "Sending your message…",
  sent: "Message sent successfully. I'll get back to you soon.",
  error: "Unable to send your message. Please try again.",
};

/**
 * Visitor-facing explanation for the failure codes returned by `api/contact.ts`.
 * Keeps the message actionable (retry later / email instead) instead of a dead end.
 */
const FAILURE_HINTS: Record<string, string> = {
  rate_limited: "Too many messages sent from this device. Please try again later.",
  server_misconfigured: "The contact service is not configured yet. Please email me directly.",
  upstream_error: "The email service is temporarily unavailable. Please email me directly.",
  payload_too_large: "Your message is too long. Please shorten it and try again.",
  not_found: "The contact service is unavailable. Please email me directly.",
};

/**
 * Extracts the machine error code (`{ ok: false, error: "..." }`) from a failed
 * response so the visitor gets an actionable message. Tolerates a missing or
 * non-JSON body (e.g. an HTML 404 page from a misrouted rewrite) and never throws.
 */
async function readErrorCode(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (body && typeof body === "object" && "error" in body) {
      const code = (body as { error: unknown }).error;
      if (typeof code === "string") return code;
    }
  } catch {
    // No JSON body — fall through to the generic message.
  }
  return "unknown";
}

const FIELD_CLASSES =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 transition duration-300 ease-smooth focus:border-sky-400/50 focus:bg-white/[0.05] focus:outline-none";

export function Contact() {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  /** Human-readable reason of the last failure (from the API error code), if any. */
  const [failureHint, setFailureHint] = useState<string | null>(null);
  /** Spam trap: humans never see it, naive bots fill it (dropped by `api/contact.ts`). */
  const [honeypot, setHoneypot] = useState("");
  /** Ref guard so a second click during the request cannot open a second submission. */
  const inFlight = useRef(false);
  const { copied, copy } = useCopyToClipboard();

  const emailConfigured = !isPlaceholder(profile.contact.email);
  const linkedin = linkProps(profile.contact.linkedin, "/profile.ts (profile.contact.linkedin)");
  const github = linkProps(profile.contact.github, "/profile.ts (profile.contact.github)");
  const phoneConfigured = !isPlaceholder(profile.contact.phone);
  const phoneHref = phoneConfigured ? telLink(profile.contact.phone) : undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
    if (status !== "idle") setStatus("idle");
    if (failureHint) setFailureHint(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current) return; // duplicate submission → ignore

    const nextErrors = validate(values);
    setErrors(nextErrors);

    const firstInvalid = FIELDS.find((field) => nextErrors[field.name]);
    if (firstInvalid) {
      setStatus("idle");
      document.getElementById(`contact-${firstInvalid.name}`)?.focus();
      return;
    }

    inFlight.current = true;
    setStatus("sending");
    setFailureHint(null);

    /** Tracked locally: the state value is stale inside this closure. */
    let hint: string | null = null;

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          subject: values.subject.trim(),
          message: values.message.trim(),
          // Honeypot — almost always empty; the API silently drops it when filled.
          _gotcha: honeypot,
        }),
      });

      if (!response.ok) {
        // A 404 usually means the serverless function is not deployed under /api,
        // or the SPA rewrite swallowed the route — the JSON body may not even exist.
        const code = response.status === 404 ? "not_found" : await readErrorCode(response);
        hint = FAILURE_HINTS[code] ?? STATUS_MESSAGES.error;
        setFailureHint(hint);
        throw new Error(`Contact endpoint responded with ${response.status} (${code})`);
      }

      // Reset only once the message really went through.
      setValues(EMPTY_FORM);
      setHoneypot("");
      setErrors({});
      setStatus("sent");
    } catch (error) {
      // A network/CORS failure never reaches the API: fall back to the generic hint.
      if (hint === null) setFailureHint(STATUS_MESSAGES.error);
      console.error("Contact form submission failed:", error);
      setStatus("error");
    } finally {
      inFlight.current = false;
    }
  };

  const contactRows = [
    {
      id: "email",
      icon: Mail,
      label: "Email",
      value: profile.contact.email,
      href: emailConfigured
        ? mailtoLink(profile.contact.email, "Contact from your portfolio")
        : undefined,
      onCopy: emailConfigured ? () => void copy(profile.contact.email) : undefined,
    },
    {
      id: "phone",
      icon: Phone,
      label: "Phone",
      value: profile.contact.phone,
      href: phoneHref,
      onCopy: phoneConfigured ? () => void copy(profile.contact.phone) : undefined,
    },
    {
      id: "linkedin",
      icon: Linkedin,
      label: "LinkedIn",
      value: profile.contact.linkedin,
      href: linkedin.disabled ? undefined : linkedin.href,
      onCopy: undefined,
    },
    {
      id: "github",
      icon: Github,
      label: "GitHub",
      value: profile.contact.github,
      href: github.disabled ? undefined : github.href,
      onCopy: undefined,
    },
  ];

  return (
    <Section
      id="contact"
      eyebrow="Get in touch"
      title="Let's Work Together"
      description="Interested in AI, Full-Stack Development, IoT or innovative engineering projects? Let's connect."
      className="below-fold"
    >
      <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10">
        {/* --------------------------- Contact details --------------------------- */}
        <div className="space-y-4">
          {contactRows.map((row, index) => {
            const Icon = row.icon;
            const placeholder = isPlaceholder(row.value);
            const isExternal = row.href ? /^https?:/i.test(row.href) : false;

            return (
              <Reveal key={row.id} delay={index * 0.05}>
                <div className="glass-card glass-card-hover flex items-center gap-3.5 p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-sky-300">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {row.label}
                    </p>
                    {row.href ? (
                      <a
                        href={row.href}
                        {...(isExternal ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                        className="mt-0.5 block truncate font-mono text-sm text-slate-200 transition hover:text-sky-200"
                      >
                        {row.value}
                      </a>
                    ) : (
                      <p className="mt-0.5 truncate font-mono text-sm text-slate-400">
                        {row.value}
                      </p>
                    )}
                  </div>
                  {placeholder && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-400/25 bg-amber-400/[0.07] px-2.5 py-1 text-[0.65rem] font-medium text-amber-200">
                      <TriangleAlert className="h-3 w-3" aria-hidden="true" />
                      to configure
                    </span>
                  )}
                  {row.onCopy && (
                    <button
                      type="button"
                      onClick={row.onCopy}
                      aria-label={`Copy ${row.label}`}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition duration-300 ease-smooth hover:border-sky-400/40 hover:text-sky-200"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                      ) : (
                        <Copy className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  )}
                </div>
              </Reveal>
            );
          })}

          <Reveal delay={0.24}>
            <div className="flex items-center gap-2">
              <IconLink
                href={github.href}
                disabled={github.disabled}
                title={github.title}
                label="GitHub profile"
                icon={Github}
              />
              <IconLink
                href={linkedin.href}
                disabled={linkedin.disabled}
                title={linkedin.title}
                label="LinkedIn profile"
                icon={Linkedin}
              />
            </div>
          </Reveal>
        </div>

        {/* ---------------------------- Contact form ---------------------------- */}
        <Reveal delay={0.12} y={28}>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="glass-card p-5 sm:p-7"
            aria-labelledby="contact-form-title"
          >
            <h3
              id="contact-form-title"
              className="text-base font-semibold text-slate-100 sm:text-lg"
            >
              Send a message
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Fields marked with <span className="text-sky-300">*</span> are required. I usually
              answer within a couple of days.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {FIELDS.map((field) => {
                const error = errors[field.name];
                const sharedProps = {
                  id: `contact-${field.name}`,
                  name: field.name,
                  value: values[field.name],
                  onChange: handleChange,
                  placeholder: field.placeholder,
                  maxLength: field.maxLength,
                  "aria-invalid": Boolean(error),
                  "aria-describedby": error ? `contact-${field.name}-error` : undefined,
                  className: cn(
                    FIELD_CLASSES,
                    field.textarea && "sm:col-span-2 resize-y",
                    error && "border-rose-400/60 focus:border-rose-400/70",
                  ),
                };

                return (
                  <div
                    key={field.name}
                    className={cn("flex flex-col gap-2", field.textarea && "sm:col-span-2")}
                  >
                    <label
                      htmlFor={`contact-${field.name}`}
                      className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400"
                    >
                      {field.label}
                      <span className="ml-1 text-sky-300">*</span>
                    </label>

                    {field.textarea ? (
                      <textarea {...sharedProps} rows={5} />
                    ) : (
                      <input
                        {...sharedProps}
                        type={field.type}
                        autoComplete={field.autoComplete}
                        required
                      />
                    )}

                    {error && (
                      <p id={`contact-${field.name}-error`} className="text-xs text-rose-300">
                        {error}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Honeypot: 0×0 and hidden from assistive tech — bots only. */}
            <div
              aria-hidden="true"
              className="pointer-events-none h-0 w-0 overflow-hidden opacity-0"
            >
              <label htmlFor="contact-gotcha">Leave this field empty</label>
              <input
                id="contact-gotcha"
                name="_gotcha"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <ActionButton
                type="submit"
                size="lg"
                icon={Send}
                disabled={status === "sending"}
                aria-busy={status === "sending"}
                className="min-w-[12rem]"
              >
                {status === "sending" ? "Sending…" : "Send Message"}
              </ActionButton>

              <p
                role="status"
                aria-live="polite"
                className={cn(
                  "text-xs leading-relaxed",
                  status === "sent" && "text-emerald-300",
                  status === "error" && "text-rose-300",
                  (status === "idle" || status === "sending") && "text-slate-400",
                )}
              >
                {status === "idle"
                  ? "I read every message — expect an answer within a couple of days."
                  : (failureHint ?? STATUS_MESSAGES[status])}
              </p>

              {/* Never leave the visitor stuck: always offer a direct email fallback. */}
              {status === "error" && emailConfigured && (
                <a
                  href={mailtoLink(
                    profile.contact.email,
                    `Portfolio enquiry: ${values.subject || "Contact"}`,
                    `Name: ${values.name}\n\n${values.message}`,
                  )}
                  className="text-xs font-medium text-sky-300 underline underline-offset-4 transition hover:text-sky-200"
                >
                  Send it as an email instead
                </a>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
