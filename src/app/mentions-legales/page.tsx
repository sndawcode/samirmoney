import type { Metadata } from "next";
import { legalNotice } from "@/content/fr/legal";
import { frTypo } from "@/lib/fr-typography";
import { pageMetadata } from "@/lib/seo";
import { Ordinals } from "@/components/ui/address";
import { LegalPage } from "@/components/ui/legal";
import { Placeholder } from "@/components/ui/placeholder";

export const metadata: Metadata = pageMetadata("/mentions-legales");

export default function MentionsLegalesPage() {
  return (
    <LegalPage title={legalNotice.title}>
      <dl className="flex flex-col divide-y divide-ink-950/10">
        {legalNotice.facts.map((fact) => (
          <div
            key={fact.label}
            className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6"
          >
            <dt className="pt-1 text-eyebrow text-graphite">{fact.label}</dt>
            <dd>
              {fact.value ? (
                <Ordinals text={frTypo(fact.value)} />
              ) : (
                <Placeholder label={`${fact.label} (à fournir)`} ratio="8/1" className="min-h-12" />
              )}
            </dd>
          </div>
        ))}
      </dl>
    </LegalPage>
  );
}
