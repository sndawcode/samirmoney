import { Check } from "lucide-react";
import type { Step } from "@/content/types";
import { cn } from "@/lib/cn";
import { frTypo } from "@/lib/fr-typography";

/** Numbered steps with mono indices. */
export function Steps({ steps, className }: { steps: readonly Step[]; className?: string }) {
  return (
    <ol className={cn("grid grid-cols-1 gap-4 md:grid-cols-3", className)}>
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="flex flex-col gap-3 rounded-lg border border-ink-950/10 p-6 ink:border-white/10"
        >
          <span className="text-eyebrow text-samir-700 ink:text-accent">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="text-xl font-extrabold tracking-tight">{frTypo(step.title)}</h3>
          <p className="text-graphite ink:text-smoke">{frTypo(step.text)}</p>
        </li>
      ))}
    </ol>
  );
}

/** Ticked list. */
export function Checklist({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <Check
            aria-hidden="true"
            className="mt-1 size-4 shrink-0 text-samir-700 ink:text-accent"
            strokeWidth={2.5}
          />
          <span>{frTypo(item)}</span>
        </li>
      ))}
    </ul>
  );
}

/** Key/value technical list. Renders nothing while empty (spec sheet not supplied). */
export function SpecList({ items }: { items: readonly { label: string; value: string }[] }) {
  if (items.length === 0) return null;
  return (
    <dl className="grid grid-cols-1 divide-y divide-ink-950/10 border-y border-ink-950/10 sm:grid-cols-2 sm:divide-y-0">
      {items.map((item) => (
        <div key={item.label} className="flex justify-between gap-4 py-3">
          <dt className="text-eyebrow text-graphite">{item.label}</dt>
          <dd>{frTypo(item.value)}</dd>
        </div>
      ))}
    </dl>
  );
}
