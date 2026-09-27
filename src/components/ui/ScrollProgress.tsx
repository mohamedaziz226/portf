import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

import { cn } from "@/lib/utils";

/** Thin gradient progress bar pinned to the top of the viewport. */
export function ScrollProgress({ className }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className={cn(
        "fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-brand-gradient",
        className,
      )}
    />
  );
}
