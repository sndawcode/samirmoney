"use client";

import { Check, Link2, Nfc } from "lucide-react";
import { m, type Transition } from "motion/react";
import type { ReactNode } from "react";
import { serviceScenes as labels } from "@/content/fr/home";
import type { ServiceId } from "@/content/fr/services";
import { cn } from "@/lib/cn";
import { frTypo } from "@/lib/fr-typography";

const EASE = [0.16, 1, 0.3, 1] as const;
const spring: Transition = { duration: 0.8, ease: EASE };

type SceneProps = { play: boolean };

/**
 * Generic, illustrative mini-scenes for the six services (§9.1-S2). No operator logos, no real data.
 * `play` restarts the scene; with reduced motion Motion jumps straight to the final state.
 */
export function ServiceScene({
  id,
  play,
  className,
}: SceneProps & { id: ServiceId; className?: string }) {
  const Scene = SCENES[id];
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-xl bg-mist p-6",
        className,
      )}
    >
      <Scene play={play} />
    </div>
  );
}

function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "rounded-full border border-ink-950/10 bg-paper px-3 py-1.5 font-mono text-[0.7rem] whitespace-nowrap shadow-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}

function Screen({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-lg bg-ink-950 p-4 text-white shadow-xl", className)}>
      {children}
    </div>
  );
}

function Paid({ text, play, delay = 0.6 }: { text: string; play: boolean; delay?: number }) {
  return (
    <m.span
      className="inline-flex items-center gap-1.5 font-mono text-xs text-volt"
      initial={false}
      animate={play ? { opacity: [0, 1], y: [6, 0] } : { opacity: 1, y: 0 }}
      transition={{ ...spring, delay }}
    >
      <Check className="size-3.5" strokeWidth={2.5} />
      {frTypo(text)}
    </m.span>
  );
}

/** Method chips converge into one terminal screen. */
function Encaissement({ play }: SceneProps) {
  const from = [
    { x: -120, y: -70 },
    { x: 120, y: -70 },
    { x: -120, y: 70 },
    { x: 120, y: 70 },
  ];
  return (
    <div className="relative grid place-items-center">
      <Screen className="flex h-36 w-28 flex-col items-center justify-end gap-2 pb-5">
        <Paid text={labels.terminal} play={play} delay={0.9} />
      </Screen>
      {labels.methods.map((method, i) => (
        <m.div
          key={method}
          className="absolute"
          initial={false}
          animate={
            play
              ? { x: [from[i].x, 0], y: [from[i].y, -10], opacity: [1, 1, 0], scale: [1, 0.6] }
              : { x: from[i].x, y: from[i].y, opacity: 1, scale: 1 }
          }
          transition={{ duration: 0.9, ease: EASE, delay: i * 0.08 }}
        >
          <Pill>{method}</Pill>
        </m.div>
      ))}
    </div>
  );
}

/** Receipts stack into one dashboard total. */
function Collecte({ play }: SceneProps) {
  return (
    <div className="flex items-end gap-6">
      <div className="relative h-28 w-24">
        {[0, 1, 2].map((i) => (
          <m.div
            key={i}
            className="absolute inset-x-0 h-16 rounded-sm border border-dashed border-ink-950/20 bg-paper p-2"
            initial={false}
            animate={
              play ? { y: [-40 - i * 20, i * 8], opacity: [0, 1] } : { y: i * 8, opacity: 1 }
            }
            transition={{ ...spring, delay: i * 0.12 }}
          >
            <span className="block h-1.5 w-10 rounded-full bg-ink-950/15" />
            <span className="mt-2 block h-1.5 w-14 rounded-full bg-ink-950/10" />
          </m.div>
        ))}
      </div>
      <Screen className="w-36">
        <p className="font-mono text-[0.65rem] text-smoke uppercase">{labels.dashboardTotal}</p>
        <m.div
          className="mt-3 h-2 rounded-full bg-samir-500"
          initial={false}
          animate={play ? { width: ["10%", "100%"] } : { width: "100%" }}
          transition={{ ...spring, delay: 0.4 }}
        />
        <div className="mt-3">
          <Paid text={labels.collected} play={play} delay={0.9} />
        </div>
      </Screen>
    </div>
  );
}

