import type { LucideIcon } from "lucide-react";
import { Bot, Brain, Cpu, Layers } from "lucide-react";

import { Reveal, Section } from "@/components/ui";
import { about, profile } from "@/data";
import { usePhotoSrc } from "@/hooks";
import type { AboutFocusIcon, AboutTerminalEntry } from "@/types";

const FOCUS_ICONS: Record<AboutFocusIcon, LucideIcon> = {
  brain: Brain,
  layers: Layers,
  bot: Bot,
  cpu: Cpu,
};

/* JSON colouring of the code window. */
const KEY_CLASS = "text-sky-300";
const STRING_CLASS = "text-amber-300";
const PUNCT_CLASS = "text-slate-500";

/* Indentation kept as literal classes so Tailwind generates the utilities. */
const INDENT_CLASS: Record<number, string> = { 0: "", 1: "pl-4", 2: "pl-8" };

/**
 * Portrait, with a graceful fallback while no photo file exists in `public/`.
 * `usePhotoSrc` walks `profile.photos`: the first file that loads wins, so dropping
 * `profile.png` — or `.jpg`, `.webp`, `.jpeg` — is enough, no code change needed.
 * `profile.photoPosition` sets the crop (`object-position`) inside the 3:4 frame.
 */
function Portrait() {
  const { src, onError } = usePhotoSrc(profile.photos);

  return (
    <div className="relative mx-auto w-full max-w-[12rem] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] sm:mx-0 sm:max-w-none">
      {src ? (
        <img
          src={src}
          alt={`Portrait of ${profile.name}`}
          loading="lazy"
          decoding="async"
          onError={onError}
          style={{ objectPosition: profile.photoPosition }}
          className="aspect-[3/4] w-full object-cover"
        />
      ) : (
        <div className="flex aspect-[3/4] flex-col items-center justify-center gap-2 bg-gradient-to-br from-sky-500/15 via-indigo-500/10 to-violet-500/15 px-3 text-center">
          <span className="gradient-text text-3xl font-bold tracking-tight">
            {profile.initials}
          </span>
          <span className="text-[0.65rem] leading-relaxed text-slate-400">
            Drop your portrait in{" "}
            <span className="font-mono text-slate-300">{profile.photoHint}</span>
          </span>
        </div>
      )}
    </div>
  );
}

/** One line of the JSON output — `"key": "value"` or `"key": [ …items ]`. */
function JsonLine({ entry, last }: { entry: AboutTerminalEntry; last: boolean }) {
  const indent = INDENT_CLASS[entry.indent] ?? "";
  const value = entry.value;

  if (Array.isArray(value)) {
    return (
      <div className={indent}>
        <span className={KEY_CLASS}>&quot;{entry.key}&quot;</span>
        <span className={PUNCT_CLASS}>: [</span>
        {value.map((item, index) => (
          <div key={item} className="pl-4">
            <span className={STRING_CLASS}>&quot;{item}&quot;</span>
            {index < value.length - 1 && <span className={PUNCT_CLASS}>,</span>}
          </div>
        ))}
        <span className={PUNCT_CLASS}>{last ? "]" : "],"}</span>
      </div>
    );
  }

  return (
    <div className={indent}>
      <span className={KEY_CLASS}>&quot;{entry.key}&quot;</span>
      <span className={PUNCT_CLASS}>: </span>
      <span className={STRING_CLASS}>&quot;{value}&quot;</span>
      {!last && <span className={PUNCT_CLASS}>,</span>}
    </div>
  );
}

/** Terminal window holding the `who-am-i` output. */
function TerminalWindow() {
  const { host, command, output } = about.terminal;

  return (
    <div className="glass-card card-shine flex h-full flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#FF5F57]" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#28C840]" aria-hidden="true" />
        <span className="ml-2 truncate font-mono text-[0.7rem] text-slate-400">
          {host}: ~
        </span>
      </div>

      <div className="overflow-x-auto p-4 font-mono text-[0.72rem] leading-6 sm:p-5 sm:text-xs">
        <p className="whitespace-nowrap">
          <span className="text-emerald-400">$</span>{" "}
          <span className="font-medium text-amber-300">{command}</span>
          <span
            className="ml-1 inline-block h-3.5 w-[7px] translate-y-[2px] animate-pulse bg-amber-300/80"
            aria-hidden="true"
          />
        </p>

        <div className="mt-3 whitespace-nowrap">
          <span className={PUNCT_CLASS}>{"{"}</span>
          {output.map((entry, index) => (
            <JsonLine key={entry.key} entry={entry} last={index === output.length - 1} />
          ))}
          <span className={PUNCT_CLASS}>{"}"}</span>
        </div>
      </div>
    </div>
  );
}

export function About() {
  return (
    <Section id="about" title={about.title} className="below-fold">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:gap-8">
        {/* ------------------- Portrait + bio + focus areas ------------------- */}
        <Reveal className="h-full">
          <article className="glass-card flex h-full flex-col gap-6 p-5 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-[minmax(0,10.5rem)_1fr] sm:gap-6">
              <Portrait />

              <p className="text-sm leading-7 text-slate-200 sm:text-[0.95rem]">
                {about.bio.map((segment, index) =>
                  segment.highlight ? (
                    <span key={index} className="font-semibold text-amber-300">
                      {segment.text}
                    </span>
                  ) : (
                    <span key={index}>{segment.text}</span>
                  ),
                )}
              </p>
            </div>

            <ul className="grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2">
              {about.focus.map((item) => {
                const Icon = FOCUS_ICONS[item.icon];
                return (
                  <li key={item.label} className="group flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-amber-300 transition duration-300 ease-smooth group-hover:border-amber-300/40 group-hover:text-amber-200">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="text-[0.82rem] font-medium text-slate-200 transition duration-300 ease-smooth group-hover:text-amber-100 sm:text-sm">
                      {item.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </article>
        </Reveal>

        {/* ---------------------------- Code window ---------------------------- */}
        <Reveal delay={0.1} variant="scale" className="h-full">
          <TerminalWindow />
        </Reveal>
      </div>
    </Section>
  );
}

