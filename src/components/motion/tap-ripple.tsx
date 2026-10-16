"use client";

import { Check, KeyRound } from "lucide-react";
import { m } from "motion/react";
import { useInViewOnce } from "@/hooks/use-in-view";
import { MotionScope } from "@/components/motion/motion-scope";
import { cn } from "@/lib/cn";
import { frTypo } from "@/lib/fr-typography";

type TapRippleProps = {
  labels: { keychain: string; terminal: string; paid: string };
  className?: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * RAPS scene: keychain → terminal → ripple → ✓ (§7). Plays once in view; with reduced motion Motion
 * renders the final state (keychain on the terminal, payment confirmed).
 */
export function TapRipple({ labels, className }: TapRippleProps) {
  const [ref, play] = useInViewOnce<HTMLDivElement>(0.5);
  return (
    <MotionScope>
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          "relative grid aspect-square w-full max-w-[420px] place-items-center overflow-hidden rounded-xl bg-ink-950 text-white",
          className,
        )}
      >
        <div className="relative flex h-64 w-40 flex-col items-center justify-between rounded-[22px] bg-ink-800 p-4 ring-1 ring-white/10">
          <span className="font-mono text-[0.65rem] tracking-[.12em] text-smoke uppercase">
            {labels.terminal}
          </span>
          <div className="relative grid size-20 place-items-center">
            {[0, 1, 2].map((i) => (
              <m.span
                key={i}
                className="absolute inset-0 rounded-full border-2 border-volt"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={play ? { scale: [0.6, 2], opacity: [0.7, 0] } : undefined}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.9 + i * 0.2 }}
              />
            ))}
            <m.span
              className="grid size-14 place-items-center rounded-full bg-volt text-ink-950"
              initial={{ scale: 0, opacity: 0 }}
              animate={play ? { scale: 1, opacity: 1 } : undefined}
              transition={{ duration: 0.5, ease: EASE, delay: 1.4 }}
            >
              <Check className="size-7" strokeWidth={2.5} />
            </m.span>
          </div>
          <m.span
            className="font-mono text-xs text-volt"
            initial={{ opacity: 0 }}
            animate={play ? { opacity: 1 } : undefined}
            transition={{ delay: 1.6 }}
          >
            {frTypo(labels.paid)}
          </m.span>
        </div>
        <m.div
          className="absolute top-[18%] right-[12%] flex flex-col items-center gap-2"
          initial={{ x: 60, y: -40, rotate: 18 }}
          animate={play ? { x: -40, y: 70, rotate: -6 } : undefined}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
        >
          <span className="grid size-16 place-items-center rounded-2xl bg-samir-500 text-ink-950 shadow-xl shadow-ink-950/50">
            <KeyRound className="size-7" strokeWidth={1.5} />
          </span>
          <span className="font-mono text-[0.65rem] tracking-[.12em] uppercase">
            {labels.keychain}
          </span>
        </m.div>
      </div>
    </MotionScope>
  );
}
