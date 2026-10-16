import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { ogEyebrows, seo, type SeoRoute } from "@/content/fr/seo";
import { trust } from "@/content/fr/trust";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

// Static Open Sans files (OFL) for next/og, which cannot use the page's variable web font.
const fontFile = (weight: 400 | 600 | 800) =>
  readFile(join(process.cwd(), `src/assets/fonts/open-sans-${weight}.ttf`));

/** Route OG image: ink background, hairline grid, title in display type, compliance line (§12). */
export async function renderOgImage(route: SeoRoute) {
  const [regular, semibold, extrabold] = await Promise.all([
    fontFile(400),
    fontFile(600),
    fontFile(800),
  ]);
  const eyebrow = ogEyebrows[route] ?? seo["/"].title;
  const title = seo[route].title.split(" — ")[0];
  const lines = Array.from({ length: 13 }, (_, i) => (i * ogSize.width) / 12);
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        fontFamily: "Open Sans",
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
          fontWeight: 600,
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
          fontWeight: 800,
          letterSpacing: -2,
          lineHeight: 1,
          maxWidth: 1000,
        }}
      >
        {title}
      </div>
      <div
        style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 20, color: "#9aa7a2" }}
      >
        <div style={{ width: 12, height: 12, borderRadius: 12, background: "#3cb088" }} />
        {trust.complianceLine}
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Open Sans", data: regular, weight: 400, style: "normal" },
        { name: "Open Sans", data: semibold, weight: 600, style: "normal" },
        { name: "Open Sans", data: extrabold, weight: 800, style: "normal" },
      ],
    },
  );
}