/** One source fans out to many recipients, ✓ each. */
function Masse({ play }: SceneProps) {
  const rows = [0, 1, 2, 3];
  return (
    <div className="flex items-center gap-6">
      <Screen className="grid size-20 place-items-center font-mono text-[0.65rem] uppercase">
        {labels.fanOut}
      </Screen>
      <ul className="flex flex-col gap-2">
        {rows.map((i) => (
          <m.li
            key={i}
            className="flex items-center gap-2 rounded-full border border-ink-950/10 bg-paper py-1.5 pr-3 pl-1.5 shadow-sm"
            initial={false}
            animate={play ? { x: [-40, 0], opacity: [0, 1] } : { x: 0, opacity: 1 }}
            transition={{ ...spring, delay: 0.1 + i * 0.1 }}
          >
            <span className="size-5 rounded-full bg-samir-100" />
            <span className="h-1.5 w-12 rounded-full bg-ink-950/15" />
            <Check className="size-3.5 text-samir-700" strokeWidth={2.5} />
          </m.li>
        ))}
      </ul>
    </div>
  );
}

/** Chat bubble with a link → tap → "Payé ✓" receipt. */
function Lien({ play }: SceneProps) {
  return (
    <div className="flex w-full max-w-[260px] flex-col gap-3">
      <m.div
        className="self-start rounded-2xl rounded-bl-sm bg-paper px-3 py-2 text-xs shadow-sm"
        initial={false}
        animate={play ? { opacity: [0, 1], y: [10, 0] } : { opacity: 1, y: 0 }}
        transition={spring}
      >
        {frTypo(labels.linkMessage)}
        <span className="mt-1 flex items-center gap-1 font-mono text-samir-700">
          <Link2 className="size-3.5" strokeWidth={2} />
          {labels.linkUrl}
        </span>
      </m.div>
      <m.div
        className="self-end"
        initial={false}
        animate={play ? { opacity: [0, 1], scale: [0.9, 1] } : { opacity: 1, scale: 1 }}
        transition={{ ...spring, delay: 0.5 }}
      >
        <Screen className="rounded-sm px-4 py-3 font-mono text-xs">
          <span className="block border-b border-dashed border-white/20 pb-2 text-smoke">
            {labels.receipt}
          </span>
          <span className="mt-2 block">
            <Paid text={labels.linkPaid} play={play} delay={0.9} />
          </span>
        </Screen>
      </m.div>
    </div>
  );
}

/** Blocks snap together. */
function Api({ play }: SceneProps) {
  const offsets = [-60, 0, 60];
  return (
    <div className="flex items-center">
      {labels.apiBlocks.map((block, i) => (
        <m.div
          key={block}
          initial={false}
          animate={play ? { x: [offsets[i], 0] } : { x: 0 }}
          transition={{ ...spring, delay: 0.1 }}
          className={cn(
            "grid h-16 w-24 place-items-center border font-mono text-[0.7rem]",
            i === 1
              ? "z-10 -mx-1 border-ink-950 bg-ink-950 text-volt"
              : "border-ink-950/15 bg-paper",
            i === 0 && "rounded-l-lg",
            i === 2 && "rounded-r-lg",
          )}
        >
          {block}
        </m.div>
      ))}
    </div>
  );
}

/** Keychain tap ripple. */
function Nfc_({ play }: SceneProps) {
  return (
    <div className="relative grid place-items-center">
      {[0, 1, 2].map((i) => (
        <m.span
          key={i}
          className="absolute size-24 rounded-full border-2 border-samir-500"
          initial={false}
          animate={play ? { scale: [0.6, 1.8], opacity: [0.8, 0] } : { scale: 1.2, opacity: 0.25 }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 + i * 0.25 }}
        />
      ))}
      <Screen className="relative grid size-24 place-items-center rounded-full">
        <Nfc className="size-8 text-volt" strokeWidth={1.5} />
      </Screen>
      <span className="mt-4 font-mono text-xs">{labels.nfc}</span>
    </div>
  );
}

const SCENES: Record<ServiceId, (props: SceneProps) => ReactNode> = {
  "encaissement-multicanal": Encaissement,
  collecte: Collecte,
  "paiement-de-masse": Masse,
  "lien-de-paiement": Lien,
  "api-integrations": Api,
  "paiement-nfc": Nfc_,
};
