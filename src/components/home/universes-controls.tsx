"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TILT_DEG = 8;

/**
 * Pause / play for the orbiting services (WCAG 2.2.2: moving content must be stoppable), plus a gentle
 * pointer tilt of each device scene on fine pointers. Both act on the closest [data-universes] section.
 */
export function UniversesControls({
  pauseLabel,
  playLabel,
}: {
  pauseLabel: string;
  playLabel: string;
}) {
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const section = ref.current?.closest<HTMLElement>("[data-universes]");
    if (!section) return;
    if (paused) section.dataset.paused = "";
    else delete section.dataset.paused;
  }, [paused]);

  // Off screen, the orbit stops: no compositing work for an animation nobody sees.
  useEffect(() => {
    const section = ref.current?.closest<HTMLElement>("[data-universes]");
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) delete section.dataset.offscreen;
      else section.dataset.offscreen = "";
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = ref.current?.closest<HTMLElement>("[data-universes]");
    if (
      !section ||
      !window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches
    )
      return;
    const stages = [...section.querySelectorAll<HTMLElement>("[data-universe-stage]")];
    const cleanups = stages.map((stage) => {
      const move = (event: PointerEvent) => {
        const rect = stage.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        stage.style.setProperty("--ry", `${x * TILT_DEG * 2}deg`);
        stage.style.setProperty("--rx", `${-y * TILT_DEG * 2}deg`);
      };
      const leave = () => {
        stage.style.removeProperty("--ry");
        stage.style.removeProperty("--rx");
      };
      stage.addEventListener("pointermove", move);
      stage.addEventListener("pointerleave", leave);
      return () => {
        stage.removeEventListener("pointermove", move);
        stage.removeEventListener("pointerleave", leave);
      };
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  const Icon = paused ? Play : Pause;
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => setPaused((value) => !value)}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink-950/15 px-4 text-sm font-medium text-graphite transition-colors hover:border-ink-950 hover:text-ink-950 motion-reduce:hidden"
    >
      <Icon aria-hidden="true" className="size-4" strokeWidth={1.5} />
      {paused ? playLabel : pauseLabel}
    </button>
  );
}
