import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { ProjectCard } from "@/components/projects/ProjectCard";
import { Reveal, Section } from "@/components/ui";
import { projects, projectFilters } from "@/data";
import type { ProjectCategory } from "@/types";
import { cn } from "@/lib/utils";

type FilterId = "all" | ProjectCategory;

export function Projects() {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const prefersReducedMotion = useReducedMotion();

  const counts = useMemo(() => {
    const base = { all: projects.length } as Record<FilterId, number>;
    projectFilters.forEach((filter) => {
      base[filter.id] =
        filter.id === "all"
          ? projects.length
          : projects.filter((project) => project.categories.includes(filter.id as ProjectCategory))
              .length;
    });
    return base;
  }, []);

  const filtered = useMemo(
    () =>
      activeFilter === "all"
        ? projects
        : projects.filter((project) => project.categories.includes(activeFilter)),
    [activeFilter],
  );

  return (
    <Section
      id="projects"
      eyebrow="Selected work"
      title="Featured Projects"
      description="AI pipelines, intelligent web applications and IoT systems — each card details the approach, the features and, when available, a live demo video."
      className="below-fold"
    >
      <Reveal className="mb-8">
        <div
          className="flex flex-wrap items-center gap-2"
          role="tablist"
          aria-label="Filter projects by domain"
        >
          {projectFilters.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "relative inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition duration-300 ease-smooth sm:text-sm",
                  isActive
                    ? "border-sky-400/45 bg-sky-400/10 text-sky-100"
                    : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200",
                )}
              >
                {filter.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[0.65rem] font-semibold transition",
                    isActive ? "bg-sky-400/20 text-sky-100" : "bg-white/[0.06] text-slate-500",
                  )}
                >
                  {counts[filter.id] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {prefersReducedMotion ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <motion.div layout className="grid gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </Section>
  );
}
