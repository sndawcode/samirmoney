import Link from "next/link";
import type { CSSProperties } from "react";
import {
  universes,
  universesSection,
  type OrbitService,
  type Universe,
} from "@/content/fr/universes";
import { eventClasses } from "@/lib/analytics";
import { frTypo } from "@/lib/fr-typography";
import { UniversesControls } from "@/components/home/universes-controls";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/section";
import { Photo } from "@/components/ui/photo";

// Two rings per device: inner (closer, flatter, slower) and outer (wider, steeper, reversed).
const RINGS = [
  {
    radius: "34cqi",
    tilt: "-28deg",
    roll: "8deg",
    lift: "-16cqi",
    duration: "48s",
    reverse: false,
  },
  { radius: "44cqi", tilt: "-34deg", roll: "-6deg", lift: "14cqi", duration: "64s", reverse: true },
] as const;

/**
 * Home, right below the hero (client decision, 17 Oct 2026): SamirPay and Samir Money, each device with its
 * services orbiting in CSS 3D. Labels are real links; the orbit pauses on hover, on focus and with the
 * section's pause button (WCAG 2.2.2), and stands still with reduced motion.
 */
export function HomeUniverses() {
  return (
    <Section
      theme="paper"
      data-universes
      aria-labelledby="home-universes-title"
      className="z-10 -mt-8 overflow-x-clip rounded-t-[32px] motion-reduce:mt-0 motion-reduce:rounded-none"
    >
      <Container width="media" className="flex flex-col gap-12 lg:gap-16">
        <div data-gsap="rise" className="flex flex-col items-center gap-4 text-center">
          <Eyebrow>{universesSection.eyebrow}</Eyebrow>
          <Heading as="h2" id="home-universes-title">
            {universesSection.title}
          </Heading>
          <UniversesControls
            pauseLabel={universesSection.pause}
            playLabel={universesSection.play}
          />
        </div>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-8">
          {universes.map((universe) => (
            <UniverseColumn key={universe.id} universe={universe} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function UniverseColumn({ universe }: { universe: Universe }) {
  return (
    <article data-gsap="rise" className="flex flex-col items-center gap-6 text-center">
      <div className="flex flex-col gap-2">
        <h3 className="text-h2">{universe.name}</h3>
        <p className="text-lead text-graphite">{frTypo(universe.subtitle)}</p>
      </div>
      <div
        data-universe-stage
        className="universe-stage relative aspect-[1/1.05] w-full max-w-[600px]"
      >
        <div aria-hidden="true" className="universe-glow absolute inset-[12%] rounded-full" />
        <div className="universe-scene absolute inset-0">
          <div className="universe-device">
            <Photo
              slot={universe.media}
              sizes="(min-width: 1024px) 22vw, 44vw"
              className="h-auto w-full"
            />
          </div>
          {/* One named group for both rings (display: contents keeps the 3D chain intact). */}
          <div
            role="group"
            aria-label={universesSection.servicesOf(universe.name)}
            className="contents"
          >
            {universe.rings.map((services, r) => (
              <OrbitRing key={r} services={services} ring={RINGS[r]} universe={universe.id} />
            ))}
          </div>
        </div>
      </div>
      <ButtonLink href={universe.cta.href} arrow location={`home-universes-${universe.id}`}>
        {universe.cta.label}
      </ButtonLink>
    </article>
  );
}

function OrbitRing({
  services,
  ring,
  universe,
}: {
  services: readonly OrbitService[];
  ring: (typeof RINGS)[number];
  universe: string;
}) {
  return (
    <ul
      className="orbit-ring"
      data-reverse={ring.reverse ? "" : undefined}
      style={
        {
          "--r": ring.radius,
          "--tilt": ring.tilt,
          "--roll": ring.roll,
          "--lift": ring.lift,
          "--dur": ring.duration,
          "--n": services.length,
        } as CSSProperties
      }
    >
      {services.map((service, i) => (
        <li
          key={service.label}
          className="orbit-item"
          style={{ "--a": `${(360 / services.length) * i}deg`, "--i": i } as CSSProperties}
        >
          <Link
            href={service.href}
            className={`orbit-chip ${eventClasses("cta_click", { location: `home-orbit-${universe}`, label: service.label })}`}
          >
            {/* Non-breaking hyphens: "PI-SPI" never splits when a label wraps. */}
            {frTypo(service.label).replace(/-/g, "\u2011")}
          </Link>
        </li>
      ))}
    </ul>
  );
}
