// scripts/build-static-map.mjs — usage: node scripts/build-static-map.mjs
// Builds the contact-page map once from OpenStreetMap tiles (no iframe, no cookies, no API key — §9.8).
// Attribution "© OpenStreetMap contributors" is shown next to the image. Re-run only if the address changes.
import sharp from "sharp";
import fs from "node:fs/promises";

const LAT = 14.698458;
const LNG = -17.465254;
const ZOOM = 16;
const TILE = 256;
const OUT_W = 960;
const OUT_H = 640;
const OUT = "public/media/brand/contact-map.webp";
const USER_AGENT = "samirmoney.com static map build (contact page)";

// Web Mercator → global pixel coordinates at ZOOM.
const scale = TILE * 2 ** ZOOM;
const px = ((LNG + 180) / 360) * scale;
const latRad = (LAT * Math.PI) / 180;
const py = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * scale;

const left = Math.round(px - OUT_W / 2);
const top = Math.round(py - OUT_H / 2);
const tiles = [];
for (let tx = Math.floor(left / TILE); tx <= Math.floor((left + OUT_W) / TILE); tx++) {
  for (let ty = Math.floor(top / TILE); ty <= Math.floor((top + OUT_H) / TILE); ty++) {
    const res = await fetch(`https://tile.openstreetmap.org/${ZOOM}/${tx}/${ty}.png`, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`Tile ${tx}/${ty}: HTTP ${res.status}`);
    tiles.push({
      input: Buffer.from(await res.arrayBuffer()),
      left: tx * TILE - left,
      top: ty * TILE - top,
    });
  }
}

const marker = Buffer.from(
  `<svg width="44" height="56" xmlns="http://www.w3.org/2000/svg"><path d="M22 2C11 2 2 11 2 22c0 15 20 32 20 32s20-17 20-32C42 11 33 2 22 2z" fill="#007552" stroke="#fff" stroke-width="3"/><circle cx="22" cy="22" r="7" fill="#fff"/></svg>`,
);

// Tiles can extend past the canvas: composite onto an oversized canvas, then crop.
const pad = TILE;
const base = sharp({
  create: { width: OUT_W + 2 * pad, height: OUT_H + 2 * pad, channels: 3, background: "#e7ecea" },
});
const composed = await base
  .composite([
    ...tiles.map((t) => ({ ...t, left: t.left + pad, top: t.top + pad })),
    { input: marker, left: pad + OUT_W / 2 - 22, top: pad + OUT_H / 2 - 54 },
  ])
  .png()
  .toBuffer();
await fs.mkdir("public/media/brand", { recursive: true });
await sharp(composed)
  .extract({ left: pad, top: pad, width: OUT_W, height: OUT_H })
  .modulate({ saturation: 0.7 })
  .webp({ quality: 72 })
  .toFile(OUT);
console.log(`ok   ${OUT} (${tiles.length} tiles)`);
