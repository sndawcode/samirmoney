import { homeHero } from "@/content/fr/home";
import { trust } from "@/content/fr/trust";
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
        {/* Depth: a flat ink base, the engineering grid fading out towards the edges, a soft top light. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-30 bg-ink-950" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-30 hairlines [mask-image:radial-gradient(70%_60%_at_60%_45%,black,transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-30 h-[60%] bg-[radial-gradient(60%_100%_at_50%_0%,rgb(255_255_255/0.06),transparent)]"
        />
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
          <div data-hero-copy className="flex max-w-[44rem] flex-col items-start gap-6 lg:gap-8">
            <CredentialPill />
            <KineticHeadline
              as="h1"
              id="home-intro-title"
              lines={homeHero.titleLines}
              highlight={homeHero.highlight}
              className="hero-legible text-[clamp(2.6rem,0.9rem+3.9vw,5.25rem)] leading-[0.9] font-extrabold tracking-[-0.04em] lg:[&_.kinetic-line]:whitespace-nowrap"
            />
            <Lead className="hero-enter hero-legible max-w-[35rem] text-base leading-relaxed text-white/70 [--d:280ms] sm:text-lg xl:text-xl ink:text-white/70">
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

/**
 * The licence, stated before anything else — built from trust.ts (§1.3), never retyped. Static and sober:
 * trust is never decorated (§5.2).
 */
function CredentialPill() {
  return (
    // From 640 px: the regulatory wording cannot be shortened (§15.3) and would wrap awkwardly on phones,
    // which still meet the licence in the trust section (S4).
    <p className="hero-enter hidden items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-2 text-[0.8125rem] leading-snug font-medium text-white/80 backdrop-blur-md [--d:120ms] sm:inline-flex">
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent" />
      <span>
        {trust.bceao.label}
        <span aria-hidden="true" className="mx-2 text-white/30">
          ·
        </span>
        <span className="whitespace-nowrap text-white">{trust.bceao.reference}</span>
      </span>
    </p>
  );
}
