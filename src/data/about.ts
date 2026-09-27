import type { AboutFocusItem, AboutSegment, AboutTerminal } from "@/types";

import { profile } from "./profile";

/**
 * "About Me" content.
 *
 * Every fact below comes from the CV — no invented ranking or metric.
 * The intro is split into segments so the key facts can be highlighted, and the
 * `who-am-i` output reuses `profile` so nothing is duplicated by hand.
 */

/** Intro paragraph rendered as one block with inline highlights. */
const bio: AboutSegment[] = [
  { text: "I'm " },
  { text: profile.name, highlight: true },
  { text: ", a 3rd-year Telecommunications Engineering student at " },
  { text: "ENET'Com", highlight: true },
  { text: " (Sfax), after a " },
  { text: "Bachelor's degree in Telecommunications", highlight: true },
  { text: " at ISITCom. Passionate about artificial intelligence, I build " },
  { text: "machine learning, computer-vision and LLM/RAG", highlight: true },
  { text: " applications, as well as " },
  { text: "full-stack and IoT", highlight: true },
  { text: " solutions — from data acquisition to processing and visualisation." },
];

/** Focus areas listed with an icon under the bio. */
const focus: AboutFocusItem[] = [
  { icon: "brain", label: "AI & Machine Learning" },
  { icon: "layers", label: "Full-Stack Development" },
  { icon: "bot", label: "LLM · RAG Engineering" },
  { icon: "cpu", label: "IoT & Embedded Systems" },
];

/** Output of the `who-am-i` command shown in the code window. */
const terminal: AboutTerminal = {
  host: "aziz@enetcom",
  command: "who-am-i",
  output: [
    { indent: 1, key: "name", value: profile.name },
    { indent: 1, key: "education", value: "3rd-year Telecommunications Engineering Student" },
    { indent: 1, key: "university", value: "ENET'Com — Sfax" },
    { indent: 1, key: "focus", value: focus.map((item) => item.label) },
    { indent: 1, key: "location", value: profile.contact.location },
    { indent: 1, key: "availability", value: profile.hero.availability },
  ],
};

export const about = {
  title: "About Me",
  bio,
  focus,
  terminal,
} as const;
