"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import site from "@/data/site.json";
import { useLocale } from "@/components/providers";
import { CheckIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { fill } from "@/lib/text";
import { formatTime, isoDay } from "@/lib/format";
import { bookingTimes, serviceSlot, type Service } from "@/lib/hours";
import { pagePath } from "@/lib/pages";
import type { Locale } from "@/lib/locales";
import { bookingMaxDay, cateringMaxDay, cateringMinDay, CATERING_TYPES, isEmail, isPhone, OCCASIONS, WANTS, type CateringType, type Occasion, type Want } from "@/lib/requests";

type Result = { notified: boolean; confirmed: boolean; wa: string };

function Field({ label, hint, error, id, children }: { label: ReactNode; hint?: ReactNode; error?: string; id: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-[0.875rem] text-grenade" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-[0.8125rem] text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

const Opt = ({ children }: { children: ReactNode }) => <span className="font-normal text-muted"> ({children})</span>;

/** Coordonnées communes aux deux formulaires. */
function ContactFields({ v, set, errors, emailRequired, placeholder }: { v: Record<string, string>; set: (k: string, val: string) => void; errors: Record<string, string>; emailRequired: boolean; placeholder: string }) {
  const { d } = useLocale();
  const f = d.form;
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="f-name" label={f.name} error={errors.name}>
          <input id="f-name" name="name" autoComplete="name" className="field" value={v.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "f-name-err" : undefined} />
        </Field>
        <Field id="f-phone" label={f.phone} error={errors.phone}>
          <input id="f-phone" name="tel" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" className="field rtl:text-end" value={v.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "f-phone-err" : undefined} />
        </Field>
      </div>
      <Field id="f-email" label={<>{f.email}{!emailRequired && <Opt>{f.emailOptional}</Opt>}</>} error={errors.email}>
        <input id="f-email" name="email" type="email" inputMode="email" autoComplete="email" dir="ltr" className="field rtl:text-end" value={v.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "f-email-err" : undefined} />
      </Field>
      <Field id="f-message" label={<>{f.message}<Opt>{f.optional}</Opt></>}>
        <textarea id="f-message" name="message" className="field" placeholder={placeholder} value={v.message} onChange={(e) => set("message", e.target.value)} />
      </Field>
      {/* Champ piège pour les robots, invisible pour les personnes */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" onChange={(e) => set("website", e.target.value)} />
    </>
  );
}

function checkContact(v: Record<string, string>, f: { required: string; invalidPhone: string; invalidEmail: string }, emailRequired: boolean) {
  const e: Record<string, string> = {};
  if (!v.name.trim()) e.name = f.required;
  if (!v.phone.trim()) e.phone = f.required;
  else if (!isPhone(v.phone)) e.phone = f.invalidPhone;
  if (emailRequired && !v.email.trim()) e.email = f.required;
  else if (v.email.trim() && !isEmail(v.email)) e.email = f.invalidEmail;
  return e;
}

async function send(kind: "booking" | "catering", lang: Locale, data: Record<string, unknown>, website: string) {
  const r = await fetch("/api/demande", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ kind, lang, data, website }) });
  if (!r.ok) throw new Error(String(r.status));
  return (await r.json()) as Result;
}

/** Écran de fin : merci, et l'appel si l'e-mail n'a pas pu partir (Resend non configuré). */
function Done({ title, text, emailText, res, onAgain }: { title: string; text: string; emailText: string; res: Result; onAgain: () => void }) {
  const { d } = useLocale();
  return (
    <div className="fade-in py-4" role="status">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cedar text-paper">
        <CheckIcon className="h-6 w-6" />
      </span>
      <h3 className="display mt-5 text-[2rem]">{title}</h3>
      <p className="mt-2 text-muted">{text}</p>
      {res.confirmed && <p className="mt-2 text-muted">{emailText}</p>}
      {!res.notified && <p className="mt-4 border-s-2 border-gold ps-4 text-[0.9375rem]">{d.form.notNotified}</p>}
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={`tel:${site.phoneIntl}`} className={res.notified ? "btn-line" : "btn"}>
          <PhoneIcon className="h-[18px] w-[18px]" />
          {d.form.callNow} <span dir="ltr">{site.phone}</span>
        </a>
        {res.wa && (
          <a href={res.wa} target="_blank" rel="noopener noreferrer" className="btn-line">
            <WhatsAppIcon className="h-5 w-5" />
            {d.form.whatsapp}
          </a>
        )}
      </div>
      <button type="button" onClick={onAgain} className="link-line mt-6 min-h-11 text-[0.9375rem] text-muted">
        {d.form.again}
      </button>
    </div>
  );
}

