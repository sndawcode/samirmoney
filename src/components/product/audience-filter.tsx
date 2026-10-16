"use client";

import * as RadioGroup from "@radix-ui/react-radio-group";
import { useState, useSyncExternalStore, type PointerEvent, type ReactNode } from "react";
import { audienceFilter } from "@/content/fr/home";
import { audienceLabels, products, type Audience } from "@/content/fr/products";
import { track } from "@/lib/analytics";
import { cx } from "@/lib/cx";
import { frTypo } from "@/lib/fr-typography";

const ALL = "tous";
type FilterValue = Audience | typeof ALL;

const AUDIENCES = Object.keys(audienceLabels) as Audience[];
const PARAM = "profil";
const PARALLAX_PX = 8;

const OPTIONS: readonly FilterValue[] = [ALL, ...AUDIENCES];

const isAudience = (value: string | null): value is Audience =>
  value !== null && (AUDIENCES as string[]).includes(value);

// ?profil= is read from the URL on the client only, so the bento stays fully prerendered
// (no useSearchParams, which would client-render the whole tree under Cache Components).
const subscribeToHistory = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
};
const readProfil = () => new URLSearchParams(window.location.search).get(PARAM);
const readProfilOnServer = () => null;

/**
 * "Je suis :" chips (radio-group semantics). Dims non-matching tiles — never hides them —, syncs ?profil=
 * and announces the result (§7). Also drives the tiles' cursor spotlight and ±8 px parallax on fine pointers.
 */
export function AudienceFilter({ children, total }: { children: ReactNode; total: number }) {
  const urlProfil = useSyncExternalStore(subscribeToHistory, readProfil, readProfilOnServer);
  const [selected, setSelected] = useState<FilterValue | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const value: FilterValue = selected ?? (isAudience(urlProfil) ? urlProfil : ALL);

  function select(next: string) {
    const nextValue: FilterValue = isAudience(next) ? next : ALL;
    setSelected(nextValue);
    const url = new URL(window.location.href);
    if (nextValue === ALL) url.searchParams.delete(PARAM);
    else url.searchParams.set(PARAM, nextValue);
    window.history.replaceState(window.history.state, "", url);
    const count =
      nextValue === ALL ? total : products.filter((p) => p.audiences.includes(nextValue)).length;
    setAnnouncement(
      audienceFilter.announce(count, nextValue === ALL ? null : audienceLabels[nextValue]),
    );
    track("audience_filter", { value: nextValue });
  }

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <span id="audience-filter-label" className="text-eyebrow text-smoke">
          {frTypo(audienceFilter.label)}
        </span>
        <RadioGroup.Root
          aria-labelledby="audience-filter-label"
          value={value}
          onValueChange={select}
          orientation="horizontal"
          className="-mx-1 flex snap-x [scrollbar-width:none] gap-2 overflow-x-auto px-1 pb-1"
        >
          {OPTIONS.map((option) => (
            <RadioGroup.Item
              key={option}
              value={option}
              className={cx(
                "min-h-11 shrink-0 snap-start rounded-full border px-4 text-sm font-medium transition-colors duration-(--dur-micro)",
                "border-white/20 text-white hover:border-white/50",
                "data-[state=checked]:border-volt data-[state=checked]:bg-volt data-[state=checked]:text-ink-950",
              )}
            >
              {option === ALL ? audienceFilter.all : audienceLabels[option]}
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
      </div>
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
      <div data-audience={value} onPointerMove={onPointerMove}>
        {children}
      </div>
    </div>
  );
}
