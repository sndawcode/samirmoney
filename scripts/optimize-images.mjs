// scripts/optimize-images.mjs — usage: node scripts/optimize-images.mjs [assets/selection.json] [--variants]
// Crops, resizes and compresses every curated image for fast loading, then writes src/content/media.json.
// --variants also writes static AVIF/WebP/JPEG files at each width (OG images, e-mails, hosting without next/image).
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

const args = process.argv.slice(2);
const SELECTION = args.find((a) => !a.startsWith("--")) ?? "assets/selection.json";
const VARIANTS = args.includes("--variants");
const OUT = "public/media/photos";
const MANIFEST = "src/content/media.json";
const WIDTHS = [480, 768, 1080, 1440, 1920, 2560];
const MAX_EDGE = 2560;
const AVIF = { quality: 50, effort: 4 }; // effort 6+ is ~4× slower for no real size gain
const BUDGET = {
  // max AVIF weight at the width each kind of slot is displayed
  hero: { width: 1920, kb: 200 },
  card: { width: 1080, kb: 70 },
  tile: { width: 768, kb: 45 },
  thumb: { width: 480, kb: 20 },
};
const RELEASES = ["ok", "n/a", "minor-consent"];

const selection = JSON.parse(await fs.readFile(SELECTION, "utf8"));
await fs.rm(OUT, { recursive: true, force: true }); // full regeneration: no stale files
await fs.mkdir(OUT, { recursive: true });
const manifest = {};
const problems = [];

for (const item of selection) {
  try {
    if (!RELEASES.includes(item.release))
      throw new Error(`release is "${item.release}" — not exported`);
    if (typeof item.alt !== "string")
      throw new Error(`missing "alt" (use "" for decorative images)`);
    const budget = BUDGET[item.kind];
    if (!budget) throw new Error(`unknown kind "${item.kind}"`);
    if (item.ratio && !/^\d+\/\d+$/.test(item.ratio))
      throw new Error(`ratio must look like "16/9"`);

    // 1. Upright source size (EXIF orientations 5–8 swap width and height).
    const meta = await sharp(item.file).metadata();
    const turned = (meta.orientation ?? 1) >= 5;
    let w = turned ? meta.height : meta.width;
    let h = turned ? meta.width : meta.height;

    // 2. Target size: optional crop to the slot ratio, long edge ≤ 2560 px, never upscaled.
    if (item.ratio) {
      const [rw, rh] = item.ratio.split("/").map(Number);
      if (w / h > rw / rh) w = Math.round((h * rw) / rh);
      else h = Math.round((w * rh) / rw);
    }
    const scale = Math.min(1, MAX_EDGE / Math.max(w, h));
    w = Math.round(w * scale);
    h = Math.round(h * scale);

    // 3. One decode: auto-orient → crop + downscale → sRGB → raw pixels. Outputs carry no metadata (EXIF, GPS, XMP).
    const { data, info } = await sharp(item.file, { failOn: "none" })
      .rotate()
      .resize({ width: w, height: h, fit: "cover", position: item.position ?? "attention" })
      .toColourspace("srgb")
      .raw()
      .toBuffer({ resolveWithObject: true });
    const raw = { width: info.width, height: info.height, channels: info.channels };
    const px = () => sharp(data, { raw });
    const alpha = info.channels === 4;

    // 4. Master for next/image, content-hashed so no cache ever serves a replaced photo.
    const master = await (
      alpha ? px().png({ compressionLevel: 9 }) : px().jpeg({ quality: 82, mozjpeg: true })
    ).toBuffer();
    const id = `${item.slot}-${createHash("sha1").update(master).digest("hex").slice(0, 8)}`;
    const ext = alpha ? "png" : "jpg";
    await fs.writeFile(path.join(OUT, `${id}.${ext}`), master);

    // 5. Weight budget: AVIF at the width this kind of slot is displayed (override per item with "budgetKb").
    const checkW = Math.min(budget.width, info.width);
    const kb = Math.round(
      (await px().resize({ width: checkW }).avif(AVIF).toBuffer()).length / 1024,
    );
    const limit = item.budgetKb ?? budget.kb;
    if (kb > limit)
      problems.push(
        `${item.slot}: ${kb} KB AVIF @${checkW}w > ${limit} KB — crop tighter or pick a calmer frame`,
      );

    // 6. Optional static variants, never upscaled.
    let variants;
    if (VARIANTS) {
      const widths = [...new Set([...WIDTHS.filter((x) => x < info.width), info.width])];
      const dir = path.join(OUT, id);
      await fs.mkdir(dir, { recursive: true });
      for (const x of widths) {
        const at = () => px().resize({ width: x });
        await at()
          .avif(AVIF)
          .toFile(path.join(dir, `${x}.avif`));
        await at()
          .webp({ quality: 72 })
          .toFile(path.join(dir, `${x}.webp`));
        if (!alpha)
          await at()
            .jpeg({ quality: 78, mozjpeg: true })
            .toFile(path.join(dir, `${x}.jpg`));
      }
      variants = {
        base: `/media/photos/${id}/`,
        widths,
        formats: alpha ? ["avif", "webp"] : ["avif", "webp", "jpg"],
      };
    }

    // 7. Blur placeholder + dominant colour, shown while the image loads.
    const lqip = await px().resize({ width: 24 }).webp({ quality: 40 }).toBuffer();
    const { dominant: c } = await px().stats();

    manifest[item.slot] = {
      src: `/media/photos/${id}.${ext}`,
      width: info.width,
      height: info.height,
      alt: item.alt,
      blurDataURL: `data:image/webp;base64,${lqip.toString("base64")}`,
      color: alpha ? "transparent" : `rgb(${c.r} ${c.g} ${c.b})`,
      ...(variants && { variants }),
    };
    console.log(
      `ok   ${item.slot.padEnd(24)} ${info.width}×${info.height}  ${kb} KB AVIF @${checkW}w`,
    );
  } catch (err) {
    problems.push(`${item.slot}: ${err.message}`);
  }
}

await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${Object.keys(manifest).length}/${selection.length} images optimised → ${MANIFEST}`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
