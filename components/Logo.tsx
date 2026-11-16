import { Cedar } from "@/components/Cedar";

/**
 * Logo en ligne de l'en-tête : le cèdre au trait, « CHEZ MARC » en capitales à empattements, « Restaurant libanais · Paris 15 ».
 * Le logo complet (« CHEZ / Marc / — CUISINE LIBANAISE — / cèdre ») est dans public/logo.svg ; pour mettre le fichier
 * d'origine de Marc, remplacez public/logo.svg et public/logo-clair.svg (mêmes noms).
 */
export function Logo({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <span dir="ltr" className={`flex items-center gap-2.5 ${light ? "text-cream" : "text-cedar"} ${className}`}>
      <Cedar className="h-9 w-9 shrink-0 md:h-10 md:w-10" strokeWidth={2.6} />
      <span className="flex flex-col leading-none">
        <span className="font-[family-name:var(--font-display)] text-[1.5rem] font-semibold tracking-[0.12em] md:text-[1.6875rem]">CHEZ MARC</span>
        <span className={`mt-1 font-[family-name:var(--font-body)] text-[0.5625rem] font-medium tracking-[0.24em] md:text-[0.625rem] ${light ? "text-cream/75" : "text-muted"}`}>RESTAURANT LIBANAIS · PARIS 15</span>
      </span>
    </span>
  );
}

/** Logo complet (fichier public/logo.svg ou logo-clair.svg sur fond sombre). */
export function FullLogo({ light = false, className = "h-40 w-auto" }: { light?: boolean; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- SVG vectoriel, pas besoin de next/image
  return <img src={light ? "/logo-clair.svg" : "/logo.svg"} alt="Chez Marc, cuisine libanaise" width={320} height={300} className={className} />;
}
