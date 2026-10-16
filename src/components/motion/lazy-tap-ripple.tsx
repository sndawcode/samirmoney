"use client";

import dynamic from "next/dynamic";
import { useInViewOnce } from "@/hooks/use-in-view";

// The RAPS scene (and Motion) downloads when it scrolls into view (§13 JS budget).
const TapRipple = dynamic(
  () => import("@/components/motion/tap-ripple").then((mod) => mod.TapRipple),
  { ssr: false },
);

type Labels = { keychain: string; terminal: string; paid: string };

/** Reserves the scene's square box so nothing shifts while it loads. Decorative. */
export function LazyTapRipple({ labels }: { labels: Labels }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.2);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="aspect-square w-full max-w-[420px] rounded-xl bg-ink-950"
    >
      {inView && <TapRipple labels={labels} />}
    </div>
  );
}
