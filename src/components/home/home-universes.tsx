import {
  ArrowLeftRight,
  BadgePercent,
  Braces,
  CreditCard,
  Fuel,
  Gift,
  HandCoins,
  KeyRound,
  Layers,
  LayoutDashboard,
  Link2,
  PiggyBank,
  QrCode,
  Receipt,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Store,
  Users,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import {
  universes,
  universesSection,
  type OrbitService,
  type ServiceIcon,
  type Universe,
} from "@/content/fr/universes";
import { eventClasses } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { frTypo } from "@/lib/fr-typography";
import { OrbitPauseButton, UniversesMotion } from "@/components/home/universes-controls";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/section";
import { Photo } from "@/components/ui/photo";

const ICONS: Record<ServiceIcon, LucideIcon> = {
  ArrowLeftRight,
  BadgePercent,
  Braces,
  CreditCard,
  Fuel,
  Gift,
  HandCoins,
  KeyRound,
  Layers,
  LayoutDashboard,
  Link2,
  PiggyBank,
  QrCode,
  Receipt,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Store,
  Users,
  Wallet,
  Zap,
};

// Two rings per device: inner (closer, flatter, slower) and outer (wider, steeper, reversed).
const RINGS = [
  { radius: "33cqi", tilt: "-24deg", roll: "7deg", lift: "-6cqi", duration: "48s", reverse: false },
  { radius: "44cqi", tilt: "-30deg", roll: "-6deg", lift: "4cqi", duration: "64s", reverse: true },
] as const;

/**
 * Home, right below the hero (client decision, 17 Oct 2026): SamirPay and Samir Money as two framed product
 * cards, each device bleeding off the bottom of its card with its services orbiting on visible 3D tracks.
 * Labels are real links; the orbit pauses on hover, on focus, with each card's pause button (WCAG 2.2.2)
 * and while off-screen, and becomes tidy rows with reduced motion.
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
      <header className="flex items-start justify-between gap-4 p-6 sm:p-8">
        <div className="flex flex-col gap-3">
          <p className="text-eyebrow text-graphite ink:text-smoke">
            {universe.index} — {universe.name}
          </p>
          <h3 className="text-h3">{universe.name}</h3>
          <p className="text-graphite ink:text-smoke">{frTypo(universe.subtitle)}</p>
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
        <OrbitPauseButton pauseLabel={universesSection.pause} playLabel={universesSection.play} />
      </header>
      <div
        data-universe-stage
        className="universe-stage relative -mt-20 aspect-[1/0.9] w-full sm:-mt-24"
      >
        <div
          aria-hidden="true"
          className="universe-glow absolute inset-x-[10%] top-[8%] bottom-[-20%] rounded-full"
        />
        <div className="universe-scene absolute inset-0">
          {/* Orbit paths on their own flat layer: a 3D plane through the labels would slice them. */}
          <div aria-hidden="true" className="orbit-tracks">
            {RINGS.map((ring, r) => (
              <span key={r} className="orbit-track" style={ringStyle(ring)} />
            ))}
          </div>
          <div className="universe-device">
            <Photo
              slot={universe.media}
              sizes="(min-width: 1024px) 24vw, 52vw"
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
    </article>
  );
}

function ringStyle(ring: (typeof RINGS)[number]): CSSProperties {
  return {
    "--r": ring.radius,
    "--tilt": ring.tilt,
    "--roll": ring.roll,
    "--lift": ring.lift,
    "--dur": ring.duration,
  } as CSSProperties;
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
    <div
      className="orbit-ring"
      data-reverse={ring.reverse ? "" : undefined}
      style={{ ...ringStyle(ring), "--n": services.length } as CSSProperties}
    >
      <ul className="orbit-list">
        {services.map((service, i) => {
          const Icon = ICONS[service.icon];
          return (
            <li
              key={service.label}
              className="orbit-item"
              style={{ "--a": `${(360 / services.length) * i}deg`, "--i": i } as CSSProperties}
            >
              <Link
                href={service.href}
                className={cn(
                  "orbit-chip",
                  eventClasses("cta_click", {
                    location: `home-orbit-${universe}`,
                    label: service.label,
                  }),
                )}
              >
                <Icon aria-hidden="true" className="orbit-chip-icon" strokeWidth={1.75} />
                {/* Non-breaking hyphens: "PI-SPI" never splits when a label wraps. */}
                <span>{frTypo(service.label).replace(/-/g, "‑")}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
