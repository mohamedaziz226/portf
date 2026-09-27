import { useState } from "react";
import { Check, Github, Globe } from "lucide-react";

import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { ActionButton, ActionLink, Chip, Tilt, VideoModal } from "@/components/ui";
import type { Project, ProjectCategory } from "@/types";
import { linkProps } from "@/lib/links";

const CHIP_TONES: Record<ProjectCategory, "ai" | "web" | "iot"> = {
  ai: "ai",
  web: "web",
  iot: "iot",
};

export function ProjectCard({ project }: { project: Project }) {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const primaryTone = CHIP_TONES[project.categories[0]];

  /** Le bouton « LIVE DEMO » n'apparaît que si une vidéo est réellement associée au projet. */
  const hasVideo = Boolean(project.video);

  /** Le bouton « GitHub » n'apparaît que si un dépôt public réel est renseigné. */
  const github = linkProps(project.github, "/projects.ts");
  const showGithub = !github.disabled;

  return (
    <>
      <Tilt max={4} className="h-full">
        <article className="group glass-card card-shine flex h-full flex-col p-4 transition duration-300 ease-smooth hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-glow sm:p-5">
          <ProjectVisual project={project} />

          <div className="mt-5 flex flex-1 flex-col">
            <h3 className="text-base font-semibold leading-snug text-slate-100 transition-colors duration-300 group-hover:text-white sm:text-lg">
              {project.title}
            </h3>
            <p className="mt-1 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-slate-500">
              {project.subtitle}
            </p>

            <p className="mt-3 text-sm leading-relaxed text-slate-400">{project.description}</p>

            {project.features && project.features.length > 0 && (
              <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
                {project.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-1.5 text-xs text-slate-400">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-400/80" aria-hidden="true" />
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            <ul className="mt-auto flex flex-wrap gap-2 pt-4">
              {project.tech.map((technology) => (
                <li key={technology}>
                  <Chip tone={primaryTone}>{technology}</Chip>
                </li>
              ))}
            </ul>

            {(showGithub || hasVideo) && (
              <div className="flex flex-wrap items-center gap-2 pt-4">
                {showGithub && (
                  <ActionLink
                    href={github.href}
                    external={github.external}
                    variant="outline"
                    size="sm"
                    icon={Github}
                    aria-label={`Open the GitHub repository of ${project.title}`}
                  >
                    GitHub
                  </ActionLink>
                )}

                {hasVideo && (
                  <ActionButton
                    onClick={() => setVideoModalOpen(true)}
                    variant="amber"
                    size="sm"
                    icon={Globe}
                    aria-label={`Open live demo video for ${project.title}`}
                  >
                    LIVE DEMO
                  </ActionButton>
                )}
              </div>
            )}
          </div>
        </article>
      </Tilt>

      {hasVideo && project.video && (
        <VideoModal
          isOpen={videoModalOpen}
          onClose={() => setVideoModalOpen(false)}
          videoSrc={project.video}
          title={project.videoTitle ?? project.title}
          subtitle={project.subtitle}
        />
      )}
    </>
  );
}

