"use client";

import { useEffect, useRef } from "react";

/**
 * Marks each "Nos univers" card once it scrolls into view, which starts its labels' floating. The floating
 * then settles by itself after ~5 s, so it needs no pause control (WCAG 2.2.2); hovering a card replays it.
 */
export function UniversesMotion() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = ref.current?.closest<HTMLElement>("[data-universes]");
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.inview = "";
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.35 },
    );
    for (const card of section.querySelectorAll("[data-universe]")) observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return <span ref={ref} hidden />;
}
