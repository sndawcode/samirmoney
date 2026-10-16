"use client";

import { useInViewOnce } from "@/hooks/use-in-view";
import { cx } from "@/lib/cx";

const DIAMETER = { sm: 112, lg: 176 } as const;

/** Circular typographic seal; the ring draws on once when it enters the viewport (CSS, §9.1-S4). */
export function SealRing({ text, size }: { text: string; size: keyof typeof DIAMETER }) {
  const [ref, inView] = useInViewOnce<SVGSVGElement>(0.6);
  const d = DIAMETER[size];
  const r = d / 2 - 3;
  return (
    <div
      aria-hidden="true"
      className="relative grid shrink-0 place-items-center"
      style={{ width: d, height: d }}
    >
      <svg
        ref={ref}
        data-shown={inView ? "" : undefined}
        width={d}
        height={d}
        viewBox={`0 0 ${d} ${d}`}
        className="absolute inset-0 -rotate-90"
      >
        <circle
          cx={d / 2}
          cy={d / 2}
          r={r - 8}
          fill="none"
          strokeWidth="1"
          className="stroke-ink-950/15 ink:stroke-white/15"
        />
        <circle
          cx={d / 2}
          cy={d / 2}
          r={r}
          fill="none"
          strokeWidth="2"
          pathLength={1}
          className="seal-ring stroke-samir-700 ink:stroke-samir-500"
        />
      </svg>
      <span
        className={cx(
          "px-3 text-center font-mono leading-tight font-medium tracking-tight text-ink-950 ink:text-white",
          size === "lg" ? "text-[0.95rem]" : "text-[0.7rem]",
        )}
      >
        {text}
      </span>
    </div>
  );
}
