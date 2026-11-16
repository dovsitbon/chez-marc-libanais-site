"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { CEDAR } from "@/components/Cedar";

/**
 * Effet d'ouverture (1,2 s, une fois par session) : fond crème, un cèdre du Liban se dessine au trait vert,
 * « CHEZ MARC » apparaît, puis « RESTAURANT LIBANAIS », fondu sur le hero.
 * Styles dans globals.css (.intro-*). Masqué d'office si déjà vu ou si l'utilisateur préfère réduire les animations.
 */
export function Intro({ skipLabel, tagline }: { skipLabel: string; tagline: string }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem("chezmarc-intro", "1");
    } catch {}
    const t = setTimeout(() => setGone(true), 1250);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;
  return (
    <div className="intro-curtain">
      <svg viewBox="0 0 64 64" className="h-24 w-24 text-cedar md:h-28 md:w-28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {CEDAR.map((d, i) => (
          <path key={d} className="intro-draw" d={d} pathLength={1} style={{ "--i": i } as CSSProperties} />
        ))}
      </svg>
      <p dir="ltr" className="intro-word mt-5 font-[family-name:var(--font-display)] text-[2.25rem] font-semibold tracking-[0.14em] text-cedar md:text-[2.75rem]" aria-hidden="true">
        CHEZ MARC
      </p>
      <p dir="ltr" className="intro-word intro-word-2 mt-1 font-[family-name:var(--font-body)] text-[0.75rem] font-medium tracking-[0.38em] text-grenade" aria-hidden="true">
        {tagline}
      </p>
      <button type="button" onClick={() => setGone(true)} className="absolute end-5 bottom-5 min-h-11 px-3 text-sm text-muted underline underline-offset-4">
        {skipLabel}
      </button>
    </div>
  );
}
