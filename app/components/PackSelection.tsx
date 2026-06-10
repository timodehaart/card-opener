"use client";

import { useState, useEffect, useRef } from "react";
import { Atom, Brain, Palette, Clock, Package, ChevronLeft, Shuffle, Eye, X } from "lucide-react";

type PackType = "science" | "philosophy" | "art";

interface CardData {
  name: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Ultra Rare";
  description: string;
  image: string;
}

interface Pack {
  id: PackType;
  name: string;
  type: string;
  icon: React.ReactNode;
  glowColor: string;
  gradientA: string;
  gradientB: string;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  cards: CardData[]; // pool to draw from — 3 random picked per open
}

// ─── Card pool per pack ──────────────────────────────────────────────────────
// Swap out images/names/rarities here to manage each pack's card pool.

const SCIENCE_CARDS: CardData[] = [
  { name: "The Library",       rarity: "Rare",       description: "Draw 3 cards and keep one.",                          image: "/card1.png" },
  { name: "DNA",               rarity: "Ultra Rare", description: "Copy an Ally's effects until end of turn.",           image: "/card2.png" },
  { name: "Schrödinger's Cat", rarity: "Uncommon",   description: "Both active & inactive. Leaving play: draw 1, discard 1.", image: "/card3.png" },
  { name: "Creation Touch",    rarity: "Rare",       description: "Activate a dormant ability on any card.",             image: "/card4.png" },
  { name: "The Murmuration",   rarity: "Common",     description: "Split any card's power across two targets.",          image: "/card5.png" },
];

const PHILOSOPHY_CARDS: CardData[] = [
  { name: "Cogito Ergo Sum",   rarity: "Ultra Rare", description: "Resurrect any eliminated card.",                      image: "/card3.png" },
  { name: "Socratic Method",   rarity: "Rare",       description: "Ask three questions — opponent reveals their strategy.", image: "/card4.png" },
  { name: "The Dialectic",     rarity: "Uncommon",   description: "Merge two opposing cards into a synthesis.",          image: "/card1.png" },
  { name: "Kant's Imperative", rarity: "Common",     description: "Neutralize all illegal moves for one turn.",          image: "/card5.png" },
  { name: "Plato's Cave",      rarity: "Rare",       description: "Reveal all hidden card effects on the board.",        image: "/card2.png" },
];

const ART_CARDS: CardData[] = [
  { name: "Warhol's Silkscreen", rarity: "Ultra Rare", description: "Duplicate any card four times.",                   image: "/card2.png" },
  { name: "Dali's Clock",        rarity: "Rare",       description: "Bend time — skip to any point in your turn order.", image: "/card1.png" },
  { name: "Rothko's Field",      rarity: "Uncommon",   description: "All cards gain +2 presence for one turn.",          image: "/card5.png" },
  { name: "Pollock's Drip",      rarity: "Common",     description: "Random buff applied to random cards.",              image: "/card3.png" },
  { name: "Basquiat's Crown",    rarity: "Ultra Rare", description: "Crown a card — it becomes immune to elimination.",  image: "/card4.png" },
];

// ─────────────────────────────────────────────────────────────────────────────

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
    cards: SCIENCE_CARDS,
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
    cards: PHILOSOPHY_CARDS,
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
    cards: ART_CARDS,
  },
];

const CARDS_PER_PACK = 3;

