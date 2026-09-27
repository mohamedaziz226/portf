import type { LucideIcon } from "lucide-react";
import { Bot, Brain, GraduationCap, RadioTower, ShoppingCart, Signal, Stethoscope } from "lucide-react";

import type { Accent, Project, ProjectCategory, ProjectIcon } from "@/types";
import { cn } from "@/lib/utils";

const ACCENTS: Record<Accent, { gradient: string; glow: string; bar: string }> = {
  sky: {
    gradient: "from-sky-500/[0.22] via-sky-400/[0.06] to-transparent",
    glow: "bg-sky-400/20",
    bar: "from-sky-400/80 to-sky-200",
  },
  violet: {
    gradient: "from-violet-500/[0.22] via-violet-400/[0.06] to-transparent",
    glow: "bg-violet-400/20",
    bar: "from-violet-400/80 to-violet-200",
  },
  cyan: {
    gradient: "from-cyan-500/[0.22] via-cyan-400/[0.06] to-transparent",
    glow: "bg-cyan-400/20",
    bar: "from-cyan-400/80 to-cyan-200",
  },
  indigo: {
    gradient: "from-indigo-500/[0.22] via-indigo-400/[0.06] to-transparent",
    glow: "bg-indigo-400/20",
    bar: "from-indigo-400/80 to-indigo-200",
  },
  emerald: {
    gradient: "from-emerald-500/[0.22] via-emerald-400/[0.06] to-transparent",
    glow: "bg-emerald-400/20",
    bar: "from-emerald-400/80 to-emerald-200",
  },
};

const ICONS: Record<ProjectIcon, LucideIcon> = {
  brain: Brain,
  bot: Bot,
  graduationCap: GraduationCap,
  stethoscope: Stethoscope,
  radioTower: RadioTower,
  signal: Signal,
  shoppingCart: ShoppingCart,
};

const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  ai: "AI / ML",
  web: "Web",
  iot: "IoT",
};

/** Decorative signal bars — an abstract visualisation, not real data. */
const BARS = [38, 62, 48, 76, 58, 88, 70, 96, 66, 82, 54, 74];

type ProjectVisualProps = {
  project: Project;
  className?: string;
};

/**
 * Generated illustration for a project card.
 * No fake screenshot: a gradient + icon + abstract signal bars are used instead,
 * so the portfolio never displays an image that does not exist.
 */
export function ProjectVisual({ project, className }: ProjectVisualProps) {
  const accent = ACCENTS[project.accent];
  const Icon = ICONS[project.icon ?? "brain"];
  const label = CATEGORY_LABELS[project.categories[0]];

  return (
    <div
      className={cn(
        "relative h-36 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br sm:h-40",
        accent.gradient,
        className,
      )}
    >
      <div className="absolute inset-0 surface-grid opacity-[0.15]" aria-hidden="true" />
      <div
        className={cn("absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl", accent.glow)}
        aria-hidden="true"
      />
      <Icon className="absolute -bottom-2 right-2 h-20 w-20 text-white/[0.07]" aria-hidden="true" />

      <div className="relative flex h-full flex-col justify-between p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-base-950/60 px-2.5 py-1 text-[0.68rem] font-medium text-slate-200 backdrop-blur">
            {label}
          </span>
          {project.featured && (
            <span className="inline-flex items-center rounded-full border border-sky-400/30 bg-sky-400/10 px-2.5 py-1 text-[0.68rem] font-medium text-sky-200 backdrop-blur">
              Featured
            </span>
          )}
        </div>

        <div className="flex h-12 items-end gap-1.5 sm:h-14" aria-hidden="true">
          {BARS.map((height, index) => (
            <span
              key={`${project.id}-bar-${index}`}
              className={cn(
                "w-full origin-bottom rounded-t-[3px] bg-gradient-to-t opacity-70 transition duration-500 ease-smooth group-hover:scale-y-110 group-hover:opacity-100",
                accent.bar,
              )}
              style={{ height: `${height}%`, transitionDelay: `${index * 22}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
