import type { Metadata } from "next";
import Link from "next/link";
import { nav, navLabel } from "@/content/fr/nav";
import { productById } from "@/content/fr/products";
import { servicesPage as page, type ServiceDetail } from "@/content/fr/services-page";
import { services, type Service } from "@/content/fr/services";
import { ui } from "@/content/fr/ui";
import { frTypo } from "@/lib/fr-typography";
import { breadcrumbJsonLd, JsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { LazyServiceScene } from "@/components/motion/lazy-service-scene";
import { KineticHeadline } from "@/components/motion/kinetic-headline";
import { LocalNav } from "@/components/product/local-nav";
import { ContactBand } from "@/components/ui/contact-band";
import { Placeholder } from "@/components/ui/placeholder";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/section";

export const metadata: Metadata = pageMetadata("/services");

const serviceById = (id: Service["id"]) => {
  const service = services.find((s) => s.id === id);
  if (!service) throw new Error(`Unknown service "${id}"`);
  return service;
};

const crossLinks = services.filter((s) => s.id === "api-integrations" || s.id === "paiement-nfc");

export default function ServicesPage() {
  return (
    <>
      <Section
        theme="paper"
        spacing="none"
        className="pt-[calc(var(--header-h)+3rem)] pb-12 lg:pt-[calc(var(--header-h)+5rem)] lg:pb-16"
      >
        <Container className="flex flex-col gap-6">
          <Eyebrow>{page.hero.eyebrow}</Eyebrow>
          <KineticHeadline
            as="h1"
            lines={[page.hero.title]}
            className="max-w-[14ch] text-display-l"
          />
        </Container>
      </Section>
      <LocalNav
        name={page.hero.eyebrow}
        links={page.details.map((d) => ({ label: serviceById(d.id).name, href: `#${d.id}` }))}
        cta={nav.cta}
      />
      {page.details.map((detail, i) => (
        <ServiceSection key={detail.id} detail={detail} theme={i % 2 === 0 ? "paper" : "mist"} />
      ))}
      <Section theme="paper" spacing="compact" aria-labelledby="services-more-title">
        <Container className="flex flex-col gap-6">
          <h2 id="services-more-title" className="text-eyebrow text-graphite">
            {page.crossLinks.title}
          </h2>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {crossLinks.map((service) => (
              <li key={service.id}>
                <Link
                  href={service.href}
                  className="group flex h-full flex-col gap-3 rounded-lg bg-mist p-6 transition-colors hover:bg-fog"
                >
                  <span className="text-h3">{frTypo(service.name)}</span>
                  <span className="text-graphite">{frTypo(service.line)}</span>
                  <span
                    aria-hidden="true"
                    className="mt-auto text-samir-700 transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <ContactBand location="services" />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: ui.breadcrumbHome, path: "/" },
          { name: navLabel("/services"), path: "/services" },
        ])}
      />
    </>
  );
}

function ServiceSection({ detail, theme }: { detail: ServiceDetail; theme: "paper" | "mist" }) {
  const service = serviceById(detail.id);
  const titleId = `${detail.id}-title`;
  return (
    <Section theme={theme} id={detail.id} aria-labelledby={titleId}>
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-6">
          <Heading as="h2" id={titleId}>
            {service.name}
          </Heading>
          <p className="max-w-[40ch] text-lead text-graphite">{frTypo(service.line)}</p>
          {detail.note && <p className="font-mono text-sm text-graphite">{frTypo(detail.note)}</p>}
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <dt className="text-eyebrow text-graphite">{page.labels.audience}</dt>
              <dd>{frTypo(detail.audience)}</dd>
            </div>
            <div className="flex flex-col gap-2">
              <dt className="text-eyebrow text-graphite">{page.labels.products}</dt>
              <dd>
                <ul className="flex flex-wrap gap-2">
                  {detail.products.map((id) => {
                    const product = productById(id);
                    return (
                      <li key={id}>
                        <Link
                          href={product.href}
                          className="inline-flex min-h-11 items-center rounded-full border border-ink-950/15 px-4 text-sm font-medium hover:border-ink-950"
                        >
                          {product.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </dd>
            </div>
          </dl>
          <div className="flex flex-col gap-4">
            <h3 className="text-eyebrow text-graphite">{page.labels.how}</h3>
            <ol className="flex flex-col gap-3">
              {detail.steps.map((step, i) => (
                <li key={step} className="flex items-baseline gap-4">
                  <span className="font-mono text-sm text-samir-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lg">{frTypo(step)}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:col-span-6">
          <LazyServiceScene id={detail.id} className={theme === "mist" ? "bg-paper" : undefined} />
          <Placeholder label={detail.photo.placeholder} ratio={detail.photo.ratio} />
        </div>
      </Container>
    </Section>
  );
}
