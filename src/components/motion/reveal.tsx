"use client";

import { m, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const item: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  shown: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE_OUT_EXPO },
  },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "ul" | "ol";
  /** Stagger direct <Reveal.Item> children by 60 ms. */
  stagger?: boolean;
};

/** Entrance reveal (§6 motion spec). Renders its final state with reduced motion. Below-the-fold content only. */
export function Reveal({ children, className, as = "div", stagger = false }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = m[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
      variants={stagger ? { hidden: {}, shown: { transition: { staggerChildren: 0.06 } } } : item}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({ children, className, as = "div" }: Omit<RevealProps, "stagger">) {
  const Tag = m[as];
  return (
    <Tag className={className} variants={item}>
      {children}
    </Tag>
  );
}
