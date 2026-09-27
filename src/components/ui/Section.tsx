import type { ReactNode } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Wrapper class for the heading block (alignment, max width...). */
  headingClassName?: string;
};

/** Consistent section shell: anchor id, vertical rhythm and container width. */
export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  headingClassName,
}: SectionProps) {
  return (
    <section id={id} className={cn("relative scroll-mt-24 py-20 sm:py-24", className)}>
      <div className="container-shell">
        {(eyebrow || title) && (
          <Reveal variant="up" y={18} className={cn("mb-10 max-w-3xl sm:mb-14", headingClassName)}>
            {eyebrow && (
              <p className="eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" aria-hidden="true" />
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="group/title mt-4 w-fit text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.6rem]">
                {title}
                <span
                  className="mt-3 block h-[3px] w-16 rounded-full bg-brand-gradient transition-[width] duration-500 ease-smooth group-hover/title:w-28"
                  aria-hidden="true"
                />
              </h2>
            )}
            {description && (
              <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
                {description}
              </p>
            )}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
