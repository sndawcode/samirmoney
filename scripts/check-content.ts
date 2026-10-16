// scripts/check-content.ts — lists every TODO(client) in src/content/** (§4.2).
// Fails when STRICT_CONTENT=1 (production CI) and at least one remains.
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = "src/content";
const MARKER = "TODO(client)";

async function* files(dir: string): AsyncGenerator<string> {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* files(full);
    else if (/\.(ts|tsx|json|mdx?)$/.test(entry.name)) yield full;
  }
}

async function main(): Promise<void> {
  const hits: string[] = [];
  for await (const file of files(ROOT)) {
    const lines = (await fs.readFile(file, "utf8")).split("\n");
    lines.forEach((line, i) => {
      if (line.includes(MARKER)) hits.push(`${file}:${i + 1}  ${line.trim().slice(0, 140)}`);
    });
  }

  const strict = process.env.STRICT_CONTENT === "1";
  console.log(`${hits.length} ${MARKER} item(s) in ${ROOT}`);
  for (const hit of hits) console.log(`- ${hit}`);
  if (strict && hits.length > 0) {
    console.error(
      `\nSTRICT_CONTENT=1: resolve every ${MARKER} before a production build (Appendix D).`,
    );
    process.exit(1);
  }
}

void main();
