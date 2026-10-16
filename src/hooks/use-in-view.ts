"use client";

import { useEffect, useRef, useState } from "react";

/** True once the element has been `amount` visible (never resets). Tiny replacement for Motion's useInView. */
export function useInViewOnce<T extends Element>(amount = 0.3) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: amount },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [amount, inView]);
  return [ref, inView] as const;
}
