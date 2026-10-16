"use client";

import dynamic from "next/dynamic";
import type { ServiceId } from "@/content/fr/services";
import { useInViewOnce } from "@/hooks/use-in-view";
import { cn } from "@/lib/cn";

// The scenes (and Motion) download only when a scene scrolls into view.
const ServiceScene = dynamic(
  () => import("@/components/motion/service-scenes").then((mod) => mod.ServiceScene),
  {
    ssr: false,
  },
);

/** Decorative mini-scene for a service; reserves its 4:3 box so nothing shifts when it loads. */
export function LazyServiceScene({ id, className }: { id: ServiceId; className?: string }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.2);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("aspect-[4/3] w-full overflow-hidden rounded-xl bg-mist", className)}
    >
      {inView && <ServiceScene id={id} play className={className} />}
    </div>
  );
}
