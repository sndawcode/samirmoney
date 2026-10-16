import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ui } from "@/content/fr/ui";
import { eventClasses, type AnalyticsEvent, type EventProps } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { frTypo } from "@/lib/fr-typography";
import { buttonVariants, type ButtonVariantProps } from "@/components/ui/button-variants";

type ButtonLinkProps = ButtonVariantProps & {
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
  size,
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
  const classes = cn(
    buttonVariants({ variant, size: size ?? (variant === "link" ? "inline" : "md") }),
    tracking,
    className,
  );
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
