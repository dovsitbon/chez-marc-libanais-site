import site from "@/data/site.json";
import type { Dict } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { formatDay, formatTime, isoDay, num } from "@/lib/format";
import { addDays, bookingTimes, type Service } from "@/lib/hours";

// Les deux demandes du site : réservation d'une table (booking) et traiteur / groupe (catering).

export const OCCASIONS = ["none", "birthday", "family", "couple", "business", "celebration", "other"] as const;
export type Occasion = (typeof OCCASIONS)[number];
export const CATERING_TYPES = ["traiteur", "groupe"] as const;
export type CateringType = (typeof CATERING_TYPES)[number];
export const WANTS = ["froids", "chauds", "grillades", "assortiments", "patisseries", "boissons"] as const;
export type Want = (typeof WANTS)[number];

type Contact = { name: string; phone: string; email: string; message: string };
export type Booking = Contact & { day: string; service: Service; time: string; guests: number; occasion: Occasion };
export type Catering = Contact & { type: CateringType; day: string; guests: number; wants: Want[]; budget: string };

export const isPhone = (v: string) => /^[+\d][\d\s\-().]{7,19}$/.test(v.trim());
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export const bookingMaxDay = (now: Date) => addDays(isoDay(now), site.booking.daysAhead);
export const cateringMinDay = (now: Date) => addDays(isoDay(now), 2);
export const cateringMaxDay = (now: Date) => addDays(isoDay(now), site.catering.daysAhead);

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const day = (v: unknown) => (ISO.test(str(v, 10)) ? str(v, 10) : "");
// Marge de 10 minutes : le client a pu choisir son heure juste avant qu'elle ne sorte de la liste
const grace = (now: Date) => new Date(now.getTime() - 10 * 60_000);

function contact(o: Record<string, unknown>, emailRequired = false): Contact | null {
  const c = { name: str(o.name, 120), phone: str(o.phone, 30), email: str(o.email, 160), message: str(o.message, 1500) };
  if (!c.name || !isPhone(c.phone)) return null;
  if (c.email && !isEmail(c.email)) c.email = "";
  if (emailRequired && !c.email) return null;
  return c;
}

export function parseBooking(v: unknown, now = new Date()): Booking | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const c = contact(o);
  const d = day(o.day);
  const service = o.service === "midi" || o.service === "soir" ? o.service : null;
  const time = str(o.time, 5);
  const guests = Math.round(Number(o.guests) || 0);
  const occasion = OCCASIONS.includes(o.occasion as Occasion) ? (o.occasion as Occasion) : "none";
  if (!c || !d || !service || d > bookingMaxDay(now) || !bookingTimes(d, service, grace(now)).includes(time) || guests < 1 || guests > site.booking.maxGuests) return null;
  return { ...c, day: d, service, time, guests, occasion };
}

export function parseCatering(v: unknown, now = new Date()): Catering | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const c = contact(o, true);
  const d = day(o.day);
  const guests = Math.round(Number(o.guests) || 0);
  const type = CATERING_TYPES.includes(o.type as CateringType) ? (o.type as CateringType) : null;
  const wants = (Array.isArray(o.wants) ? o.wants : []).filter((w): w is Want => WANTS.includes(w as Want));
  if (!c || !type || !d || d < isoDay(now) || d > cateringMaxDay(now) || guests < site.catering.minGuests || guests > site.catering.maxGuests) return null;
  return { ...c, type, day: d, guests, wants: [...new Set(wants)], budget: str(o.budget, 40) };
}

const colon = (lang: Locale) => (lang === "fr" ? " :" : ":");
const longDay = (iso: string, lang: Locale) => formatDay(iso, lang, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const join = (blocks: (string | false)[]) => blocks.filter(Boolean).join("\n\n");

function who(q: Contact, m: { name: string; phone: string; email: string }, c: string) {
  return [`${m.name}${c} ${q.name}`, `${m.phone}${c} ${q.phone}`, q.email ? `${m.email}${c} ${q.email}` : ""].filter(Boolean).join("\n");
}

export function bookingText(q: Booking, lang: Locale, d: Dict, withContact = true) {
  const m = d.booking.mail;
  const c = colon(lang);
  return join([
    [
      `${m.date}${c} ${longDay(q.day, lang)}`,
      `${m.time}${c} ${formatTime(q.time, lang)} (${d.booking.services[q.service]})`,
      `${m.guests}${c} ${num(q.guests, lang)}`,
      q.occasion !== "none" ? `${m.occasion}${c} ${d.booking.occasions[q.occasion]}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    withContact && who(q, m, c),
    !!q.message && `${m.message}${c}\n${q.message}`,
  ]);
}

export function cateringText(t: Catering, lang: Locale, d: Dict, withContact = true) {
  const m = d.catering.mail;
  const c = colon(lang);
  return join([
    [
      `${m.type}${c} ${d.catering.types[t.type]}`,
      `${m.date}${c} ${longDay(t.day, lang)}`,
      `${m.guests}${c} ${num(t.guests, lang)}`,
      t.wants.length ? `${m.wants}${c} ${t.wants.map((w) => d.catering.wants[w]).join(", ")}` : "",
      t.budget ? `${m.budget}${c} ${t.budget}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    withContact && who(t, m, c),
    !!t.message && `${m.message}${c}\n${t.message}`,
  ]);
}

/** Lien WhatsApp (vide tant que Marc n'a pas confirmé un portable : data/site.json → whatsapp). */
export const waLink = (text: string) => (site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}` : "");
