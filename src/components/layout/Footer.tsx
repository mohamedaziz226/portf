import { ArrowUp, Github, Linkedin, Mail, Phone } from "lucide-react";

import { IconLink } from "@/components/ui";
import { profile } from "@/data";
import { isPlaceholder, linkProps, mailtoLink, telLink } from "@/lib/links";

export function Footer() {
  const github = linkProps(profile.contact.github, "/profile.ts (profile.contact.github)");
  const linkedin = linkProps(profile.contact.linkedin, "/profile.ts (profile.contact.linkedin)");
  const emailTarget = isPlaceholder(profile.contact.email)
    ? profile.contact.email
    : mailtoLink(profile.contact.email, "Contact from your portfolio");
  const email = linkProps(emailTarget, "/profile.ts (profile.contact.email)");

  const phoneTarget = isPlaceholder(profile.contact.phone)
    ? profile.contact.phone
    : telLink(profile.contact.phone);
  const phone = linkProps(phoneTarget, "/profile.ts (profile.contact.phone)");

  return (
    <footer className="relative border-t border-white/[0.07] py-10">
      <div className="container-shell flex flex-col gap-8 sm:gap-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-gradient text-sm font-bold text-slate-950">
              {profile.initials}
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-100">{profile.name}</p>
              <p className="text-xs text-slate-400">{profile.role}</p>
            </div>
          </div>

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
            <IconLink
              href={phone.href}
              disabled={phone.disabled}
              title={phone.title}
              label={`Call ${profile.contact.phone}`}
              icon={Phone}
            />
          </div>
        </div>

        <div className="hairline" aria-hidden="true" />

        <div className="flex flex-col items-start justify-between gap-4 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>© 2026 {profile.name}. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <a
              href="#home"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-slate-300 transition duration-300 ease-smooth hover:-translate-y-0.5 hover:border-sky-400/40 hover:text-white"
            >
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              Back to top
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
