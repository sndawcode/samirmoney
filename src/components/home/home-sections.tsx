import { Check } from "lucide-react";
import { partnersSection } from "@/content/fr/home";
import { partners } from "@/content/fr/partners";
import { apiSection, servicesSection } from "@/content/fr/services";
import { trust } from "@/content/fr/trust";
import { frTypo } from "@/lib/fr-typography";
import { ServicesExplorer } from "@/components/home/services-explorer";
import { FlowDiagram } from "@/components/motion/flow-diagram";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { CredentialSeal } from "@/components/trust/credential-seal";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/section";
import { Photo } from "@/components/ui/photo";

/** S2 — Nos services [paper]; slides over S1 with rounded corners (card-stack, §5.3). */
export function HomeServices() {
  return (
    <Section
      theme="paper"
      aria-labelledby="home-services-title"
      className="z-10 -mt-8 rounded-t-[32px] shadow-[0_-24px_48px_rgb(5_8_7/0.25)] motion-reduce:mt-0 motion-reduce:rounded-none"
    >
      <Container className="flex flex-col gap-12">
        <Reveal className="flex flex-col gap-4">
          <Eyebrow>{servicesSection.eyebrow}</Eyebrow>
          <Heading as="h2" id="home-services-title">
            {servicesSection.title}
          </Heading>
        </Reveal>
        <ServicesExplorer />
      </Container>
    </Section>
  );
}

/** S3 — Nos API [ink]. */
export function HomeApi() {
  return (
    <Section theme="ink" texture aria-labelledby="home-api-title">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <Eyebrow>{apiSection.eyebrow}</Eyebrow>
          <Heading as="h2" id="home-api-title">
            {apiSection.title}
          </Heading>
          <p className="text-lead text-smoke">{frTypo(apiSection.lead)}</p>
          <Reveal as="ul" stagger className="flex flex-col gap-3">
            {apiSection.items.map((item) => (
              <RevealItem as="li" key={item} className="flex items-start gap-3">
                <Check
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-accent"
                  strokeWidth={2.5}
                />
                <span>{frTypo(item)}</span>
              </RevealItem>
            ))}
          </Reveal>
          <div>
            <ButtonLink href="/developpeurs" arrow location="home-api">
              {apiSection.cta}
            </ButtonLink>
          </div>
        </div>
        <div className="lg:col-span-7">
          <FlowDiagram />
        </div>
      </Container>
    </Section>
  );
}

/** S4 — Sécurité, agrément et certifications [mist]. Calm, static, high contrast. */
export function HomeTrust() {
  return (
    <Section theme="mist" aria-labelledby="home-trust-title">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <Eyebrow>{trust.eyebrow}</Eyebrow>
          <Heading as="h2" id="home-trust-title">
            {trust.title}
          </Heading>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <CredentialSeal kind="bceao" />
          <CredentialSeal kind="pciDss" />
        </div>
      </Container>
    </Section>
  );
}

/** S5 — Nos partenaires [paper]. Hidden while no partner is validated. */
export function HomePartners() {
  if (partners.length === 0) return null;
  return (
    <Section theme="paper" aria-labelledby="home-partners-title">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <Eyebrow>{partnersSection.eyebrow}</Eyebrow>
          <Heading as="h2" id="home-partners-title">
            {partnersSection.title}
          </Heading>
        </div>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner) => (
            <li key={partner.name} className="grid h-24 place-items-center rounded-lg bg-mist p-4">
              <Photo
                slot={partner.logo}
                sizes="200px"
                alt={partner.name}
                className="max-h-12 w-auto grayscale transition-[filter] duration-(--dur-ui) hover:grayscale-0"
              />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
