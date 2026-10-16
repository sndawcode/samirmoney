/**
 * Production stage = the live site. Placeholders and other dev/preview aids are forbidden there (§4.2).
 * Vercel sets VERCEL_ENV at build time; SITE_STAGE lets other hosts and CI opt in.
 */
export const isProductionStage =
  process.env.VERCEL_ENV === "production" || process.env.SITE_STAGE === "production";
