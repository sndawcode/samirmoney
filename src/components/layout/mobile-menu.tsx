"use client";

import { Menu } from "lucide-react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ui } from "@/content/fr/ui";
import { cx } from "@/lib/cx";
import { buttonVariants } from "@/components/ui/button-variants";

// The sheet (and Radix Dialog) downloads on the first tap, not with the page (§13 JS budget).
const MobileMenuSheet = dynamic(
  () => import("@/components/layout/mobile-menu-sheet").then((mod) => mod.MobileMenuSheet),
  { ssr: false },
);

/** "Menu" button below lg; opens the full-screen ink sheet (§7). */
export function MobileMenu({ extras }: { extras: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on route change, and when Activity hides the page (Next.js "preserving UI state").
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }
  useLayoutEffect(() => () => setOpen(false), []);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setRequested(true);
          setOpen(true);
        }}
        className={cx(buttonVariants({ variant: "ghost", size: "sm" }), "lg:hidden")}
      >
        <Menu aria-hidden="true" className="size-5" strokeWidth={1.5} />
        {ui.menuOpen}
      </button>
      {requested && (
        <MobileMenuSheet
          open={open}
          onOpenChange={setOpen}
          pathname={pathname}
          extras={extras}
          onClosed={() => triggerRef.current?.focus()}
        />
      )}
    </>
  );
}
