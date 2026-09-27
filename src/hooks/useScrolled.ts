import { useEffect, useState } from "react";

/** True once the page is scrolled past `threshold` px (used for the glassy navbar). */
export function useScrolled(threshold = 12): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // rAF-throttled: without this the navbar re-renders on every scroll event
    // (dozens per frame on 120Hz phones), each one re-rendering the header.
    let frame = 0;
    const sync = () => {
      frame = 0;
      setScrolled(window.scrollY > threshold);
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(sync);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return scrolled;
}
