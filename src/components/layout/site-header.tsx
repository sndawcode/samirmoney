"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { SectionTheme } from "@/content/types";
import { nav } from "@/content/fr/nav";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/button";

const HEADER_PROBE_Y = 32; // middle of the 64 px header
const HIDE_AFTER_PX = 120;
const LG_QUERY = "(min-width: 1024px)";

/** Theme of the page section currently under the header. */
function themeUnderHeader(): SectionTheme {
  const stack = document.elementsFromPoint(window.innerWidth / 2, HEADER_PROBE_Y);
  const section = stack
    .find((el) => !el.closest("[data-site-header]"))
    ?.closest<HTMLElement>("[data-theme]");
  return (section?.dataset.theme as SectionTheme | undefined) ?? "paper";
}

type SiteHeaderProps = {
  logo: ReactNode;
  /** Desktop navigation (rendered on the server so product visuals stay out of the client bundle). */
  navigation: ReactNode;
  mobileMenu: ReactNode;
};

export function SiteHeader({ logo, navigation, mobileMenu }: SiteHeaderProps) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<SectionTheme>("paper");
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia(LG_QUERY);
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setTheme(themeUnderHeader());
      // Hide on scroll down, return on scroll up — below lg only (§7).
      setHidden(!desktop.matches && y > HIDE_AFTER_PX && y > lastY);
      lastY = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  const dark = theme === "ink";

  return (
    <header
      data-site-header
      data-theme={dark ? "ink" : "paper"}
      onFocusCapture={() => setHidden(false)}
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-(--header-h) border-b backdrop-blur-xl backdrop-saturate-150",
        "transition-[transform,background-color,border-color] duration-(--dur-ui) ease-(--ease-out-expo)",
        dark
          ? "border-white/10 bg-ink-950/70 text-white"
          : "border-ink-950/10 bg-paper/75 text-ink-950",
        hidden && "-translate-y-full",
      )}
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-6 px-gutter">
        {logo}
        {navigation}
        <div className="flex items-center gap-2">
          <ButtonLink
            href={nav.cta.href}
            location="header"
            className="hidden min-h-11 px-5 text-sm lg:inline-flex"
          >
            {nav.cta.label}
          </ButtonLink>
          {mobileMenu}
        </div>
      </div>
    </header>
  );
}
