import { ArrowUpRight } from "lucide-react";
import { trust } from "@/content/fr/trust";
import { ui } from "@/content/fr/ui";
import { cn } from "@/lib/cn";
import { frTypo } from "@/lib/fr-typography";
import { SealRing } from "@/components/trust/seal-ring";

type CredentialSealProps = {
  kind: "bceao" | "pciDss";
  compact?: boolean;
  headingLevel?: "h2" | "h3";
};

/**
 * Typographic seal for the BCEAO licence and PCI DSS certification (§9.1-S4).
 * Static, sober and high contrast: no third-party logos, no glow. Wording comes only from trust.ts.
 */
export function CredentialSeal({
  kind,
  compact = false,
  headingLevel = "h3",
}: CredentialSealProps) {
  const Title = headingLevel;
  const isBceao = kind === "bceao";
  const content = isBceao ? trust.bceao : trust.pciDss;
  const sealText = isBceao ? trust.bceao.reference : "PCI DSS";

  return (
    <article
      className={cn(
        "flex h-full flex-col gap-6 rounded-lg border border-ink-950/10 bg-paper p-6 md:p-8",
        "ink:border-white/10 ink:bg-ink-900",
        compact ? "md:flex-row md:items-center" : "lg:flex-row lg:items-center lg:gap-10",
      )}
    >
      <SealRing text={sealText} size={compact ? "sm" : "lg"} />
      <div className="flex flex-col gap-3">
        <Title className="text-eyebrow leading-normal tracking-[.12em] text-samir-700 ink:text-samir-300">
          {frTypo(content.label)}
        </Title>
        <p className={cn(compact ? "text-body" : "text-lead", "text-ink-950 ink:text-white")}>
          {isBceao ? <BceaoText /> : frTypo(content.text)}
        </p>
        {isBceao && (
          <a
            href={trust.bceao.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 self-start text-samir-700 underline underline-offset-4 hover:no-underline ink:text-samir-300"
          >
            {frTypo(trust.bceao.verifyLabel)}
            <span className="rounded-sm border border-current px-1.5 py-1 text-eyebrow">
              {trust.bceao.verifyFormat}
            </span>
            <span className="sr-only">({ui.newTab})</span>
            <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </a>
        )}
      </div>
    </article>
  );
}

/** The reference never breaks across lines (§4.4). */
function BceaoText() {
  const [before, after] = trust.bceao.text.split(trust.bceao.reference);
  return (
    <>
      {frTypo(before)}
      <span className="font-mono whitespace-nowrap">{trust.bceao.reference}</span>
      {frTypo(after)}
    </>
  );
}
