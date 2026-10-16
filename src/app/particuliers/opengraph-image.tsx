import { seo } from "@/content/fr/seo";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = seo["/particuliers"].title;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage("/particuliers");
}
