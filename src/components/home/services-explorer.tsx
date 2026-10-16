"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { services, type Service } from "@/content/fr/services";
import { productsSection } from "@/content/fr/products";
import { eventClasses } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { frTypo } from "@/lib/fr-typography";
import { LazyServiceScene } from "@/components/motion/lazy-service-scene";

/**
 * Home S2. ≥ lg: sticky stage (left) driven by the active item (scroll spy, hover or focus).
 * Below lg: stacked cards, each with its own mini-scene.
 */
export function ServicesExplorer() {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Scroll spy: the item crossing the middle of the viewport becomes active.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const el of itemRefs.current) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="hidden lg:col-span-6 lg:block">
        <div className="sticky top-[calc(var(--header-h)+3rem)]">
          <LazyServiceScene key={active} id={services[active].id} />
        </div>
      </div>
      <ol className="flex flex-col gap-4 lg:col-span-6 lg:gap-0">
        {services.map((service, i) => (
          <ServiceItem
            key={service.id}
            service={service}
            index={i}
            active={i === active}
            onActivate={() => setActive(i)}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
          />
        ))}
      </ol>
    </div>
  );
}

type ServiceItemProps = {
  service: Service;
  index: number;
  active: boolean;
  onActivate: () => void;
  ref: (el: HTMLLIElement | null) => void;
};

function ServiceItem({ service, index, active, onActivate, ref }: ServiceItemProps) {
  return (
    <li
      ref={ref}
      data-index={index}
      onPointerEnter={onActivate}
      onFocusCapture={onActivate}
      className={cn(
        "rounded-xl bg-mist p-5 lg:rounded-none lg:border-t lg:border-ink-950/10 lg:bg-transparent lg:px-0 lg:py-8",
        "lg:transition-colors lg:duration-(--dur-ui)",
        active && "lg:border-ink-950",
      )}
    >
      <div className="mb-5 lg:hidden">
        <LazyServiceScene id={service.id} className="bg-paper" />
      </div>
      <p className="text-eyebrow text-graphite">{String(index + 1).padStart(2, "0")}</p>
      <h3 className={cn("mt-3 text-h3 lg:transition-colors", !active && "lg:text-graphite")}>
        {frTypo(service.name)}
      </h3>
      <p className="mt-3 max-w-[46ch] text-body text-graphite">{frTypo(service.line)}</p>
      <Link
        href={service.href}
        className={cn(
          "mt-4 inline-flex min-h-11 items-center gap-2 font-medium text-samir-700 underline-offset-4 hover:underline",
          eventClasses("cta_click", { location: "home-services", label: service.name }),
        )}
      >
        {productsSection.cta}
        <span className="sr-only"> : {service.name}</span>
        <span aria-hidden="true">→</span>
      </Link>
    </li>
  );
}
