"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/cx";

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
          {/* Re-keyed on each step: the CSS entrance plays again (no animation library on this route). */}
          <div key={steps[active].key} className="chapter-swap">
            {steps[active].media}
          </div>
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
            className={cx(
              "flex flex-col gap-6 border-t py-10 lg:min-h-[60vh] lg:justify-center",
              "lg:transition-colors lg:duration-(--dur-ui)",
              i === active ? "border-white/10 lg:border-volt" : "border-white/10",
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
