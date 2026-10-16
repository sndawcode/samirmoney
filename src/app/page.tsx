import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { HomeIntro } from "@/components/home/home-intro";
import { HomeApi, HomePartners, HomeServices, HomeTrust } from "@/components/home/home-sections";
import { ContactBand } from "@/components/ui/contact-band";

export const metadata: Metadata = pageMetadata("/");

export default function HomePage() {
  return (
    <>
      <HomeIntro />
      <HomeServices />
      <HomeApi />
      <HomeTrust />
      <HomePartners />
      <ContactBand location="home" />
    </>
  );
}
