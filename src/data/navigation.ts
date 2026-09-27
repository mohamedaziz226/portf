import type { NavLink } from "@/types";

/**
 * Navbar / scroll-spy links — each `id` must match the <section id="...">.
 *
 * `home` and `education` are intentionally left out of the bar: the hero is still
 * reachable through the logo (top-left) and the "Back to top" button, and the
 * academic background sits right above the certifications.
 */
export const navLinks: NavLink[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "achievements", label: "Certificates" },
  { id: "contact", label: "Contact" },
];
