"use client";

import { useEffect, useMemo, useState } from "react";
import { Lock, SlidersHorizontal, X, Loader2, AlertTriangle } from "lucide-react";

import { getCards, type RiftcodexCard } from "@/lib/riftcodex";
import {
  getOwnership,
  subscribe,
  unlockCard,
  resetCard,
  type OwnershipMap,
  type OwnershipSource,
} from "@/lib/collection-store";
import { rarityStyle } from "./rarity";
import CardDetail from "./CardDetail";

const CATALOG_LIMIT = 60;

type OwnershipFilter =
  | "all"
  | "owned"
  | "physical"
  | "digital"
  | "both"
  | "not";

const OWNERSHIP_OPTIONS: { value: OwnershipFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "owned", label: "Owned" },
  { value: "physical", label: "Physical" },
  { value: "digital", label: "Digital" },
  { value: "both", label: "Both" },
  { value: "not", label: "Not owned" },
];

function ownedBadge(physical: boolean, digital: boolean): string | null {
  if (physical && digital) return "P+D";
  if (physical) return "P";
  if (digital) return "D";
  return null;
}

export default function CollectionPage() {
  const [cards, setCards] = useState<RiftcodexCard[]>([]);
  const [ownership, setOwnership] = useState<OwnershipMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Filters
  const [ownerFilter, setOwnerFilter] = useState<OwnershipFilter>("all");
  const [rarity, setRarity] = useState<string>("all");
  const [set, setSet] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Load the catalog from Riftcodex.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getCards({ limit: CATALOG_LIMIT })
      .then((res) => {
        if (cancelled) return;
        setCards((res.items ?? []).slice(0, CATALOG_LIMIT));
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load cards.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  // Sync ownership from the shared store (and keep in sync with scanner/packs).
  useEffect(() => {
    setOwnership(getOwnership());
    return subscribe(() => setOwnership(getOwnership()));
  }, []);

  const rarities = useMemo(
    () =>
      Array.from(
        new Set(cards.map((c) => c.classification?.rarity).filter(Boolean))
      ).sort() as string[],
    [cards]
  );
  const sets = useMemo(
    () =>
      Array.from(
        new Set(cards.map((c) => c.set?.label).filter(Boolean))
      ).sort() as string[],
    [cards]
  );

  const stats = useMemo(() => {
    let collected = 0;
    let physical = 0;
    let digital = 0;
    for (const c of cards) {
      const e = ownership[c.id];
      if (e?.physical || e?.digital) collected++;
      if (e?.physical) physical++;
      if (e?.digital) digital++;
    }
    return { collected, physical, digital, total: cards.length };
  }, [cards, ownership]);

  const filtered = useMemo(() => {
    return cards.filter((c) => {
      const e = ownership[c.id];
      const p = !!e?.physical;
      const d = !!e?.digital;
      const matchOwner =
        ownerFilter === "all"
          ? true
          : ownerFilter === "owned"
          ? p || d
          : ownerFilter === "physical"
          ? p
          : ownerFilter === "digital"
          ? d
          : ownerFilter === "both"
          ? p && d
          : !p && !d; // "not"
      const matchRarity = rarity === "all" || c.classification?.rarity === rarity;
      const matchSet = set === "all" || c.set?.label === set;
      return matchOwner && matchRarity && matchSet;
    });
  }, [cards, ownership, ownerFilter, rarity, set]);

  const hasActiveFilters =
    ownerFilter !== "all" || rarity !== "all" || set !== "all";

  function clearFilters() {
    setOwnerFilter("all");
    setRarity("all");
    setSet("all");
  }

  const selected = cards.find((c) => c.id === selectedId) ?? null;
  const pct =
    stats.total > 0 ? Math.round((stats.collected / stats.total) * 100) : 0;

  return (
    <main className="px-4 pb-10 pt-4">
      {/* Header */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Your Collection</h1>
          <p className="mt-0.5 text-xs text-neutral-500">
            Scan a physical card or open a pack to start collecting.
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold tabular-nums leading-none">
            {stats.collected}
            <span className="text-sm font-normal text-neutral-500">
              {" "}
              / {stats.total}
            </span>
          </p>
          <p className="mt-1 text-[11px] text-neutral-500">
            P {stats.physical} · D {stats.digital}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full rounded-full bg-neutral-800 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Ownership chips + filters toggle */}
      <div className="mt-3 flex items-center gap-2">
        <div className="-mx-1 flex flex-1 gap-1.5 overflow-x-auto px-1 pb-1">
          {OWNERSHIP_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => setOwnerFilter(o.value)}
              className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${
                ownerFilter === o.value
                  ? "border-neutral-800 bg-neutral-800 text-white"
                  : "border-neutral-300 bg-white text-neutral-600"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className={`relative shrink-0 rounded-full border p-2 ${
            rarity !== "all" || set !== "all"
              ? "border-neutral-800 text-neutral-800"
              : "border-neutral-300 text-neutral-500"
          }`}
          aria-label="More filters"
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>

      {/* Rarity / set selects */}
      {showFilters && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          <select
            value={rarity}
            onChange={(e) => setRarity(e.target.value)}
            className="rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-sm"
          >
            <option value="all">All rarities</option>
            {rarities.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select
            value={set}
            onChange={(e) => setSet(e.target.value)}
            className="rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-sm"
          >
            <option value="all">All sets</option>
            {sets.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Result count + clear */}
      <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
        <span>
          {filtered.length} {filtered.length === 1 ? "card" : "cards"}
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 font-medium text-neutral-700"
          >
            <X size={13} /> Clear filters
          </button>
        )}
      </div>

      {/* States */}
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-2 py-20 text-neutral-400">
          <Loader2 className="animate-spin" />
          <span className="text-sm">Loading cards…</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <AlertTriangle className="text-red-500" />
          <p className="max-w-[260px] text-sm text-neutral-500">
            Couldn&apos;t load the card catalog. {error}
          </p>
          <button
            onClick={() => setReloadKey((k) => k + 1)}
            className="rounded-lg bg-neutral-800 px-4 py-2 text-sm font-medium text-white"
          >
            Try again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-neutral-400">
          No cards match these filters.
        </p>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {filtered.map((card) => {
            const e = ownership[card.id];
            const owned = !!(e?.physical || e?.digital);
            const r = rarityStyle(card.classification?.rarity);
            const badge = ownedBadge(!!e?.physical, !!e?.digital);
            return (
              <button
                key={card.id}
                onClick={() => setSelectedId(card.id)}
                className={`group relative overflow-hidden rounded-xl text-left transition ${
                  owned ? `ring-2 ${r.ring}` : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.media?.image_url}
                  alt={owned ? card.name : "Locked card"}
                  loading="lazy"
                  className={`aspect-[5/7] w-full object-cover ${
                    owned ? "" : "opacity-40 grayscale"
                  }`}
                />

                {badge && (
                  <span
                    className={`absolute right-1.5 top-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${r.badge}`}
                  >
                    {badge}
                  </span>
                )}

                {!owned && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Lock className="size-6 text-neutral-600" />
                  </span>
                )}

                <span className="block truncate px-1 py-1 text-[11px] font-medium text-neutral-700">
                  {owned ? card.name : "Locked"}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Detail */}
      {selected && (
        <CardDetail
          card={selected}
          entry={ownership[selected.id] ?? null}
          onClose={() => setSelectedId(null)}
          onMark={(source: OwnershipSource) => unlockCard(selected.id, source)}
          onReset={() => resetCard(selected.id)}
        />
      )}
    </main>
  );
}
