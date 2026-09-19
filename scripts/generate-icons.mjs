// Vygeneruje apple-icon.png (180×180) z SVG favicony.
// Spuštění: npm run icons
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const svg = await readFile(fileURLToPath(new URL("../src/app/icon.svg", import.meta.url)));
await sharp(svg, { density: 384 })
  .resize(180, 180)
  .png()
  .toFile(fileURLToPath(new URL("../src/app/apple-icon.png", import.meta.url)));
console.log("apple-icon.png vygenerován");
