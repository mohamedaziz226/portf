import type { ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

import { cn } from "@/lib/utils";

type TimelineProps = {
  children: ReactNode;
  /** Shows a gradient progress line that fills while scrolling. */
  animated?: boolean;
  className?: string;
};

/**
 * Vertical timeline with a left rail.
 * The rail is a real element, so it stays crisp on every breakpoint.
 */
export function Timeline({ children, animated = true, className }: TimelineProps) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    offset: ["start 85%", "end 65%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });

  return (
    <div className={cn("relative", className)}>
      <span
        className="pointer-events-none absolute bottom-1 left-[7px] top-1 w-[2px] rounded-full bg-white/[0.08]"
        aria-hidden="true"
      />
      {animated && !prefersReducedMotion && (
        <motion.span
          style={{ scaleY }}
          className="pointer-events-none absolute bottom-1 left-[7px] top-1 w-[2px] origin-top rounded-full bg-gradient-to-b from-sky-400 via-indigo-400 to-violet-400"
          aria-hidden="true"
        />
      )}
      <ol className="relative space-y-0">{children}</ol>
    </div>
  );
}

type TimelineItemProps = {
  children: ReactNode;
  /** Renders a pulsing dot (ongoing experience / current studies). */
  highlighted?: boolean;
  className?: string;
};

export function TimelineItem({ children, highlighted, className }: TimelineItemProps) {
  return (
    <li className={cn("relative flex gap-4 sm:gap-6", className)}>
      <span className="relative z-10 mt-2 flex h-4 w-4 shrink-0 items-center justify-center">
        <span
          className={cn(
            "h-2.5 w-2.5 rounded-full ring-4 ring-base-950",
            highlighted
              ? "bg-gradient-to-br from-sky-400 to-cyan-300"
              : "bg-gradient-to-br from-slate-400 to-slate-500",
          )}
          aria-hidden="true"
        />
        {highlighted && (
          <span
            className="absolute h-2.5 w-2.5 rounded-full bg-sky-400/60 animate-pulse-ring"
            aria-hidden="true"
          />
        )}
      </span>
      <div className="min-w-0 flex-1 pb-9 sm:pb-11">{children}</div>
    </li>
  );
}
