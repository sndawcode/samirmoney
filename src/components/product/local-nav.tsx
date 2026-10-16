"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ui } from "@/content/fr/ui";
import { eventClasses } from "@/lib/analytics";
import { cx } from "@/lib/cx";
import { buttonVariants } from "@/components/ui/button-variants";

type LocalNavProps = {
  name: string;
  links: readonly { label: string; href: `#${string}` | string }[];
  cta: { label: string; href: string };
};

/** Apple-style sticky product sub-nav with scroll spy; scrolls horizontally on small screens (§7). */
export function LocalNav({ name, links, cta }: LocalNavProps) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = links
      .map((link) =>
        link.href.startsWith("#") ? document.querySelector<HTMLElement>(link.href) : null,
      )
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(`#${entry.target.id}`);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    for (const el of targets) observer.observe(el);
    return () => observer.disconnect();
  }, [links]);

  return (
    <nav
      aria-label={ui.localNavLabel}
      data-theme="paper"
      className="sticky top-0 z-40 border-b border-ink-950/10 bg-paper/85 backdrop-blur-xl lg:top-(--header-h)"
    >
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-4 px-gutter">
        <span className="hidden shrink-0 font-semibold md:block">{name}</span>
        <ul className="-mx-2 flex min-w-0 flex-1 [scrollbar-width:none] gap-1 overflow-x-auto px-2 md:justify-center">
          {links.map((link) => (
            <li key={link.href} className="shrink-0">
              <a
                href={link.href}
                aria-current={active === link.href ? "location" : undefined}
                className="inline-flex min-h-11 items-center rounded-full px-3 text-sm text-graphite transition-colors hover:text-ink-950 aria-[current=location]:font-medium aria-[current=location]:text-ink-950"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <Link
          href={cta.href}
          className={cx(
            buttonVariants({ variant: "primary", size: "sm" }),
            "shrink-0",
            eventClasses("cta_click", { location: "local-nav", label: cta.label }),
          )}
        >
          {cta.label}
        </Link>
      </div>
    </nav>
  );
}
