import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import site from "@/data/site.json";
import { getDict, isLocale, locales, ogLocale, type Dict, type Locale } from "@/lib/i18n";
import { pageJsonLd } from "@/lib/jsonld";
import { pageOfSlug, pagePath, PAGE_IDS, SLUGS, type PageId } from "@/lib/pages";
import { CATEGORIES } from "@/lib/carte";
import { CategoryList } from "@/components/MenuTabs";
import { BookingForm } from "@/components/Forms";
import { CarteNote, Catering, Faq, Formulas, Infos } from "@/components/Sections";
import { Pic } from "@/components/Pic";
import { Cedar, Frieze } from "@/components/Cedar";
import { HoursTable } from "@/components/HoursTable";
import { OpenStatus } from "@/components/OpenStatus";
import { Rating } from "@/components/Rating";
import { ArrowIcon, PhoneIcon, PinIcon } from "@/components/icons";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => PAGE_IDS.map((id) => ({ lang, slug: SLUGS[id][lang] })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const id = pageOfSlug(slug, lang);
  if (!id) return {};
  const p = getDict(lang).pages[id];
  return {
    title: { absolute: p.metaTitle },
    description: p.metaDescription,
    alternates: {
      canonical: pagePath(id, lang),
      languages: { ...Object.fromEntries(locales.map((l) => [l, pagePath(id, l)])), "x-default": pagePath(id, "fr") },
    },
    openGraph: { type: "website", url: pagePath(id, lang), siteName: site.fullName, title: p.metaTitle, description: p.metaDescription, locale: ogLocale[lang], images: [{ url: "/og.jpg", width: 1200, height: 630 }] },
    ...(id === "legal" ? { robots: { index: false, follow: true } } : {}),
  };
}

function PageHead({ d, id, children }: { d: Dict; id: PageId; children?: React.ReactNode }) {
  const p = d.pages[id] as { h1: string; intro?: string };
  return (
    <header className="mx-auto max-w-7xl px-5 pt-12 md:px-8 md:pt-20">
      <p className="eyebrow flex items-center gap-2">
        <Cedar className="h-5 w-5 text-cedar" strokeWidth={3} />
        <span dir="ltr">Chez Marc · Paris 15</span>
      </p>
      <h1 className="display mt-3 max-w-4xl text-[2.875rem] md:text-[4.75rem]">{p.h1}</h1>
      {p.intro && <p className="lead mt-5 max-w-2xl">{p.intro}</p>}
      {children}
    </header>
  );
}

