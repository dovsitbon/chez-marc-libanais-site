import Image from "next/image";
import type { Dict } from "@/lib/i18n";
import { altOf } from "@/lib/text";
import { has, img } from "@/lib/media";
import { Cedar } from "@/components/Cedar";

const TINTS = ["bg-cedar-soft text-cedar", "bg-grenade-soft text-grenade", "bg-gold-soft text-gold-ink", "bg-faience-soft text-faience"];

/**
 * Photo de public/media, recadrée dans son cadre. Si le fichier n'existe pas encore (photo à prendre sur place,
 * voir assets/A-PHOTOGRAPHIER.md), un cèdre au trait dans un cadre fin tient la place : aucune fausse photo.
 */
export function Pic({ src, d, sizes, className = "", priority = false, position = "center", alt, label, tint = 0 }: { src: string; d: Dict; sizes: string; className?: string; priority?: boolean; position?: string; alt?: string; label?: string; tint?: number }) {
  if (!src || !has(src))
    return (
      <div className={`relative flex flex-col items-center justify-center gap-3 p-6 text-center ${TINTS[tint % TINTS.length]} ${className}`} data-photo-slot={src || "vide"}>
        <span className="pointer-events-none absolute inset-3 border border-current opacity-25" aria-hidden="true" />
        <Cedar className="h-14 w-14 opacity-70" strokeWidth={1.8} />
        <span className="max-w-[16rem] text-[0.8125rem] leading-snug opacity-90">{label ?? d.photoSlot}</span>
      </div>
    );
  const i = img(src);
  return (
    <div className={`zoom ${className}`}>
      <Image src={i.src} alt={alt ?? altOf(d, i.src)} width={i.width} height={i.height} sizes={sizes} quality={85} priority={priority} fetchPriority={priority ? "high" : undefined} className="h-full w-full object-cover" style={{ objectPosition: position }} />
    </div>
  );
}
