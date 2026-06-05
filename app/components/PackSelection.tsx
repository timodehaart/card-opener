"use client";

import { useState, useEffect } from "react";
import { Atom, Brain, Palette, Clock, Package, ChevronLeft, Shuffle, Eye, X } from "lucide-react";

type PackType = "science" | "philosophy" | "art";

interface CardData {
  name: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Ultra Rare";
  description: string;
  emoji: string;
}

interface Pack {
  id: PackType;
  name: string;
  type: string;
  icon: React.ReactNode;
  glowColor: string;
  gradientA: string;
  gradientB: string;
  // original simple icon circle styles (no glow)
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  typeBg: string;
  typeColor: string;
  cards: CardData[];
}

const packs: Pack[] = [
  {
    id: "science",
    name: "Scientific Revolution",
    type: "Science",
    icon: <Atom size={24} />,
    glowColor: "rgba(96, 165, 250, 0.45)",
    gradientA: "#60a5fa",
    gradientB: "#22d3ee",
    iconBg: "bg-blue-50",
    iconBorder: "border-blue-200",
    iconColor: "text-blue-600",
    typeBg: "rgba(219,234,254,0.85)",
    typeColor: "#1d4ed8",
    cards: [
      { name: "Newton's Apple", rarity: "Rare", description: "The moment gravity revealed itself. Gain momentum from any falling action.", emoji: "🍎" },
      { name: "Copernican Shift", rarity: "Ultra Rare", description: "Reposition your entire field. All cards rotate to new positions.", emoji: "🌍" },
      { name: "Alchemical Flask", rarity: "Common", description: "A bubbling reagent of unknown origin. Transform one element into another.", emoji: "⚗️" },
      { name: "Telescope Gaze", rarity: "Uncommon", description: "See cards hidden in the opponent's hand for one turn.", emoji: "🔭" },
      { name: "Periodic Table", rarity: "Rare", description: "Summon any element by name. 118 possible outcomes.", emoji: "🧪" },
      { name: "Archimedes' Lever", rarity: "Common", description: "Move the world with enough fulcrum. Double any force card.", emoji: "⚖️" },
      { name: "Electrostatic Charge", rarity: "Uncommon", description: "Shock adjacent cards. Stuns for 1 turn.", emoji: "⚡" },
      { name: "Darwin's Notebook", rarity: "Ultra Rare", description: "Evolve any card into a stronger variant once per game.", emoji: "📓" },
    ],
  },
  {
    id: "philosophy",
    name: "Age of Reason",
    type: "Philosophy",
    icon: <Brain size={24} />,
    glowColor: "rgba(139, 92, 246, 0.45)",
    gradientA: "#a78bfa",
    gradientB: "#c084fc",
    iconBg: "bg-violet-50",
    iconBorder: "border-violet-200",
    iconColor: "text-violet-600",
    typeBg: "rgba(237,233,254,0.85)",
    typeColor: "#6d28d9",
    cards: [
      { name: "Cogito Ergo Sum", rarity: "Ultra Rare", description: "I think, therefore I am. Resurrect any eliminated card.", emoji: "💭" },
      { name: "Socratic Method", rarity: "Rare", description: "Ask three questions. Opponent must reveal their strategy.", emoji: "🏛️" },
      { name: "The Dialectic", rarity: "Uncommon", description: "Thesis meets antithesis. Merge two opposing cards into a synthesis.", emoji: "🔄" },
      { name: "Kant's Imperative", rarity: "Common", description: "Act only by rules you'd make universal. Neutralize all illegal moves.", emoji: "📜" },
      { name: "Nihil Obstat", rarity: "Common", description: "Nothing stands in the way. Clear all obstacles from your path.", emoji: "🌑" },
      { name: "Plato's Cave", rarity: "Rare", description: "See through illusions. Reveal all hidden card effects.", emoji: "🕯️" },
      { name: "Stoic Resolve", rarity: "Uncommon", description: "Ignore all status effects for 2 turns.", emoji: "🪨" },
      { name: "Epicurean Feast", rarity: "Common", description: "Restore balance. Heal all your cards by a small amount.", emoji: "🍇" },
    ],
  },
  {
    id: "art",
    name: "Modern Art",
    type: "Art",
    icon: <Palette size={24} />,
    glowColor: "rgba(251, 146, 60, 0.45)",
    gradientA: "#fb923c",
    gradientB: "#fbbf24",
    iconBg: "bg-orange-50",
    iconBorder: "border-orange-200",
    iconColor: "text-orange-600",
    typeBg: "rgba(255,237,213,0.85)",
    typeColor: "#c2410c",
    cards: [
      { name: "Warhol's Silkscreen", rarity: "Ultra Rare", description: "Duplicate any card four times. Pop art proliferates.", emoji: "🖨️" },
      { name: "Dali's Clock", rarity: "Rare", description: "Bend time. Skip to any point in your turn order.", emoji: "⏰" },
      { name: "Rothko's Field", rarity: "Uncommon", description: "Flood the board with color. All cards gain +2 presence.", emoji: "🎨" },
      { name: "Duchamp's Readymade", rarity: "Common", description: "Transform any ordinary object into art. Reassign any card's type.", emoji: "🚿" },
      { name: "Picasso's Eye", rarity: "Rare", description: "See all angles simultaneously. Preview opponent's next 3 moves.", emoji: "👁️" },
      { name: "Pollock's Drip", rarity: "Common", description: "Scatter energy randomly. Random buff applied to random cards.", emoji: "🖌️" },
      { name: "Monet's Garden", rarity: "Uncommon", description: "Soft focus. Reduce all opponents' accuracy by 20%.", emoji: "🌸" },
      { name: "Basquiat's Crown", rarity: "Ultra Rare", description: "Crown any card as king. That card becomes immune to elimination.", emoji: "👑" },
    ],
  },
];

