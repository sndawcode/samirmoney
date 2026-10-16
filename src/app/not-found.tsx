import Link from "next/link";
import { Check } from "lucide-react";
import { products } from "@/content/fr/products";
import { notFoundPage as page } from "@/content/fr/ui";
import { frTypo } from "@/lib/fr-typography";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";

export default function NotFound() {
  return (
    <Section
      theme="ink"
      texture
      spacing="none"
      className="min-h-[80vh] pt-[calc(var(--header-h)+4rem)] pb-(--section-y)"
    >
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="flex flex-col items-start gap-6 lg:col-span-7">
          <p
            aria-hidden="true"
            className="text-[clamp(5rem,4rem+8vw,12rem)] leading-none text-accent"
          >
            {page.code}
          </p>
          <h1 className="text-h2">{frTypo(page.title)}</h1>
          <p className="text-lead text-smoke">{frTypo(page.lead)}</p>
          <ul className="flex flex-wrap gap-2">
            {products.map((product) => (
              <li key={product.id}>
                <Link
                  href={product.href}
                  className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-4 text-sm hover:border-white"
                >
                  {product.name}
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink href="/" arrow location="404">
            {page.home}
          </ButtonLink>
        </div>
        <div aria-hidden="true" className="lg:col-span-5">
          <div className="mx-auto max-w-[300px] rounded-sm bg-paper p-6 text-sm text-ink-950 shadow-2xl">
            <p className="text-eyebrow text-graphite">{page.receipt.title}</p>
            <dl className="mt-4 flex flex-col gap-2 border-y border-dashed border-ink-950/30 py-4">
              {page.receipt.rows.map((row) => (
                <div key={row.label} className="flex justify-between gap-4">
                  <dt>{row.label}</dt>
                  <dd>{frTypo(row.value)}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 flex items-center gap-2">
              <Check className="size-4 text-samir-700" strokeWidth={2.5} />
              {frTypo(page.receipt.status)}
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
