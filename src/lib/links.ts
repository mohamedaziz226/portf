/**
 * Placeholder-aware link helpers.
 *
 * Content that is not known yet is stored as a clearly identified placeholder,
 * e.g. "[GITHUB_URL]". Instead of rendering a broken link, every button built
 * with `linkProps()` becomes a disabled element with an explanatory tooltip.
 * Replace the placeholder in `src/data/*` and the link becomes active.
 */

const PLACEHOLDER_PATTERN = /^\[[A-Z0-9_]+\]$/;

export function isPlaceholder(value?: string | null): boolean {
  if (!value) return true;
  return PLACEHOLDER_PATTERN.test(value.trim());
}

export function isExternalUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

export type ResolvedLink = {
  /** True when the content still holds a placeholder (or is empty). */
  disabled: boolean;
  href?: string;
  title?: string;
  /** Present only for real, external URLs (target/rel attributes). */
  external: boolean;
};

/** Normalises a raw content value into render-ready anchor props. */
export function linkProps(value?: string | null, context = ""): ResolvedLink {
  if (isPlaceholder(value)) {
    const suffix = context ? ` (${context})` : "";
    return {
      disabled: true,
      title: `Not configured yet — replace ${value ?? "the value"} in src/data${suffix}`,
      external: false,
    };
  }

  const raw = (value as string).trim();
  const href = raw.startsWith("mailto:") || raw.startsWith("tel:") || raw.startsWith("/")
    ? raw
    : isExternalUrl(raw)
      ? raw
      : `https://${raw}`;

  return { disabled: false, href, external: !raw.startsWith("/") && !raw.startsWith("mailto:"), title: undefined };
}

/** mailto: link with a prefilled subject (used by the contact form fallback). */
export function mailtoLink(email: string, subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString();
  return `mailto:${email}${query ? `?${query}` : ""}`;
}
/** tel: link built from a human-readable phone number, e.g. "+216 29 864 722". */
export function telLink(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
