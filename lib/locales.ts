// Langues du site, sans les textes : importable côté client sans embarquer les dictionnaires.
// Français par défaut, arabe (de droite à gauche), anglais. Ordre du sélecteur : FR · ع · EN.
export const locales = ["fr", "ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);

export const isRtl = (l: Locale) => l === "ar";
export const dirOf = (l: Locale) => (isRtl(l) ? "rtl" : "ltr");

export const ogLocale: Record<Locale, string> = { fr: "fr_FR", ar: "ar_LB", en: "en_GB" };
// Arabe : chiffres occidentaux (comme au Liban sur les cartes et les prix), calendrier grégorien
export const intlLocale: Record<Locale, string> = { fr: "fr-FR", ar: "ar-LB-u-nu-latn-ca-gregory", en: "en-GB" };
export const langNames: Record<Locale, string> = { fr: "Français", ar: "العربية", en: "English" };
export const langShort: Record<Locale, string> = { fr: "FR", ar: "ع", en: "EN" };
