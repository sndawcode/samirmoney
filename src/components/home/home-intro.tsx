import { homeHero } from "@/content/fr/home";
import { productsSection } from "@/content/fr/products";
import { EcosystemCanvas } from "@/components/home/ecosystem/ecosystem-canvas";
import { KineticHeadline } from "@/components/motion/kinetic-headline";
import { ProductBento } from "@/components/product/product-bento";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, Lead, Section } from "@/components/ui/section";

/**
 * Home S1, one dark chapter: a full-screen hero (headline, lead, CTAs and the 3D ecosystem), then the bento
 * with the six solutions and their real visuals (§9.1-S1, client decisions 16 Oct 2026).
 */
export function HomeIntro() {
  return (
    <Section theme="ink" texture spacing="none" aria-labelledby="home-intro-title">
      <div data-hero className="relative isolate flex min-h-[100svh] flex-col pt-(--header-h)">
        {/* Static background first; the WebGL scene fades in over it once the page is idle. */}
        <div
          aria-hidden="true"
          className="ambient-glow pointer-events-none absolute top-1/4 left-1/2 -z-20 size-[90vmax] -translate-x-1/2 -translate-y-1/2 lg:top-1/2 lg:left-[76%]"
        />
        <EcosystemCanvas />
        {/* Scrims keep the copy at AA contrast over the scene: bottom-up on phones, left-to-right on desktop. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_22%,rgb(5_8_7/0.7)_48%,var(--color-ink-950)_70%)] lg:bg-[linear-gradient(90deg,var(--color-ink-950)_22%,rgb(5_8_7/0.55)_46%,transparent_66%)]"
        />
        {/* Vignette and a soft floor so the hero melts into the bento below. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_60%_40%,transparent_55%,rgb(5_8_7/0.85)_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-ink-950"
        />

        {/* The copy owns the whole screen: centred beside the globe on desktop, under it on phones. */}
        <Container
          width="media"
          data-gsap="hero-out"
          className="flex flex-1 flex-col justify-end pt-10 pb-24 sm:pb-28 lg:justify-center lg:pt-0 lg:pb-20"
        >
          <div className="flex max-w-[42rem] flex-col items-start gap-6 lg:gap-8">
            <KineticHeadline
              as="h1"
              id="home-intro-title"
              lines={homeHero.titleLines}
              highlight={homeHero.highlight}
              className="hero-legible text-[clamp(2.5rem,1rem+4vw,5.25rem)] leading-[0.92] font-extrabold tracking-[-0.035em] lg:[&_.kinetic-line]:whitespace-nowrap"
            />
            <Lead className="hero-enter hero-legible max-w-[34rem] text-base text-smoke [--d:280ms] sm:text-lg xl:text-xl">
              {homeHero.lead}
            </Lead>
            <div className="hero-enter flex flex-wrap gap-2.5 pt-1 [--d:400ms] sm:gap-3">
              <span data-magnetic className="inline-flex">
                <ButtonLink
                  href={homeHero.primary.href}
                  arrow
                  location="home-hero"
                  className="max-sm:min-h-11 max-sm:px-4 max-sm:text-sm"
                >
                  {homeHero.primary.label}
                </ButtonLink>
              </span>
              <span data-magnetic className="inline-flex">
                <ButtonLink
                  href={homeHero.secondary.href}
                  variant="secondary"
                  location="home-hero"
                  className="max-sm:min-h-11 max-sm:px-4 max-sm:text-sm"
                >
                  {homeHero.secondary.label}
                </ButtonLink>
              </span>
            </div>
          </div>
        </Container>

        <span
          aria-hidden="true"
          data-gsap="scroll-cue"
          className="hero-enter absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-eyebrow text-smoke [--d:700ms] lg:bottom-8"
        >
          {homeHero.scrollCue}
          <span className="scroll-cue-line" />
        </span>
      </div>

      <Container
        id="solutions"
        width="media"
        data-gsap-stack
        className="flex flex-col gap-8 pt-12 pb-16 lg:gap-10 lg:pt-16 lg:pb-24"
      >
        <ProductBento heading={<Eyebrow as="h2">{productsSection.eyebrow}</Eyebrow>} />
      </Container>
    </Section>
  );
}
