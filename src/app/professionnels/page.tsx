import type { Metadata } from "next";
import { samirPayFaq } from "@/content/fr/faq";
import { navLabel } from "@/content/fr/nav";
import { productById } from "@/content/fr/products";
import { professionnelsPage as page } from "@/content/fr/professionnels";
import { site } from "@/content/fr/site";
import { ui } from "@/content/fr/ui";
import { frTypo } from "@/lib/fr-typography";
import { breadcrumbJsonLd, faqJsonLd, JsonLd, mobileAppJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { Reveal } from "@/components/motion/reveal";
import { DeviceFrame } from "@/components/product/device-frame";
import { Hotspots } from "@/components/product/hotspots";
import { LegacyHashHandler } from "@/components/product/legacy-hash-handler";
import { LocalNav } from "@/components/product/local-nav";
import { NextProduct } from "@/components/product/next-product";
import { ProductHero } from "@/components/product/product-hero";
import { ProductVisual } from "@/components/product/product-visual";
import { ButtonLink } from "@/components/ui/button";
import { ContactBand } from "@/components/ui/contact-band";
import { Checklist, SpecList, Steps } from "@/components/ui/content-blocks";
import { Faq } from "@/components/ui/faq";
import { Photo } from "@/components/ui/photo";
import { StoreBadges } from "@/components/ui/store-badges";
import { Container, Eyebrow, Heading, Lead, Section } from "@/components/ui/section";

export const metadata: Metadata = pageMetadata("/professionnels");

export default function ProfessionnelsPage() {
  return (
    <>
      <ProductHero
        id="apercu"
        theme="ink"
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        lead={page.hero.lead}
        actions={
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={page.hero.primary.href} arrow location="pro-hero">
              {page.hero.primary.label}
            </ButtonLink>
            <ButtonLink href={page.hero.secondary.href} variant="secondary" location="pro-hero">
              {page.hero.secondary.label}
            </ButtonLink>
          </div>
        }
        visual={<HeroComposition />}
      />
      <LocalNav name={page.localNav.name} links={page.localNav.links} cta={page.localNav.cta} />
      <LegacyHashHandler />

      {/* 01 — TPE */}
      <Section theme="paper" id="tpe" aria-labelledby="tpe-title">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="flex flex-col items-start gap-6 lg:col-span-6">
            <Eyebrow>{page.tpe.eyebrow}</Eyebrow>
            <Heading as="h2" id="tpe-title">
              {page.tpe.title}
            </Heading>
            <Lead>{page.tpe.lead}</Lead>
            <p className="text-body text-graphite">{frTypo(page.tpe.fact)}</p>
            <SpecList items={page.tpe.specs} />
            <ButtonLink href={page.tpe.cta.href} arrow location="pro-tpe">
              {page.tpe.cta.label}
            </ButtonLink>
          </div>
          <Reveal className="flex justify-center lg:col-span-6">
            <div className="grid w-full max-w-md place-items-center rounded-xl bg-mist p-10">
              <Photo
                slot={page.tpe.media}
                sizes="(min-width: 1024px) 28vw, 70vw"
                className="max-h-[560px] w-auto drop-shadow-[0_32px_32px_rgb(5_8_7/0.25)]"
              />
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* 02 — Business */}
      <Section theme="mist" id="business" aria-labelledby="business-title">
        <Container className="flex flex-col gap-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="flex flex-col items-start gap-6 lg:col-span-6">
              <Eyebrow>{page.business.eyebrow}</Eyebrow>
              <Heading as="h2" id="business-title">
                {page.business.title}
              </Heading>
              <Lead>{page.business.lead}</Lead>
              <StoreBadges app="samirPayBusiness" />
            </div>
            <Checklist items={page.business.features} className="lg:col-span-6 lg:pt-10" />
          </div>
          <ul className="-mx-(--gutter) flex snap-x gap-4 overflow-x-auto px-(--gutter) pb-4 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
            {page.business.screens.map((screen) => (
              <li
                key={screen.slot}
                className="w-[58vw] max-w-[260px] shrink-0 snap-center lg:w-auto lg:max-w-none"
              >
                <figure className="flex flex-col gap-3">
                  <DeviceFrame kind="phone">
                    <Photo
                      slot={screen.slot}
                      sizes="(min-width: 1024px) 22vw, 58vw"
                      className="w-full"
                    />
                  </DeviceFrame>
                  <figcaption className="text-center text-eyebrow leading-normal text-graphite">
                    {frTypo(screen.caption)}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 03 — Web Admin */}
      <Section theme="ink" texture id="web-admin" aria-labelledby="web-admin-title">
        <Container width="media" className="flex flex-col gap-12">
          <div className="flex flex-col items-start gap-6 lg:max-w-3xl">
            <Eyebrow>{page.webAdmin.eyebrow}</Eyebrow>
            <Heading as="h2" id="web-admin-title">
              {page.webAdmin.title}
            </Heading>
            <Lead>{page.webAdmin.lead}</Lead>
          </div>
          <Hotspots items={page.webAdmin.hotspots}>
            <DeviceFrame kind="browser">
              <Photo
                slot={page.webAdmin.media}
                sizes="(min-width: 1440px) 1340px, 94vw"
                className="w-full"
              />
            </DeviceFrame>
          </Hotspots>
          <div className="flex flex-col gap-3 sm:flex-row">
            {site.webAdminUrl && (
              <ButtonLink href={site.webAdminUrl} arrow location="pro-web-admin">
                {page.webAdmin.access}
              </ButtonLink>
            )}
            <ButtonLink
              href={page.webAdmin.demo.href}
              variant={site.webAdminUrl ? "secondary" : "primary"}
              arrow
              location="pro-web-admin"
            >
              {page.webAdmin.demo.label}
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {/* Démarrer */}
      <Section theme="paper" id="demarrer" aria-labelledby="demarrer-title">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Eyebrow>{page.start.eyebrow}</Eyebrow>
            <Heading as="h2" id="demarrer-title">
              {page.start.title}
            </Heading>
          </div>
          <Steps steps={page.start.steps} />
          <div className="flex flex-col gap-3 rounded-lg bg-mist p-6">
            <h3 className="text-eyebrow text-graphite">{page.start.checklistTitle}</h3>
            <Checklist items={page.start.checklist} />
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section theme="mist" id="faq" aria-labelledby="faq-title">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-4">
            <Eyebrow>{page.faq.eyebrow}</Eyebrow>
            <Heading as="h2" id="faq-title">
              {page.faq.title}
            </Heading>
          </div>
          <div className="lg:col-span-8">
            <Faq items={samirPayFaq} />
          </div>
        </Container>
      </Section>

      <NextProduct id="raps" />
      <ContactBand location="professionnels" />
      <JsonLd
        data={[
          faqJsonLd(samirPayFaq),
          mobileAppJsonLd({ name: productById("business").name, ...site.apps.samirPayBusiness }),
          breadcrumbJsonLd([
            { name: ui.breadcrumbHome, path: "/" },
            { name: navLabel("/professionnels"), path: "/professionnels" },
          ]),
        ]}
      />
    </>
  );
}

/** TPE + Business phone + Web Admin dashboard, composed (hero visual until a shoot photo is cleared). */
function HeroComposition() {
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[620px]">
      <div className="absolute top-0 right-0 w-[78%]">
        <ProductVisual
          product={productById("web-admin")}
          sizes="(min-width: 1024px) 38vw, 75vw"
          eager
        />
      </div>
      <div className="absolute bottom-0 left-[4%] h-[78%]">
        <ProductVisual
          product={productById("tpe")}
          sizes="(min-width: 1024px) 18vw, 40vw"
          eager
          className="h-full"
        />
      </div>
      <div className="absolute right-[6%] bottom-0 h-[62%] w-[30%]">
        <ProductVisual
          product={productById("business")}
          sizes="(min-width: 1024px) 14vw, 30vw"
          eager
          className="h-full"
        />
      </div>
    </div>
  );
}
