"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/** Per-card pause / play for the floating labels (WCAG 2.2.2: moving content must be stoppable). */
export function FloatPauseButton({
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

/** Section-level behaviour: stops the floating labels while the section is off-screen. */
export function UniversesMotion() {
  const ref = useRef<HTMLSpanElement>(null);

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

  return <span ref={ref} hidden />;
}
