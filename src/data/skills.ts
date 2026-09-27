import type { SkillGroup } from "@/types";

/**
 * "Toolkit & Skills" — one group per domain, one logo card per technology.
 *
 * ⚠️ Every `icon` key must exist in `src/components/ui/TechIcon.tsx` (TECH_GLYPHS).
 * Add, remove or reorder items here: the rows adapt automatically.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    items: [
      { name: "Python", icon: "python" },
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" },
    ],
  },
  {
    id: "frontend-backend",
    label: "Frontend & Backend",
    items: [
      { name: "React.js", icon: "react" },
      { name: "Node.js", icon: "node" },
      { name: "FastAPI", icon: "fastapi" },
      { name: "REST API", icon: "rest-api" },
    ],
  },
  {
    id: "ai",
    label: "AI & Machine Learning",
    items: [
      { name: "Machine Learning", icon: "machine-learning" },
      { name: "Deep Learning", icon: "deep-learning" },
      { name: "CNN", icon: "cnn" },
      { name: "3D CNN", icon: "cnn-3d" },
      { name: "Computer Vision", icon: "computer-vision" },
      { name: "YOLO", icon: "yolo" },
      { name: "LLMs", icon: "llm" },
      { name: "RAG", icon: "rag" },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    items: [
      { name: "MySQL", icon: "mysql" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MongoDB", icon: "mongodb" },
    ],
  },
  {
    id: "iot",
    label: "IoT & Embedded",
    items: [
      { name: "ESP32", icon: "esp32" },
      { name: "Arduino", icon: "arduino" },
      { name: "MQTT", icon: "mqtt" },
    ],
  },
  {
    id: "tools",
    label: "Tools & DevOps",
    items: [
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "Docker", icon: "docker" },
      { name: "n8n", icon: "n8n" },
      { name: "VS Code", icon: "vscode" },
    ],
  },
];

/** Three pillars highlighted in the hero. */
export const skillPillars = [
  "AI / Machine Learning",
  "Full-Stack Development",
  "IoT / Telecommunications",
];
