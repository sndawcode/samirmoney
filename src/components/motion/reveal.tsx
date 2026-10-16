"use client";

import type { ReactNode } from "react";
import { useInViewOnce } from "@/hooks/use-in-view";
import { cx } from "@/lib/cx";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
  /** Stagger direct <RevealItem> children by 60 ms. */
  stagger?: boolean;
};

/**
 * Entrance reveal (§6 motion spec) in CSS: opacity, 24 px rise and 6 px blur, 800 ms ease-out-expo.
 * Content is only hidden when scripting is on and motion is allowed (globals.css), so it never stays invisible.
 */
export function Reveal({ children, className, as: Tag = "div", stagger = false }: RevealProps) {
  const [ref, inView] = useInViewOnce<HTMLDivElement & HTMLUListElement & HTMLOListElement>(0.3);
  return (
    <Tag
      ref={ref}
      data-reveal={stagger ? "stagger" : "self"}
      data-shown={inView ? "" : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  return (
    <Tag data-reveal-item="" className={cx(className)}>
      {children}
    </Tag>
  );
}
