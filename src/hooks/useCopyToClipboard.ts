import { useCallback, useEffect, useState } from "react";

/** Copy helper with a transient "copied" state (micro-interaction friendly). */
export function useCopyToClipboard(resetDelay = 1800) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), resetDelay);
    return () => window.clearTimeout(timer);
  }, [copied, resetDelay]);

  const copy = useCallback(async (value: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        // Fallback for non-secure contexts.
        const field = document.createElement("textarea");
        field.value = value;
        field.setAttribute("readonly", "");
        field.style.position = "absolute";
        field.style.left = "-9999px";
        document.body.appendChild(field);
        field.select();
        document.execCommand("copy");
        document.body.removeChild(field);
      }
      setCopied(true);
      return true;
    } catch {
      setCopied(false);
      return false;
    }
  }, []);

  return { copied, copy };
}
