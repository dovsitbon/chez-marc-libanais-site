// Le cèdre du Liban au trait (mêmes tracés que scripts/draw.mjs, utilisés pour le logo et le favicon).
// Comme sur le drapeau : des étages plats et larges, aux pointes tombantes.

const tier = (y: number, w: number) => `M${32 - w} ${y + 3.2}c${w * 0.22} -1.6 ${w * 0.55} -3.2 ${w} -3.2s${w * 0.78} 1.6 ${w} 3.2`;
export const CEDAR = ["M32 6v50", "M29 11.5 32 7l3 4.5", tier(16, 9), tier(24, 15), tier(32, 21), tier(40, 25), tier(48, 28), "M26 59h12"];

type P = { className?: string; strokeWidth?: number };

export function Cedar({ className = "h-8 w-8", strokeWidth = 2.4 }: P) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {CEDAR.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

/** Étoile à huit branches au trait (motif des carreaux orientaux), pour les petits repères. */
export function Star8({ className = "h-4 w-4" }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2.5l2.7 6.8 6.8 2.7-6.8 2.7-2.7 6.8-2.7-6.8L2.5 12l6.8-2.7z" />
      <path d="M5.3 5.3h13.4v13.4H5.3z" />
    </svg>
  );
}

/** Petit drapeau « suggestion du chef », comme sur la carte du restaurant. */
export function Flag({ className = "h-3.5 w-3.5" }: P) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path d="M3 1.5v13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M4 2.2h9l-2 2.8 2 2.8H4z" fill="currentColor" />
    </svg>
  );
}

/** Frise d'arcades fines (filet de séparation). */
export function Frieze({ className = "" }: P) {
  return <div className={`frieze ${className}`} aria-hidden="true" />;
}
