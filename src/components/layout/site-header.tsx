"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { SectionTheme } from "@/content/types";
import { cx } from "@/lib/cx";

const HEADER_PROBE_Y = 32; // middle of the 64 px header
const HIDE_AFTER_PX = 120;
const LG_QUERY = "(min-width: 1024px)";

const TRANSPARENT_UNTIL_PX = 24;

/** What sits under the header: the section theme, and whether it is a full-screen hero (home). */
function underHeader(): { theme: SectionTheme; overHero: boolean } {
  const stack = document.elementsFromPoint(window.innerWidth / 2, HEADER_PROBE_Y);
  const element = stack.find((el) => !el.closest("[data-site-header]"));
  const section = element?.closest<HTMLElement>("[data-theme]");
  return {
    theme: (section?.dataset.theme as SectionTheme | undefined) ?? "paper",
    overHero: Boolean(element?.closest("[data-hero]")),
  };
}

type SiteHeaderProps = {
  logo: ReactNode;
  /** Desktop navigation (rendered on the server so product visuals stay out of the client bundle). */
  navigation: ReactNode;
  mobileMenu: ReactNode;
  cta: ReactNode;
};

export function SiteHeader({ logo, navigation, mobileMenu, cta }: SiteHeaderProps) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<SectionTheme>("paper");
  const [hidden, setHidden] = useState(false);
  // At the very top of the home hero the header is clear glass-free, so the full screen reads as one image.
  const [transparent, setTransparent] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia(LG_QUERY);
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const under = underHeader();
      setTheme(under.theme);
      setTransparent(under.overHero && y < TRANSPARENT_UNTIL_PX);
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
      className={cx(
        "fixed inset-x-0 top-0 z-50 h-(--header-h) border-b",
        "transition-[transform,background-color,border-color,backdrop-filter] duration-(--dur-ui) ease-(--ease-out-expo)",
        transparent
          ? "border-transparent bg-transparent text-white"
          : dark
            ? "border-white/10 bg-ink-950/70 text-white backdrop-blur-xl backdrop-saturate-150"
            : "border-ink-950/10 bg-paper/75 text-ink-950 backdrop-blur-xl backdrop-saturate-150",
        hidden && "-translate-y-full",
      )}
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-6 px-gutter">
        {logo}
        {navigation}
        <div className="flex items-center gap-2">
          <div className="hidden lg:block">{cta}</div>
          {mobileMenu}
        </div>
      </div>
    </header>
  );
}