const RARITY_COLORS: Record<CardData["rarity"], { bg: string; text: string; dot: string; border: string }> = {
  "Common":     { bg: "#f8fafc", text: "#64748b", dot: "#94a3b8", border: "#e2e8f0" },
  "Uncommon":   { bg: "#f0fdf4", text: "#166534", dot: "#22c55e", border: "#bbf7d0" },
  "Rare":       { bg: "#eff6ff", text: "#1e40af", dot: "#3b82f6", border: "#bfdbfe" },
  "Ultra Rare": { bg: "#faf5ff", text: "#5b21b6", dot: "#8b5cf6", border: "#ddd6fe" },
};

const CARDS_WIDTH = 3 * 95 + 2 * 12;
const REGEN_SECONDS = 12 * 60 * 60;
const MAX_PACKS = 2;

function formatTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h} hr ${String(m).padStart(2, "0")} min`;
  return `${String(m).padStart(2, "0")} min ${String(sec).padStart(2, "0")} sec`;
}

function PackIcon({ id, size = 28 }: { id: PackType; size?: number }) {
  if (id === "science") return <Atom size={size} />;
  if (id === "philosophy") return <Brain size={size} />;
  return <Palette size={size} />;
}

export default function PackSelection() {
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [previewPack, setPreviewPack] = useState<Pack | null>(null);
  const [availablePacks, setAvailablePacks] = useState(1);
  const [secondsRemaining, setSecondsRemaining] = useState(Math.floor(REGEN_SECONDS / 2));

  useEffect(() => {
    if (availablePacks >= MAX_PACKS) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) { setAvailablePacks((p) => Math.min(p + 1, MAX_PACKS)); return REGEN_SECONDS; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [availablePacks]);

  const progress = 1 - secondsRemaining / REGEN_SECONDS;

  function handleSelectPack(pack: Pack) { setSelectedPack(pack); }
  function handleBack() { setSelectedPack(null); }
  function handleSwitch() {
    if (!selectedPack) return;
    const idx = packs.findIndex((p) => p.id === selectedPack.id);
    setSelectedPack(packs[(idx + 1) % packs.length]);
  }
  function openPreview() { setPreviewPack(selectedPack); }
  function closePreview() { setPreviewPack(null); }

  return (
    <main className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-bar {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.55; }
        }
        .timer-bar {
          background: linear-gradient(90deg,#a78bfa,#818cf8,#67e8f9,#818cf8,#a78bfa,#f0abfc,#a78bfa);
          background-size: 300% 100%;
          animation: shimmer 3s linear infinite, pulse-bar 4s ease-in-out infinite;
        }
        .timer-bar-full {
          background: linear-gradient(90deg,#c4b5fd,#a5f3fc,#c4b5fd);
          background-size: 300% 100%;
          animation: shimmer 3s linear infinite;
        }
        @keyframes pack-enter {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        .pack-enter { animation: pack-enter 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .slide-up { animation: slide-up 0.35s ease forwards; }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .fade-in { animation: fade-in 0.25s ease forwards; }

        /* ── streak: fixed, covers full height from top ── */
        .detail-streak {
          position: fixed;
          /* extend well beyond viewport top and bottom so rotation never clips */
          top: -60%;
          bottom: -60%;
          left: -30%;
          right: -30%;
          transform: rotate(-14deg);
          pointer-events: none;
          z-index: 0;
          opacity: 0.16;
        }
        .detail-streak-inner {
          width: 100%;
          height: 100%;
        }

        /* card grid items */
        .card-thumb {
          border-radius: 14px;
          background: white;
          border: 1.5px solid #e2e8f0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          cursor: default;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .card-thumb:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
        }

        /* modal */
        @keyframes modal-in {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: none; }
        }
        .modal-backdrop {
          position: fixed; inset: 0; z-index: 50;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(6px);
          display: flex; align-items: flex-end; justify-content: center;
        }
        .modal-sheet {
          width: 100%; max-width: 480px;
          background: white;
          border-radius: 28px 28px 0 0;
          overflow: hidden;
          animation: modal-in 0.3s cubic-bezier(0.34,1.2,0.64,1) both;
          max-height: 88dvh;
          display: flex; flex-direction: column;
        }
      `}</style>

      {/* ══════════ SELECTION VIEW ══════════ */}
      {!selectedPack && (
        <div className="flex w-full flex-col items-center gap-10 px-10 py-16">

          {/* Title — single font, Crimson Pro */}
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Choose your booster
            </p>
            <h1
              style={{
                fontFamily: "'Crimson Pro', Georgia, serif",
                fontSize: "2.4rem",
                fontWeight: 400,
                color: "#0f172a",
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}
            >
              Dezcartes
            </h1>
          </div>

          {/* Pack cards — exactly as original */}
          <div className="flex w-full items-center justify-center gap-3">
            {packs.map((pack) => (
              <button
                key={pack.id}
                onClick={() => handleSelectPack(pack)}
                style={{ width: 95, height: 148 }}
                className="relative flex shrink-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_2px_6px_rgba(0,0,0,0.10),0_6px_24px_rgba(0,0,0,0.09)] active:scale-95"
              >
                <div className={`h-[5px] w-full shrink-0 bg-gradient-to-r ${
                  pack.id === "science" ? "from-blue-100 to-blue-50" :
                  pack.id === "philosophy" ? "from-violet-100 to-violet-50" :
                  "from-orange-100 to-orange-50"
                }`} />
                <div className="flex flex-1 flex-col items-center justify-between px-2 py-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${pack.iconBg} ${pack.iconBorder} ${pack.iconColor}`}>
                    {pack.icon}
                  </div>
                  <div className="flex h-9 items-center justify-center">
                    <span className="text-center text-[9px] font-semibold uppercase leading-tight tracking-wide text-slate-800 sm:text-[10px]">
                      {pack.name}
                    </span>
                  </div>
                  <div className="w-8 border-t border-slate-100" />
                  <span style={{ fontFamily: "'Crimson Pro', Georgia, serif" }} className="text-[11px] font-light italic text-slate-400">
                    {pack.type}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Timer card — exactly as original */}
          <div style={{ width: CARDS_WIDTH }} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.06)]">
            <div className="mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Clock size={11} className="text-slate-400" />
                {availablePacks >= MAX_PACKS ? (
                  <span className="text-[10px] font-medium text-slate-500">Packs full</span>
                ) : (
                  <span className="text-[10px] font-medium tabular-nums text-slate-500">
                    {formatTime(secondsRemaining)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Package size={11} className="text-slate-400" />
                <span className="text-[10px] font-semibold text-slate-600">
                  {availablePacks}
                  <span className="font-normal text-slate-400">/{MAX_PACKS}</span>
                </span>
              </div>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
              {availablePacks >= MAX_PACKS ? (
                <div className="timer-bar-full h-full w-full rounded-full" />
              ) : (
                <div
                  className="timer-bar h-full rounded-full transition-[width] duration-1000 ease-linear"
                  style={{ width: `${progress * 100}%` }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════ DETAIL VIEW ══════════ */}
      {selectedPack && (
        <div className="fade-in flex min-h-dvh w-full flex-col">

          {/* Angled streak — fixed, full-height, pack color */}
          <div className="detail-streak">
            <div
              className="detail-streak-inner"
              style={{
                background: `linear-gradient(90deg, transparent 10%, ${selectedPack.gradientA} 40%, ${selectedPack.gradientB} 60%, transparent 90%)`,
              }}
            />
          </div>

          {/* Top bar */}
          <div className="relative z-10 flex items-center justify-center px-6 pt-12 pb-4">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.06)]">
              <div className="flex items-center gap-1">
                <Package size={11} className="text-slate-400" />
                <span className="text-[10px] font-semibold text-slate-600">
                  {availablePacks}
                  <span className="font-normal text-slate-400">/{MAX_PACKS}</span>
                </span>
              </div>
              <div className="h-3 w-px bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <Clock size={11} className="text-slate-400" />
                {availablePacks >= MAX_PACKS ? (
                  <span className="text-[10px] font-medium text-slate-500">Full</span>
                ) : (
                  <span className="text-[10px] font-medium tabular-nums text-slate-500">
                    {formatTime(secondsRemaining)}
                  </span>
                )}
              </div>
              <div className="h-3 w-px bg-slate-200" />
              <div className="h-1 w-16 overflow-hidden rounded-full bg-slate-100">
                {availablePacks >= MAX_PACKS ? (
                  <div className="timer-bar-full h-full w-full rounded-full" />
                ) : (
                  <div
                    className="timer-bar h-full rounded-full transition-[width] duration-1000 ease-linear"
                    style={{ width: `${progress * 100}%` }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Pack display */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4 px-10">
            <div
              key={selectedPack.id}
              className="pack-enter flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.10),0_1px_4px_rgba(0,0,0,0.06)]"
              style={{ width: 200, height: 280 }}
            >
              <div
                className="h-[6px] w-full shrink-0"
                style={{ background: `linear-gradient(90deg, ${selectedPack.gradientA}, ${selectedPack.gradientB})` }}
              />
              <div className="flex flex-1 flex-col items-center justify-between px-4 py-6">
                {/* Icon — original plain circle, no glow */}
                <div className={`flex h-24 w-24 items-center justify-center rounded-full border-2 ${selectedPack.iconBg} ${selectedPack.iconBorder} ${selectedPack.iconColor}`}>
                  <div className="scale-[2.2] transform">
                    <PackIcon id={selectedPack.id} size={28} />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-center text-[11px] font-semibold uppercase leading-snug tracking-wider text-slate-800">
                    {selectedPack.name}
                  </span>
                  <div className="w-10 border-t border-slate-100" />
                  <span style={{ fontFamily: "'Crimson Pro', Georgia, serif" }} className="text-sm font-light italic text-slate-400">
                    {selectedPack.type}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="slide-up relative z-10 flex flex-col items-center gap-3 px-10 pb-14 pt-4">
            {/* Back / Open / Switch row */}
            <div className="flex w-full items-center justify-between">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-medium text-slate-500 shadow-[0_1px_3px_rgba(0,0,0,0.07)] transition-all active:scale-95"
              >
                <ChevronLeft size={15} />
                Back
              </button>

              <button
                onClick={handleSwitch}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-medium text-slate-500 shadow-[0_1px_3px_rgba(0,0,0,0.07)] transition-all active:scale-95"
              >
                <Shuffle size={13} />
                Switch pack
              </button>
            </div>

            {/* Preview cards button — full width, below */}
            <button
              onClick={openPreview}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-medium text-slate-500 shadow-[0_1px_3px_rgba(0,0,0,0.07)] transition-all active:scale-95"
            >
              <Eye size={13} />
              Preview cards in this pack
            </button>
          </div>
        </div>
      )}

      {/* ══════════ CARD PREVIEW SHEET ══════════ */}
      {previewPack && (
        <div className="modal-backdrop" onClick={closePreview}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>

            {/* Sheet header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div>
                <h2
                  style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontSize: "1.25rem", fontWeight: 400, color: "#0f172a", letterSpacing: "-0.01em" }}
                >
                  {previewPack.name}
                </h2>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 mt-0.5">
                  {previewPack.cards.length} cards in this set
                </p>
              </div>
              <button
                onClick={closePreview}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-all hover:bg-slate-100"
              >
                <X size={14} />
              </button>
            </div>

            {/* Pack color bar */}
            <div
              className="h-[3px] w-full"
              style={{ background: `linear-gradient(90deg, ${previewPack.gradientA}, ${previewPack.gradientB})` }}
            />

            {/* Card grid — scrollable */}
            <div className="overflow-y-auto flex-1 px-4 pt-4 pb-6">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                {previewPack.cards.map((card, i) => {
                  const rc = RARITY_COLORS[card.rarity];
                  return (
                    <div key={i} className="card-thumb" style={{ border: `1.5px solid ${rc.border}` }}>
                      {/* Card image area — colored bg with emoji */}
                      <div
                        style={{
                          height: 100,
                          background: `linear-gradient(160deg, ${rc.bg}, white)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 40,
                          position: "relative",
                        }}
                      >
                        {card.emoji}
                        {/* Rarity dot top-right */}
                        <div
                          style={{
                            position: "absolute",
                            top: 8, right: 8,
                            width: 8, height: 8,
                            borderRadius: "50%",
                            background: rc.dot,
                          }}
                        />
                      </div>

                      {/* Card info */}
                      <div style={{ padding: "8px 10px 10px", display: "flex", flexDirection: "column", gap: 4, background: "white" }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", lineHeight: 1.3 }}>{card.name}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: rc.dot, flexShrink: 0 }} />
                          <span style={{ fontSize: 9, fontWeight: 600, color: rc.text, letterSpacing: "0.06em", textTransform: "uppercase" }}>{card.rarity}</span>
                        </div>
                        <p style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.5, marginTop: 2 }}>{card.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}