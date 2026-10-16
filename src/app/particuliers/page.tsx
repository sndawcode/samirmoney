import type { Metadata } from "next";
import Link from "next/link";
import { navLabel } from "@/content/fr/nav";
import { particuliersPage as page } from "@/content/fr/particuliers";
import { productById } from "@/content/fr/products";
import { site } from "@/content/fr/site";
import { ui } from "@/content/fr/ui";
import { frTypo } from "@/lib/fr-typography";
import { breadcrumbJsonLd, JsonLd, mobileAppJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { DeviceFrame } from "@/components/product/device-frame";
import { FeatureChapter } from "@/components/product/feature-chapter";
import { LocalNav } from "@/components/product/local-nav";
import { NextProduct } from "@/components/product/next-product";
import { ProductHero } from "@/components/product/product-hero";
import { ProductVisual } from "@/components/product/product-visual";
import { ComplianceLine } from "@/components/trust/compliance-line";
import { ContactBand } from "@/components/ui/contact-band";
import { Steps } from "@/components/ui/content-blocks";
import { Placeholder } from "@/components/ui/placeholder";
import { StoreBadges } from "@/components/ui/store-badges";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/section";

export const metadata: Metadata = pageMetadata("/particuliers");

const features = page.features.items.filter((feature) => feature.published);

export default function ParticuliersPage() {
  const product = productById("samir-money");
  return (
    <>
      <ProductHero
        theme="paper"
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        lead={page.hero.lead}
        actions={<StoreBadges app="samirMoney" />}
        visual={
          <ProductVisual
            product={product}
            sizes="(min-width: 1024px) 24vw, 60vw"
            eager
            className="mx-auto h-[440px] max-w-[380px] [--phone-max:300px] lg:h-[600px]"
          />
        }
      />
      <LocalNav name={page.localNav.name} links={page.localNav.links} cta={page.localNav.cta} />

      <Section theme="ink" texture id="fonctionnalites" aria-labelledby="fonctionnalites-title">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Eyebrow>{page.features.eyebrow}</Eyebrow>
            <Heading as="h2" id="fonctionnalites-title">
              {page.features.title}
            </Heading>
          </div>
          <FeatureChapter
            steps={features.map((feature) => ({
              key: feature.index,
              media: (
                <DeviceFrame kind="phone">
                  <Placeholder
                    label={feature.screen.placeholder}
                    ratio={feature.screen.ratio}
                    className="rounded-none border-0"
                  />
                </DeviceFrame>
              ),
              content: (
                <div className="flex flex-col gap-3">
                  <span className="text-eyebrow text-accent">{feature.index}</span>
                  <h3 className="text-h3">{frTypo(feature.title)}</h3>
                  <p className="max-w-[40ch] text-lead text-smoke">{frTypo(feature.text)}</p>
                  {"link" in feature && feature.link && (
                    <Link
                      href={feature.link.href}
                      className="inline-flex min-h-11 items-center gap-2 self-start font-medium text-samir-300 underline-offset-4 hover:underline"
                    >
                      {feature.link.label} <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              ),
            }))}
          />
          <div className="flex flex-col gap-2 border-t border-white/10 pt-10">
            <h3 className="text-h3">{frTypo(page.features.more.title)}</h3>
            <p className="text-smoke">{frTypo(page.features.more.text)}</p>
          </div>
        </Container>
      </Section>

      <Section theme="mist" id="demarrer" aria-labelledby="demarrer-title">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Eyebrow>{page.start.eyebrow}</Eyebrow>
            <Heading as="h2" id="demarrer-title">
              {page.start.title}
            </Heading>
          </div>
          <Steps steps={page.start.steps} />
          <p className="text-sm text-graphite">{frTypo(page.start.note)}</p>
        </Container>
      </Section>

      <Section theme="ink" texture id="securite" aria-labelledby="securite-title">
        <Container className="flex flex-col gap-6">
          <Eyebrow>{page.security.eyebrow}</Eyebrow>
          <Heading as="h2" id="securite-title">
            {page.security.title}
          </Heading>
          <p className="max-w-[48ch] text-lead text-smoke">{frTypo(page.security.text)}</p>
          <ComplianceLine />
        </Container>
      </Section>

      <Section theme="paper" id="telecharger" aria-labelledby="telecharger-title">
        <Container className="flex flex-col items-start gap-8">
          <Heading as="h2" size="display-l" id="telecharger-title">
            {page.download.title}
          </Heading>
          <StoreBadges app="samirMoney" />
        </Container>
      </Section>

      <NextProduct id="tpe" />
      <ContactBand location="particuliers" />
      <JsonLd
        data={[
          mobileAppJsonLd({ name: product.name, ...site.apps.samirMoney }),
          breadcrumbJsonLd([
            { name: ui.breadcrumbHome, path: "/" },
            { name: navLabel("/particuliers"), path: "/particuliers" },
          ]),
        ]}
      />
    </>
  );
}