const waText = (title: string, lines: (string | false)[]) => (site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent([title, ...lines.filter(Boolean)].join("\n"))}` : "");

/* ——————————— Réservation ——————————— */
export function BookingForm() {
  const { lang, d } = useLocale();
  const b = d.booking;
  const [now, setNow] = useState<Date | null>(null);
  const [day, setDay] = useState("");
  const [service, setService] = useState<Service>("soir");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState("2");
  const [occasion, setOccasion] = useState<Occasion>("none");
  const [v, setV] = useState<Record<string, string>>({ name: "", phone: "", email: "", message: "", website: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [res, setRes] = useState<Result | null>(null);

  useEffect(() => {
    const n = new Date();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- l'heure du navigateur n'est connue qu'après hydratation
    setNow(n);
    const today = isoDay(n);
    setDay(today);
    // Après le service du midi, on propose le soir ; le matin, le midi
    setService(bookingTimes(today, "midi", n).length ? "midi" : "soir");
  }, []);

  const times = useMemo(() => (now && day ? bookingTimes(day, service, now) : []), [now, day, service]);
  const open = day ? !!serviceSlot(day, service) : true;
  // Garde l'heure choisie si elle existe encore, sinon la première proposée
  const t = times.includes(time) ? time : (times[0] ?? "");

  const set = (k: string, val: string) => setV((p) => ({ ...p, [k]: val }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    const errs = checkContact(v, d.form, false);
    if (!t) errs.time = b.noTime;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setState("sending");
    try {
      const data = { day, service, time: t, guests: Number(guests), occasion, name: v.name, phone: v.phone, email: v.email, message: v.message };
      const r = await send("booking", lang, data, v.website);
      r.wa = waText(b.mail.title, [`${b.mail.date} : ${day}`, `${b.mail.time} : ${t}`, `${b.mail.guests} : ${guests}`, `${b.mail.name} : ${v.name}`, `${b.mail.phone} : ${v.phone}`, !!v.message && v.message]);
      setRes(r);
      setState("idle");
    } catch {
      setState("error");
    }
  }

  if (res) return <Done title={b.sentTitle} text={b.sentText} emailText={b.sentEmail} res={res} onAgain={() => setRes(null)} />;

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="b-day" label={b.day} error={!open ? b.closedDay : undefined}>
          <input id="b-day" type="date" className="field" value={day} min={now ? isoDay(now) : undefined} max={now ? bookingMaxDay(now) : undefined} onChange={(e) => setDay(e.target.value)} required />
        </Field>
        <fieldset>
          <legend className="label">{b.service}</legend>
          <div className="flex gap-2">
            {(["midi", "soir"] as const).map((s) => (
              <label key={s} className="chip flex-1 justify-center">
                <input type="radio" name="service" value={s} checked={service === s} onChange={() => setService(s)} className="sr-only" />
                {b.services[s]}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="b-time" label={b.time} error={errors.time && !t ? errors.time : undefined} hint={open && now && !times.length ? b.noTime : undefined}>
          <select id="b-time" className="field tabular-nums" value={t} onChange={(e) => setTime(e.target.value)} disabled={!times.length}>
            {times.map((x) => (
              <option key={x} value={x}>
                {formatTime(x, lang)}
              </option>
            ))}
          </select>
        </Field>
        <Field
          id="b-guests"
          label={b.guests}
          hint={
            <>
              {fill(b.guestsHint, { max: site.booking.maxGuests })}{" "}
              <Link href={`${pagePath("traiteur", lang)}#devis`} className="link-line text-cedar">
                {b.groupLink}
              </Link>
            </>
          }
        >
          <select id="b-guests" className="field tabular-nums" value={guests} onChange={(e) => setGuests(e.target.value)}>
            {Array.from({ length: site.booking.maxGuests }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field id="b-occasion" label={<>{b.occasion}<Opt>{b.occasionOptional}</Opt></>}>
        <select id="b-occasion" className="field" value={occasion} onChange={(e) => setOccasion(e.target.value as Occasion)}>
          {OCCASIONS.map((o) => (
            <option key={o} value={o}>
              {b.occasions[o]}
            </option>
          ))}
        </select>
      </Field>
      <ContactFields v={v} set={set} errors={errors} emailRequired={false} placeholder={b.messagePlaceholder} />
      {state === "error" && (
        <p className="text-[0.9375rem] text-grenade" role="alert">
          {d.form.error}
        </p>
      )}
      <button type="submit" className="btn w-full sm:w-auto" disabled={state === "sending"}>
        {state === "sending" ? d.form.sending : b.submit}
      </button>
      <p className="text-[0.8125rem] text-muted">{b.note}</p>
      <p className="text-[0.8125rem] text-muted">{d.form.privacy}</p>
    </form>
  );
}

