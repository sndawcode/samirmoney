import { homeHero } from "@/content/fr/home";
import { productsSection } from "@/content/fr/products";
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
      aria-labelledby="home-intro-title"
      className="pt-[calc(var(--header-h)+2rem)] pb-16 lg:pt-[calc(var(--header-h)+3rem)] lg:pb-24"
    >
      <div
        aria-hidden="true"
        className="ambient-glow pointer-events-none absolute -top-1/3 left-1/4 -z-10 size-[80vmax]"
      />
      <Container width="media" className="flex flex-col gap-6 lg:gap-10">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end lg:gap-8">
          <KineticHeadline
            as="h1"
            id="home-intro-title"
            lines={homeHero.titleLines}
            highlight={homeHero.highlight}
            className="text-[clamp(2.5rem,0.9rem+4vw,4.75rem)] leading-[0.95] font-extrabold tracking-[-0.03em] lg:col-span-7 lg:[&_.kinetic-line]:whitespace-nowrap"
          />
          <Lead className="text-base text-smoke sm:text-lg lg:col-span-5 lg:max-w-none lg:text-xl">
            {homeHero.lead}
          </Lead>
        </div>
        <div className="flex flex-col gap-4">
          <Eyebrow as="h2">{productsSection.eyebrow}</Eyebrow>
          <ProductBento />
        </div>
      </Container>
    </Section>
  );
}
