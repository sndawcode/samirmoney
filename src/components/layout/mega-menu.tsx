"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { nav } from "@/content/fr/nav";
import { products, type ProductId } from "@/content/fr/products";
import { services } from "@/content/fr/services";
import { ui } from "@/content/fr/ui";
import { cx } from "@/lib/cx";
import { frTypo } from "@/lib/fr-typography";

const PRO_PRODUCTS: readonly ProductId[] = ["tpe", "business", "web-admin"];

const itemClasses =
  "inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-medium transition-colors duration-(--dur-micro) hover:bg-ink-950/5 ink:hover:bg-white/10 aria-[current=page]:underline aria-[current=page]:underline-offset-8";

const panelClasses =
  "absolute top-full left-1/2 mt-3 w-[min(92vw,760px)] -translate-x-1/2 rounded-lg border border-ink-950/10 bg-paper p-4 text-ink-950 shadow-xl shadow-ink-950/10 data-[state=closed]:hidden";

/** Desktop navigation (≥ lg). Arrow keys and Esc via Radix NavigationMenu. */
export function MegaMenu({ visuals }: { visuals: Partial<Record<ProductId, ReactNode>> }) {
  const pathname = usePathname();
  const current = (href: string) => (pathname === href ? "page" : undefined);

  return (
    <NavigationMenu.Root
      aria-label={ui.menuTitle}
      className="relative hidden lg:block"
      delayDuration={80}
    >
      <NavigationMenu.List className="flex items-center gap-1">
        {nav.primary.map((item) => (
          <NavigationMenu.Item key={item.href} className="relative">
            {item.menu ? (
              <>
                <NavigationMenu.Trigger
                  className={cx(itemClasses, "group")}
                  aria-current={current(item.href)}
                >
                  {item.label}
                  <ChevronDown
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="size-4 transition-transform duration-(--dur-ui) group-data-[state=open]:rotate-180"
                  />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content data-theme="paper" className={panelClasses}>
                  {item.menu === "professionnels" ? (
                    <ProPanel visuals={visuals} />
                  ) : (
                    <ServicesPanel />
                  )}
                </NavigationMenu.Content>
              </>
            ) : (
              <NavigationMenu.Link asChild active={pathname === item.href}>
                <Link href={item.href} className={itemClasses} aria-current={current(item.href)}>
                  {item.label}
                </Link>
              </NavigationMenu.Link>
            )}
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

function ProPanel({ visuals }: { visuals: Partial<Record<ProductId, ReactNode>> }) {
  const items = products.filter((p) => PRO_PRODUCTS.includes(p.id));
  return (
    <div className="flex flex-col gap-3">
      <ul className="grid grid-cols-3 gap-3">
        {items.map((product) => (
          <li key={product.id}>
            <NavigationMenu.Link asChild>
              <Link
                href={product.href}
                className="group flex h-full flex-col gap-3 rounded-md bg-mist p-4 transition-colors hover:bg-fog"
              >
                <div aria-hidden="true" className="grid h-32 place-items-center overflow-hidden">
                  {visuals[product.id]}
                </div>
                <span className="text-eyebrow text-graphite">{product.index}</span>
                <span className="font-semibold">{product.name}</span>
                <span className="text-sm text-graphite">{frTypo(product.tagline)}</span>
              </Link>
            </NavigationMenu.Link>
          </li>
        ))}
      </ul>
      <NavigationMenu.Link asChild>
        <Link
          href={nav.professionnelsOverview.href}
          className="inline-flex min-h-11 items-center self-start px-2 text-sm font-medium text-samir-700 underline-offset-4 hover:underline"
        >
          {nav.professionnelsOverview.label} →
        </Link>
      </NavigationMenu.Link>
    </div>
  );
}

function ServicesPanel() {
  return (
    <div className="flex flex-col gap-3">
      <ul className="grid grid-cols-2 gap-1">
        {services.map((service) => (
          <li key={service.id}>
            <NavigationMenu.Link asChild>
              <Link
                href={service.href}
                className="flex flex-col gap-1 rounded-md p-3 transition-colors hover:bg-mist"
              >
                <span className="font-semibold">{frTypo(service.name)}</span>
                <span className="text-sm text-graphite">{frTypo(service.line)}</span>
              </Link>
            </NavigationMenu.Link>
          </li>
        ))}
      </ul>
      <NavigationMenu.Link asChild>
        <Link
          href={nav.servicesOverview.href}
          className="inline-flex min-h-11 items-center self-start px-3 text-sm font-medium text-samir-700 underline-offset-4 hover:underline"
        >
          {nav.servicesOverview.label} →
        </Link>
      </NavigationMenu.Link>
    </div>
  );
}
