import { useEffect, useState } from "react";

/**
 * Scroll-spy based on IntersectionObserver: returns the id of the section
 * currently in the reading area (used to highlight the active navbar link).
 */
export function useActiveSection(ids: readonly string[], rootMargin = "-45% 0px -50% 0px"): string {
  // Starts empty: nothing is highlighted when no section is in the reading area
  // (the hero is not part of the navbar links anymore).
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin, threshold: [0, 0.2, 0.5, 0.8, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids, rootMargin]);

  return activeId;
}
