"use client";

import dynamic from "next/dynamic";
import type { ServiceId } from "@/content/fr/services";
import { useInViewOnce } from "@/hooks/use-in-view";
import { cx } from "@/lib/cx";
import { TONE_BG, type SceneTone } from "@/components/motion/scene-tone";

// The scenes (and Motion) download only when a scene scrolls into view.
const ServiceScene = dynamic(
  () => import("@/components/motion/service-scenes").then((mod) => mod.ServiceScene),
  {
    ssr: false,
  },
);

/** Decorative mini-scene for a service; reserves its 4:3 box so nothing shifts when it loads. */
export function LazyServiceScene({ id, tone = "mist" }: { id: ServiceId; tone?: SceneTone }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.2);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cx("aspect-[4/3] w-full overflow-hidden rounded-xl", TONE_BG[tone])}
    >
      {inView && <ServiceScene id={id} play tone={tone} />}
    </div>
  );
}
