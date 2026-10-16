"use client";

import { Check, Cpu, ShoppingCart, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { useInViewOnce } from "@/hooks/use-in-view";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { apiFlow } from "@/content/fr/home";
import { cx } from "@/lib/cx";
import { frTypo } from "@/lib/fr-typography";

type NodeId = keyof typeof apiFlow.nodes;

// Layout in a 600 × 420 viewBox.
const POS: Record<NodeId, { x: number; y: number }> = {
  ecommerce: { x: 120, y: 90 },
  app: { x: 480, y: 90 },
  core: { x: 300, y: 320 },
};

const EDGES: { id: string; from: NodeId; to: NodeId }[] = [
  { id: "ecommerce-core", from: "ecommerce", to: "core" },
  { id: "app-core", from: "app", to: "core" },
];

const ICONS: Record<NodeId, typeof Cpu> = { ecommerce: ShoppingCart, app: Smartphone, core: Cpu };

const PACKET_CYCLES = 3; // packets run a few times, then rest (§5.2: nothing loops forever)
const PACKET_SECONDS = 1.8;

const edgePath = (from: NodeId, to: NodeId) => {
  const a = POS[from];
  const b = POS[to];
  const midY = (a.y + b.y) / 2;
  return `M ${a.x} ${a.y} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`;
};

/**
 * Home S3: e-commerce platform ↔ SamirPay infrastructure ↔ application (brief DESIGN note).
 * Illustrative only — no endpoints, keys or payloads. Static with reduced motion.
 */
export function FlowDiagram() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.4);
  const reduce = usePrefersReducedMotion();
  const [focus, setFocus] = useState<NodeId | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const animate = inView && !reduce;

  useEffect(() => {
    if (!inView) return;
    const timer = window.setTimeout(() => setConfirmed(true), reduce ? 0 : PACKET_SECONDS * 1000);
    return () => window.clearTimeout(timer);
  }, [inView, reduce]);

  const isLit = (edge: (typeof EDGES)[number]) =>
    focus === null || edge.from === focus || edge.to === focus;
  const [initiated, done] = apiFlow.statuses;

  return (
    <figure className="flex flex-col gap-4">
      <div ref={ref} className="relative mx-auto aspect-[600/420] w-full max-w-[640px]">
        <svg viewBox="0 0 600 420" className="absolute inset-0 size-full" aria-hidden="true">
          {EDGES.map((edge) => (
            <g
              key={edge.id}
              className={cx(
                "transition-opacity duration-(--dur-ui)",
                isLit(edge) ? "opacity-100" : "opacity-20",
              )}
            >
              <path
                id={edge.id}
                d={edgePath(edge.from, edge.to)}
                fill="none"
                stroke="rgb(255 255 255 / 0.18)"
                strokeWidth="1.5"
                strokeDasharray="4 6"
              />
              {animate &&
                [0, 0.6].map((offset) => (
                  <circle key={offset} r="4" fill="var(--color-volt)">
                    <animateMotion
                      dur={`${PACKET_SECONDS}s`}
                      begin={`${offset}s`}
                      repeatCount={PACKET_CYCLES}
                      fill="remove"
                      keyPoints={edge.from === "core" ? "1;0" : "0;1"}
                      keyTimes="0;1"
                      calcMode="linear"
                    >
                      <mpath href={`#${edge.id}`} />
                    </animateMotion>
                  </circle>
                ))}
            </g>
          ))}
        </svg>
        {(Object.keys(POS) as NodeId[]).map((id) => {
          const Icon = ICONS[id];
          const core = id === "core";
          return (
            <button
              key={id}
              type="button"
              aria-pressed={focus === id}
              onPointerEnter={() => setFocus(id)}
              onPointerLeave={() => setFocus(null)}
              onFocus={() => setFocus(id)}
              onBlur={() => setFocus(null)}
              style={{ left: `${(POS[id].x / 600) * 100}%`, top: `${(POS[id].y / 420) * 100}%` }}
              className={cx(
                "absolute flex min-h-11 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 rounded-lg border px-3 py-3 text-center sm:px-5 sm:py-4",
                "transition-colors duration-(--dur-ui)",
                core ? "border-samir-500/60 bg-ink-800 hairlines" : "border-white/15 bg-ink-900",
                focus === id && "border-volt",
              )}
            >
              <Icon
                aria-hidden="true"
                className={cx("size-5 sm:size-6", core ? "text-volt" : "text-samir-300")}
                strokeWidth={1.5}
              />
              <span className="max-w-[12ch] text-xs font-medium sm:text-sm">
                {frTypo(apiFlow.nodes[id])}
              </span>
            </button>
          );
        })}
      </div>
      <p
        aria-live="polite"
        className="flex items-center justify-center gap-2 font-mono text-xs text-smoke"
      >
        {confirmed ? (
          <>
            <Check aria-hidden="true" className="size-3.5 text-volt" strokeWidth={2.5} />
            <span className="text-volt">{frTypo(done)}</span>
          </>
        ) : (
          <span>{frTypo(initiated)}</span>
        )}
      </p>
      <figcaption className="sr-only">{frTypo(apiFlow.caption)}</figcaption>
    </figure>
  );
}
