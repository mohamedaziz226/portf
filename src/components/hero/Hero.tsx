import { memo, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Download, Github, Linkedin, Mail } from "lucide-react";

import { HeroPortrait } from "@/components/hero/HeroPortrait";
import { ParticleField } from "@/components/hero/ParticleField";
import { ActionLink, Chip, IconLink } from "@/components/ui";
import { profile } from "@/data";
import { skillPillars } from "@/data/skills";
import { useTypewriter } from "@/hooks";
import { isPlaceholder, linkProps, mailtoLink } from "@/lib/links";

const HERO_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: HERO_EASE } },
};

export function Hero() {
  return <HeroContent />;
}

/**
 * Isolated so the typewriter + parallax updates only re-render this subtree.
 * The section chrome (particles, grid, auroras) stays mounted and untouched.
 */
const HeroContent = memo(function HeroContent() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  // Parallax on fine pointers only: on touch devices the per-frame transform
  // of two large layers during scroll is the #1 cause of jank.
  const [parallaxEnabled, setParallaxEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const sync = () => setParallaxEnabled(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const animateParallax = parallaxEnabled && !prefersReducedMotion;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, animateParallax ? 72 : 0]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, animateParallax ? 0 : 1]);
  const { text, animateCaret } = useTypewriter(profile.roles, { holdDuration: 1900 });

  const cv = linkProps(profile.cvUrl, "/profile.ts (profile.cvUrl)");
  const github = linkProps(profile.contact.github, "/profile.ts (profile.contact.github)");
  const linkedin = linkProps(profile.contact.linkedin, "/profile.ts (profile.contact.linkedin)");
  const emailTarget = isPlaceholder(profile.contact.email)
    ? profile.contact.email
    : mailtoLink(profile.contact.email, "Contact from your portfolio");
  const email = linkProps(emailTarget, "/profile.ts (profile.contact.email)");

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative isolate overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-36"
    >
      <ParticleField className="pointer-events-none absolute inset-0 h-full w-full opacity-70" />
      <div
        className="pointer-events-none absolute inset-0 bg-grid-lines bg-grid [-webkit-mask-image:radial-gradient(65%_55%_at_50%_15%,black,transparent)] [mask-image:radial-gradient(65%_55%_at_50%_15%,black,transparent)]"
        aria-hidden="true"
      />
      {/* Drifting aurora blobs — desktop only (blur-3xl over large areas is
          the most expensive paint on mobile GPUs). */}
      {!prefersReducedMotion && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 top-1/4 hidden h-72 w-72 rounded-full bg-sky-500/10 blur-3xl animate-aurora sm:block"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 top-10 hidden h-80 w-80 rounded-full bg-violet-500/10 blur-3xl animate-aurora-late sm:block"
          />
        </>
      )}

      <div className="container-shell relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* ------------------------------- Text ------------------------------- */}
          <motion.div
            variants={prefersReducedMotion ? undefined : heroContainer}
            initial={prefersReducedMotion ? undefined : "hidden"}
            animate={prefersReducedMotion ? undefined : "visible"}
            style={animateParallax ? { y: textY, opacity: fade } : undefined}
          >
            <motion.div
              variants={prefersReducedMotion ? undefined : heroItem}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/[0.07] px-3.5 py-1.5 text-[0.72rem] font-medium text-emerald-200 sm:text-xs"
            >
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {profile.hero.availability}
            </motion.div>

            <motion.p
              variants={prefersReducedMotion ? undefined : heroItem}
              className="mt-6 text-sm font-medium text-slate-400 sm:text-base"
            >
              Hi, I&apos;m <span className="font-semibold text-slate-100">{profile.name}</span>
            </motion.p>

            <motion.h1
              variants={prefersReducedMotion ? undefined : heroItem}
              className="mt-3 min-h-[2.4em] text-[2rem] font-extrabold leading-[1.14] tracking-tight sm:text-[2.6rem] lg:text-[3.05rem]"
            >
              <span className="sr-only">{profile.roles.join(" — ")}</span>
              <span aria-hidden="true" className="gradient-text-animated">
                {text}
              </span>
              {animateCaret && (
                <span
                  className="ml-1 inline-block h-[0.95em] w-[3px] translate-y-[0.08em] animate-pulse rounded-full bg-sky-400 align-middle"
                  aria-hidden="true"
                />
              )}
            </motion.h1>

            <motion.p
              variants={prefersReducedMotion ? undefined : heroItem}
              className="mt-5 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base"
            >
              {profile.hero.subtitle}
            </motion.p>

            <motion.div
              variants={prefersReducedMotion ? undefined : heroItem}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <ActionLink
                href="#projects"
                size="lg"
                iconRight={ArrowRight}
                variant="primary"
                aria-label="View my projects"
              >
                View My Projects
              </ActionLink>
              <ActionLink
                href={cv.href}
                disabled={cv.disabled}
                title={cv.title}
                download={!cv.disabled}
                size="lg"
                variant="outline"
                icon={Download}
              >
                Download CV
              </ActionLink>
              <ActionLink href="#contact" size="lg" variant="ghost" icon={Mail}>
                Contact Me
              </ActionLink>
            </motion.div>

            <motion.div
              variants={prefersReducedMotion ? undefined : heroItem}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <div className="flex items-center gap-2">
                <IconLink
                  href={github.href}
                  disabled={github.disabled}
                  title={github.title}
                  label="GitHub profile"
                  icon={Github}
                />
                <IconLink
                  href={linkedin.href}
                  disabled={linkedin.disabled}
                  title={linkedin.title}
                  label="LinkedIn profile"
                  icon={Linkedin}
                />
                <IconLink
                  href={email.href}
                  disabled={email.disabled}
                  title={email.title}
                  label="Send an email"
                  icon={Mail}
                />
              </div>
            </motion.div>

            <motion.ul
              variants={prefersReducedMotion ? undefined : heroItem}
              className="mt-7 flex flex-wrap gap-2"
            >
              {skillPillars.map((pillar) => (
                <li key={pillar}>
                  <Chip tone="mixed">{pillar}</Chip>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* ---------------------- Portrait (static, no motion) ---------------------- */}
          <div className="lg:pl-4">
            <HeroPortrait />
          </div>
        </div>
      </div>
    </section>
  );
});
