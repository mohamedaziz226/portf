import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "outline" | "ghost" | "amber";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "border border-transparent bg-brand-gradient bg-[length:200%_100%] text-slate-950 shadow-glow hover:bg-[position:100%_50%] hover:shadow-glow-violet",
  outline:
    "border border-white/15 bg-white/[0.04] text-slate-100 hover:border-sky-400/45 hover:bg-sky-400/10 hover:text-white",
  ghost: "border border-transparent text-slate-300 hover:bg-white/[0.06] hover:text-white",
  amber:
    "border border-amber-500/50 bg-[#161208]/90 text-amber-400 tracking-wider uppercase font-bold shadow-[0_0_18px_-4px_rgba(245,158,11,0.35)] hover:border-amber-400 hover:bg-amber-500/20 hover:text-amber-300 hover:shadow-[0_0_24px_-2px_rgba(245,158,11,0.55)]",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[0.8rem]",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-sm sm:h-[3.25rem] sm:px-7 sm:text-base",
};

const BASE =
  "group inline-flex select-none items-center justify-center gap-2 rounded-full font-medium transition duration-300 ease-smooth will-change-transform hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 disabled:saturate-50";

type SharedProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  fullWidth?: boolean;
  className?: string;
};

type ActionLinkProps = SharedProps & {
  href?: string;
  disabled?: boolean;
  title?: string;
  external?: boolean;
  download?: boolean;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;

/** Anchor styled as a button. Falls back to a non-interactive span when disabled. */
export function ActionLink({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconRight: IconRight,
  fullWidth,
  className,
  href,
  disabled,
  title,
  external,
  download,
  ...rest
}: ActionLinkProps) {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && "w-full", className);

  const content = (
    <>
      {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
      <span className="truncate">{children}</span>
      {IconRight && (
        <IconRight
          className="h-4 w-4 shrink-0 transition-transform duration-300 ease-smooth group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      )}
    </>
  );

  if (disabled || !href) {
    return (
      <span
        className={cn(classes, "cursor-not-allowed opacity-55 saturate-50 hover:translate-y-0")}
        title={title}
        aria-disabled="true"
        role="link"
      >
        {content}
      </span>
    );
  }

  return (
    <a
      className={classes}
      href={href}
      title={title}
      download={download}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      {...rest}
    >
      {content}
    </a>
  );
}

type ActionButtonProps = SharedProps & {
  disabled?: boolean;
  type?: "button" | "submit";
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children" | "type">;

/** Real <button> for in-page actions (form submit, filters...). */
export function ActionButton({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconRight: IconRight,
  fullWidth,
  className,
  type = "button",
  disabled,
  ...rest
}: ActionButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && "w-full", className)}
      {...rest}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
      <span className="truncate">{children}</span>
      {IconRight && (
        <IconRight
          className="h-4 w-4 shrink-0 transition-transform duration-300 ease-smooth group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      )}
    </button>
  );
}

type IconLinkProps = {
  href?: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
  title?: string;
  className?: string;
};

/** Compact circular icon button used for GitHub / LinkedIn / Email shortcuts. */
export function IconLink({ href, label, icon: Icon, disabled, title, className }: IconLinkProps) {
  const classes = cn(
    "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] text-slate-300 transition duration-300 ease-smooth hover:-translate-y-0.5 hover:border-sky-400/45 hover:bg-sky-400/10 hover:text-sky-200",
    disabled && "cursor-not-allowed opacity-50 hover:translate-y-0 hover:border-white/[0.12] hover:bg-white/[0.04] hover:text-slate-300",
    className,
  );

  if (disabled || !href) {
    return (
      <span className={classes} title={title} aria-disabled="true" role="link">
        <Icon className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">{label}</span>
      </span>
    );
  }

  const isExternal = /^https?:\/\//i.test(href);

  return (
    <a
      className={classes}
      href={href}
      aria-label={label}
      title={title ?? label}
      {...(isExternal ? { target: "_blank", rel: "noreferrer noopener" } : {})}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </a>
  );
}
