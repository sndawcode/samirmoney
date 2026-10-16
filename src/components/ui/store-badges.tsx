import Image from "next/image";
import { site, type AppId, type Store } from "@/content/fr/site";
import { ui } from "@/content/fr/ui";
import { eventClasses } from "@/lib/analytics";
import { cn } from "@/lib/cn";

// Official artwork, displayed at 40 px high as the store guidelines require.
// TODO(client): French App Store badge ("Télécharger dans l’App Store") — the localized file could not be downloaded; English artwork in the meantime.
const BADGES: Record<Store, { src: string; width: number; height: number }> = {
  ios: { src: "/media/brand/app-store-badge.svg", width: 120, height: 40 },
  android: { src: "/media/brand/google-play-badge-fr.png", width: 135, height: 40 },
};

const STORES: readonly Store[] = ["ios", "android"];

/** App Store / Google Play badges. Each badge is hidden while its URL is unknown (§4.2). */
export function StoreBadges({ app, className }: { app: AppId; className?: string }) {
  const links = STORES.flatMap((store) => {
    const href = site.apps[app][store];
    return href ? [{ store, href }] : [];
  });
  if (links.length === 0) return null;
  return (
    <ul className={cn("flex flex-wrap items-center gap-3", className)}>
      {links.map(({ store, href }) => (
        <li key={store}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex min-h-11 items-center rounded-sm",
              eventClasses("store_badge_click", { app, store }),
            )}
          >
            <Image
              src={BADGES[store].src}
              width={BADGES[store].width}
              height={BADGES[store].height}
              alt={`${ui.storeBadges[store]} (${ui.newTab})`}
              unoptimized
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
