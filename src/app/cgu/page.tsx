import type { Metadata } from "next";
import { termsPage } from "@/content/fr/legal";
import { frTypo } from "@/lib/fr-typography";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/ui/legal";
import { Placeholder } from "@/components/ui/placeholder";

export const metadata: Metadata = pageMetadata("/cgu");

export default function CguPage() {
  return (
    <LegalPage title={termsPage.title}>
      {termsPage.body ? (
        <p>{frTypo(termsPage.body)}</p>
      ) : (
        <Placeholder label={termsPage.pending} ratio="3/1" />
      )}
    </LegalPage>
  );
}
