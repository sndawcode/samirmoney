import type { Metadata } from "next";
import { rapsFaq } from "@/content/fr/faq";
import { navLabel } from "@/content/fr/nav";
import { rapsPage as page } from "@/content/fr/raps";
import { ui } from "@/content/fr/ui";
import { frTypo } from "@/lib/fr-typography";
import { breadcrumbJsonLd, faqJsonLd, JsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { TapRipple } from "@/components/motion/tap-ripple";
import { NextProduct } from "@/components/product/next-product";
import { ProductHero } from "@/components/product/product-hero";
import { ButtonLink } from "@/components/ui/button";
import { ContactBand } from "@/components/ui/contact-band";
import { WhatsAppButton } from "@/components/ui/contact-links";
import { Steps } from "@/components/ui/content-blocks";
import { Faq } from "@/components/ui/faq";
import { Placeholder } from "@/components/ui/placeholder";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/section";

export const metadata: Metadata = pageMetadata("/raps");

export default function RapsPage() {
  return (
    <>
      <ProductHero
        theme="ink"
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        lead={page.hero.lead}
        actions={
          <div className="flex flex-col items-start gap-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={page.hero.primary.href} arrow location="raps-hero">
                {page.hero.primary.label}
              </ButtonLink>
              <WhatsAppButton prefill={page.whatsappPrefill} page="raps" />
            </div>
            <ButtonLink href={page.hero.secondary.href} variant="link" location="raps-hero">
              {page.hero.secondary.label}
            </ButtonLink>
          </div>
        }
        visual={
          <div className="mx-auto max-w-[420px]">
            <Placeholder label={page.hero.visual.placeholder} ratio={page.hero.visual.ratio} />
          </div>
        }
      />

      <Section theme="paper" aria-labelledby="raps-how-title">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-7">
            <div className="flex flex-col gap-4">
              <Eyebrow>{page.how.eyebrow}</Eyebrow>
              <Heading as="h2" id="raps-how-title">
                {page.how.title}
              </Heading>
            </div>
            <Steps steps={page.how.steps} className="md:grid-cols-1 lg:grid-cols-1" />
          </div>
          <div className="flex justify-center lg:col-span-5">
            <TapRipple labels={page.how.sceneLabels} />
          </div>
        </Container>
      </Section>

      <Section theme="mist" aria-labelledby="raps-cases-title">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Eyebrow>{page.useCases.eyebrow}</Eyebrow>
            <Heading as="h2" id="raps-cases-title">
              {page.useCases.title}
            </Heading>
          </div>
          <Reveal as="ul" stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {page.useCases.items.map((item) => (
              <RevealItem
                as="li"
                key={item.title}
                className="flex flex-col gap-4 rounded-lg bg-paper p-4"
              >
                <Placeholder label={item.visual.placeholder} ratio={item.visual.ratio} />
                <h3 className="text-xl font-semibold tracking-tight">{frTypo(item.title)}</h3>
                <p className="text-graphite">{frTypo(item.text)}</p>
              </RevealItem>
            ))}
          </Reveal>
          <ButtonLink
            href={page.useCases.otherCta.href}
            variant="secondary"
            arrow
            location="raps-cases"
            className="self-start"
          >
            {page.useCases.otherCta.label}
          </ButtonLink>
        </Container>
      </Section>

      {rapsFaq.length > 0 && (
        <Section theme="paper" aria-labelledby="raps-faq-title">
          <Container className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <Eyebrow>{page.faq.eyebrow}</Eyebrow>
              <Heading as="h2" id="raps-faq-title">
                {page.faq.title}
              </Heading>
            </div>
            <Faq items={rapsFaq} />
            <JsonLd data={faqJsonLd(rapsFaq)} />
          </Container>
        </Section>
      )}

      <NextProduct id="api" />
      <ContactBand location="raps" />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: ui.breadcrumbHome, path: "/" },
          { name: navLabel("/raps"), path: "/raps" },
        ])}
      />
    </>
  );
}
