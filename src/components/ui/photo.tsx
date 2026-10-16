import Image from "next/image";
import type { MediaSlot } from "@/content/types";
import { cn } from "@/lib/cn";
import { getMedia } from "@/lib/media";

type PhotoProps = {
  slot: MediaSlot;
  /** Required: how wide the image is displayed (§13). */
  sizes: string;
  className?: string;
  /** Only for the LCP image of a route. */
  preload?: boolean;
  /** Above the fold but not the LCP: load without lazy-loading, without a preload hint. */
  eager?: boolean;
  /** Empty string for decorative use; defaults to the slot's alt text. */
  alt?: string;
};

/** A curated image from media.json, served by next/image (AVIF/WebP) with a blur placeholder. */
export function Photo({ slot, sizes, className, preload = false, eager = false, alt }: PhotoProps) {
  const entry = getMedia(slot);
  const transparent = entry.color === "transparent";
  return (
    <Image
      src={entry.src}
      width={entry.width}
      height={entry.height}
      alt={alt ?? entry.alt}
      sizes={sizes}
      preload={preload}
      loading={preload || eager ? "eager" : "lazy"}
      placeholder={transparent ? "empty" : "blur"}
      blurDataURL={transparent ? undefined : entry.blurDataURL}
      style={transparent ? undefined : { backgroundColor: entry.color }}
      className={cn("h-auto max-w-full", className)}
    />
  );
}
