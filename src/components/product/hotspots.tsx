"use client";

import { useState, type ReactNode } from "react";
import type { Hotspot } from "@/content/fr/professionnels";
import { ui } from "@/content/fr/ui";
import { cx } from "@/lib/cx";
import { frTypo } from "@/lib/fr-typography";

/**
 * Numbered dots on a screenshot with tooltips on hover, focus or tap (≥ md).
 * The numbered list below is always present — it is the mobile and screen-reader version (§7).
 */
export function Hotspots({ items, children }: { items: readonly Hotspot[]; children: ReactNode }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        {children}
        {items.map((item, i) =>
          item.x === undefined || item.y === undefined ? null : (
            <div
              key={item.label}
              className="absolute hidden -translate-x-1/2 -translate-y-1/2 md:block"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              <button
                type="button"
                aria-label={`${i + 1}. ${item.label}`}
                onClick={() => setOpen(open === i ? null : i)}
                onPointerEnter={() => setOpen(i)}
                onPointerLeave={() => setOpen(null)}
                onFocus={() => setOpen(i)}
                onBlur={() => setOpen(null)}
                className="grid size-11 place-items-center"
              >
                <span className="relative grid size-7 place-items-center rounded-full bg-accent text-xs font-semibold text-ink-950 shadow-lg ring-4 ring-accent/25">
                  {i + 1}
                </span>
              </button>
              <span
                aria-hidden="true"
                className={cx(
                  "pointer-events-none absolute top-full left-1/2 z-10 mt-1 w-56 -translate-x-1/2 rounded-sm bg-ink-950 px-3 py-2 text-sm text-white shadow-xl transition-opacity duration-(--dur-micro)",
                  open === i ? "opacity-100" : "opacity-0",
                )}
              >
                {frTypo(item.label)}
              </span>
            </div>
          ),
        )}
      </div>
      <ol aria-label={ui.hotspotsList} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-start gap-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full border border-accent text-xs text-accent">
              {i + 1}
            </span>
            <span className="text-smoke">{frTypo(item.label)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
