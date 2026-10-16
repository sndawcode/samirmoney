import { ViewTransition } from "react";
import type { Product } from "@/content/fr/products";
import { cn } from "@/lib/cn";
import { ApiCodeCard } from "@/components/dev/api-code-card";
import { DeviceFrame } from "@/components/product/device-frame";
import { Photo } from "@/components/ui/photo";
import { Placeholder } from "@/components/ui/placeholder";

type ProductVisualProps = {
  product: Product;
  sizes: string;
  className?: string;
  eager?: boolean;
};

/**
 * The real visual of a product, framed the same way on the home tile and the product hero,
 * so the browser can morph one into the other (shared-element view transition, progressive).
 */
export function ProductVisual({ product, sizes, className, eager }: ProductVisualProps) {
  return (
    <ViewTransition name={`product-${product.id}`} share="morph" default="none">
      <div className={cn("relative flex items-end justify-center", className)}>
        <VisualFor product={product} sizes={sizes} eager={eager} />
      </div>
    </ViewTransition>
  );
}

function VisualFor({ product, sizes, eager }: Omit<ProductVisualProps, "className">) {
  switch (product.id) {
    case "api":
      return <ApiCodeCard />;
    case "samir-money":
    case "business":
      // Phones rise from the bottom edge: top of the screen visible, bottom faded (§5.3 "bold crops").
      return product.media ? (
        <div className="h-full w-full overflow-hidden [mask-image:linear-gradient(to_bottom,black_75%,transparent)]">
          <DeviceFrame kind="phone" className="mx-auto w-[min(78%,var(--phone-max,210px))]">
            <Photo slot={product.media} sizes={sizes} eager={eager} alt="" className="w-full" />
          </DeviceFrame>
        </div>
      ) : null;
    case "web-admin":
      return product.media ? (
        <DeviceFrame kind="browser" className="w-full">
          <Photo slot={product.media} sizes={sizes} eager={eager} alt="" className="w-full" />
        </DeviceFrame>
      ) : null;
    default:
      return product.media ? (
        <Photo
          slot={product.media}
          sizes={sizes}
          eager={eager}
          alt=""
          className="max-h-full w-auto object-contain drop-shadow-[0_24px_24px_rgb(0_0_0/0.35)]"
        />
      ) : (
        <Placeholder
          label={`Visuel ${product.name} (photo à fournir)`}
          ratio="4/5"
          className="max-h-full w-auto"
        />
      );
  }
}
