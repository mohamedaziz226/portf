import type { AchievementItem, AchievementKind } from "@/types";

/**
 * CERTIFICATIONS / HACKATHONS / COMPETITIONS / ACHIEVEMENTS
 *
 * Real, verifiable items only — badge & certificate images live in `public/certificates/`.
 * `credentialId` is copyable in one click and `link` opens the official verification page
 * (a "[...]" placeholder renders as a disabled button instead of a broken link).
 *
 * Template — duplicate as needed:
 *
 * {
 *   id: "cert-example",
 *   kind: "certification",
 *   title: "Course title",
 *   issuer: "Platform — Instructor",
 *   year: "2026",
 *   meta: "4.5 total hours · Feb 11, 2026",
 *   description: "Optional short description (1 line).",
 *   credentialId: "UC-…",               // optional
 *   link: "https://…",                  // optional
 *   image: "/certificates/example.jpg", // optional
 * },
 */
export const achievements: AchievementItem[] = [
  {
    id: "cert-ccna-srwe",
    kind: "certification",
    title: "CCNA: Switching, Routing, and Wireless Essentials",
    issuer: "Cisco Networking Academy",
    year: "2026",
    meta: "Issued May 22, 2026",
    description:
      "Switching concepts, VLANs & inter-VLAN routing, STP, EtherChannel and wireless LAN essentials from the CCNA curriculum.",
    credentialId: "d7084e22-eef6-4af0-a1a0-895864be8e12",
    image: "/certificates/ccna-srwe-badge.png",
  },
  {
    id: "award-ai-night-5th-edition",
    kind: "competition",
    title: "AI Night Challenge 5th Edition — AI for Daily Life Transformation Challenge",
    issuer: "ITSPECTRUM+ · ARSII",
    year: "2026",
    meta: "Winning team · Feb 27–28, 2026",
    description:
      "Certificate of Achievement as a member of the winning team \"Alpha Squad\" in the AI for Daily Life Transformation Challenge, held during the AI Night Challenge 5th Edition.",
    image: "/certificates/ai-night-challenge-5th-edition.jpg",
  },
  {
    id: "cert-udemy-node-js",
    kind: "certification",
    title: "Master Node.js: From Beginner to Full-Stack Developer",
    issuer: "Udemy — Brighter Futures Hub",
    year: "2026",
    meta: "3 total hours · Feb 12, 2026",
    description:
      "Node.js fundamentals, Express REST APIs and database integration up to full-stack application structure.",
    credentialId: "UC-8ffa21c7-c4b9-4ac5-a6f0-8975835b6f28",
    link: "https://ude.my/UC-8ffa21c7-c4b9-4ac5-a6f0-8975835b6f28",
    image: "/certificates/udemy-node-js.jpg",
  },
  {
    id: "cert-udemy-react-js",
    kind: "certification",
    title: "Hands On React JS From Beginner to Expert",
    issuer: "Udemy — Learnify IT",
    year: "2026",
    meta: "4.5 total hours · Feb 11, 2026",
    description:
      "React fundamentals to advanced: components, hooks, state management and REST API integration.",
    credentialId: "UC-7829a49f-e67b-4905-95b1-72fab6409cd3",
    link: "https://ude.my/UC-7829a49f-e67b-4905-95b1-72fab6409cd3",
    image: "/certificates/udemy-react-js.jpg",
  },
  {
    id: "cert-ccna-itn",
    kind: "certification",
    title: "CCNA: Introduction to Networks",
    issuer: "Cisco Networking Academy",
    year: "2025",
    meta: "Issued May 22, 2025",
    description:
      "Networking fundamentals: OSI & TCP/IP models, Ethernet, IPv4/IPv6 addressing and routing basics.",
    link: "https://www.credly.com/badges/e3e6aa95-8795-45b3-a450-83e40e64b1b9",
    image: "/certificates/ccna-itn-badge.png",
  },
];

/** Card structure displayed while `achievements` is empty. */
export const achievementKinds: {
  id: AchievementKind;
  label: string;
  description: string;
}[] = [
  {
    id: "certification",
    label: "Certifications",
    description: "AI / ML, cloud or development certifications you completed.",
  },
  {
    id: "hackathon",
    label: "Hackathons",
    description: "Hackathons you joined, with the project and the outcome.",
  },
  {
    id: "competition",
    label: "Competitions",
    description: "Data science, robotics or engineering competitions.",
  },
  {
    id: "achievement",
    label: "Achievements",
    description: "Awards, academic distinctions or notable milestones.",
  },
];
