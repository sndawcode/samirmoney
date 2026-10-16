import Link from "next/link";
import { productById, type ProductId } from "@/content/fr/products";
import { ui } from "@/content/fr/ui";
import { frTypo } from "@/lib/fr-typography";
import { Container, Section } from "@/components/ui/section";

/** "Next product" link at the end of every product page — no dead ends (§8.3). */
export function NextProduct({ id }: { id: ProductId }) {
  const product = productById(id);
  return (
    <Section theme="paper" spacing="compact">
      <Container>
        <Link
          href={product.href}
          className="group flex flex-col gap-2 border-t border-ink-950/10 pt-8 md:flex-row md:items-end md:justify-between"
        >
          <span className="flex flex-col gap-2">
            <span className="text-eyebrow text-graphite">
              {ui.nextProduct} · {product.index}
            </span>
            <span className="text-h2">{product.name}</span>
            <span className="text-graphite">{frTypo(product.tagline)}</span>
          </span>
          <span
            aria-hidden="true"
            className="text-h2 transition-transform duration-(--dur-ui) group-hover:translate-x-2"
          >
            →
          </span>
        </Link>
      </Container>
    </Section>
  );
}
