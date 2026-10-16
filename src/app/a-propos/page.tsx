import type { Metadata } from "next";
import Link from "next/link";
import { aProposPage as page } from "@/content/fr/a-propos";
import { navLabel } from "@/content/fr/nav";
import { site } from "@/content/fr/site";
import { ui } from "@/content/fr/ui";
import { frTypo } from "@/lib/fr-typography";
import { breadcrumbJsonLd, JsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { HomePartners } from "@/components/home/home-sections";
import { KineticHeadline } from "@/components/motion/kinetic-headline";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { ComplianceLine } from "@/components/trust/compliance-line";
import { CredentialSeal } from "@/components/trust/credential-seal";
import { Address } from "@/components/ui/address";
import { ContactBand } from "@/components/ui/contact-band";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/section";
import { trust } from "@/content/fr/trust";

export const metadata: Metadata = pageMetadata("/a-propos");

export default function AProposPage() {
  return (
    <>
      <Section
        theme="paper"
        spacing="none"
        className="pt-[calc(var(--header-h)+3rem)] pb-12 lg:pt-[calc(var(--header-h)+5rem)] lg:pb-20"
      >
        <Container className="flex flex-col gap-6">
          <Eyebrow>{page.hero.eyebrow}</Eyebrow>
          <KineticHeadline
            as="h1"
            lines={[page.hero.title]}
            className="max-w-[18ch] text-display-l"
          />
        </Container>
      </Section>

      <Section theme="paper" spacing="compact" aria-labelledby="mission-title">
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <h2 id="mission-title" className="text-eyebrow text-graphite lg:col-span-4">
            {page.mission.eyebrow}
          </h2>
          <div className="flex flex-col gap-6 lg:col-span-8">
            {page.mission.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-lead text-ink-950">
                {frTypo(paragraph)}
              </p>
            ))}
          </div>
        </Container>
      </Section>

      <Section theme="mist" aria-labelledby="values-title">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Eyebrow>{page.values.eyebrow}</Eyebrow>
            <Heading as="h2" id="values-title">
              {page.values.title}
            </Heading>
          </div>
          <Reveal as="ul" stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {page.values.items.map((value, i) => (
              <RevealItem
                as="li"
                key={value.title}
                className="flex flex-col gap-3 rounded-lg bg-paper p-6"
              >
                <span className="text-eyebrow text-samir-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xl font-extrabold tracking-tight">{value.title}</h3>
                <p className="text-graphite">{frTypo(value.text)}</p>
              </RevealItem>
            ))}
          </Reveal>
        </Container>
      </Section>

      <Section theme="ink" texture aria-labelledby="about-trust-title">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Eyebrow>{page.trust.eyebrow}</Eyebrow>
            <Heading as="h2" id="about-trust-title">
              {trust.title}
            </Heading>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <CredentialSeal kind="bceao" />
            <CredentialSeal kind="pciDss" />
          </div>
        </Container>
      </Section>

      <Section theme="paper" aria-labelledby="commitments-title">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Eyebrow>{page.commitments.eyebrow}</Eyebrow>
            <Heading as="h2" id="commitments-title">
              {page.commitments.title}
            </Heading>
          </div>
          <ul className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
            {page.commitments.items.map((item) => (
              <li key={item.title} className="flex flex-col gap-2 border-t border-ink-950/10 pt-6">
                <h3 className="text-xl font-extrabold tracking-tight">{item.title}</h3>
                <p className="text-graphite">{frTypo(item.text)}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {page.milestones.length > 0 && (
        <Section theme="mist" spacing="compact">
          <Container>
            <ul className="flex flex-col gap-4">
              {page.milestones.map((milestone) => (
                <li key={milestone.title}>
                  <h3 className="font-extrabold">{milestone.title}</h3>
                  <p className="text-graphite">{frTypo(milestone.text)}</p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <HomePartners />

      <Section theme="mist" spacing="compact" aria-labelledby="identity-title">
        <Container className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <h2 id="identity-title" className="text-eyebrow text-graphite lg:col-span-4">
            {page.identity.eyebrow}
          </h2>
          <div className="flex flex-col gap-4 lg:col-span-8">
            <p className="text-xl font-semibold">{site.legalName}</p>
            <div>
              <p className="text-eyebrow text-graphite">{page.identity.headquarters}</p>
              <Address className="mt-2" />
            </div>
            <ComplianceLine />
            <Link
              href="/mentions-legales"
              className="inline-flex min-h-11 items-center self-start text-samir-700 underline underline-offset-4 hover:no-underline"
            >
              {page.identity.legalLink}
            </Link>
          </div>
        </Container>
      </Section>

      <ContactBand location="a-propos" />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: ui.breadcrumbHome, path: "/" },
          { name: navLabel("/a-propos"), path: "/a-propos" },
        ])}
      />
    </>
  );
}
