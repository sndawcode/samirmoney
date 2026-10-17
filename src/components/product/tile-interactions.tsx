"use client";

import type { PointerEvent, ReactNode } from "react";
import { ECOSYSTEM_FOCUS_EVENT } from "@/components/home/ecosystem/ecosystem-canvas";

const PARALLAX_PX = 8;

/**
 * Pointer and focus behaviour of the bento tiles: cursor spotlight and ±8 px parallax on fine pointers,
 * and the hovered or focused tile lights up its node in the hero scene.
 */
export function TileInteractions({ children }: { children: ReactNode }) {
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const tile = (event.target as HTMLElement).closest<HTMLElement>(".tile-spotlight");
    if (!tile) return;
    const rect = tile.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    tile.style.setProperty("--mx", `${x * 100}%`);
    tile.style.setProperty("--my", `${y * 100}%`);
    tile.style.setProperty("--px", `${(x - 0.5) * 2 * PARALLAX_PX}px`);
    tile.style.setProperty("--py", `${(y - 0.5) * 2 * PARALLAX_PX}px`);
  }

  function focusProduct(target: EventTarget | null) {
    const id =
      target instanceof Element
        ? (target.closest<HTMLElement>("[data-product]")?.dataset.product ?? null)
        : null;
    window.dispatchEvent(new CustomEvent(ECOSYSTEM_FOCUS_EVENT, { detail: id }));
  }

  return (
    <div
      onPointerMove={onPointerMove}
      onPointerOver={(event) => focusProduct(event.target)}
      onPointerLeave={() => focusProduct(null)}
      onFocus={(event) => focusProduct(event.target)}
      onBlur={() => focusProduct(null)}
    >
      {children}
    </div>
  );
}
