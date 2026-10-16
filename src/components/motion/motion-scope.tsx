"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

// Motion's DOM animation features load in their own chunk, after the component renders (§13 JS budget).
const loadFeatures = () => import("motion/react").then((mod) => mod.domAnimation);

/** Wrap each Motion-powered scene: lazy features + reduced-motion respected. Not used on the critical path. */
export function MotionScope({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
