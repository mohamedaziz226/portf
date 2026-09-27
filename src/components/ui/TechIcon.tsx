import type { ComponentType } from "react";
import {
  Boxes,
  BrainCircuit,
  FileSearch,
  Focus,
  Grid3x3,
  Layers,
  ScanEye,
  Sparkles,
  Webhook,
} from "lucide-react";
import {
  SiArduino,
  SiDocker,
  SiEspressif,
  SiFastapi,
  SiGit,
  SiGithub,
  SiJavascript,
  SiMongodb,
  SiMqtt,
  SiMysql,
  SiN8N,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiTypescript,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";

import { cn } from "@/lib/utils";
import type { SkillIconId } from "@/types";

/** Props shared by every glyph (Simple Icons, VS Code icons and Lucide). */
type GlyphProps = {
  className?: string;
  color?: string;
  "aria-hidden"?: boolean | "true" | "false";
};

type Glyph = ComponentType<GlyphProps>;

/**
 * Official technology logos, tinted with their usual brand color.
 * Generic concepts (REST API, LLMs, RAG…) fall back to Lucide glyphs.
 */
export const TECH_GLYPHS: Record<SkillIconId, { Icon: Glyph; color: string }> = {
  /* Languages */
  python: { Icon: SiPython, color: "#3776AB" },
  javascript: { Icon: SiJavascript, color: "#F7DF1E" },
  typescript: { Icon: SiTypescript, color: "#3178C6" },

  /* Frontend / Backend */
  react: { Icon: SiReact, color: "#61DAFB" },
  node: { Icon: SiNodedotjs, color: "#5FA04E" },
  fastapi: { Icon: SiFastapi, color: "#009688" },
  "rest-api": { Icon: Webhook, color: "#38BDF8" },

  /* AI & machine learning */
  "machine-learning": { Icon: BrainCircuit, color: "#A78BFA" },
  "deep-learning": { Icon: Layers, color: "#818CF8" },
  cnn: { Icon: Grid3x3, color: "#38BDF8" },
  "cnn-3d": { Icon: Boxes, color: "#22D3EE" },
  "computer-vision": { Icon: ScanEye, color: "#7DD3FC" },
  yolo: { Icon: Focus, color: "#F472B6" },
  llm: { Icon: Sparkles, color: "#C084FC" },
  rag: { Icon: FileSearch, color: "#60A5FA" },

  /* Databases */
  mysql: { Icon: SiMysql, color: "#4479A1" },
  postgresql: { Icon: SiPostgresql, color: "#4169E1" },
  mongodb: { Icon: SiMongodb, color: "#47A248" },

  /* IoT & embedded */
  esp32: { Icon: SiEspressif, color: "#E7352C" },
  arduino: { Icon: SiArduino, color: "#00979D" },
  mqtt: { Icon: SiMqtt, color: "#9E4BC0" },

  /* Tools & DevOps */
  git: { Icon: SiGit, color: "#F05032" },
  github: { Icon: SiGithub, color: "#E5E7EB" },
  docker: { Icon: SiDocker, color: "#2496ED" },
  n8n: { Icon: SiN8N, color: "#EA4B71" },
  vscode: { Icon: VscVscode, color: "#22A7F2" },
};

type TechIconProps = {
  /** Key declared in `src/data/skills.ts`. */
  id: SkillIconId;
  className?: string;
};

/** Renders the logo of a technology, colored with its brand color. */
export function TechIcon({ id, className }: TechIconProps) {
  const { Icon, color } = TECH_GLYPHS[id];

  return <Icon className={cn("shrink-0", className)} color={color} aria-hidden="true" />;
}
