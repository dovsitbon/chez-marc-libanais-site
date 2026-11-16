"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { motion } from "motion/react";
import { useLocale } from "@/components/providers";
import { Flag } from "@/components/Cedar";
import { ArrowIcon } from "@/components/icons";
import { CATEGORIES, type Category, type Item } from "@/lib/carte";
import { price } from "@/lib/format";
import { pagePath } from "@/lib/pages";
import type { Dict, Locale } from "@/lib/i18n";

/** Une ligne de la carte : nom, nom arabe et transcription, description courte, prix. */
export function ItemRow({ it, lang, d }: { it: Item; lang: Locale; d: Dict }) {
  const t = it[lang];
  const second = lang === "ar" ? it.translit : it.arabic;
  return (
    <li className="border-b border-line py-5 last:border-0">
      <div className="flex items-baseline gap-3">
        <h3 className="display text-[1.375rem] leading-tight md:text-[1.5rem]">{t.name}</h3>
        {it.signature && (
          <span className="inline-flex shrink-0 translate-y-[-1px] text-grenade" title={d.carte.signature}>
            <Flag />
            <span className="sr-only">{d.carte.signature}</span>
          </span>
        )}
        {it.veg && (
          <abbr title={d.carte.veg} className="shrink-0 text-[0.8125rem] font-medium text-cedar no-underline">
            {d.carte.vegShort}
          </abbr>
        )}
        <span className="mx-1 min-w-6 flex-1 translate-y-[-4px] border-b border-dotted border-gold/70" aria-hidden="true" />
        <span className="shrink-0 text-[1.0625rem] font-medium tabular-nums" dir="ltr">
          {it.price !== null ? (
            <>
              {t.note && it.id === "vins-libanais" ? <span className="me-1 text-[0.8125rem] font-normal text-muted">{t.note}</span> : null}
              {price(it.price, lang)}
            </>
          ) : (
            <span className="text-[0.875rem] font-normal text-muted">{d.carte.priceOnSite}</span>
          )}
        </span>
      </div>
      <p className="mt-0.5 flex flex-wrap items-baseline gap-x-2 text-[0.9375rem]">
        <span lang={lang === "ar" ? "fr" : "ar"} dir={lang === "ar" ? "ltr" : "rtl"} className={lang === "ar" ? "text-gold-ink italic" : "font-[family-name:var(--font-ar)] text-[1.0625rem] text-grenade"}>
          {second}
        </span>
        {lang !== "ar" && it.translit !== t.name && <span className="font-[family-name:var(--font-display)] text-[1.0625rem] text-gold-ink italic">{it.translit}</span>}
      </p>
      {t.desc && <p className="mt-1.5 max-w-xl text-[0.9375rem] leading-relaxed text-muted">{t.desc}</p>}
      {(t.note && it.id !== "vins-libanais") || it.check ? (
        <p className="mt-1.5 text-[0.8125rem] text-gold-ink">{[it.id !== "vins-libanais" ? t.note : "", it.check ? d.carte.toCheck : ""].filter(Boolean).join(" · ")}</p>
      ) : null}
    </li>
  );
}

export function CategoryList({ c, lang, d, limit }: { c: Category; lang: Locale; d: Dict; limit?: number }) {
  const items = limit ? c.items.slice(0, limit) : c.items;
  return (
    <ul className="grid gap-x-14 md:grid-cols-2">
      {items.map((it) => (
        <ItemRow key={it.id} it={it} lang={lang} d={d} />
      ))}
    </ul>
  );
}

/** Onglets de la carte (accueil) : toutes les rubriques sont dans le HTML, une seule visible à la fois. */
export function MenuTabs({ limit }: { limit?: number }) {
  const { lang, d } = useLocale();
  const [active, setActive] = useState(CATEGORIES[0].id);
  const uid = useId();

  return (
    <div>
      <div role="tablist" aria-label={d.carte.tabsLabel} className="tabs -mx-5 flex gap-1 overflow-x-auto border-b border-line px-5 md:mx-0 md:px-0">
        {CATEGORIES.map((c) => {
          const on = c.id === active;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              id={`${uid}-tab-${c.id}`}
              aria-selected={on}
              aria-controls={`${uid}-panel-${c.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(c.id)}
              onKeyDown={(e) => {
                const i = CATEGORIES.findIndex((x) => x.id === active);
                const dir = (e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0) * (lang === "ar" ? -1 : 1);
                if (!dir) return;
                const next = CATEGORIES[(i + dir + CATEGORIES.length) % CATEGORIES.length];
                setActive(next.id);
                document.getElementById(`${uid}-tab-${next.id}`)?.focus();
              }}
              className={`relative min-h-12 shrink-0 px-4 text-[0.9375rem] whitespace-nowrap transition-colors ${on ? "text-ink" : "text-muted hover:text-ink"}`}
            >
              {c[lang]}
              {on && <motion.span layoutId={`${uid}-bar`} className="absolute inset-x-3 -bottom-px h-[2px] bg-grenade" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
            </button>
          );
        })}
      </div>
      {CATEGORIES.map((c) => (
        <div key={c.id} role="tabpanel" id={`${uid}-panel-${c.id}`} aria-labelledby={`${uid}-tab-${c.id}`} hidden={c.id !== active} className="pt-4">
          <CategoryList c={c} lang={lang} d={d} limit={limit} />
          {limit && c.items.length > limit ? (
            <Link href={`${pagePath("carte", lang)}#${c.id}`} className="link-line mt-6 inline-flex min-h-11 items-center gap-2 text-cedar">
              {d.carte.seeAll} · {c[lang]}
              <ArrowIcon className="h-4 w-4 rtl:-scale-x-100" />
            </Link>
          ) : null}
        </div>
      ))}
    </div>
  );
}
