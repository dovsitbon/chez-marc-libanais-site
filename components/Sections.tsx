import Link from "next/link";
import type { ReactNode } from "react";
import site from "@/data/site.json";
import avis from "@/data/avis.json";
import { fill, type Dict, type Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/pages";
import { categoryOf, CHECKED } from "@/lib/carte";
import { formatDay, price } from "@/lib/format";
import { Pic } from "@/components/Pic";
import { Reveal } from "@/components/Reveal";
import { Rating } from "@/components/Rating";
import { OpenStatus } from "@/components/OpenStatus";
import { HoursTable } from "@/components/HoursTable";
import { MapLoader } from "@/components/MapLoader";
import { CateringForm } from "@/components/Forms";
import { Cedar, Frieze, Star8 } from "@/components/Cedar";
import { ArrowIcon, CalendarIcon, MezzeIcon, PhoneIcon, PinIcon, PlusIcon, StarIcon, TableIcon, BagIcon } from "@/components/icons";

type S = { lang: Locale; d: Dict };

export function Heading({ eyebrow, title, id, children, className = "" }: { eyebrow: string; title: string; id?: string; children?: ReactNode; className?: string }) {
  return (
    <Reveal className={className}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="display mt-2 text-[2.375rem] md:text-[3.5rem]">
        {title}
      </h2>
      {children}
    </Reveal>
  );
}

/* ——— Hero : la table de mezzés vue de dessus, titre court, deux boutons, la note Google et le statut en direct ——— */
export function Hero({ lang, d }: S) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[34rem] items-end overflow-hidden bg-cedar-deep text-paper md:min-h-[calc(100svh-7.5rem)]">
      <Pic src="/media/hero/hero.jpg" d={d} sizes="100vw" priority className="absolute inset-0 -z-10 h-full w-full" position="50% 45%" />
      {/* Voile sombre en bas seulement, pour lire le texte sur la photo */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(20_30_24/0.88)_0%,rgb(20_30_24/0.55)_38%,rgb(20_30_24/0.05)_70%)]" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(to_right,rgb(20_30_24/0.55),transparent_60%)] md:block rtl:bg-[linear-gradient(to_left,rgb(20_30_24/0.55),transparent_60%)]" aria-hidden="true" />
      <div className="mx-auto w-full max-w-7xl px-5 pt-40 pb-10 md:px-8 md:pb-16">
        <p className="sign text-cream/90">{d.hero.eyebrow}</p>
        <h1 id="hero-title" className="display mt-4 max-w-4xl text-[3.25rem] text-paper md:text-[5.75rem]">
          {d.hero.title}
        </h1>
        <p className="mt-5 max-w-xl text-[1.125rem] leading-relaxed text-cream/90">{d.hero.sub}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={pagePath("reserver", lang)} className="btn-light">
            {d.hero.ctaBook}
          </Link>
          <Link href={pagePath("carte", lang)} className="btn-line text-paper hover:!border-paper hover:!bg-paper hover:!text-cedar-deep">
            {d.hero.ctaMenu}
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.9375rem] text-cream">
          <Rating lang={lang} d={d} />
          <span className="hidden h-4 w-px bg-cream/30 sm:block" aria-hidden="true" />
          <OpenStatus />
        </div>
      </div>
    </section>
  );
}

/* ——— Tuiles de catégories en capitales sur photo, juste après le hero ——— */
const TILES = [
  { id: "froids", photo: "/media/mezzes/taboule.jpg", anchor: "froids", pos: "50% 55%" },
  { id: "chauds", photo: "/media/mezzes/fatayer-falafels.jpg", anchor: "chauds", pos: "50% 50%" },
  { id: "grillades", photo: "/media/grillades/kafta.jpg", anchor: "grillades", pos: "40% 50%" },
  { id: "assortiments", photo: "/media/mezzes/assiette-mezzes.jpg", anchor: "menus", pos: "50% 50%" },
  { id: "patisseries", photo: "/media/desserts/baklawa.jpg", anchor: "desserts", pos: "50% 40%" },
  { id: "the", photo: "/media/the/the-menthe.jpg", anchor: "boissons", pos: "50% 50%" },
] as const;

