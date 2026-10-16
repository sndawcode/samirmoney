import type { Metadata } from "next";
import { privacyPage } from "@/content/fr/legal";
import { privacyPolicy } from "@/content/fr/privacy-policy";
import { site } from "@/content/fr/site";
import { frTypo } from "@/lib/fr-typography";
import { pageMetadata } from "@/lib/seo";
import { LegalBlocks, LegalPage } from "@/components/ui/legal";

export const metadata: Metadata = pageMetadata("/confidentialite");

export default function ConfidentialitePage() {
  return (
    <LegalPage title={privacyPage.title} meta={privacyPolicy.updated}>
      <h2 className="text-xl font-extrabold">{frTypo(privacyPolicy.title)}</h2>
      <LegalBlocks blocks={privacyPolicy.blocks} />
      <section
        aria-labelledby="privacy-website"
        className="flex flex-col gap-4 border-t border-ink-950/10 pt-8"
      >
        <h2 id="privacy-website" className="text-h3">
          {privacyPage.website.title}
        </h2>
        <LegalBlocks blocks={privacyPage.website.blocks} />
      </section>
      <p className="border-t border-ink-950/10 pt-8">
        {frTypo(privacyPolicy.contactLead)} {frTypo(privacyPage.contactByEmail)}{" "}
        <a href={`mailto:${site.email}`} className="text-samir-700 underline underline-offset-4">
          {site.email}
        </a>
      </p>
    </LegalPage>
  );
}
