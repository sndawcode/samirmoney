import Link from "next/link";
import { products, productsSection, type Product } from "@/content/fr/products";
import { eventClasses } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { frTypo } from "@/lib/fr-typography";
import { ProductVisual } from "@/components/product/product-visual";
import { TileInteractions } from "@/components/product/tile-interactions";
import { Photo } from "@/components/ui/photo";

const TILE_SIZES = "(min-width: 1024px) 33vw, 50vw";

/** Home S1: the six solutions, visible immediately, each one link (§9.1-S1). */
export function ProductBento() {
  return (
    <TileInteractions>
      <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3">
        {products.map((product, i) => (
          <ProductTile key={product.id} product={product} order={i} />
        ))}
      </ul>
    </TileInteractions>
  );
}

function ProductTile({ product, order }: { product: Product; order: number }) {
  return (
    <li
      data-tile
      data-product={product.id}
      style={{ animationDelay: `calc(${order} * var(--stagger))` }}
      className="tile-enter"
    >
      <Link
        href={product.href}
        className={cn(
          "group/tile tile-spotlight relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(180deg,var(--color-ink-800),var(--color-ink-900)_60%)] p-3 shadow-[inset_0_1px_0_rgb(255_255_255/0.07),0_24px_48px_-24px_rgb(0_0_0/0.6)] sm:p-5",
          "transition-[transform,border-color] duration-(--dur-ui) ease-(--ease-out-expo) hover:-translate-y-1 hover:border-white/25",
          eventClasses("product_tile_click", { product: product.id }),
        )}
      >
        {/* Full-bleed media on top: the client's photo, or the product visual (API code card). */}
        <div className="relative -mx-3 -mt-3 mb-3 aspect-[3/2] overflow-hidden border-b border-white/10 bg-ink-800 sm:-mx-5 sm:-mt-5 sm:mb-4">
          {product.photo ? (
            <Photo
              slot={product.photo}
              sizes={TILE_SIZES}
              alt=""
              className="h-full w-full object-cover transition-transform duration-(--dur-reveal) ease-(--ease-out-expo) motion-safe:group-hover/tile:scale-[1.04]"
            />
          ) : (
            <div className="tile-parallax flex h-full items-center justify-center pt-6 sm:p-6">
              {/* Phones: lay the visual out at desktop width, then scale it down to fit the small tile. */}
              <ProductVisual
                product={product}
                sizes={TILE_SIZES}
                className="w-[260px] shrink-0 scale-[0.46] sm:w-full sm:scale-100"
              />
            </div>
          )}
          <span className="absolute top-2 left-2 rounded-full bg-ink-950/70 px-2.5 py-1.5 text-eyebrow text-white backdrop-blur-sm sm:top-3 sm:left-3">
            {product.index}
          </span>
        </div>
        <h3 className="text-base font-extrabold tracking-tight sm:text-xl">{product.name}</h3>
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
