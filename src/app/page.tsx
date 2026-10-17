import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { HomeIntro, HomeSolutions } from "@/components/home/home-intro";
import { HomeUniverses } from "@/components/home/home-universes";
import { HomeApi, HomePartners, HomeServices, HomeTrust } from "@/components/home/home-sections";
import { HomeMotion } from "@/components/home/home-motion";
import { ContactBand } from "@/components/ui/contact-band";

export const metadata: Metadata = pageMetadata("/");

export default function HomePage() {
  return (
    <>
      <HomeIntro />
      <HomeUniverses />
      <HomeSolutions />
      <HomeServices />
      <HomeApi />
      <HomeTrust />
      <HomePartners />
      <ContactBand location="home" />
      <HomeMotion />
    </>
  );
}