function Prose({ sections }: { sections: { h: string; p: string[] }[] }) {
  return (
    <div className="space-y-10">
      {sections.map((s) => (
        <section key={s.h}>
          <h2 className="display text-[1.875rem] md:text-[2.375rem]">{s.h}</h2>
          {s.p.map((t) => (
            <p key={t} className="lead mt-3">
              {t}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}

function Ctas({ lang, d }: { lang: Locale; d: Dict }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link href={pagePath("reserver", lang)} className="btn">
        {d.nav.bookCta}
      </Link>
      <Link href={pagePath("carte", lang)} className="btn-line">
        {d.nav.seeMenu}
      </Link>
    </div>
  );
}

/* ——— La carte, en vraie page HTML ——— */
function CartePage({ lang, d }: { lang: Locale; d: Dict }) {
  const photos = ["/media/mezzes/assiette-mezzes.jpg", "/media/mezzes/falafel.jpg", "/media/grillades/chawarma-poulet.jpg", "/media/desserts/patisseries.jpg"];
  return (
    <>
      <PageHead d={d} id="carte">
        <div className="mt-8">
          <Rating lang={lang} d={d} />
        </div>
      </PageHead>
      <nav aria-label={d.carte.tabsLabel} className="sticky top-16 z-30 mt-10 border-y border-line bg-cream/95 backdrop-blur-sm md:top-20">
        <ul className="tabs mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 md:px-6">
          {CATEGORIES.map((c) => (
            <li key={c.id} className="shrink-0">
              <a href={`#${c.id}`} className="inline-flex min-h-12 items-center px-3 text-[0.9375rem] whitespace-nowrap text-muted hover:text-ink">
                {c[lang]}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {photos.map((p) => (
            <li key={p}>
              <Pic src={p} d={d} sizes="(min-width: 768px) 25vw, 50vw" className="aspect-square w-full" />
            </li>
          ))}
        </ul>
        {CATEGORIES.map((c) => (
          <section key={c.id} id={c.id} aria-labelledby={`${c.id}-h`} className="scroll-mt-36 pt-14 md:pt-20">
            <div className="flex items-end gap-4">
              <h2 id={`${c.id}-h`} className="display text-[2.25rem] md:text-[3rem]">
                {c[lang]}
              </h2>
              <Frieze className="mb-3 flex-1" />
            </div>
            {c.id === "menus" && (
              <div className="mt-6">
                <Formulas lang={lang} d={d} />
              </div>
            )}
            <div className="mt-4">
              <CategoryList c={c} lang={lang} d={d} />
            </div>
          </section>
        ))}
        <CarteNote lang={lang} d={d} />
        <div className="mt-8 pb-16 md:pb-24">
          <Ctas lang={lang} d={d} />
        </div>
      </div>
    </>
  );
}

/* ——— Réserver ——— */
function ReserverPage({ lang, d }: { lang: Locale; d: Dict }) {
  return (
    <>
      <PageHead d={d} id="reserver" />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:px-8 md:py-16 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
        <div className="border border-line bg-paper p-5 md:p-8">
          <BookingForm />
        </div>
        <aside className="space-y-8">
          <div>
            <h2 className="text-[0.9375rem] font-medium text-grenade">{d.infos.phone}</h2>
            <a href={`tel:${site.phoneIntl}`} className="display mt-1 inline-flex min-h-11 items-center gap-2 text-[2rem] tabular-nums" dir="ltr">
              <PhoneIcon className="h-5 w-5 text-cedar" />
              {site.phone}
            </a>
          </div>
          <div>
            <h2 className="text-[0.9375rem] font-medium text-grenade">{d.infos.hours}</h2>
            <div className="mt-2">
              <HoursTable lang={lang} d={d} />
            </div>
            <OpenStatus className="mt-4 text-[0.9375rem]" />
          </div>
          <div>
            <h2 className="text-[0.9375rem] font-medium text-grenade">{d.infos.address}</h2>
            <p className="mt-2" dir="ltr">
              {site.address.street}, {site.address.postalCode} {site.address.city}
            </p>
            <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="link-line mt-1 inline-flex min-h-11 items-center gap-2 text-cedar">
              <PinIcon />
              {d.nav.directions}
            </a>
          </div>
          <div className="border-t border-line pt-6">
            <p className="text-[0.9375rem] text-muted">{d.booking.theforkLead}</p>
            <a href={site.thefork} target="_blank" rel="noopener noreferrer" className="link-line mt-1 inline-flex min-h-11 items-center gap-2 text-cedar">
              {d.booking.thefork}
              <ArrowIcon className="h-4 w-4 rtl:-scale-x-100" />
            </a>
          </div>
          <Pic src="/media/salle/banquettes.jpg" d={d} sizes="(min-width: 1024px) 30vw, 100vw" className="aspect-[4/3] w-full" />
        </aside>
      </div>
    </>
  );
}

/* ——— Traiteur libanais Paris ——— */
function TraiteurPage({ lang, d }: { lang: Locale; d: Dict }) {
  return (
    <>
      <PageHead d={d} id="traiteur">
        <a href="#devis" className="btn mt-8">
          {d.blocks[2].cta}
        </a>
      </PageHead>
      <div className="mx-auto mt-12 grid max-w-7xl grid-cols-2 gap-3 px-5 md:grid-cols-3 md:px-8">
        <Pic src="/media/desserts/patisseries.jpg" d={d} sizes="(min-width: 768px) 33vw, 50vw" className="aspect-[4/5] w-full" />
        <Pic src="/media/mezzes/fatayer-falafels.jpg" d={d} sizes="(min-width: 768px) 33vw, 50vw" className="aspect-[4/5] w-full" />
        <Pic src="/media/mezzes/pains-zaatar.jpg" d={d} sizes="(min-width: 768px) 33vw, 50vw" className="col-span-2 aspect-[16/9] w-full md:col-span-1 md:aspect-[4/5]" />
      </div>
      <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
        <Prose sections={d.pages.traiteur.sections} />
      </div>
      <div className="bg-cream-deep">
        <Catering lang={lang} d={d} withPhoto={false} />
      </div>
    </>
  );
}

/* ——— Restaurant libanais Paris 15 ——— */
function Paris15Page({ lang, d }: { lang: Locale; d: Dict }) {
  return (
    <>
      <PageHead d={d} id="paris15">
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Rating lang={lang} d={d} />
          <OpenStatus />
        </div>
      </PageHead>
      <div className="mx-auto mt-12 grid max-w-7xl gap-3 px-5 md:grid-cols-[1.4fr_1fr] md:px-8">
        <Pic src="/media/salle/salle.jpg" d={d} sizes="(min-width: 768px) 58vw, 100vw" className="aspect-[4/3] w-full" />
        <Pic src="/media/grillades/kafta.jpg" d={d} sizes="(min-width: 768px) 42vw, 100vw" className="aspect-[4/3] w-full md:aspect-auto md:h-full" />
      </div>
      <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
        <Prose sections={d.pages.paris15.sections} />
        <div className="mt-10">
          <Ctas lang={lang} d={d} />
        </div>
      </div>
      <Infos lang={lang} d={d} />
      <Faq lang={lang} d={d} />
    </>
  );
}

/* ——— Bon cadeau ——— */
function CadeauPage({ lang, d }: { lang: Locale; d: Dict }) {
  return (
    <>
      <PageHead d={d} id="cadeau" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 md:grid-cols-2 md:px-8 md:py-16">
        <Pic src="/media/desserts/baklawa.jpg" d={d} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/5] w-full" />
        <div>
          <p className="lead">{d.gift.p}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`tel:${site.phoneIntl}`} className="btn">
              <PhoneIcon className="h-[18px] w-[18px]" />
              {d.gift.cta}
            </a>
            <Link href={pagePath("carte", lang)} className="btn-line">
              {d.nav.seeMenu}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

/* ——— Mentions légales ——— */
function LegalPage({ d }: { d: Dict }) {
  const p = d.pages.legal;
  const todo = <span className="text-gold-ink">[{p.toFill}]</span>;
  return (
    <>
      <PageHead d={d} id="legal" />
      <div className="mx-auto max-w-3xl space-y-8 px-5 py-12 md:px-8 md:py-16">
        <section>
          <h2 className="display text-[1.75rem]">{p.editor}</h2>
          <p className="mt-2 leading-relaxed text-muted" dir="ltr">
            {site.legal.company}, {site.address.street}, {site.address.postalCode} {site.address.city} · {site.phone}
            <br />
            SIRET : {site.legal.siret || todo}
            <br />
            {p.director} : {site.legal.director || todo}
          </p>
        </section>
        <section>
          <h2 className="display text-[1.75rem]">{p.host}</h2>
          <p className="mt-2 text-muted" dir="ltr">
            {site.legal.host}
          </p>
        </section>
        <section>
          <h2 className="display text-[1.75rem]">{p.data}</h2>
          <p className="mt-2 leading-relaxed text-muted">{p.dataText}</p>
        </section>
        <section>
          <h2 className="display text-[1.75rem]">{p.credits}</h2>
          <p className="mt-2 leading-relaxed text-muted">{p.creditsText}</p>
        </section>
      </div>
    </>
  );
}

export default async function Page({ params }: PageProps<"/[lang]/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const id = pageOfSlug(slug, lang);
  if (!id) notFound();
  const d = getDict(lang);
  const body =
    id === "carte" ? <CartePage lang={lang} d={d} /> : id === "reserver" ? <ReserverPage lang={lang} d={d} /> : id === "traiteur" ? <TraiteurPage lang={lang} d={d} /> : id === "paris15" ? <Paris15Page lang={lang} d={d} /> : id === "cadeau" ? <CadeauPage lang={lang} d={d} /> : <LegalPage d={d} />;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd(lang, id)) }} />
      {body}
    </>
  );
}
