import { homeHero } from "@/content/fr/home";
import { productsSection } from "@/content/fr/products";
import { EcosystemCanvas } from "@/components/home/ecosystem/ecosystem-canvas";
import { KineticHeadline } from "@/components/motion/kinetic-headline";
import { ProductBento } from "@/components/product/product-bento";
import { Container, Eyebrow, Lead, Section } from "@/components/ui/section";

/** Home S1 — understand the ecosystem in 5 s; the six solutions visible immediately (§9.1-S1). */
export function HomeIntro() {
  return (
    <Section
      theme="ink"
      texture
      spacing="none"
      data-home-intro
      aria-labelledby="home-intro-title"
      className="pt-[calc(var(--header-h)+2rem)] pb-16 lg:pt-[calc(var(--header-h)+2.5rem)] lg:pb-24"
    >
      {/* Static background: what everyone sees first, and what stays if WebGL is unavailable. */}
      <div
        aria-hidden="true"
        className="ambient-glow pointer-events-none absolute -top-1/3 left-1/3 -z-20 size-[80vmax]"
      />
      <EcosystemCanvas />
      {/* Scrim: keeps the headline and lead at AA contrast over the scene. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[min(100svh,880px)] bg-[linear-gradient(200deg,transparent_5%,rgb(5_8_7/0.55)_32%,var(--color-ink-950)_58%)] lg:bg-[linear-gradient(90deg,var(--color-ink-950)_30%,rgb(5_8_7/0.4)_58%,transparent_75%)]"
      />
      <Container data-gsap-stack width="media" className="flex flex-col gap-8 lg:gap-10">
        <div data-hero-copy className="flex max-w-[44rem] flex-col gap-5">
          <KineticHeadline
            as="h1"
            id="home-intro-title"
            lines={homeHero.titleLines}
            highlight={homeHero.highlight}
            className="text-[clamp(2.5rem,0.9rem+3.8vw,4.5rem)] leading-[0.95] font-extrabold tracking-[-0.03em] lg:[&_.kinetic-line]:whitespace-nowrap"
          />
          <Lead className="max-w-[38rem] text-base text-smoke sm:text-lg">{homeHero.lead}</Lead>
        </div>
        <ProductBento heading={<Eyebrow as="h2">{productsSection.eyebrow}</Eyebrow>} />
      </Container>
    </Section>
  );
}
