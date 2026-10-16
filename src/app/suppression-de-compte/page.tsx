import type { Metadata } from "next";
import { accountDeletion } from "@/content/fr/legal";
import { frTypo } from "@/lib/fr-typography";
import { pageMetadata } from "@/lib/seo";
import { DeletionForm } from "@/components/forms/deletion-form";
import { LegalPage } from "@/components/ui/legal";

// Keep this exact URL: the app stores link to it (§8.2).
export const metadata: Metadata = pageMetadata("/suppression-de-compte");

export default function SuppressionDeComptePage() {
  return (
    <LegalPage title={accountDeletion.title}>
      <p className="text-lead text-graphite">{frTypo(accountDeletion.lead)}</p>
      {accountDeletion.inAppPath && <p>{frTypo(accountDeletion.inAppPath)}</p>}
      <DeletionForm />
      <section
        aria-labelledby="deletion-retention"
        className="flex flex-col gap-3 border-t border-ink-950/10 pt-8"
      >
        <h2 id="deletion-retention" className="text-xl font-extrabold">
          {frTypo(accountDeletion.retention.title)}
        </h2>
        <p className="text-graphite">{frTypo(accountDeletion.retention.text)}</p>
      </section>
    </LegalPage>
  );
}
