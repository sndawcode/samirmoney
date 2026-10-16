import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { developpeursPage as page } from "@/content/fr/developpeurs";
import { navLabel } from "@/content/fr/nav";
import { site } from "@/content/fr/site";
import { ui } from "@/content/fr/ui";
import { cn } from "@/lib/cn";
import { frTypo } from "@/lib/fr-typography";
import { breadcrumbJsonLd, JsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { ApiCodeCard } from "@/components/dev/api-code-card";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { NextProduct } from "@/components/product/next-product";
import { ProductHero } from "@/components/product/product-hero";
import { CredentialSeal } from "@/components/trust/credential-seal";
import { ButtonLink } from "@/components/ui/button";
import { ContactBand } from "@/components/ui/contact-band";
import { Checklist } from "@/components/ui/content-blocks";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/section";

export const metadata: Metadata = pageMetadata("/developpeurs");

export default function DeveloppeursPage() {
  return (
    <>
      <ProductHero
        theme="ink"
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        lead={page.hero.lead}
        actions={
          <div className="flex flex-col gap-3 sm:flex-row">
            {site.docsUrl && (
              <ButtonLink href={site.docsUrl} arrow event={{ name: "docs_click" }}>
                {page.hero.docs}
              </ButtonLink>
            )}
            <ButtonLink
              href={page.hero.expert.href}
              variant={site.docsUrl ? "secondary" : "primary"}
              arrow
              location="dev-hero"
            >
              {page.hero.expert.label}
            </ButtonLink>
          </div>
        }
        visual={<ApiCodeCard className="mx-auto max-w-[420px] text-sm sm:text-base" />}
      />

      <Section
        theme="ink"
        aria-labelledby="dev-catalogue-title"
        className="border-t border-white/10"
      >
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Eyebrow>{page.catalogue.eyebrow}</Eyebrow>
            <Heading as="h2" id="dev-catalogue-title">
              {page.catalogue.title}
            </Heading>
          </div>
          <Reveal as="ul" stagger className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {page.catalogue.items.map((item, i) => {
              const href = item.linkKey ? site[item.linkKey] : null;
              return (
                <RevealItem
                  as="li"
                  key={item.name}
                  className="flex flex-col gap-3 rounded-lg border border-white/10 bg-ink-900 p-6"
                >
                  <span className="text-eyebrow text-smoke">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-xl font-semibold tracking-tight">{frTypo(item.name)}</h3>
                  <p className="text-smoke">{frTypo(item.text)}</p>
                  {href && (
                    <ButtonLink
                      href={href}
                      variant="link"
                      arrow
                      event={{ name: "docs_click", props: { item: item.name } }}
                    >
                      {page.catalogue.pluginLink}
                    </ButtonLink>
                  )}
                </RevealItem>
              );
            })}
          </Reveal>
        </Container>
      </Section>

      <Section
        theme="ink"
        texture
        aria-labelledby="dev-how-title"
        className="border-t border-white/10"
      >
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Eyebrow>{page.how.eyebrow}</Eyebrow>
            <Heading as="h2" id="dev-how-title">
              {page.how.title}
            </Heading>
          </div>
          <ol className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
            {page.how.steps.map((step, i) => (
              <li key={step} className="flex flex-col items-center gap-3 lg:flex-1 lg:flex-row">
                <span
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border px-4 py-4 font-mono text-sm",
                    step.includes("SamirPay")
                      ? "border-samir-500/60 bg-ink-800 text-volt"
                      : "border-white/15 bg-ink-900",
                  )}
                >
                  <span className="text-smoke">{String(i + 1).padStart(2, "0")}</span>
                  {frTypo(step)}
                </span>
                {i < page.how.steps.length - 1 && (
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 shrink-0 rotate-90 text-smoke lg:rotate-0"
                    strokeWidth={1.5}
                  />
                )}
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {page.benefits.length > 0 && (
        <Section theme="ink" spacing="compact" className="border-t border-white/10">
          <Container>
            <Checklist items={page.benefits} />
          </Container>
        </Section>
      )}

      <Section
        theme="ink"
        aria-labelledby="dev-security-title"
        className="border-t border-white/10"
      >
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Eyebrow>{page.security.eyebrow}</Eyebrow>
            <Heading as="h2" id="dev-security-title">
              {page.security.title}
            </Heading>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <CredentialSeal kind="bceao" compact />
            <CredentialSeal kind="pciDss" compact />
          </div>
        </Container>
      </Section>

      <NextProduct id="samir-money" />
      <ContactBand location="developpeurs" />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: ui.breadcrumbHome, path: "/" },
          { name: navLabel("/developpeurs"), path: "/developpeurs" },
        ])}
      />
    </>
  );
}
