import { homeHero } from "@/content/fr/home";
import { productsSection } from "@/content/fr/products";
import { EcosystemCanvas } from "@/components/home/ecosystem/ecosystem-canvas";
import { SolutionsRail } from "@/components/home/solutions-rail";
import { KineticHeadline } from "@/components/motion/kinetic-headline";
import { ProductBento } from "@/components/product/product-bento";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, Lead, Section } from "@/components/ui/section";

/**
 * Home S1, one dark chapter: a full-screen hero (headline, the 3D ecosystem, the six solutions in a rail),
 * then the bento with real product visuals (§9.1-S1, client decision 16 Oct 2026).
 */
export function HomeIntro() {
  return (
    <Section theme="ink" texture spacing="none" aria-labelledby="home-intro-title">
      <div data-hero className="relative isolate flex min-h-[100svh] flex-col pt-(--header-h)">
        {/* Static background first; the WebGL scene fades in over it once the page is idle. */}
        <div
          aria-hidden="true"
          className="ambient-glow pointer-events-none absolute top-1/4 left-1/2 -z-20 size-[90vmax] -translate-x-1/2 -translate-y-1/2 lg:top-[46%] lg:left-[76%]"
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

        <Container
          width="media"
          data-gsap="hero-out"
          className="flex flex-1 flex-col justify-end pt-8 pb-8 lg:justify-center lg:pt-0 lg:pb-12"
        >
          <div className="flex max-w-[40rem] flex-col items-start gap-6">
            <KineticHeadline
              as="h1"
              id="home-intro-title"
              lines={homeHero.titleLines}
              highlight={homeHero.highlight}
              className="hero-legible text-[clamp(2.75rem,1rem+4vw,5.25rem)] leading-[0.92] font-extrabold tracking-[-0.035em] lg:[&_.kinetic-line]:whitespace-nowrap"
            />
            <Lead className="hero-enter hero-legible max-w-[34rem] text-base text-smoke [--d:280ms] sm:text-lg">
              {homeHero.lead}
            </Lead>
            <div className="hero-enter flex flex-wrap gap-3 [--d:400ms]">
              <span data-magnetic className="inline-flex">
                <ButtonLink href={homeHero.primary.href} arrow location="home-hero">
                  {homeHero.primary.label}
                </ButtonLink>
              </span>
              {/* Phones: the solutions rail sits right below, so the secondary CTA would only add height. */}
              <span data-magnetic className="hidden sm:inline-flex">
                <ButtonLink href={homeHero.secondary.href} variant="secondary" location="home-hero">
                  {homeHero.secondary.label}
                </ButtonLink>
              </span>
            </div>
          </div>
        </Container>

        <Container width="media" className="flex flex-col gap-4 pb-5 lg:pb-8">
          <SolutionsRail />
          <span
            aria-hidden="true"
            data-gsap="scroll-cue"
            className="hero-enter mx-auto hidden items-center gap-3 text-eyebrow text-smoke [--d:700ms] lg:flex"
          >
            <span className="scroll-cue-line" />
            {homeHero.scrollCue}
          </span>
        </Container>
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
