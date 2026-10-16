// scripts/prepare-legacy.mjs — usage: node scripts/prepare-legacy.mjs
// Derives publishable images from the raw legacy downloads (assets/legacy → assets/derived):
// crops device chrome and replaces operator logos (§1.4) and phone numbers (§1.7) before the image pipeline runs.
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const SRC = "assets/legacy";
const OUT = "assets/derived";

/** Neutral disc that stands in for an operator logo. */
const disc = (size, fill = "#d9dedc") =>
  Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${fill}"/></svg>`,
  );

/** Flat bar that hides a line of personal data (phone number). */
const bar = (width, height, fill = "#e4ece8") =>
  Buffer.from(
    `<svg width="${width}" height="${height}"><rect width="${width}" height="${height}" rx="${height / 2}" fill="${fill}"/></svg>`,
  );

const jobs = [
  {
    out: "web-admin-dashboard.png",
    src: "screens/web-admin-dashboard.png",
    // Operator logos in the sidebar and on the balance cards.
    overlays: [
      { input: disc(30), left: 93, top: 337 },
      { input: disc(30), left: 93, top: 402 },
      { input: disc(66, "#e7ecea"), left: 937, top: 287 },
      { input: disc(66, "#e7ecea"), left: 1227, top: 287 },
    ],
    // Inside the black screenshot border.
    crop: { left: 30, top: 22, width: 1468, height: 910 },
  },
  {
    out: "samir-money-home.png",
    src: "screens/samir-money-phone-01.png",
    // Phone numbers in the recent-transactions list.
    overlays: [382, 433, 484, 535, 586].map((top) => ({ input: bar(62, 13), left: 186, top })),
    // The app screen only, without the legacy phone mockup.
    crop: { left: 130, top: 92, width: 262, height: 520 },
  },
];

await fs.mkdir(OUT, { recursive: true });
for (const job of jobs) {
  const composited = await sharp(path.join(SRC, job.src)).composite(job.overlays).png().toBuffer();
  await sharp(composited).extract(job.crop).png().toFile(path.join(OUT, job.out));
  console.log(`ok   ${job.out}`);
}
