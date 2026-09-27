import type { MouseEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

import { cn } from "@/lib/utils";

type TiltProps = {
  children: ReactNode;
  className?: string;
  /** Maximum tilt in degrees on each axis. */
  max?: number;
  /** Scale applied while hovered. */
  scale?: number;
  /** Force-disable the effect. */
  disabled?: boolean;
};

/**
 * Subtle 3D tilt on hover for cards.
 * - only enabled on fine pointers (mouse / trackpad),
 * - plain static markup on touch devices, reduced motion and SSR.
 */
export function Tilt({ children, className, max = 5, scale = 1.015, disabled }: TiltProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 180, damping: 18 });
  const springY = useSpring(rotateY, { stiffness: 180, damping: 18 });

  useEffect(() => {
    if (disabled || prefersReducedMotion) {
      setEnabled(false);
      return;
    }
    setEnabled(window.matchMedia("(pointer: fine)").matches);
  }, [disabled, prefersReducedMotion]);

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-py * max * 2);
    rotateY.set(px * max * 2);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      style={enabled ? { rotateX: springX, rotateY: springY, transformPerspective: 900 } : undefined}
      whileHover={enabled ? { scale } : undefined}
      onMouseMove={enabled ? handleMove : undefined}
      onMouseLeave={enabled ? handleLeave : undefined}
    >
      {children}
    </motion.div>
  );
}
