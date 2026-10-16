"use client";

import { m, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

const DIAMETER = { sm: 112, lg: 176 } as const;

/** Circular typographic seal; the ring draws on once when it enters the viewport (600 ms, §9.1-S4). */
export function SealRing({ text, size }: { text: string; size: keyof typeof DIAMETER }) {
  const reduce = useReducedMotion();
  const d = DIAMETER[size];
  const r = d / 2 - 3;
  return (
    <div
      aria-hidden="true"
      className="relative grid shrink-0 place-items-center"
      style={{ width: d, height: d }}
    >
      <svg width={d} height={d} viewBox={`0 0 ${d} ${d}`} className="absolute inset-0 -rotate-90">
        <circle
          cx={d / 2}
          cy={d / 2}
          r={r - 8}
          fill="none"
          strokeWidth="1"
          className="stroke-ink-950/15 ink:stroke-white/15"
        />
        <m.circle
          cx={d / 2}
          cy={d / 2}
          r={r}
          fill="none"
          strokeWidth="2"
          className="stroke-samir-700 ink:stroke-samir-500"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <span
        className={cn(
          "px-3 text-center font-mono leading-tight font-medium tracking-tight text-ink-950 ink:text-white",
          size === "lg" ? "text-[0.95rem]" : "text-[0.7rem]",
        )}
      >
        {text}
      </span>
    </div>
  );
}
