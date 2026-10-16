import { ImageResponse } from "next/og";
import { ogEyebrows, seo, type SeoRoute } from "@/content/fr/seo";
import { trust } from "@/content/fr/trust";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** Route OG image: ink background, hairline grid, title in display type, compliance line in mono (§12). */
export function renderOgImage(route: SeoRoute) {
  const eyebrow = ogEyebrows[route] ?? seo["/"].title;
  const title = seo[route].title.split(" — ")[0];
  const lines = Array.from({ length: 13 }, (_, i) => (i * ogSize.width) / 12);
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: 72,
        background: "#050807",
        color: "#ffffff",
        position: "relative",
      }}
    >
      {lines.map((x) => (
        <div
          key={x}
          style={{
            position: "absolute",
            top: 0,
            left: x,
            width: 1,
            height: "100%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
      ))}
      <div
        style={{
          display: "flex",
          fontSize: 22,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "#9aa7a2",
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 96,
          fontWeight: 600,
          letterSpacing: -4,
          lineHeight: 1,
          maxWidth: 1000,
        }}
      >
        {title}
      </div>
      <div
        style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 20, color: "#9aa7a2" }}
      >
        <div style={{ width: 12, height: 12, borderRadius: 12, background: "#3df5a6" }} />
        {trust.complianceLine}
      </div>
    </div>,
    ogSize,
  );
}
