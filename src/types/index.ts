/**
 * Shared domain types.
 * Every piece of content of the portfolio is typed here and consumed by `src/data/*`.
 */

export type Placeholder = string;

/* ------------------------------- Navigation ------------------------------- */

export interface NavLink {
  id: string;
  label: string;
}

/* -------------------------------- Projects -------------------------------- */

export type ProjectCategory = "ai" | "web" | "iot";

export type ProjectIcon =
  | "brain"
  | "graduationCap"
  | "stethoscope"
  | "radioTower"
  | "bot"
  | "signal"
  | "shoppingCart";

export type Accent = "sky" | "violet" | "cyan" | "indigo" | "emerald";

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  /** Key features / capabilities (kept short, 3–6 items). */
  features?: string[];
  tech: string[];
  categories: ProjectCategory[];
  accent: Accent;
  icon?: ProjectIcon;
  /**
   * Repository URL, rendered as a "GitHub" button.
   * Only real links are kept here (no more "[PROJECT_GITHUB_URL]" placeholders): the button is
   * rendered only when the value is a valid URL, so projects without a public repository show
   * no GitHub button at all.
   */
  github?: string;
  /**
   * Optional demo video path served from `public/` (e.g. "/Media1.mp4").
   * When provided, a "LIVE DEMO" button opens a high-definition interactive player.
   * Without it, the card simply shows no action button.
   */
  video?: string;
  /** Optional custom title for the video player modal. */
  videoTitle?: string;
  /** Marks a project that should be rendered with extra emphasis. */
  featured?: boolean;
}

/* ------------------------------- Experience ------------------------------- */

export interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  company: string;
  /** City / country where the role took place (e.g. "Sousse, Tunisia"). */
  location?: string;
  /** One-line pitch. */
  summary: string;
  /** Optional second paragraph. */
  description?: string;
  tech: string[];
  responsibilities?: string[];
  features?: string[];
  /** Optional CTA, e.g. { label: "View Project", href: "https://…" }. */
  link?: { label: string; href: string };
  /**
   * Optional demo video, as a path to a file served from `public/`
   * (e.g. "/Media1.mp4"). Rendered as an inline HTML5 player (click to play,
   * never autoplayed) at the top of the experience card.
   */
  video?: string;
  ongoing?: boolean;
}

/* -------------------------------- Education -------------------------------- */

export interface EducationItem {
  id: string;
  period: string;
  school: string;
  degree: string;
  location?: string;
  description?: string;
  ongoing?: boolean;
}

/* ------------------------------- Certifications ------------------------------- */

export type AchievementKind = "certification" | "hackathon" | "competition" | "achievement";

export interface AchievementItem {
  id: string;
  kind: AchievementKind;
  title: string;
  issuer: string;
  year: string;
  description?: string;
  /** Optional link (credential URL or repository). */
  link?: string;
  /** Official credential / certificate number when the issuer provides one (Udemy, Cisco…). */
  credentialId?: string;
  /** Short factual line shown under the issuer — duration, issue date, team… */
  meta?: string;
  /** Badge / certificate image stored in `public/` (e.g. "/certificates/ccna-itn-badge.png"). */
  image?: string;
}

/* --------------------------------- Skills --------------------------------- */

export type SkillIconId =
  | "python"
  | "javascript"
  | "typescript"
  | "react"
  | "node"
  | "fastapi"
  | "rest-api"
  | "machine-learning"
  | "deep-learning"
  | "cnn"
  | "cnn-3d"
  | "computer-vision"
  | "yolo"
  | "llm"
  | "rag"
  | "mysql"
  | "postgresql"
  | "mongodb"
  | "esp32"
  | "arduino"
  | "mqtt"
  | "git"
  | "github"
  | "docker"
  | "n8n"
  | "vscode";

export interface SkillItem {
  name: string;
  /** Brand glyph resolved by `src/components/ui/TechIcon.tsx`. */
  icon: SkillIconId;
}

export interface SkillGroup {
  id: string;
  /** Uppercase label displayed above the row of logo cards. */
  label: string;
  items: SkillItem[];
}

/* ---------------------------------- About ---------------------------------- */

/** Icon key of a focus area listed under the "About" bio. */
export type AboutFocusIcon = "brain" | "layers" | "bot" | "cpu";

/** One chunk of the intro paragraph — highlighted chunks carry the key facts. */
export interface AboutSegment {
  text: string;
  /** Render with the accent highlight (name, school, main topics). */
  highlight?: boolean;
}

/** Focus area displayed with an icon under the bio. */
export interface AboutFocusItem {
  icon: AboutFocusIcon;
  label: string;
}

/** One line of the fake `who-am-i` JSON output. */
export interface AboutTerminalEntry {
  /** Indentation level in 2-space steps (1 = object property, 2 = array item). */
  indent: number;
  key: string;
  /** Plain string value or a list rendered one item per line. */
  value: string | string[];
}

/** Code window displayed next to the bio (title bar + command + JSON output). */
export interface AboutTerminal {
  /** Prompt shown in the title bar, e.g. "aziz@enetcom". */
  host: string;
  /** Command typed after the `$` prompt. */
  command: string;
  output: AboutTerminalEntry[];
}

/* ---------------------------------- Chat ---------------------------------- */

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}
