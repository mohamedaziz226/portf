import { useState } from "react";
import { CheckCircle2, ExternalLink, Globe, MapPin } from "lucide-react";

import { ActionButton, ActionLink, Chip, Reveal, Section, Timeline, TimelineItem, VideoModal } from "@/components/ui";
import { experiences } from "@/data";
import { linkProps } from "@/lib/links";

export function Experience() {
  const [activeVideoModal, setActiveVideoModal] = useState<{
    src: string;
    title: string;
    subtitle?: string;
  } | null>(null);

  return (
    <Section
      id="experience"
      eyebrow="What I have done so far"
      title="Experience"
      description="Internships, engineering projects and IoT solutions — with the technologies and the responsibilities behind each one."
      className="below-fold"
    >
      <Timeline>
        {experiences.map((item, index) => {
          const link = item.link ? linkProps(item.link.href, "/experience.ts") : undefined;
          const bullets = item.responsibilities ?? item.features ?? [];

          return (
            <TimelineItem key={item.id} highlighted={item.ongoing}>
              <Reveal delay={index * 0.03}>
                <article className="glass-card glass-card-hover group p-5 sm:p-6">
                  <header className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-slate-100 sm:text-lg">
                        {item.role}
                      </h3>
                      <p className="mt-0.5 text-sm font-medium text-sky-300/90">{item.company}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.7rem] font-medium text-slate-300">
                        {item.period}
                      </span>
                      {item.ongoing && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/[0.08] px-2.5 py-1 text-[0.7rem] font-medium text-emerald-200">
                          <span
                            className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                            aria-hidden="true"
                          />
                          Ongoing
                        </span>
                      )}
                    </div>
                  </header>

                  <p className="mt-4 text-sm font-medium leading-relaxed text-slate-200">
                    {item.summary}
                  </p>
                  {item.description && item.description !== item.summary && (
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {item.description}
                    </p>
                  )}
                  {item.location && (
                    <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                      {item.location}
                    </p>
                  )}

                  {bullets.length > 0 && (
                    <div className="mt-5">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                        {item.responsibilities ? "Responsibilities" : "Features"}
                      </p>
                      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                        {bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex items-start gap-2 text-sm text-slate-400"
                          >
                            <CheckCircle2
                              className="mt-0.5 h-4 w-4 shrink-0 text-sky-400/80"
                              aria-hidden="true"
                            />
                            <span className="leading-relaxed">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {item.tech.map((technology) => (
                      <li key={technology}>
                        <Chip>{technology}</Chip>
                      </li>
                    ))}
                  </ul>

                  {(item.video || (item.link && link)) && (
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      {item.video && (
                        <ActionButton
                          onClick={() =>
                            setActiveVideoModal({
                              src: item.video!,
                              title: `${item.role} — ${item.company}`,
                              subtitle: item.summary,
                            })
                          }
                          variant="amber"
                          size="sm"
                          icon={Globe}
                          aria-label={`Open interactive live demo viewer for ${item.role}`}
                        >
                          LIVE DEMO
                        </ActionButton>
                      )}

                      {item.link && link && (
                        <ActionLink
                          href={link.href}
                          disabled={link.disabled}
                          title={link.title}
                          variant="outline"
                          size="sm"
                          icon={ExternalLink}
                        >
                          {item.link.label}
                        </ActionLink>
                      )}
                    </div>
                  )}
                </article>
              </Reveal>
            </TimelineItem>
          );
        })}
      </Timeline>

      {activeVideoModal && (
        <VideoModal
          isOpen={Boolean(activeVideoModal)}
          onClose={() => setActiveVideoModal(null)}
          videoSrc={activeVideoModal.src}
          title={activeVideoModal.title}
          subtitle={activeVideoModal.subtitle}
        />
      )}
    </Section>
  );
}
