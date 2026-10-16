import type { ReactNode } from "react";
import type { SectionTheme } from "@/content/types";
import { KineticHeadline } from "@/components/motion/kinetic-headline";
import { Container, Eyebrow, Lead, Section } from "@/components/ui/section";

type ProductHeroProps = {
  theme: SectionTheme;
  eyebrow: string;
  title: string;
  lead: string;
  actions?: ReactNode;
  visual: ReactNode;
  id?: string;
};

/** Product page opening: huge product name (H1), lead, CTAs, hero visual (§7). */
export function ProductHero({
  theme,
  eyebrow,
  title,
  lead,
  actions,
  visual,
  id,
}: ProductHeroProps) {
  return (
    <Section
      theme={theme}
      texture={theme === "ink"}
      spacing="none"
      id={id}
      className="pt-[calc(var(--header-h)+3rem)] pb-16 lg:pt-[calc(var(--header-h)+5rem)] lg:pb-24"
    >
      <Container width="media" className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="flex flex-col items-start gap-6 lg:col-span-6">
          <Eyebrow>{eyebrow}</Eyebrow>
          <KineticHeadline as="h1" lines={[title]} className="text-display-l" />
          <Lead>{lead}</Lead>
          {actions}
        </div>
        <div className="lg:col-span-6">{visual}</div>
      </Container>
    </Section>
  );
}
