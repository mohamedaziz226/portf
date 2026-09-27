import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

type TypewriterOptions = {
  /** ms per typed character. */
  typeSpeed?: number;
  /** ms per deleted character. */
  deleteSpeed?: number;
  /** ms the full word stays visible. */
  holdDuration?: number;
  /** ms pause before typing the next word. */
  gap?: number;
};

/**
 * Loops through `words` with a classic type / hold / delete animation.
 * When the user prefers reduced motion, the first word is rendered statically.
 */
export function useTypewriter(words: readonly string[], options: TypewriterOptions = {}) {
  const { typeSpeed = 62, deleteSpeed = 28, holdDuration = 1600, gap = 240 } = options;
  const prefersReducedMotion = useReducedMotion();

  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");

  useEffect(() => {
    if (prefersReducedMotion) return;

    const current = words[wordIndex % words.length] ?? "";
    let timer: number | undefined;

    if (phase === "typing") {
      timer =
        text.length < current.length
          ? window.setTimeout(() => setText(current.slice(0, text.length + 1)), typeSpeed)
          : window.setTimeout(() => setPhase("holding"), holdDuration);
    } else if (phase === "holding") {
      timer = window.setTimeout(() => setPhase("deleting"), 0);
    } else if (text.length > 0) {
      timer = window.setTimeout(() => setText(current.slice(0, text.length - 1)), deleteSpeed);
    } else {
      timer = window.setTimeout(() => {
        setWordIndex((index) => (index + 1) % words.length);
        setPhase("typing");
      }, gap);
    }

    return () => window.clearTimeout(timer);
  }, [text, phase, wordIndex, words, typeSpeed, deleteSpeed, holdDuration, gap, prefersReducedMotion]);

  // Reduced motion: no loop, no blinking caret.
  if (prefersReducedMotion) {
    return { text: words[0] ?? "", animateCaret: false };
  }

  return { text, animateCaret: true };
}
