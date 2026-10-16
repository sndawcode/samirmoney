// scripts/prepare-icons.mjs — usage: node scripts/prepare-icons.mjs
// Optimises the payment-method badges supplied by the client (icone/) for the home 3D scene:
// trims nothing, resizes to 128 px high (sharp on retina at the scene's display size), strips metadata,
// writes lossless-alpha WebP to public/media/icons/<slug>.webp.
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const SRC = "icone";
const OUT = "public/media/icons";
const HEIGHT = 128;

// Source file → slug. Order = order around the orbit.
const ICONS = [
  ["Group 1171275041.png", "samir-money"],
  ["Group 1171275038.png", "wave"],
  ["Group 1171275039.png", "orange-money"],
  ["Group 1171275037.png", "visa-mastercard"],
  ["Group 1171275040.png", "wizall-money"],
  ["Group 1171275042.png", "mixx-by-yas"],
  ["Group 1171275043.png", "kpay"],
  ["Group 1171275044.png", "pi-spi"],
];

await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });
for (const [file, slug] of ICONS) {
  const out = path.join(OUT, `${slug}.webp`);
  const info = await sharp(path.join(SRC, file))
    .resize({ height: HEIGHT })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(out);
  console.log(
    `ok   ${slug.padEnd(16)} ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`,
  );
}
