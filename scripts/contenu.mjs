// Génère CONTENU.md : tous les textes du site (français) et la carte complète, pour validation par Marc.
//   npm run contenu
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const read = async (f) => JSON.parse(await readFile(path.join(ROOT, f), "utf8"));
const fr = await read("locales/fr.json");
const carte = await read("data/carte.json");
const site = await read("data/site.json");
const eur = (n) => (n === null ? "prix à remplir" : `${n.toFixed(2).replace(".", ",")} €`);

const L = [];
const h = (lvl, t) => L.push("", `${"#".repeat(lvl)} ${t}`, "");
const p = (t) => L.push(t);

p("# Chez Marc : textes du site et carte");
p("");
p(`Document à relire avec Marc. Tout ce qui est ici apparaît sur le site (version française ; l'anglais et l'arabe suivent les mêmes textes). Les corrections se font dans \`locales/fr.json\`, \`locales/en.json\`, \`locales/ar.json\` et \`data/carte.json\`, puis \`npm run contenu\` régénère ce fichier.`);

h(2, "Référencement");
p(`- **Titre Google** : ${fr.meta.title}`);
p(`- **Description** : ${fr.meta.description}`);

h(2, "Titre de l'accueil (3 propositions)");
p(`1. **${fr.hero.title}** (retenu sur le site)`);
p("2. La générosité libanaise, rue des Volontaires");
p("3. Partagez la table de Marc");
p("");
p(`- Petite ligne : ${fr.hero.eyebrow}`);
p(`- Sous-titre : ${fr.hero.sub}`);
p(`- Boutons : « ${fr.hero.ctaBook} », « ${fr.hero.ctaMenu} »`);
p(`- Sous les boutons : note Google ${site.rating.value}/5 (${site.rating.count} avis, relevée le ${site.rating.checked}) et statut « Ouvert / Fermé » en direct.`);

h(2, "Bandeau d'annonce (data/annonces.json)");
const ann = await read("data/annonces.json");
for (const a of ann.items) p(`- Du ${a.from} au ${a.to} : ${a.fr}`);
p(`- Par défaut : ${ann.default.fr}`);

h(2, "Tuiles");
p(Object.values(fr.tiles.items).map((t) => `- ${t}`).join("\n"));

h(2, "Services");
for (const s of fr.services.items) p(`- **${s.t}** : ${s.p}`);

h(2, "Blocs");
for (const b of fr.blocks) {
  h(3, `${b.eyebrow} : ${b.title}`);
  p(b.p);
  p(`Bouton : « ${b.cta} »`);
}

h(2, fr.story.eyebrow);
h(3, fr.story.title);
for (const s of fr.story.p) p(s + "\n");
p(`*${fr.story.sign}*`);
p("");
p("> Reformulé d'après le texte affiché dans la vitrine. À vérifier avec Marc : le nom de son village (lu « Mehmarch » sur la photo) et s'il souhaite le citer.");

h(2, fr.catering.title);
p(fr.catering.intro);
for (const s of fr.catering.points) p(`- ${s}`);
for (const s of fr.pages.traiteur.sections) {
  h(3, s.h);
  for (const t of s.p) p(t);
}

h(2, "Page « Restaurant libanais à Paris 15 »");
for (const s of fr.pages.paris15.sections) {
  h(3, s.h);
  for (const t of s.p) p(t);
}

h(2, "Questions fréquentes");
for (const f of fr.faq.items) {
  p(`**${f.q}**`);
  p(f.a + "\n");
}

h(2, "Bon cadeau");
p(fr.gift.p);

h(2, `La carte (prix relevés le ${carte.checked} sur la carte de la vitrine, à confirmer)`);
p("Légende : ⚑ suggestion du chef · V végétarien · (?) prix lu sur une photo floue, à vérifier.");
for (const c of carte.categories) {
  h(3, c.fr);
  p("| Plat | Arabe | Description | Prix |");
  p("|---|---|---|---|");
  for (const it of c.items) {
    const mark = [it.signature ? "⚑" : "", it.veg ? "V" : ""].filter(Boolean).join(" ");
    const desc = [it.fr.desc, it.fr.note].filter(Boolean).join(" — ");
    p(`| ${it.fr.name}${mark ? ` ${mark}` : ""} | ${it.arabic} | ${desc.replace(/\|/g, "/")} | ${eur(it.price)}${it.check ? " (?)" : ""} |`);
  }
}
p("");
p(fr.carte.checked.replace("{date}", carte.checked));

await writeFile(path.join(ROOT, "CONTENU.md"), L.join("\n") + "\n");
console.log("CONTENU.md écrit");
