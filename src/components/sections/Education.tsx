import { CalendarDays, GraduationCap, MapPin } from "lucide-react";

import { Reveal, Section, Timeline, TimelineItem } from "@/components/ui";
import { education } from "@/data";

export function Education() {
  return (
    <Section
      id="education"
      eyebrow="Academic background"
      title="Education"
      description="Telecommunications engineering studies with a strong focus on signal processing, networks and software engineering."
      className="below-fold"
    >
      <Timeline>
        {education.map((item, index) => (
          <TimelineItem key={item.id} highlighted={item.ongoing}>
            <Reveal delay={index * 0.04}>
              <article className="glass-card glass-card-hover p-5 sm:p-6">
                <header className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-indigo-300">
                      <GraduationCap className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold leading-snug text-slate-100 sm:text-base">
                        {item.school}
                      </h3>
                      <p className="mt-1 text-sm text-sky-300/90">{item.degree}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.7rem] font-medium text-slate-300">
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                      {item.period}
                    </span>
                    {item.ongoing && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/25 bg-sky-400/[0.08] px-2.5 py-1 text-[0.7rem] font-medium text-sky-200">
                        Current
                      </span>
                    )}
                  </div>
                </header>

                {(item.description || item.location) && (
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                    {item.description && <span>{item.description}</span>}
                    {item.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                        {item.location}
                      </span>
                    )}
                  </div>
                )}
              </article>
            </Reveal>
          </TimelineItem>
        ))}
      </Timeline>
    </Section>
  );
}
