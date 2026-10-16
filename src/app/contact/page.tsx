import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { contactPage as page } from "@/content/fr/contact";
import { site } from "@/content/fr/site";
import { ui } from "@/content/fr/ui";
import { eventClasses } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { frTypo } from "@/lib/fr-typography";
import { breadcrumbJsonLd, JsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/forms/contact-form";
import { KineticHeadline } from "@/components/motion/kinetic-headline";
import { Address } from "@/components/ui/address";
import { WhatsAppButton } from "@/components/ui/contact-links";
import { Container, Lead, Section } from "@/components/ui/section";

export const metadata: Metadata = pageMetadata("/contact");

const MAP = { src: "/media/brand/contact-map.webp", width: 960, height: 640 };
const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${site.address.geo.lat},${site.address.geo.lng}`;

export default function ContactPage() {
  return (
    <>
      <Section
        theme="paper"
        spacing="none"
        className="pt-[calc(var(--header-h)+3rem)] pb-(--section-y) lg:pt-[calc(var(--header-h)+5rem)]"
      >
        <Container className="flex flex-col gap-12">
          <div className="flex flex-col gap-6">
            <KineticHeadline as="h1" lines={[page.title]} className="max-w-[16ch] text-display-l" />
            <Lead>{page.lead}</Lead>
          </div>
          <WhatsAppButton
            prefill={page.whatsappPrefill}
            page="contact"
            className="self-start lg:hidden"
          />
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
            <aside
              aria-labelledby="contact-details-title"
              className="flex flex-col gap-6 lg:col-span-5"
            >
              <WhatsAppButton
                prefill={page.whatsappPrefill}
                page="contact"
                className="hidden self-start lg:inline-flex"
              />
              <h2 id="contact-details-title" className="text-eyebrow text-graphite">
                {page.details.title}
              </h2>
              <dl className="flex flex-col divide-y divide-ink-950/10 border-y border-ink-950/10">
                <Detail label={page.details.phone}>
                  <a
                    href={`tel:${site.phone.e164}`}
                    className={cn(linkClasses, eventClasses("phone_click"))}
                  >
                    {site.phone.display}
                  </a>
                </Detail>
                <Detail label={page.details.email}>
                  <a
                    href={`mailto:${site.email}`}
                    className={cn(linkClasses, eventClasses("email_click"))}
                  >
                    {site.email}
                  </a>
                </Detail>
                <Detail label={page.details.address}>
                  <Address />
                </Detail>
                {site.openingHours && (
                  <Detail label={page.details.hours}>{site.openingHours}</Detail>
                )}
              </dl>
              <figure className="flex flex-col gap-2">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-lg"
                >
                  <Image
                    src={MAP.src}
                    width={MAP.width}
                    height={MAP.height}
                    alt={page.details.mapAlt}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="h-auto w-full transition-transform duration-(--dur-ui) group-hover:scale-[1.02]"
                  />
                  <span className="sr-only">
                    {page.details.directions} ({ui.newTab})
                  </span>
                </a>
                <figcaption className="flex items-center justify-between gap-4 text-xs text-graphite">
                  <span>{page.details.mapAttribution}</span>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(linkClasses, "text-sm")}
                  >
                    {page.details.directions}
                    <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
                    <span className="sr-only">({ui.newTab})</span>
                  </a>
                </figcaption>
              </figure>
              <p className="rounded-lg bg-mist p-5 text-sm text-graphite">
                {frTypo(page.supportNote)}
              </p>
            </aside>
          </div>
        </Container>
      </Section>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: ui.breadcrumbHome, path: "/" },
          { name: page.breadcrumb, path: "/contact" },
        ])}
      />
    </>
  );
}

const linkClasses =
  "inline-flex min-h-11 items-center gap-1 text-samir-700 underline-offset-4 hover:underline";

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-6">
      <dt className="w-28 shrink-0 pt-1 text-eyebrow text-graphite">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
