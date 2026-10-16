"use client";

import { useEffect, useRef } from "react";
import { paymentMethodBadges } from "@/content/fr/payment-methods";
import { products } from "@/content/fr/products";
import type { EcosystemScene, Layout, Quality } from "@/components/home/ecosystem/ecosystem-scene";

/** Event other components dispatch to light up a solution's node: detail = product id or null. */
export const ECOSYSTEM_FOCUS_EVENT = "ecosystem:focus";

const DESKTOP_QUERY = "(min-width: 1024px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

// Core position on screen (fractions) and camera distance, per layout.
const LAYOUT_DESKTOP: Layout = { coreX: 0.76, coreY: 0.3, distance: 8.5, badgeScale: 1 };
const LAYOUT_MOBILE: Layout = { coreX: 0.84, coreY: 0.1, distance: 11, badgeScale: 0.8 };

type NetworkInformation = { saveData?: boolean };

/** Picks a rendering tier from the device; every device gets the scene, weaker ones a lighter one. */
function detectQuality(): Quality {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: NetworkInformation };
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  if (nav.connection?.saveData || cores <= 4 || memory <= 2) return "low";
  if (cores <= 6 || memory <= 4 || window.matchMedia("(pointer: coarse)").matches) return "medium";
  return "high";
}

const IDLE_TIMEOUT_MS = 4000;

/**
 * Runs once the page has loaded and the main thread is idle, so building the scene never competes with
 * the headline, the tiles or the first interactions.
 */
function afterLoadAndIdle(callback: () => void): () => void {
  let idleId: number | undefined;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const schedule = () => {
    if ("requestIdleCallback" in window)
      idleId = window.requestIdleCallback(callback, { timeout: IDLE_TIMEOUT_MS });
    else timeoutId = setTimeout(callback, 500);
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
  return () => {
    window.removeEventListener("load", schedule);
    if (idleId !== undefined) window.cancelIdleCallback(idleId);
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  };
}

/**
 * Home S1 background: the Three.js "ecosystem". Decorative (aria-hidden), loaded on every device after first
 * paint, paused off-screen and in background tabs, a still frame with reduced motion. If WebGL is unavailable
 * the CSS glow underneath stays as the background.
 */
export function EcosystemCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.closest("section");
    if (!canvas || !section) return;

    let scene: EcosystemScene | null = null;
    let disposed = false;
    let visible = true;
    const cleanups: (() => void)[] = [];

    const cancelIdle = afterLoadAndIdle(async () => {
      const { EcosystemScene } = await import("@/components/home/ecosystem/ecosystem-scene");
      if (disposed) return;
      const reduce = window.matchMedia(REDUCED_MOTION_QUERY).matches;
      try {
        scene = new EcosystemScene({
          canvas,
          quality: detectQuality(),
          animate: !reduce,
          nodeIds: products.map((p) => p.id),
          badges: paymentMethodBadges,
        });
      } catch (error) {
        // No WebGL: keep the CSS background. Visible in the console for QA, harmless for visitors.
        console.warn("[ecosystem] WebGL unavailable, keeping the static background", error);
        return;
      }
      const active = scene;
      await active.warmUp();
      if (disposed) return;

      const desktop = window.matchMedia(DESKTOP_QUERY);
      const resize = () =>
        active.resize(
          canvas.clientWidth,
          canvas.clientHeight,
          desktop.matches ? LAYOUT_DESKTOP : LAYOUT_MOBILE,
        );
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
      resize();
      cleanups.push(() => resizeObserver.disconnect());

      // Run only while the hero is on screen and the tab is visible.
      const sync = () =>
        visible && document.visibilityState === "visible" ? active.start() : active.stop();
      const io = new IntersectionObserver(([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        sync();
      });
      io.observe(section);
      document.addEventListener("visibilitychange", sync);
      cleanups.push(
        () => io.disconnect(),
        () => document.removeEventListener("visibilitychange", sync),
      );

      // Pointer (mouse) and device tilt (where the browser allows it without a prompt).
      const onPointer = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        active.setPointer(
          (event.clientX / window.innerWidth) * 2 - 1,
          (event.clientY / window.innerHeight) * 2 - 1,
        );
      };
      const onTilt = (event: DeviceOrientationEvent) => {
        if (event.gamma === null || event.beta === null) return;
        active.setPointer(
          Math.max(-1, Math.min(1, event.gamma / 30)),
          Math.max(-1, Math.min(1, (event.beta - 45) / 30)),
        );
      };
      if (!reduce) {
        window.addEventListener("pointermove", onPointer, { passive: true });
        window.addEventListener("deviceorientation", onTilt, { passive: true });
        cleanups.push(
          () => window.removeEventListener("pointermove", onPointer),
          () => window.removeEventListener("deviceorientation", onTilt),
        );
      }

      // Scroll: pull the camera back and fade the canvas as the hero leaves.
      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          const rect = section.getBoundingClientRect();
          const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height * 0.8)));
          active.setScroll(progress);
          canvas.style.opacity = String(1 - progress * 0.85);
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", onScroll));

      const onFocus = (event: Event) => active.focus((event as CustomEvent<string | null>).detail);
      window.addEventListener(ECOSYSTEM_FOCUS_EVENT, onFocus);
      cleanups.push(() => window.removeEventListener(ECOSYSTEM_FOCUS_EVENT, onFocus));

      sync();
      canvas.dataset.ready = "";
    });

    return () => {
      disposed = true;
      cancelIdle();
      for (const cleanup of cleanups) cleanup();
      scene?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="ecosystem-canvas pointer-events-none absolute inset-x-0 top-0 -z-10 h-[min(100svh,880px)] w-full"
    />
  );
}
