import type { Locale } from "@/lib/locales";

// Pages secondaires et leurs adresses dans chaque langue (l'arabe garde des adresses latines, plus faciles à partager).
export const PAGE_IDS = ["carte", "reserver", "traiteur", "paris15", "cadeau", "legal"] as const;
export type PageId = (typeof PAGE_IDS)[number];

export const SLUGS: Record<PageId, Record<Locale, string>> = {
  carte: { fr: "carte", ar: "menu", en: "menu" },
  reserver: { fr: "reserver", ar: "book-a-table", en: "book-a-table" },
  traiteur: { fr: "traiteur-libanais-paris", ar: "lebanese-catering-paris", en: "lebanese-catering-paris" },
  paris15: { fr: "restaurant-libanais-paris-15", ar: "lebanese-restaurant-paris-15", en: "lebanese-restaurant-paris-15" },
  cadeau: { fr: "bon-cadeau", ar: "gift-voucher", en: "gift-voucher" },
  legal: { fr: "mentions-legales", ar: "legal", en: "legal" },
};

export const pagePath = (id: PageId, lang: Locale) => `/${lang}/${SLUGS[id][lang]}`;

export const pageOfSlug = (slug: string, lang: Locale) => PAGE_IDS.find((id) => SLUGS[id][lang] === slug) ?? null;
