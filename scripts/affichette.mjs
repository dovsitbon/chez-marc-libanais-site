// Affichette A5 pour les tables et la vitrine, avec un QR code vers la carte et la réservation.
//   npm run affichette
// → print/affichette-a5.pdf (148 × 210 mm, 300 dpi) et print/affichette-a5.png (aperçu).
// L'adresse du QR code vient de data/site.json → url (+ /fr/carte) : relancez le script si le nom de domaine change.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import QRCode from "qrcode";
import { PDFDocument } from "pdf-lib";
import { ROOT, C, fonts, text, logo, frieze, cedar } from "./draw.mjs";

const site = JSON.parse(await readFile(path.join(ROOT, "data/site.json"), "utf8"));
const target = `${site.url}/fr/carte`;
const W = 1748;
const H = 2480;
const cx = W / 2;

// QR code dessiné en carrés (correction élevée : il reste lisible même un peu taché)
const qr = QRCode.create(target, { errorCorrectionLevel: "H" });
const n = qr.modules.size;
const QR = 440;
const cell = QR / n;
const qx = cx - QR / 2;
const qy = 1560;
let squares = "";
for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.modules.get(r, c)) squares += `<rect x="${(qx + c * cell).toFixed(2)}" y="${(qy + r * cell).toFixed(2)}" width="${(cell + 0.5).toFixed(2)}" height="${(cell + 0.5).toFixed(2)}"/>`;

// Trois photos : mezzés, grillades, pâtisseries
const tile = async (file, w, h) => sharp(path.join(ROOT, file)).resize(w, h, { fit: "cover", position: "centre" }).png().toBuffer();
const PW = 500;
const PH = 560;
const gap = 24;
const px = (W - (PW * 3 + gap * 2)) / 2;
const py = 640;
const photos = await Promise.all(["public/media/mezzes/assiette-mezzes.jpg", "public/media/grillades/kafta.jpg", "public/media/desserts/baklawa.jpg"].map((f) => tile(f, PW, PH)));

const host = target.replace(/^https?:\/\//, "");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="${C.cream}"/>
<rect x="56" y="56" width="${W - 112}" height="${H - 112}" fill="none" stroke="${C.gold}" stroke-width="3"/>
${logo(cx, 120, 420)}
${text(fonts.display, "La carte et les réservations", cx, py + PH + 150, 92, { anchor: "middle", fill: C.cedar })}
${text(fonts.text, "Mezzés, grillades, pâtisseries libanaises : scannez pour voir les prix", cx, py + PH + 232, 38, { anchor: "middle", fill: C.muted })}
${text(fonts.text, "et réserver votre prochaine table.", cx, py + PH + 284, 38, { anchor: "middle", fill: C.muted })}
<rect x="${qx - 36}" y="${qy - 36}" width="${QR + 72}" height="${QR + 72}" fill="#FFFFFF" stroke="${C.gold}" stroke-width="2"/>
<g fill="${C.cedarDeep}">${squares}</g>
${cedar(330, qy + QR / 2, 170, { stroke: C.cedar, width: 2 })}
${cedar(W - 330, qy + QR / 2, 170, { stroke: C.cedar, width: 2 })}
${text(fonts.medium, host, cx, qy + QR + 110, 36, { anchor: "middle", fill: C.grenade })}
${frieze(cx - 220, qy + QR + 160, 440, { unit: 22, width: 2 })}
${text(fonts.medium, "Ouvert 7 j/7 · midi et soir", cx, qy + QR + 232, 42, { anchor: "middle", fill: C.ink })}
${text(fonts.text, "12 rue des Volontaires, Paris 15  ·  01 43 06 82 96  ·  @restaurantchezmarc", cx, qy + QR + 296, 33, { anchor: "middle", fill: C.muted })}
</svg>`;

const png = await sharp(Buffer.from(svg))
  .composite(photos.map((input, i) => ({ input, left: Math.round(px + i * (PW + gap)), top: py })))
  .png()
  .toBuffer();

await mkdir(path.join(ROOT, "print"), { recursive: true });
await sharp(png).resize({ width: 874 }).png().toFile(path.join(ROOT, "print/affichette-a5.png"));

const pdf = await PDFDocument.create();
pdf.setTitle("Chez Marc, affichette A5");
const page = pdf.addPage([419.53, 595.28]); // A5 en points
const jpg = await pdf.embedJpg(await sharp(png).jpeg({ quality: 94 }).toBuffer());
page.drawImage(jpg, { x: 0, y: 0, width: 419.53, height: 595.28 });
await writeFile(path.join(ROOT, "print/affichette-a5.pdf"), await pdf.save());
console.log(`affichette A5 écrite, QR code → ${target}`);
