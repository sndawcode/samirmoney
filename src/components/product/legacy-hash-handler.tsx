"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// samirpay.com one-page anchors (the App Store lists samirpay.com/#contact). Browsers keep the
// #fragment across the samirpay.com → /professionnels redirect (§8.4).
const LEGACY_HASHES: Record<string, string> = {
  "#acceuil": "#apercu",
  "#apropos": "#apercu",
  "#testmonial": "#apercu",
  "#services": "/services",
  "#faq": "#faq",
  "#inscription": "#demarrer",
  "#contact": "/contact?profil=commercant",
  "#newsletter": "/contact",
};

export function LegacyHashHandler() {
  const router = useRouter();
  useEffect(() => {
    const target = LEGACY_HASHES[window.location.hash];
    if (!target) return;
    if (target.startsWith("#")) document.querySelector(target)?.scrollIntoView();
    else router.replace(target);
  }, [router]);
  return null;
}