export function Tiles({ lang, d }: S) {
  return (
    <section aria-labelledby="tiles-title" className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
      <h2 id="tiles-title" className="sr-only">
        {d.tiles.title}
      </h2>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {TILES.map((t, i) => (
          <Reveal as="li" key={t.id} delay={i * 0.05}>
            <Link href={`${pagePath("carte", lang)}#${t.anchor}`} className="group relative block aspect-[4/5] overflow-hidden md:aspect-[5/4]">
              <Pic src={t.photo} d={d} sizes="(min-width: 768px) 33vw, 50vw" className="h-full w-full" position={t.pos} alt="" label={d.tiles.photoSoon} tint={3} />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-[linear-gradient(to_top,rgb(20_20_18/0.7),transparent)] p-4 pt-12 text-paper md:p-5 md:pt-16">
                <span className="sign !text-[0.75rem] md:!text-[0.8125rem]">{d.tiles.items[t.id]}</span>
                <ArrowIcon className="h-4 w-4 shrink-0 opacity-80 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

/* ——— Bande de services en 4 pictos ——— */
const SERVICE_ICONS = { maison: MezzeIcon, resa: CalendarIcon, emporter: BagIcon, groupes: TableIcon } as const;

export function Services({ d }: S) {
  return (
    <section aria-labelledby="services-title" className="border-y border-line bg-paper">
      <h2 id="services-title" className="sr-only">
        {d.services.title}
      </h2>
      <ul className="mx-auto grid max-w-7xl gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
        {d.services.items.map((s) => {
          const Icon = SERVICE_ICONS[s.id as keyof typeof SERVICE_ICONS];
          return (
            <li key={s.id} className="bg-paper px-5 py-8 md:px-8">
              <Icon className="h-8 w-8 text-cedar" />
              <h3 className="mt-4 text-[1.0625rem] font-medium">{s.t}</h3>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{s.p}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ——— Les formules (prix relevés sur la carte du restaurant) ——— */
export function Formulas({ lang, d }: S) {
  const menus = categoryOf("menus").items.filter((i) => ["menu-midi", "menu-soir", "mezze-complet"].includes(i.id));
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {menus.map((m, i) => (
        <Reveal as="li" key={m.id} delay={i * 0.06} className="flex flex-col border border-line bg-paper p-6 md:p-7">
          <p className="flex items-baseline justify-between gap-4">
            <span className="display text-[1.75rem]">{m[lang].name}</span>
            <span className="display text-[2rem] text-grenade tabular-nums" dir="ltr">
              {m.price !== null ? price(m.price, lang) : d.carte.priceOnSite}
            </span>
          </p>
          {m[lang].note && <p className="mt-1 text-[0.875rem] text-gold-ink">{m[lang].note}</p>}
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{m[lang].desc}</p>
        </Reveal>
      ))}
    </ul>
  );
}

export function CarteNote({ lang, d }: S) {
  return <p className="mt-8 text-[0.8125rem] text-muted">{fill(d.carte.checked, { date: formatDay(CHECKED, lang, { day: "numeric", month: "long", year: "numeric" }) })}</p>;
}

/* ——— Trois blocs alternés : photo + texte court + un seul bouton ——— */
export function Blocks({ lang, d }: S) {
  const [mezzes, salle, traiteur] = d.blocks;
  return (
    <>
      <section aria-labelledby="bloc-mezzes" className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-16 md:grid-cols-2 md:gap-16 md:px-8 md:py-24">
        <Reveal>
          <Pic src="/media/mezzes/table-mezzes.jpg" d={d} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/5] w-full md:aspect-[5/6]" />
        </Reveal>
        <Reveal delay={0.08}>
          <p className="eyebrow">{mezzes.eyebrow}</p>
          <h2 id="bloc-mezzes" className="display mt-2 text-[2.375rem] md:text-[3.25rem]">
            {mezzes.title}
          </h2>
          <p className="lead mt-5 max-w-lg">{mezzes.p}</p>
          <Link href={pagePath("carte", lang)} className="btn mt-8">
            {mezzes.cta}
          </Link>
        </Reveal>
      </section>

      {/* La salle : la seule bande en rouge grenade, comme les murs du restaurant */}
      <section aria-labelledby="bloc-salle" className="lattice bg-grenade text-paper">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-16 md:grid-cols-2 md:gap-16 md:px-8 md:py-24">
          <Reveal className="md:order-2">
            <Pic src="/media/salle/salle.jpg" d={d} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/3] w-full" />
          </Reveal>
          <Reveal delay={0.08} className="md:order-1">
            <p className="text-[0.9375rem] font-medium text-gold-soft">{salle.eyebrow}</p>
            <h2 id="bloc-salle" className="display mt-2 text-[2.375rem] md:text-[3.25rem]">
              {salle.title}
            </h2>
            <p className="mt-5 max-w-lg text-[1.125rem] leading-relaxed text-cream/90">{salle.p}</p>
            <Link href={pagePath("reserver", lang)} className="btn-light mt-8">
              {salle.cta}
            </Link>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="bloc-traiteur" className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-16 md:grid-cols-2 md:gap-16 md:px-8 md:py-24">
        <Reveal>
          <Pic src="/media/desserts/patisseries.jpg" d={d} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/5] w-full md:aspect-[5/6]" position="50% 60%" />
        </Reveal>
        <Reveal delay={0.08}>
          <p className="eyebrow">{traiteur.eyebrow}</p>
          <h2 id="bloc-traiteur" className="display mt-2 text-[2.375rem] md:text-[3.25rem]">
            {traiteur.title}
          </h2>
          <p className="lead mt-5 max-w-lg">{traiteur.p}</p>
          <Link href={`${pagePath("traiteur", lang)}#devis`} className="btn mt-8">
            {traiteur.cta}
          </Link>
        </Reveal>
      </section>
    </>
  );
}

/* ——— L'histoire de Marc (d'après le texte affiché dans sa vitrine) ——— */
export function Story({ d }: S) {
  return (
    <section aria-labelledby="story-title" className="bg-cream-deep">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:px-8 md:py-24">
        <Reveal>
          <Pic src="/media/salle/marc.jpg" d={d} sizes="(min-width: 768px) 40vw, 100vw" className="aspect-[4/5] w-full" label={d.story.photoSoon} tint={2} />
        </Reveal>
        <Reveal delay={0.08}>
          <Cedar className="h-10 w-10 text-cedar" />
          <p className="eyebrow mt-4">{d.story.eyebrow}</p>
          <h2 id="story-title" className="display mt-2 text-[2.375rem] md:text-[3.25rem]">
            {d.story.title}
          </h2>
          <div className="mt-6 max-w-xl space-y-4 text-[1.0625rem] leading-relaxed text-muted">
            {d.story.p.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="display mt-6 text-[1.75rem] text-grenade italic">{d.story.sign}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ——— Traiteur et groupes, avec le formulaire de devis ——— */
export function Catering({ d, id = "devis", withPhoto = true }: S & { id?: string; withPhoto?: boolean }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <Heading eyebrow={d.catering.eyebrow} title={d.catering.title} id={`${id}-title`}>
            <p className="lead mt-4 max-w-md">{d.catering.intro}</p>
          </Heading>
          <ul className="mt-8 space-y-3">
            {d.catering.points.map((p) => (
              <li key={p} className="flex gap-3">
                <Star8 className="mt-1.5 h-4 w-4 shrink-0 text-gold-ink" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          {withPhoto && <Pic src="/media/mezzes/fatayer-falafels.jpg" d={d} sizes="(min-width: 1024px) 35vw, 100vw" className="mt-10 hidden aspect-[4/3] w-full lg:block" />}
          {!site.catering.confirmed && <p className="mt-6 text-[0.875rem] text-gold-ink">{d.catering.unconfirmed}</p>}
        </div>
        <div className="border border-line bg-paper p-5 md:p-8">
          <CateringForm />
        </div>
      </div>
    </section>
  );
}

/* ——— Avis : emplacements, aucun avis inventé ——— */
type Review = { name: string; date: string; source: string; rating: number; fr: string; en?: string; ar?: string };

export function Reviews({ lang, d }: S) {
  const items = avis.items as Review[];
  return (
    <section aria-labelledby="reviews-title" className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Heading eyebrow={d.reviews.eyebrow} title={d.reviews.title} id="reviews-title">
          <p className="lead mt-4 max-w-xl">{d.reviews.intro}</p>
        </Heading>
        <div className="flex flex-col items-start gap-2">
          <Rating lang={lang} d={d} className="text-[1.0625rem]" />
          <a href={site.reviewsUrl} target="_blank" rel="noopener noreferrer" className="link-line inline-flex min-h-11 items-center gap-2 text-cedar">
            {d.reviews.seeGoogle}
            <ArrowIcon className="h-4 w-4 rtl:-scale-x-100" />
          </a>
        </div>
      </div>
      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {items.length
          ? items.slice(0, 6).map((r) => (
              <li key={r.name + r.date} className="border border-line bg-paper p-6">
                <p className="flex gap-0.5 text-gold" aria-label={`${r.rating}/5`}>
                  {Array.from({ length: r.rating }, (_, i) => (
                    <StarIcon key={i} />
                  ))}
                </p>
                <blockquote className="mt-4 text-[1.0625rem] leading-relaxed">{r[lang] ?? r.fr}</blockquote>
                <p className="mt-4 text-[0.875rem] text-muted">
                  {r.name} · {r.source}
                </p>
              </li>
            ))
          : [0, 1, 2].map((i) => (
              // <!-- À REMPLIR avec de vrais avis clients (data/avis.json), avec l'accord de Marc -->
              <li key={i} data-avis="a-remplir" className="flex min-h-48 flex-col items-center justify-center gap-3 border border-dashed border-line p-6 text-center text-muted">
                <span className="flex gap-0.5 text-gold/60" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <StarIcon key={s} />
                  ))}
                </span>
                <span className="text-[0.9375rem]">{d.reviews.slot}</span>
              </li>
            ))}
      </ul>
    </section>
  );
}

/* ——— Infos pratiques ——— */
export function Infos({ lang, d }: S) {
  return (
    <section id="infos" aria-labelledby="infos-title" className="bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <Heading eyebrow={d.infos.eyebrow} title={d.infos.title} id="infos-title" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr_1.1fr]">
          <div className="space-y-7">
            <div>
              <h3 className="text-[0.9375rem] font-medium text-grenade">{d.infos.address}</h3>
              <address className="mt-2 text-[1.125rem] leading-relaxed not-italic" dir="ltr">
                Chez Marc
                <br />
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}
              </address>
              <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="link-line mt-2 inline-flex min-h-11 items-center gap-2 text-cedar">
                <PinIcon />
                {d.nav.directions}
              </a>
            </div>
            <div>
              <h3 className="text-[0.9375rem] font-medium text-grenade">{d.infos.metro}</h3>
              <ul className="mt-2 space-y-1.5">
                {site.metro.map((m) => (
                  <li key={m.station} className="flex items-center gap-2.5">
                    <span className="flex gap-1" dir="ltr">
                      {m.lines.map((l) => (
                        <span key={l} className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[0.75rem] font-semibold ${l === "12" ? "bg-[#007852] text-white" : "bg-[#6ECA97] text-ink"}`}>
                          {l}
                        </span>
                      ))}
                    </span>
                    <span>{fill(m.lines.length > 1 ? d.infos.metroLines : d.infos.metroLine, { station: m.station, lines: m.lines.join(` ${d.infos.and} `), walk: m.walk })}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[0.9375rem] font-medium text-grenade">{d.infos.phone}</h3>
              <a href={`tel:${site.phoneIntl}`} className="display mt-1 inline-flex min-h-11 items-center gap-2 text-[1.75rem] tabular-nums" dir="ltr">
                <PhoneIcon className="h-5 w-5 text-cedar" />
                {site.phone}
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-[0.9375rem] font-medium text-grenade">{d.infos.hours}</h3>
            <div className="mt-2">
              <HoursTable lang={lang} d={d} />
            </div>
            <OpenStatus className="mt-4 text-[0.9375rem]" />
          </div>
          <div className="grid gap-4">
            <MapLoader src={site.mapsEmbed} title={d.infos.mapTitle} label={d.infos.mapLoad} note={d.infos.mapNote} className="h-64 lg:h-72" />
            <Pic src="/media/facade/facade.jpg" d={d} sizes="(min-width: 1024px) 33vw, 100vw" className="aspect-[16/9] w-full" label={d.infos.photoSoon} tint={0} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ——— FAQ ——— */
export function Faq({ d }: S) {
  return (
    <section aria-labelledby="faq-title" className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-24">
      <Heading eyebrow={d.faq.eyebrow} title={d.faq.title} id="faq-title" />
      <div className="mt-8 border-t border-line">
        {d.faq.items.map((f) => (
          <details key={f.q} className="group border-b border-line">
            <summary className="flex min-h-16 items-center justify-between gap-6 py-4 text-[1.125rem] font-medium">
              {f.q}
              <PlusIcon className="faq-plus h-5 w-5 shrink-0 text-grenade" />
            </summary>
            <p className="max-w-2xl pb-6 leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ——— Bon cadeau : petit encart ——— */
export function Gift({ d }: S) {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8 md:pb-24">
      <div className="flex flex-col items-start justify-between gap-6 border border-gold/60 bg-gold-soft/50 p-6 md:flex-row md:items-center md:p-10">
        <div>
          <h2 className="display text-[1.875rem] md:text-[2.25rem]">{d.gift.title}</h2>
          <p className="mt-2 max-w-xl text-muted">{d.gift.p}</p>
        </div>
        <a href={`tel:${site.phoneIntl}`} className="btn-line shrink-0 text-cedar">
          <PhoneIcon className="h-[18px] w-[18px]" />
          {d.gift.cta}
        </a>
      </div>
    </section>
  );
}

export { Frieze };
