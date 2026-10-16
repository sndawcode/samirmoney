import { ui } from "@/content/fr/ui";
import { cn } from "@/lib/cn";
import { isProductionStage } from "@/lib/stage";

type PlaceholderProps = {
  label: string;
  ratio: `${number}/${number}`;
  className?: string;
};

/** Hatched, labelled box for a visual the client has not supplied yet. Dev and preview only (§4.2). */
export function Placeholder({ label, ratio, className }: PlaceholderProps) {
  if (isProductionStage) {
    throw new Error(
      `Placeholder rendered in production: "${label}". Supply the visual (Appendix A) or hide the element.`,
    );
  }
  return (
    <div
      role="img"
      aria-label={`${ui.placeholderPrefix} : ${label}`}
      style={{ aspectRatio: ratio.replace("/", " / ") }}
      className={cn(
        "grid w-full place-items-center rounded-xl border border-dashed border-graphite/40 p-4 text-center",
        "bg-[repeating-linear-gradient(135deg,transparent_0_10px,rgb(91_104_99/0.08)_10px_11px)]",
        "ink:border-smoke/40 ink:bg-[repeating-linear-gradient(135deg,transparent_0_10px,rgb(154_167_162/0.1)_10px_11px)]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="max-w-[24ch] text-eyebrow leading-normal text-graphite ink:text-smoke"
      >
        {label}
      </span>
    </div>
  );
}
