"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TILT_DEG = 7;

/** Per-card pause / play for the orbit (WCAG 2.2.2: moving content must be stoppable). */
export function OrbitPauseButton({
  pauseLabel,
  playLabel,
}: {
  pauseLabel: string;
  playLabel: string;
}) {
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const card = ref.current?.closest<HTMLElement>("[data-universe]");
    if (!card) return;
    if (paused) card.dataset.paused = "";
    else delete card.dataset.paused;
  }, [paused]);

  const Icon = paused ? Play : Pause;
  const label = paused ? playLabel : pauseLabel;
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setPaused((value) => !value)}
      className="grid size-11 shrink-0 place-items-center rounded-full border border-ink-950/10 bg-white/60 text-ink-950 transition-colors hover:bg-white motion-reduce:hidden ink:border-white/15 ink:bg-white/5 ink:text-white ink:hover:bg-white/15"
    >
      <Icon aria-hidden="true" className="size-4" strokeWidth={1.75} />
    </button>
  );
}

/**
 * Section-level behaviour: stops the orbit while the section is off-screen, and tilts each device scene
 * gently towards the pointer (fine pointers, full motion only).
 */
export function UniversesMotion() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = ref.current?.closest<HTMLElement>("[data-universes]");
    if (!section) return;
    const cleanups: (() => void)[] = [];

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) delete section.dataset.offscreen;
      else section.dataset.offscreen = "";
    });
    observer.observe(section);
    cleanups.push(() => observer.disconnect());

    if (window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) {
      for (const stage of section.querySelectorAll<HTMLElement>("[data-universe-stage]")) {
        const move = (event: PointerEvent) => {
          const rect = stage.getBoundingClientRect();
          stage.style.setProperty(
            "--ry",
            `${((event.clientX - rect.left) / rect.width - 0.5) * TILT_DEG * 2}deg`,
          );
          stage.style.setProperty(
            "--rx",
            `${-((event.clientY - rect.top) / rect.height - 0.5) * TILT_DEG * 2}deg`,
          );
        };
        const leave = () => {
          stage.style.removeProperty("--ry");
          stage.style.removeProperty("--rx");
        };
        stage.addEventListener("pointermove", move);
        stage.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          stage.removeEventListener("pointermove", move);
          stage.removeEventListener("pointerleave", leave);
        });
      }
    }
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return <span ref={ref} hidden />;
}
