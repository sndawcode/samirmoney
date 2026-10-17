import type { Metadata, Viewport } from "next";
import { Open_Sans } from "next/font/google";
import Script from "next/script";
import { products } from "@/content/fr/products";
import { contactPage } from "@/content/fr/contact";
import { nav } from "@/content/fr/nav";
import { ui } from "@/content/fr/ui";
import { cn } from "@/lib/cn";
import { getMedia } from "@/lib/media";
import { organizationJsonLd, JsonLd, websiteJsonLd } from "@/lib/schema";
import { baseMetadata } from "@/lib/seo";
import { Logo } from "@/components/layout/logo";
import { MegaMenu } from "@/components/layout/mega-menu";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SaveDataFlag } from "@/components/motion/save-data-flag";
import { ButtonLink } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/ui/contact-links";
import { Photo } from "@/components/ui/photo";
import { StoreBadges } from "@/components/ui/store-badges";
import "./globals.css";

// Open Sans for all text (client decision, 16 Oct 2026): variable weight, self-hosted at build time.
const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = baseMetadata;

export const viewport: Viewport = {
  themeColor: "#050807",
};

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

/** Small product visuals for the "Professionnels" mega menu, rendered on the server. */
const megaMenuVisuals = Object.fromEntries(
  products.flatMap((product) =>
    product.media && ["tpe", "business", "web-admin"].includes(product.id)
      ? [
          [
            product.id,
            <Photo
              key={product.id}
              slot={product.media}
              sizes="200px"
              alt=""
              className="max-h-32 w-auto object-contain"
            />,
          ],
        ]
      : [],
  ),
);

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={cn(openSans.variable, "antialiased")}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#contenu"
          className="sr-only z-[70] rounded-full bg-ink-950 px-5 py-3 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {ui.skipLink}
        </a>
        <SaveDataFlag />
        <SiteHeader
          logo={<Logo />}
          navigation={<MegaMenu visuals={megaMenuVisuals} />}
          cta={
            <ButtonLink href={nav.cta.href} size="sm" location="header" className="header-cta">
              {nav.cta.label}
            </ButtonLink>
          }
          mobileMenu={
            <MobileMenu
              extras={
                <>
                  <StoreBadges app="samirMoney" />
                  <WhatsAppButton prefill={contactPage.whatsappPrefill} page="menu" />
                </>
              }
            />
          }
        />
        <main id="contenu" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
        <JsonLd data={[organizationJsonLd(getMedia("brand-samirmoney").src), websiteJsonLd()]} />
        {plausibleDomain && (
          <Script
            src="https://plausible.io/js/script.tagged-events.outbound-links.js"
            data-domain={plausibleDomain}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
