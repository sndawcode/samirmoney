"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useState, type ReactNode } from "react";
import { nav } from "@/content/fr/nav";
import { ui } from "@/content/fr/ui";
import { cn } from "@/lib/cn";
import { buttonVariants } from "@/components/ui/button";

/** Full-screen ink sheet below lg: large links with mono indices, CTAs, store badges and WhatsApp (§7). */
export function MobileMenu({ extras }: { extras: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change, and when Activity hides the page (§ preserving UI state).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }
  useLayoutEffect(() => () => setOpen(false), []);

  const close = () => setOpen(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "min-h-11 gap-2 px-4 text-sm lg:hidden",
        )}
      >
        <Menu aria-hidden="true" className="size-5" strokeWidth={1.5} />
        {ui.menuOpen}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content
          data-theme="ink"
          aria-describedby={undefined}
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink-950 bg-hairlines text-white"
        >
          <div className="flex h-(--header-h) shrink-0 items-center justify-between border-b border-white/10 px-gutter">
            <Dialog.Title className="text-eyebrow text-smoke">{ui.menuTitle}</Dialog.Title>
            <Dialog.Close
              className={cn(buttonVariants({ variant: "ghost" }), "min-h-11 gap-2 px-4 text-sm")}
            >
              <X aria-hidden="true" className="size-5" strokeWidth={1.5} />
              {ui.menuClose}
            </Dialog.Close>
          </div>
          <nav aria-label={ui.menuTitle} className="flex-1 px-gutter py-6">
            <ol className="flex flex-col">
              {nav.primary.map((item, i) => (
                <li key={item.href} className="border-b border-white/10">
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="flex min-h-16 items-baseline gap-4 py-3 text-3xl font-semibold tracking-tight aria-[current=page]:text-volt"
                  >
                    <span aria-hidden="true" className="text-eyebrow text-smoke">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
          <div className="flex flex-col gap-4 border-t border-white/10 px-gutter py-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={nav.cta.href}
                onClick={close}
                className={buttonVariants({ variant: "primary" })}
              >
                {nav.cta.label}
              </Link>
              <Link
                href={nav.download.href}
                onClick={close}
                className={buttonVariants({ variant: "secondary" })}
              >
                {nav.download.label}
              </Link>
            </div>
            {extras}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
