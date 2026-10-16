import type { NextConfig } from "next";

const PRIMARY = process.env.NEXT_PUBLIC_SITE_URL ?? "https://samirmoney.com"; // canonical domain: Appendix D #1
const samirPayHosts = ["samirpay.com", "www.samirpay.com"];
const isDev = process.env.NODE_ENV === "development";

// samirpay.com → matching samirmoney.com page (§8.4). Specific rules first.
const fromSamirPay = samirPayHosts.flatMap((host) => [
  {
    source: "/politique-de-confidentialite",
    has: [{ type: "host" as const, value: host }],
    destination: `${PRIMARY}/confidentialite`,
    permanent: true,
  },
  {
    source: "/:path*",
    has: [{ type: "host" as const, value: host }],
    destination: `${PRIMARY}/professionnels`,
    permanent: true,
  },
]);

// §15.1. style-src needs 'unsafe-inline' for next/image and Motion inline styles;
// script-src keeps 'unsafe-inline' for Next's inline bootstrap (nonces would make every page dynamic).
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com https://plausible.io`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self' https://plausible.io",
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [480, 768, 1080, 1440, 1920, 2560],
    imageSizes: [64, 128, 256, 384],
    minimumCacheTTL: 31536000,
    qualities: [75],
  },
  async redirects() {
    return [
      ...fromSamirPay,
      // samirmoney.com legacy WordPress paths (trailing-slash variants are normalised by Next first)
      { source: "/about-app", destination: "/a-propos", permanent: true },
      { source: "/contacts", destination: "/contact", permanent: true },
      { source: "/privacy", destination: "/confidentialite", permanent: true },
      { source: "/home/:path*", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
