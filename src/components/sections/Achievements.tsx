import { Award, BadgeCheck, Check, Copy, ExternalLink, FileText, Plus, Trophy, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ActionLink, Reveal, Section, Tilt } from "@/components/ui";
import { achievements, achievementKinds } from "@/data";
import { useCopyToClipboard } from "@/hooks";
import { linkProps } from "@/lib/links";
import type { AchievementKind } from "@/types";

const KIND_ICONS: Record<AchievementKind, LucideIcon> = {
  certification: BadgeCheck,
  hackathon: Users,
  competition: Trophy,
  achievement: Award,
};

/** Credential number with a one-click copy micro-interaction. */
function CredentialId({ value }: { value: string }) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <button
      type="button"
      onClick={() => void copy(value)}
      title={copied ? "Copied!" : `Copy credential ID — ${value}`}
      className="inline-flex max-w-full items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 transition duration-300 ease-smooth hover:border-sky-400/35 hover:bg-white/[0.06]"
    >
      <span className="truncate font-mono text-[0.68rem] text-slate-400">{value}</span>
      {copied ? (
        <Check className="h-3.5 w-3.5 shrink-0 text-emerald-300" aria-hidden="true" />
      ) : (
        <Copy className="h-3.5 w-3.5 shrink-0 text-slate-500" aria-hidden="true" />
      )}
      <span className="sr-only">{copied ? "Credential ID copied" : "Copy credential ID"}</span>
    </button>
  );
}

export function Achievements() {
  const hasContent = achievements.length > 0;

  return (
    <Section
      id="achievements"
      eyebrow="Beyond the classroom"
      title="Certifications & Achievements"
      className="below-fold"
      description={
        hasContent
          ? "Real, verifiable certifications, competitions and awards — each one with its official badge, credential number or verification link."
          : "A ready-to-fill structure for certifications, hackathons, competitions and awards. Only real, verifiable items are published here."
      }
    >
      {hasContent ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item, index) => {
            const Icon = KIND_ICONS[item.kind];
            const credential = linkProps(item.link, "/achievements.ts (link)");
            return (
              <Reveal key={item.id} delay={index * 0.05} variant="scale" className="h-full group">
                <Tilt max={3.5} className="h-full">
                <article className="glass-card glass-card-hover card-shine flex h-full flex-col p-5">
                  {item.image && (
                    <div className="img-zoom mb-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-2">
                      <img
                        src={item.image}
                        alt={`${item.title} — ${item.issuer} certificate`}
                        loading="lazy"
                        decoding="async"
                        className="h-40 w-full object-contain"
                      />
                    </div>
                  )}

                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-sky-300 transition duration-300 group-hover:rotate-6 group-hover:scale-105">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-slate-100">{item.title}</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    {item.issuer} · {item.year}
                  </p>
                  {item.meta && <p className="mt-1 text-[0.7rem] text-slate-500">{item.meta}</p>}
                  {item.description && (
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">
                      {item.description}
                    </p>
                  )}

                  {(item.credentialId || item.link) && (
                    <div className="mt-auto flex flex-col items-start gap-3 pt-5">
                      {item.credentialId && <CredentialId value={item.credentialId} />}
                      {item.link && (
                        <ActionLink
                          href={credential.href}
                          disabled={credential.disabled}
                          title={credential.title}
                          variant="outline"
                          size="sm"
                          icon={ExternalLink}
                        >
                          View credential
                        </ActionLink>
                      )}
                    </div>
                  )}
                </article>
                </Tilt>
              </Reveal>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {achievementKinds.map((kind, index) => {
            const Icon = KIND_ICONS[kind.id];
            return (
              <Reveal key={kind.id} delay={index * 0.06} className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-dashed border-white/[0.14] bg-white/[0.02] p-5 transition duration-300 ease-smooth hover:border-sky-400/35 hover:bg-white/[0.04]">
                  <header className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-400">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-sm font-semibold text-slate-200">{kind.label}</h3>
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-amber-400/25 bg-amber-400/[0.07] px-2.5 py-1 text-[0.68rem] font-medium text-amber-200">
                      <Plus className="h-3 w-3" aria-hidden="true" />
                      To fill in
                    </span>
                  </header>
                  <p className="mt-3 text-xs leading-relaxed text-slate-500">{kind.description}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      )}

      {!hasContent && (
        <Reveal delay={0.15} className="mt-6">
          <div className="glass-card flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-sky-300">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-100">Add your first entry</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                  Open <span className="font-mono text-slate-300">src/data/achievements.ts</span> and
                  copy the template — the cards are rendered automatically.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.7rem] font-medium text-slate-400">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {achievements.length} item{achievements.length === 1 ? "" : "s"} published
            </span>
          </div>
        </Reveal>
      )}
    </Section>
  );
}
