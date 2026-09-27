import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Download, Github, Linkedin, Mail } from "lucide-react";

import { ActionLink, IconLink } from "@/components/ui";
import { navLinks, profile } from "@/data";
import { useActiveSection, useScrolled } from "@/hooks";
import { isPlaceholder, linkProps, mailtoLink } from "@/lib/links";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled(16);
  const prefersReducedMotion = useReducedMotion();
  const sectionIds = useMemo(() => navLinks.map((link) => link.id), []);
  const activeId = useActiveSection(sectionIds);

  const cv = linkProps(profile.cvUrl, "/profile.ts (profile.cvUrl)");
  const github = linkProps(profile.contact.github, "/profile.ts (profile.contact.github)");
  const linkedin = linkProps(profile.contact.linkedin, "/profile.ts (profile.contact.linkedin)");
  const emailTarget = isPlaceholder(profile.contact.email)
    ? profile.contact.email
    : mailtoLink(profile.contact.email, "Contact from your portfolio");
  const email = linkProps(emailTarget, "/profile.ts (profile.contact.email)");

  /* Lock the page scroll while the mobile menu is open. */
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : previous;
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  /* Close the mobile menu with Escape. */
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition duration-300 ease-smooth",
        scrolled || menuOpen
          ? "border-b border-white/[0.07] bg-base-950/85 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav
        className="container-shell flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]"
        aria-label="Main navigation"
      >
        <a href="#home" className="group flex items-center gap-2.5" aria-label="Mohamed Aziz Zairi — home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient text-sm font-bold text-slate-950 shadow-glow transition duration-300 ease-smooth group-hover:brightness-110">
            {profile.initials}
          </span>
          <span className="hidden flex-col leading-tight sm:flex lg:hidden xl:flex">
            <span className="text-sm font-semibold text-slate-100">{profile.name}</span>
            <span className="text-[0.68rem] text-slate-400">AI · Full-Stack · IoT</span>
          </span>
        </a>

        <ul className="hidden items-center lg:flex lg:gap-0.5 xl:gap-1">
          {navLinks.map((link) => {
            const isActive = activeId === link.id;
            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative z-0 inline-flex whitespace-nowrap rounded-full px-3 py-2 text-sm transition duration-300 ease-smooth xl:px-3.5",
                    isActive ? "text-white" : "text-slate-400 hover:text-slate-100",
                  )}
                >
                  {isActive &&
                    (prefersReducedMotion ? (
                      <span
                        className="absolute inset-0 -z-10 rounded-full border border-sky-400/30 bg-sky-400/[0.12]"
                        aria-hidden="true"
                      />
                    ) : (
                      <motion.span
                        layoutId="navbar-active-pill"
                        className="absolute inset-0 -z-10 rounded-full border border-sky-400/30 bg-sky-400/[0.12]"
                        transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      />
                    ))}
                  <span className="relative">{link.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <ActionLink
              href={cv.href}
              disabled={cv.disabled}
              title={cv.title}
              download={!cv.disabled}
              variant="outline"
              size="sm"
              icon={Download}
            >
              Download CV
            </ActionLink>
            <IconLink
              href={github.href}
              disabled={github.disabled}
              title={github.title}
              label="GitHub profile"
              icon={Github}
              className="h-9 w-9"
            />
            <IconLink
              href={linkedin.href}
              disabled={linkedin.disabled}
              title={linkedin.title}
              label="LinkedIn profile"
              icon={Linkedin}
              className="h-9 w-9"
            />
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-200 transition duration-300 ease-smooth hover:border-sky-400/40 hover:text-white lg:hidden"
          >
            <motion.span
              className="absolute h-[2px] w-[18px] rounded-full bg-current"
              animate={{ y: menuOpen ? 0 : -4, rotate: menuOpen ? 45 : 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.span
              className="absolute h-[2px] w-[18px] rounded-full bg-current"
              animate={{ y: menuOpen ? 0 : 4, rotate: menuOpen ? -45 : 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            />
          </button>
        </div>
      </nav>


      {/* ---------------------------- Mobile menu ---------------------------- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden"
          >
            <div className="container-shell pb-6">
              <div className="glass-card overflow-hidden p-3">
                <ul className="flex flex-col">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.22, delay: index * 0.035 }}
                    >
                      <a
                        href={`#${link.id}`}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-4 py-3 text-sm transition duration-300 ease-smooth",
                          activeId === link.id
                            ? "bg-white/[0.07] text-white"
                            : "text-slate-300 hover:bg-white/[0.05] hover:text-white",
                        )}
                      >
                        {link.label}
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full transition",
                            activeId === link.id ? "bg-sky-400" : "bg-white/15",
                          )}
                          aria-hidden="true"
                        />
                      </a>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-3 space-y-3 border-t border-white/10 pt-3">
                  <ActionLink
                    href={cv.href}
                    disabled={cv.disabled}
                    title={cv.title}
                    download={!cv.disabled}
                    variant="outline"
                    size="md"
                    icon={Download}
                    fullWidth
                  >
                    Download CV
                  </ActionLink>

                  <div className="flex items-center gap-2 px-1">
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
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
