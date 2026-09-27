import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

export type RevealVariant = "up" | "fade" | "scale" | "blur" | "left" | "right" | "none";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds before the animation starts. */
  delay?: number;
  /** Vertical offset (px) of the slide-up (variants "up" / "blur"). */
  y?: number;
  /** Animation duration in seconds. */
  duration?: number;
  /** Horizontal slide (px) for variants "left" / "right" (positive = from the right). */
  x?: number;
  /** Entrance style. Defaults to "up" (previous behaviour). */
  variant?: RevealVariant;
  /** How much of the element must be visible before animating (0–1). */
  amount?: number;
  /** Replay the animation every time it enters the viewport. */
  once?: boolean;
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function hiddenState(variant: RevealVariant, y: number, x: number) {
  switch (variant) {
    case "fade":
      return { opacity: 0 };
    case "scale":
      return { opacity: 0, scale: 0.94, y: Math.min(y, 12) };
    case "blur":
      return { opacity: 0, y, filter: "blur(6px)" };
    case "left":
      return { opacity: 0, x: x !== 0 ? x : -28 };
    case "right":
      return { opacity: 0, x: x !== 0 ? x : 28 };
    case "none":
      return { opacity: 0 };
    case "up":
    default:
      return { opacity: 0, y, x };
  }
}

/**
 * Scroll-triggered entrance wrapper.
 * Renders plain markup when the user prefers reduced motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  x = 0,
  duration = 0.55,
  variant = "up",
  amount = 0.2,
  once = true,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: "-60px 0px -60px 0px" }}
      variants={{
        hidden: hiddenState(variant, y, x),
        visible: { opacity: 1, y: 0, x: 0, scale: 1, filter: "blur(0px)" },
      }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

