import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ui } from "@/content/fr/ui";
import { eventClasses, type AnalyticsEvent, type EventProps } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { frTypo } from "@/lib/fr-typography";

export const buttonVariants = cva(
  [
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-base font-medium whitespace-nowrap",
    "transition-[background-color,color,border-color,transform] duration-(--dur-micro) active:scale-[.98]",
    "disabled:pointer-events-none disabled:opacity-60",
  ],
  {
    variants: {
      variant: {
        // ink on light / volt on dark (§7)
        primary:
          "bg-ink-950 text-white hover:bg-ink-700 ink:bg-volt ink:text-ink-950 ink:hover:bg-[#7af8c2]",
        secondary:
          "border border-ink-950/20 text-ink-950 hover:border-ink-950 ink:border-white/25 ink:text-white ink:hover:border-white",
        ghost: "text-ink-950 hover:bg-ink-950/5 ink:text-white ink:hover:bg-white/10",
        link: "min-h-11 rounded-none px-0 text-samir-700 underline-offset-4 hover:underline ink:text-samir-300",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

type ButtonLinkProps = VariantProps<typeof buttonVariants> & {
  href: string;
  children: string;
  className?: string;
  /** Show a trailing arrow (→ internal, ↗ external). */
  arrow?: boolean;
  /** Extra visually hidden context for screen readers (e.g. file type). */
  srHint?: string;
  icon?: ReactNode;
  /** Analytics event recorded on click; defaults to `cta_click` with the label. */
  event?: { name: AnalyticsEvent; props?: EventProps } | false;
  /** Where the CTA sits, for `cta_click {location,label}`. */
  location?: string;
};

const isExternal = (href: string) => /^https?:\/\//.test(href);

/** Every call to action on the site is a link styled as a button. */
export function ButtonLink({
  href,
  children,
  variant,
  className,
  arrow = false,
  srHint,
  icon,
  event,
  location = "page",
}: ButtonLinkProps) {
  const external = isExternal(href);
  const Arrow = external ? ArrowUpRight : ArrowRight;
  const content = (
    <>
      {icon}
      <span>{frTypo(children)}</span>
      {srHint && <span className="sr-only"> ({srHint})</span>}
      {external && <span className="sr-only"> ({ui.newTab})</span>}
      {arrow && <Arrow aria-hidden="true" className="size-4" strokeWidth={1.5} />}
    </>
  );
  const tracking =
    event === false
      ? undefined
      : event
        ? eventClasses(event.name, event.props)
        : eventClasses("cta_click", { location, label: children });
  const classes = cn(buttonVariants({ variant }), tracking, className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
