// Maps Riftbound/Riftcodex rarity strings to light-theme Tailwind classes.
// Rarity values come from the API (e.g. "Common", "Rare", "Showcase"), so we
// match case-insensitively and fall back to a neutral style for anything new.

export interface RarityStyle {
  /** Ring/border for owned tiles. */
  ring: string;
  /** Small pill shown on tiles and in the detail view. */
  badge: string;
}

const STYLES: Record<string, RarityStyle> = {
  common: { ring: "ring-slate-300", badge: "bg-slate-100 text-slate-700" },
  uncommon: { ring: "ring-emerald-400", badge: "bg-emerald-100 text-emerald-700" },
  rare: { ring: "ring-sky-400", badge: "bg-sky-100 text-sky-700" },
  epic: { ring: "ring-fuchsia-400", badge: "bg-fuchsia-100 text-fuchsia-700" },
  legendary: { ring: "ring-amber-400", badge: "bg-amber-100 text-amber-800" },
  mythic: { ring: "ring-rose-400", badge: "bg-rose-100 text-rose-700" },
  showcase: { ring: "ring-violet-400", badge: "bg-violet-100 text-violet-700" },
};

const FALLBACK: RarityStyle = {
  ring: "ring-slate-300",
  badge: "bg-slate-100 text-slate-700",
};

export function rarityStyle(rarity: string | undefined | null): RarityStyle {
  if (!rarity) return FALLBACK;
  return STYLES[rarity.toLowerCase()] ?? FALLBACK;
}