/* ——————————— Traiteur et groupes ——————————— */
export function CateringForm() {
  const { lang, d } = useLocale();
  const c = d.catering;
  const [now, setNow] = useState<Date | null>(null);
  const [type, setType] = useState<CateringType>("traiteur");
  const [day, setDay] = useState("");
  const [guests, setGuests] = useState("");
  const [wants, setWants] = useState<Want[]>([]);
  const [budget, setBudget] = useState("");
  const [v, setV] = useState<Record<string, string>>({ name: "", phone: "", email: "", message: "", website: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [res, setRes] = useState<Result | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- l'heure du navigateur n'est connue qu'après hydratation
    setNow(new Date());
  }, []);

  const set = (k: string, val: string) => setV((p) => ({ ...p, [k]: val }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    const errs = checkContact(v, d.form, true);
    if (!day) errs.day = d.form.required;
    const g = Number(guests);
    if (!g || g < site.catering.minGuests || g > site.catering.maxGuests) errs.guests = fill(c.guestsHint, { min: site.catering.minGuests });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setState("sending");
    try {
      const data = { type, day, guests: g, wants, budget, name: v.name, phone: v.phone, email: v.email, message: v.message };
      const r = await send("catering", lang, data, v.website);
      r.wa = waText(c.mail.title, [`${c.mail.type} : ${c.types[type]}`, `${c.mail.date} : ${day}`, `${c.mail.guests} : ${g}`, wants.length > 0 && `${c.mail.wants} : ${wants.map((w) => c.wants[w]).join(", ")}`, `${c.mail.name} : ${v.name}`, `${c.mail.phone} : ${v.phone}`, !!v.message && v.message]);
      setRes(r);
      setState("idle");
    } catch {
      setState("error");
    }
  }

  if (res) return <Done title={c.sentTitle} text={c.sentText} emailText={c.sentEmail} res={res} onAgain={() => setRes(null)} />;

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <fieldset>
        <legend className="label">{c.type}</legend>
        <div className="flex flex-wrap gap-2">
          {CATERING_TYPES.map((x) => (
            <label key={x} className="chip">
              <input type="radio" name="type" value={x} checked={type === x} onChange={() => setType(x)} className="sr-only" />
              {c.types[x]}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="c-day" label={c.day} error={errors.day}>
          <input id="c-day" type="date" className="field" value={day} min={now ? cateringMinDay(now) : undefined} max={now ? cateringMaxDay(now) : undefined} onChange={(e) => setDay(e.target.value)} aria-invalid={!!errors.day} />
        </Field>
        <Field id="c-guests" label={c.guests} error={errors.guests} hint={fill(c.guestsHint, { min: site.catering.minGuests })}>
          <input id="c-guests" type="number" inputMode="numeric" min={site.catering.minGuests} max={site.catering.maxGuests} className="field tabular-nums" value={guests} onChange={(e) => setGuests(e.target.value)} aria-invalid={!!errors.guests} />
        </Field>
      </div>
      <fieldset>
        <legend className="label">{c.wantsLabel}</legend>
        <div className="flex flex-wrap gap-2">
          {WANTS.map((w) => (
            <label key={w} className="chip">
              <input type="checkbox" checked={wants.includes(w)} onChange={(e) => setWants((p) => (e.target.checked ? [...p, w] : p.filter((x) => x !== w)))} className="sr-only" />
              {c.wants[w]}
            </label>
          ))}
        </div>
      </fieldset>
      <Field id="c-budget" label={<>{c.budget}<Opt>{c.budgetOptional}</Opt></>}>
        <input id="c-budget" className="field sm:max-w-56" placeholder={c.budgetPlaceholder} value={budget} onChange={(e) => setBudget(e.target.value)} />
      </Field>
      <ContactFields v={v} set={set} errors={errors} emailRequired placeholder={c.messagePlaceholder} />
      {state === "error" && (
        <p className="text-[0.9375rem] text-grenade" role="alert">
          {d.form.error}
        </p>
      )}
      <button type="submit" className="btn w-full sm:w-auto" disabled={state === "sending"}>
        {state === "sending" ? d.form.sending : c.submit}
      </button>
      <p className="text-[0.8125rem] text-muted">{d.form.privacy}</p>
    </form>
  );
}
