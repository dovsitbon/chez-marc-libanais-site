import Link from "next/link";
import site from "@/data/site.json";
import { FullLogo } from "@/components/Logo";
import { InstagramIcon, PhoneIcon } from "@/components/icons";
import { LangSwitch } from "@/components/LangSwitch";
import { formatTime, num } from "@/lib/format";
import { weekHours } from "@/lib/hours";
import { fill, type Dict, type Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/pages";

export function Footer({ lang, d }: { lang: Locale; d: Dict }) {
  const w = weekHours();
  const range = ([a, b]: string[]) => `${formatTime(a, lang)} – ${formatTime(b, lang)}`;
  // Horaires du dimanche (référence) ; le soir du lundi se termine plus tôt
  const ref = w[6];
  const mondayEnd = w[0][1]?.[1];
  const links = [
    { href: pagePath("carte", lang), label: d.pages.carte.title },
    { href: pagePath("reserver", lang), label: d.pages.reserver.title },
    { href: pagePath("traiteur", lang), label: d.pages.traiteur.title },
    { href: pagePath("paris15", lang), label: d.pages.paris15.title },
    { href: pagePath("cadeau", lang), label: d.pages.cadeau.title },
  ];
  return (
    <footer className="lattice bg-cedar-deep text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.2fr_1fr_1fr_1fr] md:px-8 md:py-16">
        <div>
          <FullLogo light className="h-36 w-auto" />
          <p className="mt-4 max-w-xs text-cream/80">{d.footer.tagline}</p>
        </div>
        <div>
          <h2 className="text-[0.9375rem] font-medium text-gold">{d.infos.address}</h2>
          <address className="mt-3 leading-relaxed not-italic" dir="ltr">
            Chez Marc
            <br />
            {site.address.street}
            <br />
            {site.address.postalCode} {site.address.city}
          </address>
          <a href={`tel:${site.phoneIntl}`} className="mt-3 inline-flex min-h-11 items-center gap-2 tabular-nums hover:underline" dir="ltr">
            <PhoneIcon className="h-4 w-4" />
            {site.phone}
          </a>
          <br />
          <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="link-line inline-flex min-h-11 items-center">
            {d.nav.directions}
          </a>
        </div>
        <div>
          <h2 className="text-[0.9375rem] font-medium text-gold">{d.footer.hours}</h2>
          <p className="mt-3 leading-relaxed">
            {d.footer.everyday}
            <br />
            <span className="tabular-nums">{ref.map(range).join(" · ")}</span>
          </p>
          {mondayEnd && mondayEnd !== ref[1]?.[1] && <p className="mt-2 text-cream/75">{fill(d.footer.mondayEvening, { time: formatTime(mondayEnd, lang) })}</p>}
        </div>
        <div>
          <h2 className="text-[0.9375rem] font-medium text-gold">{d.footer.pages}</h2>
          <ul className="mt-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-10 items-center hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="h-px bg-cream/15" />
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 text-[0.875rem] md:px-8">
        <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 hover:underline" dir="ltr">
          <InstagramIcon className="h-5 w-5" />
          {site.instagramHandle}
        </a>
        <div className="flex items-center gap-6">
          <Link href={pagePath("legal", lang)} className="inline-flex min-h-11 items-center hover:underline">
            {d.footer.legal}
          </Link>
          <LangSwitch lang={lang} label={d.nav.lang} />
        </div>
        <p className="w-full text-cream/70 md:w-auto">
          © {num(new Date().getFullYear(), lang, { useGrouping: false })} {d.footer.rights}
        </p>
      </div>
    </footer>
  );
}
