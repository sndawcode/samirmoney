import { Check } from "lucide-react";
import { apiCard } from "@/content/fr/home";
import { cn } from "@/lib/cn";
import { frTypo } from "@/lib/fr-typography";

/**
 * Code-card composition for API SamirPay. Illustrative only: no real endpoint, key or payload (§9.1-S1).
 */
export function ApiCodeCard({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "w-full max-w-[300px] rounded-sm border border-white/10 bg-ink-900 p-4 font-mono text-[0.7rem] leading-relaxed text-smoke shadow-2xl shadow-ink-950/40 sm:text-xs",
        className,
      )}
    >
      <div className="mb-3 flex gap-1.5">
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/15" />
      </div>
      <ol className="flex flex-col gap-1.5">
        {apiCard.lines.map((line, i) => (
          <li key={line} className="flex gap-3">
            <span className="text-white/30">{String(i + 1).padStart(2, "0")}</span>
            <span className={cn(i === apiCard.lines.length - 1 && "text-white")}>
              {frTypo(line)}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-3 flex items-center gap-2 border-t border-dashed border-white/15 pt-3 text-volt">
        <Check className="size-3.5" strokeWidth={2} />
        {frTypo(apiCard.status)}
      </p>
    </div>
  );
}
