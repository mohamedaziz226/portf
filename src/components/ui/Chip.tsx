import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ChipProps = {
  children: ReactNode;
  className?: string;
  /** Emphasis color of the chip. */
  tone?: "default" | "ai" | "web" | "iot" | "mixed";
};

const TONES: Record<NonNullable<ChipProps["tone"]>, string> = {
  default: "hover:border-white/25 hover:bg-white/[0.07] hover:text-white",
  ai: "border-violet-400/25 bg-violet-400/[0.08] text-violet-200 hover:border-violet-400/50 hover:bg-violet-400/[0.14]",
  web: "border-sky-400/25 bg-sky-400/[0.08] text-sky-200 hover:border-sky-400/50 hover:bg-sky-400/[0.14]",
  iot: "border-cyan-400/25 bg-cyan-400/[0.08] text-cyan-200 hover:border-cyan-400/50 hover:bg-cyan-400/[0.14]",
  mixed:
    "border-indigo-400/25 bg-indigo-400/[0.08] text-indigo-200 hover:border-indigo-400/50 hover:bg-indigo-400/[0.14]",
};

/** Small pill used for technologies, features and tags. */
export function Chip({ children, className, tone = "default" }: ChipProps) {
  return <span className={cn("chip", TONES[tone], className)}>{children}</span>;
}

type StatBadgeProps = {
  value: string;
  label: string;
  hint?: string;
  className?: string;
};

/** Qualitative highlight card (no invented percentage). */
export function StatCard({ value, label, hint, className }: StatBadgeProps) {
  return (
    <div
      className={cn(
        "glass-card glass-card-hover group h-full p-5",
        className,
      )}
    >
      <p className="gradient-text text-xl font-bold tracking-tight sm:text-2xl">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-100">{label}</p>
      {hint && <p className="mt-1 text-xs leading-relaxed text-slate-400">{hint}</p>}
    </div>
  );
}
