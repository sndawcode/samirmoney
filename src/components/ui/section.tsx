import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { SectionTheme } from "@/content/types";
import { cn } from "@/lib/cn";
import { frTypo } from "@/lib/fr-typography";

const themeClasses: Record<SectionTheme, string> = {
  paper: "bg-paper text-ink-950",
  mist: "bg-mist text-ink-950",
  ink: "bg-ink-950 text-white",
};

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  theme: SectionTheme;
  /** Night-chapter texture: hairline grid and grain (dark chapters only). */
  texture?: boolean;
  /** Vertical padding; "none" for full-bleed compositions. */
  spacing?: "section" | "compact" | "none";
};

/** A page chapter. The header reads `data-theme` to switch between light and dark glass. */
export function Section({
  theme,
  texture = false,
  spacing = "section",
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      data-theme={theme}
      className={cn(
        "relative isolate",
        themeClasses[theme],
        spacing === "section" && "py-section",
        spacing === "compact" && "py-16 md:py-24",
        texture && theme === "ink" && "grain overflow-hidden bg-hairlines",
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  );
}

type ContainerProps = ComponentPropsWithoutRef<"div"> & { width?: "text" | "media" };

/** 1280 px for text layouts, 1440 px for bento and media (§6). */
export function Container({ width = "text", className, ...rest }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-gutter",
        width === "text" ? "max-w-[1280px]" : "max-w-[1440px]",
        className,
      )}
      {...rest}
    />
  );
}

export function Eyebrow({
  children,
  className,
  as: Tag = "p",
}: {
  children: string;
  className?: string;
  as?: "p" | "span";
}) {
  return (
    <Tag className={cn("text-eyebrow text-graphite ink:text-smoke", className)}>
      {frTypo(children)}
    </Tag>
  );
}

type HeadingSize = "display-xl" | "display-l" | "h2" | "h3";
const headingSizes: Record<HeadingSize, string> = {
  "display-xl": "text-display-xl",
  "display-l": "text-display-l",
  h2: "text-h2",
  h3: "text-h3",
};

type HeadingProps = {
  as: "h1" | "h2" | "h3";
  size?: HeadingSize;
  children: ReactNode;
  className?: string;
  id?: string;
};

export function Heading({ as: Tag, size = "h2", children, className, id }: HeadingProps) {
  return (
    <Tag id={id} className={cn(headingSizes[size], className)}>
      {typeof children === "string" ? frTypo(children) : children}
    </Tag>
  );
}

export function Lead({ children, className }: { children: string; className?: string }) {
  return (
    <p className={cn("max-w-[38ch] text-lead text-graphite ink:text-smoke", className)}>
      {frTypo(children)}
    </p>
  );
}

/** Body text with French typography. */
export function Fr({ children }: { children: string }) {
  return <>{frTypo(children)}</>;
}