const RARITY_COLORS: Record<CardData["rarity"], { dot: string; text: string; border: string }> = {
  "Common":     { dot: "#94a3b8", text: "#64748b", border: "#e2e8f0" },
  "Uncommon":   { dot: "#22c55e", text: "#166534", border: "#bbf7d0" },
  "Rare":       { dot: "#3b82f6", text: "#1e40af", border: "#bfdbfe" },
  "Ultra Rare": { dot: "#8b5cf6", text: "#5b21b6", border: "#ddd6fe" },
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

function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
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
  const [isOpening, setIsOpening] = useState(false);
  const [openedCards, setOpenedCards] = useState<CardData[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [expandedCard, setExpandedCard] = useState<CardData | null>(null);

  // Swipe state
  const dragStartX = useRef<number | null>(null);
  const dragCurrentX = useRef<number>(0);
  const [swipeProgress, setSwipeProgress] = useState(0);

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

  const timerProgress = 1 - secondsRemaining / REGEN_SECONDS;

  function handleSelectPack(pack: Pack) { setSelectedPack(pack); }

  function handleBack() {
    setSelectedPack(null);
    setIsOpening(false);
    setOpenedCards([]);
    setRevealedCount(0);
    setSwipeProgress(0);
  }

  function handleCollect() {
    // Consume one pack, return to home
    setAvailablePacks(p => Math.max(0, p - 1));
    setSelectedPack(null);
    setIsOpening(false);
    setOpenedCards([]);
    setRevealedCount(0);
    setSwipeProgress(0);
  }

  function handleSwitch() {
    if (!selectedPack) return;
    const idx = packs.findIndex((p) => p.id === selectedPack.id);
    setSelectedPack(packs[(idx + 1) % packs.length]);
    setIsOpening(false); setOpenedCards([]); setRevealedCount(0); setSwipeProgress(0);
  }

  function openPreview() { setPreviewPack(selectedPack); }
  function closePreview() { setPreviewPack(null); }

  function handleOpenPack() {
    setIsOpening(true);
    setOpenedCards([]);
    setRevealedCount(0);
    setSwipeProgress(0);
  }

  // ── Swipe handlers ──
  function onPointerDown(e: React.PointerEvent) {
    dragStartX.current = e.clientX;
    dragCurrentX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    setSwipeProgress(Math.min(Math.max(delta / 180, 0), 1));
    dragCurrentX.current = e.clientX;
  }
  function onPointerUp() {
    if (dragStartX.current === null) return;
    const delta = dragCurrentX.current - (dragStartX.current ?? 0);
    dragStartX.current = null;
    if (delta > 100) {
      setSwipeProgress(1);
      setTimeout(() => triggerReveal(), 280);
    } else {
      setSwipeProgress(0);
    }
  }

  function triggerReveal() {
    if (!selectedPack) return;
    const drawn = pickRandom(selectedPack.cards, CARDS_PER_PACK);
    setOpenedCards(drawn);
    setRevealedCount(0);
    for (let i = 0; i < CARDS_PER_PACK; i++) {
      setTimeout(() => setRevealedCount(n => n + 1), 350 + i * 230);
    }
  }

  const allRevealed = openedCards.length > 0 && revealedCount >= CARDS_PER_PACK;

  // ─── Timer pill (shared) ──────────────────────────────────────────────────
  const TimerPill = () => (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-1">
        <Package size={11} className="text-slate-400" />
        <span className="text-[10px] font-semibold text-slate-600">
          {availablePacks}<span className="font-normal text-slate-400">/{MAX_PACKS}</span>
        </span>
      </div>
      <div className="h-3 w-px bg-slate-200" />
      <div className="flex items-center gap-1.5">
        <Clock size={11} className="text-slate-400" />
        {availablePacks >= MAX_PACKS
          ? <span className="text-[10px] font-medium text-slate-500">Full</span>
          : <span className="text-[10px] font-medium tabular-nums text-slate-500">{formatTime(secondsRemaining)}</span>
        }
      </div>
      <div className="h-3 w-px bg-slate-200" />
      <div className="h-1 w-16 overflow-hidden rounded-full bg-slate-100">
        {availablePacks >= MAX_PACKS
          ? <div className="timer-bar-full h-full w-full rounded-full" />
          : <div className="timer-bar h-full rounded-full transition-[width] duration-1000 ease-linear" style={{ width: `${timerProgress * 100}%` }} />
        }
      </div>
    </div>
  );

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

        .detail-streak {
          position: fixed;
          top: -60%; bottom: -60%;
          left: -30%; right: -30%;
          transform: rotate(-14deg);
          pointer-events: none;
          z-index: 0;
          opacity: 0.15;
        }

        /* Swipe glow */
        @keyframes swipe-glow {
          0%   { left: -60%; opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 0.85; }
          100% { left: 110%; opacity: 0; }
        }
        .swipe-glow-streak {
          position: absolute;
          top: 0; bottom: 0;
          width: 50%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.85) 40%, rgba(255,255,255,1) 55%, rgba(255,255,255,0.85) 70%, transparent);
          animation: swipe-glow 2s ease-in-out infinite;
          pointer-events: none;
          border-radius: 100px;
        }

        /* Card reveal */
        @keyframes card-pop {
          0%   { opacity: 0; transform: translateY(50px) scale(0.82) rotateY(-18deg); }
          65%  { transform: translateY(-6px) scale(1.03) rotateY(3deg); }
          100% { opacity: 1; transform: translateY(0) scale(1) rotateY(0deg); }
        }
        .card-reveal { animation: card-pop 0.52s cubic-bezier(0.34,1.4,0.64,1) both; }

        /* Expanded card */
        @keyframes card-expand {
          from { opacity: 0; transform: scale(0.72); }
          to   { opacity: 1; transform: scale(1); }
        }
        .card-expand-img {
          animation: card-expand 0.32s cubic-bezier(0.34,1.4,0.64,1) both;
          max-width: min(82vw, 320px);
          border-radius: 18px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6);
        }

        /* Modal */
        @keyframes modal-in {
          from { opacity: 0; transform: translateY(22px) scale(0.97); }
          to   { opacity: 1; transform: none; }
        }
        .modal-backdrop {
          position: fixed; inset: 0; z-index: 50;
          background: rgba(0,0,0,0.38);
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

      {/* ══════════ HOME / PACK SELECTION ══════════ */}
      {!selectedPack && (
        <div className="flex w-full flex-col items-center gap-10 px-10 py-16">

          {/* Title */}
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Choose your booster</p>
            <h1 style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontSize: "2.4rem", fontWeight: 400, color: "#0f172a", letterSpacing: "-0.01em", lineHeight: 1 }}>
              Dezcartes
            </h1>
          </div>

          {/* Pack cards */}
          <div className="flex w-full items-center justify-center gap-3">
            {packs.map((pack) => (
              <button
                key={pack.id}
                onClick={() => handleSelectPack(pack)}
                style={{ width: 95, height: 148 }}
                className="relative flex shrink-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_2px_6px_rgba(0,0,0,0.10),0_6px_24px_rgba(0,0,0,0.09)] active:scale-95"
              >
                <div
                  className="h-[5px] w-full shrink-0"
                  style={{ background: `linear-gradient(90deg, ${pack.gradientA}, ${pack.gradientB})`, opacity: 0.35 }}
                />
                <div className="flex flex-1 flex-col items-center justify-between px-2 py-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${pack.iconBg} ${pack.iconBorder} ${pack.iconColor}`}>
                    {pack.icon}
                  </div>
                  <div className="flex h-9 items-center justify-center">
                    <span className="text-center text-[9px] font-semibold uppercase leading-tight tracking-wide text-slate-800">{pack.name}</span>
                  </div>
                  <div className="w-8 border-t border-slate-100" />
                  <span style={{ fontFamily: "'Crimson Pro', Georgia, serif" }} className="text-[11px] font-light italic text-slate-400">{pack.type}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Timer */}
          <div style={{ width: CARDS_WIDTH }} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.06)]">
            <div className="mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Clock size={11} className="text-slate-400" />
                {availablePacks >= MAX_PACKS
                  ? <span className="text-[10px] font-medium text-slate-500">Packs full</span>
                  : <span className="text-[10px] font-medium tabular-nums text-slate-500">{formatTime(secondsRemaining)}</span>
                }
              </div>
              <div className="flex items-center gap-1">
                <Package size={11} className="text-slate-400" />
                <span className="text-[10px] font-semibold text-slate-600">{availablePacks}<span className="font-normal text-slate-400">/{MAX_PACKS}</span></span>
              </div>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
              {availablePacks >= MAX_PACKS
                ? <div className="timer-bar-full h-full w-full rounded-full" />
                : <div className="timer-bar h-full rounded-full transition-[width] duration-1000 ease-linear" style={{ width: `${timerProgress * 100}%` }} />
              }
            </div>
          </div>
        </div>
      )}

      {/* ══════════ PACK DETAIL VIEW ══════════ */}
      {selectedPack && !isOpening && (
        <div className="fade-in flex min-h-dvh w-full flex-col">

          {/* Streak bg */}
          <div className="detail-streak">
            <div style={{ width: "100%", height: "100%", background: `linear-gradient(90deg, transparent 10%, ${selectedPack.gradientA} 40%, ${selectedPack.gradientB} 60%, transparent 90%)` }} />
          </div>

          {/* Top timer pill */}
          <div className="relative z-10 flex items-center justify-center px-6 pt-12 pb-4">
            <TimerPill />
          </div>

          {/* Pack art — centred, fills flex-1 */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
            <div
              key={selectedPack.id}
              className="pack-enter flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.10),0_1px_4px_rgba(0,0,0,0.06)]"
              style={{ width: 200, height: 280 }}
            >
              <div className="h-[6px] w-full shrink-0" style={{ background: `linear-gradient(90deg, ${selectedPack.gradientA}, ${selectedPack.gradientB})` }} />
              <div className="flex flex-1 flex-col items-center justify-between px-4 py-6">
                <div className={`flex h-24 w-24 items-center justify-center rounded-full border-2 ${selectedPack.iconBg} ${selectedPack.iconBorder} ${selectedPack.iconColor}`}>
                  <div className="scale-[2.2] transform"><PackIcon id={selectedPack.id} size={28} /></div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-center text-[11px] font-semibold uppercase leading-snug tracking-wider text-slate-800">{selectedPack.name}</span>
                  <div className="w-10 border-t border-slate-100" />
                  <span style={{ fontFamily: "'Crimson Pro', Georgia, serif" }} className="text-sm font-light italic text-slate-400">{selectedPack.type}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom buttons: Open · Back · Switch · Preview (stacked) ── */}
          <div className="slide-up relative z-10 flex flex-col items-center gap-2 px-10 pb-14 pt-4">

            {/* Open — primary, full width */}
            <button
              onClick={handleOpenPack}
              className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[13px] font-semibold text-white shadow-[0_2px_12px_rgba(0,0,0,0.18)] transition-all active:scale-95"
              style={{ background: `linear-gradient(135deg, ${selectedPack.gradientA}, ${selectedPack.gradientB})` }}
            >
              Open Pack
            </button>

            {/* Back + Switch — side by side */}
            <div className="flex w-full items-center gap-2">
              <button
                onClick={handleBack}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-medium text-slate-500 shadow-[0_1px_3px_rgba(0,0,0,0.07)] transition-all active:scale-95"
              >
                <ChevronLeft size={14} />Back
              </button>
              <button
                onClick={handleSwitch}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-medium text-slate-500 shadow-[0_1px_3px_rgba(0,0,0,0.07)] transition-all active:scale-95"
              >
                <Shuffle size={13} />Switch pack
              </button>
            </div>

            {/* Preview — full width */}
            <button
              onClick={openPreview}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-medium text-slate-500 shadow-[0_1px_3px_rgba(0,0,0,0.07)] transition-all active:scale-95"
            >
              <Eye size={13} />Preview cards in this pack
            </button>
          </div>
        </div>
      )}

      {/* ══════════ PACK OPENING SCREEN ══════════ */}
      {selectedPack && isOpening && (
        <div className="fade-in flex min-h-dvh w-full flex-col items-center justify-between pb-14 pt-12">

          {/* Streak bg */}
          <div className="detail-streak">
            <div style={{ width: "100%", height: "100%", background: `linear-gradient(90deg, transparent 10%, ${selectedPack.gradientA} 40%, ${selectedPack.gradientB} 60%, transparent 90%)` }} />
          </div>

          {openedCards.length === 0 ? (
            /* ── Pre-reveal: pack with swipe line ── */
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
              <div
                className="pack-enter flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.16),0_2px_6px_rgba(0,0,0,0.08)]"
                style={{ width: 220, height: 306 }}
              >
                {/* ── Swipe line just below the top ── */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: 34,
                    flexShrink: 0,
                    background: `linear-gradient(90deg, ${selectedPack.gradientA}, ${selectedPack.gradientB})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "grab",
                    userSelect: "none",
                    touchAction: "none",
                    overflow: "hidden",
                  }}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                >
                  {/* Track */}
                  <div style={{ position: "absolute", left: 24, right: 24, height: 3, borderRadius: 100, background: "rgba(255,255,255,0.25)", overflow: "hidden" }}>
                    {swipeProgress < 0.08 && <div className="swipe-glow-streak" />}
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${swipeProgress * 100}%`, background: "rgba(255,255,255,0.9)", borderRadius: 100, transition: "width 0.08s ease" }} />
                  </div>
                  {swipeProgress < 0.04 && (
                    <span style={{ position: "relative", zIndex: 2, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", pointerEvents: "none", whiteSpace: "nowrap" }}>
                      ← swipe to open →
                    </span>
                  )}
                </div>

                {/* Pack art */}
                <div className="flex flex-1 flex-col items-center justify-between px-4 py-5">
                  <div className={`flex h-24 w-24 items-center justify-center rounded-full border-2 ${selectedPack.iconBg} ${selectedPack.iconBorder} ${selectedPack.iconColor}`}>
                    <div className="scale-[2.2] transform"><PackIcon id={selectedPack.id} size={28} /></div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-center text-[11px] font-semibold uppercase leading-snug tracking-wider text-slate-800">{selectedPack.name}</span>
                    <div className="w-10 border-t border-slate-100" />
                    <span style={{ fontFamily: "'Crimson Pro', Georgia, serif" }} className="text-sm font-light italic text-slate-400">{selectedPack.type}</span>
                  </div>
                </div>
              </div>

              <p className="relative z-10 mt-5 text-[11px] font-medium text-slate-400">Drag the line at the top to open</p>
            </div>
          ) : (
            /* ── Cards revealed ── */
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 w-full">
              <p style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontSize: "1.5rem", fontWeight: 400, color: "#0f172a", letterSpacing: "-0.01em" }}>
                Your cards
              </p>

              {/* 3-card row, centered */}
              <div style={{ display: "flex", gap: 12, alignItems: "flex-end", justifyContent: "center", padding: "0 20px", width: "100%" }}>
                {openedCards.map((card, i) => (
                  i < revealedCount ? (
                    <div
                      key={i}
                      className="card-reveal"
                      style={{ flex: "0 0 auto", width: 105, borderRadius: 14, overflow: "hidden", background: "white", boxShadow: "0 6px 28px rgba(0,0,0,0.18)", cursor: "pointer", transition: "transform 0.15s ease" }}
                      onClick={() => setExpandedCard(card)}
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      <img
                        src={card.image}
                        alt={card.name}
                        style={{ width: "100%", display: "block", aspectRatio: "2/3", objectFit: "cover" }}
                      />
                    </div>
                  ) : (
                    <div
                      key={i}
                      style={{ flex: "0 0 auto", width: 105, borderRadius: 14, overflow: "hidden", background: "#f1f5f9", boxShadow: "0 3px 12px rgba(0,0,0,0.08)" }}
                    >
                      <div style={{ width: "100%", aspectRatio: "2/3", background: "linear-gradient(135deg, #e2e8f0, #f8fafc)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#dde3ea", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#94a3b8" }}>?</div>
                      </div>
                    </div>
                  )
                ))}
              </div>

              {allRevealed && (
                <p className="fade-in text-[11px] text-slate-400 font-medium">Tap any card to enlarge</p>
              )}
            </div>
          )}

          {/* Bottom — Collect (only after all revealed), else just a subtle back */}
          <div className="slide-up relative z-10 flex w-full flex-col items-center gap-2 px-10">
            {openedCards.length > 0 && allRevealed ? (
              <button
                onClick={handleCollect}
                className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[13px] font-semibold text-white shadow-[0_2px_12px_rgba(0,0,0,0.18)] transition-all active:scale-95"
                style={{ background: `linear-gradient(135deg, ${selectedPack!.gradientA}, ${selectedPack!.gradientB})` }}
              >
                Collect cards
              </button>
            ) : (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-[12px] font-medium text-slate-400 shadow-[0_1px_3px_rgba(0,0,0,0.07)] transition-all active:scale-95"
              >
                <ChevronLeft size={14} />Back
              </button>
            )}
          </div>
        </div>
      )}

      {/* ══════════ CARD PREVIEW SHEET ══════════ */}
      {previewPack && (
        <div className="modal-backdrop" onClick={closePreview}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>

            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div>
                <h2 style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontSize: "1.25rem", fontWeight: 400, color: "#0f172a", letterSpacing: "-0.01em" }}>{previewPack.name}</h2>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 mt-0.5">{previewPack.cards.length} cards in this set</p>
              </div>
              <button onClick={closePreview} className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-all hover:bg-slate-100">
                <X size={14} />
              </button>
            </div>

            <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${previewPack.gradientA}, ${previewPack.gradientB})` }} />

            {/* Cards grid — image only, uniform size */}
            <div className="overflow-y-auto flex-1 px-4 pt-4 pb-6">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                {previewPack.cards.map((card, i) => (
                  <div
                    key={i}
                    style={{ borderRadius: 14, overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,0.10)", transition: "transform 0.15s ease" }}
                    onClick={() => setExpandedCard(card)}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    <img
                      src={card.image}
                      alt={card.name}
                      style={{ width: "100%", display: "block", aspectRatio: "2/3", objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ EXPANDED CARD OVERLAY ══════════ */}
      {expandedCard && (
        <div
          className="fade-in"
          style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.78)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setExpandedCard(null)}
        >
          <img
            src={expandedCard.image}
            alt={expandedCard.name}
            className="card-expand-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}