import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";

/** Floating "back to top" button that appears after scrolling. */
export function BackToTop({ threshold = 640 }: { threshold?: number }) {
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Same rAF-throttle as useScrolled: avoids a setState per scroll event.
    let frame = 0;
    const sync = () => {
      frame = 0;
      setVisible(window.scrollY > threshold);
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(sync);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  const goTop = () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={goTop}
          aria-label="Back to top"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-6 z-50 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-base-900/90 text-slate-200 shadow-glow backdrop-blur-xl transition hover:border-sky-400/50 hover:text-white"
        >
          <ArrowUp className="h-5 w-5" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
