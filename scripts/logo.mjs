// Logo de Chez Marc, redessiné d'après ses affiches (« CHEZ » / « Marc » en écriture liée / « — CUISINE LIBANAISE — » / cèdre).
//   npm run logo
// → public/logo.svg (logo complet, vert cèdre), public/logo-clair.svg (crème, pour fond sombre),
//   public/logo-horizontal.svg (cèdre + CHEZ MARC, en-tête), app/icon.svg (favicon), app/apple-icon.png,
//   public/icon-512.png, assets/logo-apercu.png.
// Pour mettre son fichier d'origine : remplacez public/logo.svg (même nom).
import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { ROOT, C, cedar, logo, wordmark, wordmarkWidth } from "./draw.mjs";

const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>\n`;

await writeFile(path.join(ROOT, "public/logo.svg"), svg(320, 300, logo(160, 8, 300)));
await writeFile(path.join(ROOT, "public/logo-clair.svg"), svg(320, 300, logo(160, 8, 300, { ink: C.cream, sub: "#E9DCC3", mark: C.gold })));
const ww = Math.ceil(wordmarkWidth(64)) + 8;
await writeFile(path.join(ROOT, "public/logo-horizontal.svg"), svg(ww, 66, wordmark(2, 1, 64)));

// Favicon : le cèdre crème sur le vert du logo
const mark = (size) => svg(size, size, `<g transform="scale(${size / 100})"><rect width="100" height="100" rx="22" fill="${C.cedar}"/>${cedar(50, 51, 74, { stroke: C.cream, width: 3.4 })}</g>`);
await writeFile(path.join(ROOT, "app/icon.svg"), mark(100));
await sharp(Buffer.from(mark(512))).resize(180, 180).flatten({ background: C.cedar }).png().toFile(path.join(ROOT, "app/apple-icon.png"));
await sharp(Buffer.from(mark(512))).png().toFile(path.join(ROOT, "public/icon-512.png"));

// Aperçu à comparer avec l'affiche d'origine
await sharp(Buffer.from(svg(1000, 340, `<rect width="1000" height="340" fill="${C.cream}"/>${logo(170, 16, 300)}<rect x="360" y="0" width="300" height="340" fill="${C.cedarDeep}"/>${logo(510, 16, 280, { ink: C.cream, sub: "#E9DCC3", mark: C.gold })}${wordmark(690, 40, 56)}<g transform="translate(700 180)"><rect width="100" height="100" rx="22" fill="${C.cedar}"/>${cedar(50, 51, 74, { stroke: C.cream, width: 3.4 })}</g>`)))
  .png()
  .toFile(path.join(ROOT, "assets/logo-apercu.png"));
console.log("logo.svg, logo-clair.svg, logo-horizontal.svg, icon.svg, apple-icon.png, icon-512.png écrits");
