// Photos du site.
//   npm run media
//
// 1. Prépare pour le web toutes les photos de assets/<dossier>/ dans public/media/<dossier>/
//    (next/image sert ensuite AVIF/WebP à la bonne taille) et note leurs dimensions dans data/media-sizes.json.
// 2. Fabrique l'image de partage public/og.jpg (1200 × 630).
//
// Pour ajouter une photo prise sur place : déposez-la sous le nom attendu (voir assets/A-PHOTOGRAPHIER.md),
// par ex. assets/facade/facade.jpg, puis relancez « npm run media » : l'emplacement dessiné laisse place à la photo.
// assets/raw/ : photos brutes (Téléchargements + fiche Google), non publiées telles quelles.
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { ROOT, C, fonts, text, logo, frieze } from "./draw.mjs";

const CATS = ["hero", "mezzes", "grillades", "desserts", "salle", "facade", "the"];
// Recadrages (fractions de l'image) : on retire les clients attablés en haut des photos de table (pas de visages, pas de mains)
const CROP = { "hero/hero": { top: 0.27, right: 0.04 }, "mezzes/table-mezzes": { top: 0.36, right: 0.04 } };

const sizes = {};
await rm(path.join(ROOT, "public/media"), { recursive: true, force: true });
for (const cat of CATS) {
  const dir = path.join(ROOT, "assets", cat);
  await mkdir(dir, { recursive: true });
  await mkdir(path.join(ROOT, "public/media", cat), { recursive: true });
  for (const f of (await readdir(dir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))) {
    const name = f.replace(/\.\w+$/, "").toLowerCase();
    const max = cat === "hero" ? 2400 : 1800;
    let img = sharp(path.join(dir, f)).rotate();
    const crop = CROP[`${cat}/${name}`];
    if (crop) {
      const m = await sharp(path.join(dir, f)).rotate().metadata();
      const top = Math.round(m.height * (crop.top ?? 0));
      const left = Math.round(m.width * (crop.left ?? 0));
      const w = m.width - left - Math.round(m.width * (crop.right ?? 0));
      const h = m.height - top - Math.round(m.height * (crop.bottom ?? 0));
      img = img.extract({ left, top, width: w, height: h });
    }
    const info = await img
      .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(path.join(ROOT, "public/media", cat, `${name}.jpg`));
    sizes[`/media/${cat}/${name}.jpg`] = [info.width, info.height];
  }
}
await writeFile(path.join(ROOT, "data/media-sizes.json"), JSON.stringify(sizes, null, 1) + "\n");

// Image de partage : à droite la table de mezzés, à gauche le logo et l'essentiel
const right = await sharp(path.join(ROOT, "public/media/hero/hero.jpg")).resize(560, 630, { fit: "cover", position: "centre" }).toBuffer();
const left = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="630">
${logo(320, 46, 290)}
${frieze(210, 382, 220, { unit: 20 })}
${text(fonts.display, "Le Liban, mezzé après mezzé", 320, 452, 44, { anchor: "middle", fill: C.ink })}
${text(fonts.medium, "12 rue des Volontaires · Paris 15", 320, 510, 25, { anchor: "middle", fill: C.cedar })}
${text(fonts.text, "Midi et soir, 7 j/7 · 01 43 06 82 96", 320, 552, 22, { anchor: "middle", fill: C.muted })}
</svg>`);
await sharp({ create: { width: 1200, height: 630, channels: 3, background: C.cream } })
  .composite([
    { input: right, left: 640, top: 0 },
    { input: left, left: 0, top: 0 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(path.join(ROOT, "public/og.jpg"));

console.log(`${Object.keys(sizes).length} photos prêtes, og.jpg écrit`);
