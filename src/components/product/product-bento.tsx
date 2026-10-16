import Link from "next/link";
import { products, productsSection, type Product } from "@/content/fr/products";
import { eventClasses } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { frTypo } from "@/lib/fr-typography";
import { AudienceFilter } from "@/components/product/audience-filter";
import { ProductVisual } from "@/components/product/product-visual";

const TILE_SIZES = "(min-width: 1024px) 33vw, 50vw";
// The TPE cut-out is the largest image in the first row: the home LCP candidate (§13).
const LCP_PRODUCT = "tpe";

/** Home S1: the six solutions, visible immediately, each one link (§9.1-S1). */
export function ProductBento() {
  return (
    <AudienceFilter total={products.length}>
      <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3">
        {products.map((product, i) => (
          <ProductTile key={product.id} product={product} order={i} />
        ))}
      </ul>
    </AudienceFilter>
  );
}

function ProductTile({ product, order }: { product: Product; order: number }) {
  return (
    <li
      data-tile
      data-audiences={product.audiences.join(" ")}
      style={{ animationDelay: `calc(${order} * var(--stagger))` }}
      className="tile-enter transition-opacity duration-(--dur-ui)"
    >
      <Link
        href={product.href}
        className={cn(
          "group/tile tile-spotlight relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-ink-900 p-3 sm:p-5",
          "transition-[transform,border-color] duration-(--dur-ui) ease-(--ease-out-expo) hover:-translate-y-1 hover:border-white/25",
          eventClasses("product_tile_click", { product: product.id }),
        )}
      >
        <span className="text-eyebrow text-smoke">{product.index}</span>
        <div className="tile-parallax my-3 flex h-28 items-end justify-center sm:my-4 sm:h-44 lg:h-52 xl:h-60">
          <ProductVisual
            product={product}
            sizes={TILE_SIZES}
            eager={order < 3}
            preload={product.id === LCP_PRODUCT}
            className="h-full w-full"
          />
        </div>
        <h3 className="text-base font-semibold tracking-tight sm:text-xl">{product.name}</h3>
        <p className="mt-1 line-clamp-3 text-sm text-smoke sm:line-clamp-none sm:text-base">
          {frTypo(product.tagline)}
        </p>
        <span
          aria-hidden="true"
          className="mt-auto hidden items-center gap-2 pt-5 text-sm font-medium text-accent sm:inline-flex"
        >
          {productsSection.cta}
          <span className="transition-transform duration-(--dur-ui) group-hover/tile:translate-x-1">
            →
          </span>
        </span>
        <span className="sr-only">
          {" — "}
          {productsSection.cta}
        </span>
      </Link>
    </li>
  );
}
