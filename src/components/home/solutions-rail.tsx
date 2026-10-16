import {
  Braces,
  CreditCard,
  KeyRound,
  LayoutDashboard,
  Smartphone,
  Store,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { products, productsSection, type ProductId } from "@/content/fr/products";
import { eventClasses } from "@/lib/analytics";
import { cn } from "@/lib/cn";

// A generic pictogram per solution (no product imagery here: the real visuals are in the bento below).
const ICONS: Record<ProductId, LucideIcon> = {
  "samir-money": Smartphone,
  tpe: CreditCard,
  business: Store,
  "web-admin": LayoutDashboard,
  raps: KeyRound,
  api: Braces,
};

/**
 * Bottom of the full-screen hero: the six solutions, named and one click away, so the brief's priority
 * ("comprendre nos solutions dès son arrivée") holds on the first screen. Scrolls sideways on phones.
 */
export function SolutionsRail({ className }: { className?: string }) {
  return (
    <nav aria-label={productsSection.eyebrow} className={cn("hero-enter [--d:520ms]", className)}>
      <ul className="-mx-(--gutter) flex snap-x [scrollbar-width:none] gap-2 overflow-x-auto px-(--gutter) pb-1 lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-0 lg:overflow-visible lg:rounded-xl lg:border lg:border-white/10 lg:bg-ink-950/45 lg:px-0 lg:pb-0 lg:backdrop-blur-md">
        {products.map((product) => {
          const Icon = ICONS[product.id];
          return (
            <li
              key={product.id}
              className="shrink-0 snap-start lg:border-l lg:border-white/10 lg:first:border-l-0"
            >
              <Link
                href={product.href}
                className={cn(
                  "group flex min-h-16 min-w-44 items-center gap-3 rounded-lg border border-white/10 bg-ink-950/50 px-4 py-3 backdrop-blur-md transition-colors duration-(--dur-ui)",
                  "hover:border-white/25 hover:bg-white/5 lg:h-full lg:min-w-0 lg:rounded-none lg:border-0 lg:bg-transparent lg:px-5 lg:py-4 lg:backdrop-blur-none",
                  eventClasses("product_tile_click", { product: product.id }),
                )}
              >
                <Icon
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-5 shrink-0 text-accent"
                />
                <span className="flex min-w-0 flex-col">
                  <span className="text-eyebrow text-smoke">{product.index}</span>
                  <span className="mt-1 text-sm leading-tight font-semibold text-white">
                    {product.name}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
