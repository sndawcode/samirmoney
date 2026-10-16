import { trust } from "@/content/fr/trust";
import { cn } from "@/lib/cn";
import { frTypo } from "@/lib/fr-typography";

/** One-line legal mention, imported from trust.ts everywhere (§1.3). */
export function ComplianceLine({ className }: { className?: string }) {
  const [before, after] = trust.complianceLine.split(trust.bceao.reference);
  return (
    <p className={cn("text-xs leading-relaxed text-graphite ink:text-smoke", className)}>
      {frTypo(before)}
      <span className="whitespace-nowrap">{trust.bceao.reference}</span>
      {frTypo(after)}
    </p>
  );
}
