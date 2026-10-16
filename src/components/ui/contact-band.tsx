import { contactBand } from "@/content/fr/home";
import { ContactLine } from "@/components/ui/contact-links";
import { ButtonLink } from "@/components/ui/button";
import { Container, Heading, Lead, Section } from "@/components/ui/section";

/**
 * Home S6 / end of every product page [ink] (§9.1-S6).
 * TODO: full-bleed merchant photo (Shoot – Marchands 2025) under a ≥ 70 % ink scrim once releases are confirmed.
 */
export function ContactBand({ location }: { location: string }) {
  return (
    <Section theme="ink" texture aria-labelledby={`contact-band-${location}`}>
      <div
        aria-hidden="true"
        data-gsap="parallax"
        data-speed="0.25"
        className="ambient-glow pointer-events-none absolute -bottom-1/2 left-1/3 -z-10 size-[70vmax]"
      />
      <Container className="flex flex-col items-start gap-8">
        <div data-gsap="rise" className="flex flex-col gap-8">
          <Heading
            as="h2"
            size="display-l"
            id={`contact-band-${location}`}
            className="max-w-[16ch]"
          >
            {contactBand.title}
          </Heading>
          <Lead className="text-smoke">{contactBand.lead}</Lead>
        </div>
        <div data-gsap="rise" className="flex flex-col gap-3 sm:flex-row">
          <span data-magnetic className="inline-flex">
            <ButtonLink href={contactBand.primary.href} arrow location={location}>
              {contactBand.primary.label}
            </ButtonLink>
          </span>
          <span data-magnetic className="inline-flex">
            <ButtonLink href={contactBand.secondary.href} variant="secondary" location={location}>
              {contactBand.secondary.label}
            </ButtonLink>
          </span>
        </div>
        <ContactLine className="text-smoke" />
      </Container>
    </Section>
  );
}
