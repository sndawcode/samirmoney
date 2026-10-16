"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ChapterStep = { key: string; content: ReactNode; media: ReactNode };

/**
 * Sticky media + scrolling steps (≥ lg): the step crossing the middle of the viewport swaps the media.
 * Below lg, each step is stacked with its own media (§7). `media` arrives already framed from the server.
 */
export function FeatureChapter({ steps }: { steps: readonly ChapterStep[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const el of refs.current) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-[calc(var(--header-h)+5rem)] mx-auto w-full max-w-[300px]">
          <AnimatePresence mode="popLayout" initial={false}>
            <m.div
              key={steps[active].key}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {steps[active].media}
            </m.div>
          </AnimatePresence>
        </div>
      </div>
      <ol className="flex flex-col lg:col-span-7">
        {steps.map((step, i) => (
          <li
            key={step.key}
            data-index={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={cn(
              "flex flex-col gap-6 border-t border-ink-950/10 py-10 lg:min-h-[60vh] lg:justify-center ink:border-white/10",
              "lg:transition-opacity lg:duration-(--dur-ui)",
              i !== active && "lg:opacity-40",
            )}
          >
            <div className="mx-auto w-full max-w-[220px] lg:hidden">{step.media}</div>
            {step.content}
          </li>
        ))}
      </ol>
    </div>
  );
}
