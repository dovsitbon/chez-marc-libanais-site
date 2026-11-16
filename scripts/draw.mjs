// Outils de dessin partagés par les scripts (logo, image de partage, affichette) :
// texte converti en tracés (aucune police à installer), le cèdre au trait et le logo de Chez Marc.
import { readFile } from "node:fs/promises";
import path from "node:path";
import opentype from "opentype.js";

export const ROOT = path.resolve(import.meta.dirname, "..");

// Charte tirée du restaurant : vert cèdre du logo, crème, rouge grenade des murs de la salle,
// or des filets, bleu faïence des tableaux.
export const C = {
  cream: "#F8F2E7",
  paper: "#FFFCF6",
  cedar: "#2F5D46",
  cedarDeep: "#1F4031",
  grenade: "#A3313E",
  grenadeDeep: "#7E2230",
  gold: "#C6A15B",
  goldInk: "#8C6A2C",
  faience: "#2B6C8E",
  ink: "#1F1D1A",
  muted: "#5A534B",
};

async function load(file) {
  const buf = await readFile(path.join(ROOT, "node_modules", file));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
}

export const fonts = {
  display: await load("@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff"),
  displaySemi: await load("@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff"),
  text: await load("@fontsource/jost/files/jost-latin-400-normal.woff"),
  medium: await load("@fontsource/jost/files/jost-latin-500-normal.woff"),
  light: await load("@fontsource/jost/files/jost-latin-300-normal.woff"),
  script: await load("@fontsource/allura/files/allura-latin-400-normal.woff"),
  arabic: await load("@fontsource/noto-naskh-arabic/files/noto-naskh-arabic-arabic-600-normal.woff"),
};

/** Largeur d'un texte, interlettrage compris (tracking en em). */
export function width(font, text, size, tracking = 0) {
  return font.getAdvanceWidth(text, size) + tracking * size * (text.length - 1);
}

/** Texte en tracés SVG. anchor : start | middle | end. tracking en em. */
export function text(font, str, x, y, size, { fill = C.ink, anchor = "start", tracking = 0 } = {}) {
  const w = width(font, str, size, tracking);
  let cursor = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  if (!tracking) return `<path d="${font.getPath(str, cursor, y, size).toPathData(2)}" fill="${fill}"/>`;
  let d = "";
  for (const ch of str) {
    d += font.getPath(ch, cursor, y, size).toPathData(2);
    cursor += font.getAdvanceWidth(ch, size) + tracking * size;
  }
  return `<path d="${d}" fill="${fill}"/>`;
}

// Cèdre du Liban au trait, dans un carré de 64 : un axe, cinq étages de branches qui s'élargissent, le tronc.
// Comme sur le drapeau libanais : des étages plats, larges, aux pointes tombantes (pas un sapin).
const tier = (y, w) => `M${32 - w} ${y + 3.2}c${w * 0.22} -1.6 ${w * 0.55} -3.2 ${w} -3.2s${w * 0.78} 1.6 ${w} 3.2`;
export const CEDAR = ["M32 6v50", "M29 11.5 32 7l3 4.5", tier(16, 9), tier(24, 15), tier(32, 21), tier(40, 25), tier(48, 28), "M26 59h12"];

/** Cèdre en SVG, centré sur (cx, cy), taille = côté du carré. */
export function cedar(cx, cy, size, { stroke = C.cedar, width = 2.4 } = {}) {
  const s = size / 64;
  return `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${s})" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${CEDAR.map((d) => `<path d="${d}"/>`).join("")}</g>`;
}

/**
 * Logo de Chez Marc, redessiné d'après ses affiches : « CHEZ » en capitales espacées, « Marc » en écriture liée,
 * « — CUISINE LIBANAISE — » entre deux filets, et le petit cèdre dessous. Centré sur cx, haut en y. Hauteur ≈ 1,45 × w.
 */
export function logo(cx, y, w, { ink = C.cedar, sub = C.cedar, mark = C.cedar } = {}) {
  const k = w / 300;
  const chez = text(fonts.text, "CHEZ", cx + 18 * k, y + 40 * k, 34 * k, { fill: ink, anchor: "middle", tracking: 0.16 });
  const marc = text(fonts.script, "Marc", cx, y + 150 * k, 138 * k, { fill: ink, anchor: "middle" });
  const subW = width(fonts.text, "CUISINE LIBANAISE", 19 * k, 0.16);
  const s = text(fonts.text, "CUISINE LIBANAISE", cx, y + 205 * k, 19 * k, { fill: sub, anchor: "middle", tracking: 0.16 });
  const gap = 14 * k;
  const len = 40 * k;
  const ly = y + 198.5 * k;
  const rules = `<g stroke="${sub}" stroke-width="${1.6 * k}"><path d="M${cx - subW / 2 - gap - len} ${ly}h${len}"/><path d="M${cx + subW / 2 + gap} ${ly}h${len}"/></g>`;
  return chez + marc + rules + s + cedar(cx, y + 252 * k, 46 * k, { stroke: mark, width: 2.6 });
}

/** Version en ligne (en-tête, image de partage) : cèdre + « CHEZ MARC » + « Restaurant libanais · Paris 15 ». */
export function wordmark(x, y, h, { ink = C.cedar, sub = C.muted, mark = C.cedar } = {}) {
  const k = h / 64;
  return (
    cedar(x + 28 * k, y + 32 * k, 56 * k, { stroke: mark, width: 2.4 }) +
    text(fonts.displaySemi, "CHEZ MARC", x + 68 * k, y + 38 * k, 40 * k, { fill: ink, tracking: 0.12 }) +
    text(fonts.text, "RESTAURANT LIBANAIS · PARIS 15", x + 70 * k, y + 60 * k, 12.5 * k, { fill: sub, tracking: 0.2 })
  );
}
export const wordmarkWidth = (h) => {
  const k = h / 64;
  return 70 * k + Math.max(width(fonts.displaySemi, "CHEZ MARC", 40 * k, 0.12), width(fonts.text, "RESTAURANT LIBANAIS · PARIS 15", 12.5 * k, 0.2));
};

/** Frise fine d'arcs orientaux (filet de séparation). */
export function frieze(x, y, w, { stroke = C.gold, unit = 24, width = 1.5 } = {}) {
  let d = "";
  for (let i = 0; i + unit <= w; i += unit) d += `M${x + i} ${y}c${unit * 0.25} ${-unit * 0.5} ${unit * 0.75} ${-unit * 0.5} ${unit} 0`;
  return `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}"/>`;
}
