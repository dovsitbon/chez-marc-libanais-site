import fr from "@/locales/fr.json";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";
import type { Locale } from "@/lib/locales";

export { defaultLocale, dirOf, intlLocale, isLocale, isRtl, langNames, langShort, locales, ogLocale, type Locale } from "@/lib/locales";
export type Dict = typeof fr;

const dictionaries: Record<Locale, Dict> = { fr, ar, en };

export const getDict = (lang: Locale): Dict => dictionaries[lang];

export { fill, altOf } from "@/lib/text";
