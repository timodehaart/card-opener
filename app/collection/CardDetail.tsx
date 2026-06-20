"use client";

import { X, ScanLine, PackageOpen, RotateCcw } from "lucide-react";

import type { RiftcodexCard } from "@/lib/riftcodex";
import type { OwnedEntry, OwnershipSource } from "@/lib/collection-store";
import { rarityStyle } from "./rarity";

function Stamp({ source }: { source: OwnershipSource }) {
  const physical = source === "physical";
  return (
    <span
      className={`inline-flex select-none items-center rounded-md border-[3px] px-3 py-1 text-base font-black uppercase tracking-[0.2em] opacity-90 ${
        physical
          ? "-rotate-12 border-emerald-600 text-emerald-700"
          : "rotate-6 border-sky-600 text-sky-700"
      }`}
    >
      {source}
    </span>
  );
}

/** Full-card detail overlay with ownership stamps and manual (demo) controls. */
export default function CardDetail({
  card,
  entry,
  onClose,
  onMark,
  onReset,
}: {
  card: RiftcodexCard;
  entry: OwnedEntry | null;
  onClose: () => void;
  onMark: (source: OwnershipSource) => void;
  onReset: () => void;
}) {
  const owned = !!(entry?.physical || entry?.digital);
  const r = rarityStyle(card.classification?.rarity);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90dvh] w-full max-w-[340px] overflow-y-auto rounded-2xl bg-white p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-1 text-neutral-600 hover:bg-neutral-100"
        >
          <X size={20} />
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.media?.image_url}
          alt={card.media?.accessibility_text ?? card.name}
          className={`w-full rounded-xl ${owned ? "" : "opacity-70 grayscale"}`}
        />

        <h2 className="mt-3 text-lg font-semibold">{card.name}</h2>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
          <span className={`rounded-md px-2 py-0.5 font-semibold ${r.badge}`}>
            {card.classification?.rarity ?? "—"}
          </span>
          {card.set?.label && (
            <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-neutral-600">
              {card.set.label}
            </span>
          )}
          {(card.classification?.domain?.length ?? 0) > 0 && (
            <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-neutral-600">
              {card.classification.domain.join(" · ")}
            </span>
          )}
        </div>

        {card.text?.flavour && (
          <p className="mt-3 text-sm italic text-neutral-500">
            “{card.text.flavour}”
          </p>
        )}

        {/* Ownership */}
        <div className="mt-4 flex min-h-[3rem] items-center justify-center gap-4 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-3">
          {owned ? (
            <>
              {entry?.physical && <Stamp source="physical" />}
              {entry?.digital && <Stamp source="digital" />}
            </>
          ) : (
            <span className="text-sm font-medium text-neutral-400">
              Not yet collected
            </span>
          )}
        </div>

        {/* Manual controls — placeholder until the scanner / pack flow write to
            the shared store. Safe to remove once those are wired up. */}
        <div className="mt-3 space-y-2 rounded-xl border border-dashed border-neutral-300 p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
            Manage (demo)
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onMark("physical")}
              disabled={entry?.physical}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium disabled:opacity-40"
            >
              <ScanLine size={15} /> Mark Physical
            </button>
            <button
              onClick={() => onMark("digital")}
              disabled={entry?.digital}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium disabled:opacity-40"
            >
              <PackageOpen size={15} /> Mark Digital
            </button>
            <button
              onClick={onReset}
              disabled={!owned}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-500 disabled:opacity-40"
            >
              <RotateCcw size={15} /> Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
