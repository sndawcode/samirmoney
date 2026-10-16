import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { frTypo } from "@/lib/fr-typography";

type KineticHeadlineProps = {
  as: "h1" | "h2";
  lines: readonly string[];
  /** A word that gets the accent underline (dark surfaces only). */
  highlight?: string;
  className?: string;
  id?: string;
};

/**
 * Line-mask reveal, CSS only (§5.3). Screen readers get the whole sentence once;
 * the animated lines are hidden from them. Reduced motion shows the final state.
 */
export function KineticHeadline({
  as: Tag,
  lines,
  highlight,
  className,
  id,
}: KineticHeadlineProps) {
  const text = lines.map(frTypo);
  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{text.join(" ")}</span>
      {text.map((line, i) => (
        <span key={line} aria-hidden="true" className="kinetic-line">
          <span style={{ "--line": i } as CSSProperties}>
            <Highlighted line={line} word={highlight} />
          </span>
        </span>
      ))}
    </Tag>
  );
}

function Highlighted({ line, word }: { line: string; word?: string }) {
  if (!word || !line.includes(word)) return <>{line}</>;
  const [before, after] = line.split(word);
  return (
    <>
      {before}
      <span className={cn("accent-underline")}>{word}</span>
      {after}
    </>
  );
}
