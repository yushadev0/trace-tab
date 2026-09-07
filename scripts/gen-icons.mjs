// Rasterizes assets/icon.svg into the PNG sizes Chrome + the Web Store need.
// Run: npm run icons
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "assets", "icon.svg");
const outDir = join(root, "public", "icons");

const sizes = [16, 32, 48, 128];

const svg = await readFile(src);
await mkdir(outDir, { recursive: true });

for (const size of sizes) {
  const file = join(outDir, `icon-${size}.png`);
  await sharp(svg, { density: 384 })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(file);
  console.log(`  ${file.replace(root + "\\", "").replace(root + "/", "")}`);
}

console.log("done");
