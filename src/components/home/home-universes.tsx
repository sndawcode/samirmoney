import Link from "next/link";
import type { CSSProperties } from "react";
import {
  universes,
  universesSection,
  type FloatingService,
  type Universe,
} from "@/content/fr/universes";
import { eventClasses } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { frTypo } from "@/lib/fr-typography";
import { UniversesMotion } from "@/components/home/universes-controls";
import { StoreBadges } from "@/components/ui/store-badges";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/section";
import { Photo } from "@/components/ui/photo";

// Where each service label floats, in % of the stage. `side` anchors the label so it never runs past the
// card edge: "l" = its left edge at x, "r" = its right edge at x, "c" = centred on x.
type Spot = { x: number; y: number; side: "l" | "r" | "c" };

const SPOTS: Record<Universe["id"], readonly Spot[]> = {
  // SamirPay: the terminal sits bottom-left, so the services fill the right side, staggered.
  samirpay: [
    { x: 54, y: 10, side: "l" },
    { x: 96, y: 21, side: "r" },
    { x: 60, y: 32, side: "l" },
    { x: 96, y: 43, side: "r" },
    { x: 62, y: 54, side: "l" },
    { x: 96, y: 65, side: "r" },
    { x: 64, y: 76, side: "l" },
    { x: 96, y: 87, side: "r" },
  ],
  // Samir Money: the phone sits centred and low; services on both sides and across the top.
  "samir-money": [
    { x: 4, y: 8, side: "l" },
    { x: 50, y: 4, side: "c" },
    { x: 96, y: 8, side: "r" },
    { x: 4, y: 24, side: "l" },
    { x: 96, y: 24, side: "r" },
    { x: 4, y: 39, side: "l" },
    { x: 96, y: 39, side: "r" },
    { x: 4, y: 54, side: "l" },
    { x: 96, y: 54, side: "r" },
    { x: 4, y: 69, side: "l" },
    { x: 96, y: 69, side: "r" },
    { x: 4, y: 84, side: "l" },
    { x: 96, y: 84, side: "r" },
    { x: 50, y: 16, side: "c" },
  ],
};

/**
 * Home, right below the hero (client decision, 17 Oct 2026): SamirPay and Samir Money as two framed product
 * cards, each with a large device image cropped by the card edges and its services floating around it.
 * Labels are real links; the floating pauses on hover, on focus, with each card's pause button (WCAG 2.2.2)
 * and while off-screen, and stops with reduced motion.
 */
export function HomeUniverses() {
  return (
    <Section
      theme="paper"
      data-universes
      aria-labelledby="home-universes-title"
      className="z-10 -mt-8 overflow-x-clip rounded-t-[32px] motion-reduce:mt-0 motion-reduce:rounded-none"
    >
      <UniversesMotion />
      <Container width="media" className="flex flex-col gap-10 lg:gap-14">
        <div
          data-gsap="rise"
          className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end lg:gap-8"
        >
          <div className="flex flex-col gap-4 lg:col-span-7">
            <Eyebrow>{universesSection.eyebrow}</Eyebrow>
            <Heading as="h2" id="home-universes-title">
              {universesSection.title}
            </Heading>
          </div>
          <p className="max-w-[36ch] text-lead text-graphite lg:col-span-5 lg:justify-self-end">
            {frTypo(universesSection.lead)}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {universes.map((universe) => (
            <UniverseCard key={universe.id} universe={universe} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function UniverseCard({ universe }: { universe: Universe }) {
  const ink = universe.tone === "ink";
  return (
    <article
      data-gsap="rise"
      data-universe
      data-tone={universe.tone}
      data-theme={ink ? "ink" : "paper"}
      className={cn(
        "universe-card group relative isolate flex flex-col overflow-hidden rounded-xl",
        ink ? "bg-ink-950 text-white" : "text-ink-950",
      )}
    >
      <div aria-hidden="true" className="universe-card-bg absolute inset-0 -z-10" />
      <header className="relative z-10 flex flex-col items-start gap-4 p-6 sm:flex-row sm:justify-between sm:p-8">
        <div className="flex flex-col gap-3">
          <h3 className="text-h3">{universe.name}</h3>
          <ButtonLink
            href={universe.cta.href}
            variant="link"
            arrow
            location={`home-universes-${universe.id}`}
            className="self-start"
          >
            {universe.cta.label}
          </ButtonLink>
        </div>
        {universe.action.kind === "contact" ? (
          <ButtonLink
            href={universe.action.href}
            size="sm"
            location={`home-universes-${universe.id}-contact`}
            className="shrink-0"
          >
            {universe.action.label}
          </ButtonLink>
        ) : (
          <StoreBadges app="samirMoney" className="shrink-0 sm:justify-end" />
        )}
      </header>
      <div
        data-universe-stage
        data-layout={universe.id}
        className="universe-stage relative aspect-[1/0.95] w-full"
      >
        <div aria-hidden="true" className="universe-glow absolute inset-0" />
        <div className="universe-device">
          <Photo
            slot={universe.media}
            sizes="(min-width: 1024px) 34vw, 80vw"
            className="h-auto w-full"
          />
        </div>
        <ul aria-label={universesSection.servicesOf(universe.name)} className="contents">
          {universe.services.map((service, i) => (
            <FloatingLabel
              key={service.label}
              service={service}
              spot={SPOTS[universe.id][i]}
              index={i}
              universe={universe.id}
            />
          ))}
        </ul>
      </div>
    </article>
  );
}

function FloatingLabel({
  service,
  spot,
  index,
  universe,
}: {
  service: FloatingService;
  spot: Spot | undefined;
  index: number;
  universe: string;
}) {
  if (!spot) throw new Error(`No floating spot for service ${index} of ${universe}`);
  const position: CSSProperties =
    spot.side === "r"
      ? { right: `${100 - spot.x}%`, top: `${spot.y}%` }
      : { left: `${spot.x}%`, top: `${spot.y}%` };
  return (
    <li
      className="float-item"
      data-side={spot.side}
      style={{ ...position, "--i": index } as CSSProperties}
    >
      <Link
        href={service.href}
        className={cn(
          "float-chip",
          eventClasses("cta_click", {
            location: `home-universe-${universe}`,
            label: service.label,
          }),
        )}
      >
        {/* Non-breaking hyphens: "PI-SPI" never splits when a label wraps. */}
        <span>{frTypo(service.label).replace(/-/g, "‑")}</span>
      </Link>
    </li>
  );
}
