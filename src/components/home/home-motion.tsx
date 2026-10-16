"use client";

import { useEffect } from "react";

/**
 * Home choreography (GSAP + ScrollTrigger), loaded after first paint. Elements opt in with data attributes:
 * - `data-gsap="rise"`      fade + rise + unblur when scrolled into view (batched, staggered)
 * - `data-gsap="pop"`       children of the element pop in one after another (diagram nodes)
 * - `data-gsap="parallax"`  drifts with scroll (`data-speed`, default 0.15)
 * - `data-gsap-stack`       the hero content recedes as the next section slides over it (card stack)
 * - `data-magnetic`         follows the pointer slightly (CTAs)
 * - `[data-tile] > a`       3D tilt towards the pointer
 * Native scrolling only (no scroll-jacking). With reduced motion nothing runs and every element stays as rendered.
 */
export function HomeMotion() {
  useEffect(() => {
    let revert: (() => void) | undefined;
    let cancelled = false;

    const start = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Section reveals.
        gsap.set("[data-gsap='rise']", { autoAlpha: 0, y: 48, filter: "blur(8px)" });
        ScrollTrigger.batch("[data-gsap='rise']", {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 1,
              ease: "expo.out",
              stagger: 0.08,
            }),
        });

        // Diagram nodes and similar groups.
        gsap.utils.toArray<HTMLElement>("[data-gsap='pop']").forEach((group) => {
          gsap.from(group.children, {
            scale: 0.6,
            autoAlpha: 0,
            duration: 0.9,
            ease: "back.out(1.7)",
            stagger: 0.12,
            scrollTrigger: { trigger: group, start: "top 80%", once: true },
          });
        });

        // Slow drift.
        gsap.utils.toArray<HTMLElement>("[data-gsap='parallax']").forEach((el) => {
          const speed = Number(el.dataset.speed ?? 0.15);
          gsap.fromTo(
            el,
            { yPercent: speed * 100 },
            {
              yPercent: -speed * 100,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        // Card stack: the hero recedes while the services section slides over it.
        const stack = document.querySelector<HTMLElement>("[data-gsap-stack]");
        const next = document.querySelector<HTMLElement>("[data-gsap-stack-next]");
        if (stack && next) {
          gsap.to(stack, {
            scale: 0.94,
            autoAlpha: 0.35,
            transformOrigin: "50% 100%",
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top 35%", scrub: true },
          });
        }
      });

      // Pointer-driven details: fine pointers only, and never with reduced motion.
      mm.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
        const handlers: (() => void)[] = [];

        gsap.utils.toArray<HTMLElement>("[data-tile] > a").forEach((tile) => {
          gsap.set(tile, { transformPerspective: 900 });
          const rotateX = gsap.quickTo(tile, "rotationX", { duration: 0.5, ease: "power3.out" });
          const rotateY = gsap.quickTo(tile, "rotationY", { duration: 0.5, ease: "power3.out" });
          const move = (event: PointerEvent) => {
            const rect = tile.getBoundingClientRect();
            rotateY(((event.clientX - rect.left) / rect.width - 0.5) * 8);
            rotateX(-((event.clientY - rect.top) / rect.height - 0.5) * 8);
          };
          const leave = () => {
            rotateX(0);
            rotateY(0);
          };
          tile.addEventListener("pointermove", move);
          tile.addEventListener("pointerleave", leave);
          handlers.push(() => {
            tile.removeEventListener("pointermove", move);
            tile.removeEventListener("pointerleave", leave);
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((el) => {
          const x = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
          const y = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
          const move = (event: PointerEvent) => {
            const rect = el.getBoundingClientRect();
            x((event.clientX - (rect.left + rect.width / 2)) * 0.25);
            y((event.clientY - (rect.top + rect.height / 2)) * 0.35);
          };
          const leave = () => {
            x(0);
            y(0);
          };
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
          handlers.push(() => {
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", leave);
          });
        });

        return () => handlers.forEach((remove) => remove());
      });

      revert = () => mm.revert();
    };

    // After load and an idle moment, so the choreography never delays the headline, tiles or first input.
    let id: number | null = null;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const schedule = () => {
      if ("requestIdleCallback" in window)
        id = window.requestIdleCallback(() => void start(), { timeout: 2000 });
      else timeout = setTimeout(() => void start(), 300);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      if (id !== null) window.cancelIdleCallback(id);
      if (timeout !== null) clearTimeout(timeout);
      revert?.();
    };
  }, []);

  return null;
}
