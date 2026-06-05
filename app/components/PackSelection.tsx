"use client";

import { useState, useEffect } from "react";
import { Atom, Brain, Palette, Clock, Package, ChevronLeft, RefreshCw } from "lucide-react";

type PackType = "science" | "philosophy" | "art";

interface Pack {
  id: PackType;
  name: string;
  type: string;
  icon: React.ReactNode;
  iconBg: string;
  iconBorder: string;
  iconText: string;
  accentFrom: string;
  accentTo: string;
  accentSolid: string;
}

const packs: Pack[] = [
  {
    id: "science",
    name: "Scientific Revolution",
    type: "Science",
    icon: <Atom size={24} />,
    iconBg: "bg-blue-50",
    iconBorder: "border-blue-200",
    iconText: "text-blue-600",
    accentFrom: "from-blue-100",
    accentTo: "to-blue-50",
    accentSolid: "bg-blue-100",
  },
  {
    id: "philosophy",
    name: "Age of Reason",
    type: "Philosophy",
    icon: <Brain size={24} />,
    iconBg: "bg-violet-50",
    iconBorder: "border-violet-200",
    iconText: "text-violet-600",
    accentFrom: "from-violet-100",
    accentTo: "to-violet-50",
    accentSolid: "bg-violet-100",
  },
  {
    id: "art",
    name: "Modern Art",
    type: "Art",
    icon: <Palette size={24} />,
    iconBg: "bg-orange-50",
    iconBorder: "border-orange-200",
    iconText: "text-orange-600",
    accentFrom: "from-orange-100",
    accentTo: "to-orange-50",
    accentSolid: "bg-orange-100",
  },
];

const REGEN_SECONDS = 12 * 60 * 60;
const MAX_PACKS = 2;
const CARDS_WIDTH = 3 * 95 + 2 * 12;

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h} hr ${String(m).padStart(2, "0")} min`;
  return `${String(m).padStart(2, "0")} min ${String(s).padStart(2, "0")} sec`;
}

export default function PackSelection() {
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [entering, setEntering] = useState(false);
  const [availablePacks, setAvailablePacks] = useState(1);
  const [secondsRemaining, setSecondsRemaining] = useState(
    Math.floor(REGEN_SECONDS / 2)
  );

  useEffect(() => {
    if (availablePacks >= MAX_PACKS) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setAvailablePacks((p) => Math.min(p + 1, MAX_PACKS));
          return REGEN_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [availablePacks]);

  const progress = 1 - secondsRemaining / REGEN_SECONDS;

  function handleSelectPack(pack: Pack) {
    setSelectedPack(pack);
    setEntering(true);
    setTimeout(() => setEntering(false), 300);
  }

  function handleBack() {
    setSelectedPack(null);
  }

  function handleSwitch() {
    if (!selectedPack) return;
    const currentIndex = packs.findIndex((p) => p.id === selectedPack.id);
    const next = packs[(currentIndex + 1) % packs.length];
    setSelectedPack(next);
    setEntering(true);
    setTimeout(() => setEntering(false), 300);
  }

  const iconLarge = selectedPack
    ? packs.find((p) => p.id === selectedPack.id)?.icon
    : null;

  return (
    <main className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-white">

      <style>{`
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
        .pack-enter {
          animation: pack-enter 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .slide-up {
          animation: slide-up 0.35s ease forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .fade-in { animation: fade-in 0.25s ease forwards; }
      `}</style>

      {/* ── SELECTION VIEW ── */}
      {!selectedPack && (
        <div className="flex w-full flex-col items-center gap-10 px-10 py-16">
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Choose your booster
            </p>
            <p className="font-serif text-[1.6rem] font-light italic text-slate-700">
              Select one pack to open
            </p>
          </div>

          <div className="flex w-full items-center justify-center gap-3">
            {packs.map((pack) => (
              <button
                key={pack.id}
                onClick={() => handleSelectPack(pack)}
                style={{ width: 95, height: 148 }}
                className="relative flex shrink-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_2px_6px_rgba(0,0,0,0.10),0_6px_24px_rgba(0,0,0,0.09)] active:scale-95"
              >
                <div className={`h-[5px] w-full shrink-0 bg-gradient-to-r ${pack.accentFrom} ${pack.accentTo}`} />
                <div className="flex flex-1 flex-col items-center justify-between px-2 py-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${pack.iconBg} ${pack.iconBorder} ${pack.iconText}`}>
                    {pack.icon}
                  </div>
                  <div className="flex h-9 items-center justify-center">
                    <span className="text-center text-[9px] font-semibold uppercase leading-tight tracking-wide text-slate-800 sm:text-[10px]">
                      {pack.name}
                    </span>
                  </div>
                  <div className="w-8 border-t border-slate-100" />
                  <span className="font-serif text-[11px] font-light italic text-slate-400">
                    {pack.type}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Timer card */}
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

      {/* ── PACK DETAIL VIEW ── */}
      {selectedPack && (
        <div className="fade-in flex min-h-dvh w-full flex-col">

          {/* Top bar */}
          <div className="flex items-center justify-center px-6 pt-12 pb-4">
            {/* Timer pill */}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.06)]">
              {/* Pack count */}
              <div className="flex items-center gap-1">
                <Package size={11} className="text-slate-400" />
                <span className="text-[10px] font-semibold text-slate-600">
                  {availablePacks}
                  <span className="font-normal text-slate-400">/{MAX_PACKS}</span>
                </span>
              </div>

              <div className="h-3 w-px bg-slate-200" />

              {/* Clock + time */}
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

              {/* Mini progress bar */}
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

          {/* Pack display — centred, takes up remaining space */}
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-10">
            {/* Big pack card */}
            <div
              key={selectedPack.id}
              className={`pack-enter flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.10),0_1px_4px_rgba(0,0,0,0.06)]`}
              style={{ width: 200, height: 280 }}
            >
              <div className={`h-[6px] w-full shrink-0 bg-gradient-to-r ${selectedPack.accentFrom} ${selectedPack.accentTo}`} />
              <div className="flex flex-1 flex-col items-center justify-between px-4 py-6">
                {/* Large icon */}
                <div className={`flex h-24 w-24 items-center justify-center rounded-full border-2 ${selectedPack.iconBg} ${selectedPack.iconBorder} ${selectedPack.iconText}`}>
                  {/* Clone icon at larger size */}
                  <div className="scale-[2.2] transform">
                    {packs.find((p) => p.id === selectedPack.id) &&
                      (() => {
                        const p = packs.find((p) => p.id === selectedPack.id)!;
                        if (p.id === "science") return <Atom size={28} />;
                        if (p.id === "philosophy") return <Brain size={28} />;
                        return <Palette size={28} />;
                      })()
                    }
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <span className="text-center text-[11px] font-semibold uppercase leading-snug tracking-wider text-slate-800">
                    {selectedPack.name}
                  </span>
                  <div className="w-10 border-t border-slate-100" />
                  <span className="font-serif text-sm font-light italic text-slate-400">
                    {selectedPack.type}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="slide-up flex items-center justify-between px-10 pb-14 pt-6">
            {/* Back */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-medium text-slate-500 shadow-[0_1px_3px_rgba(0,0,0,0.07)] transition-all active:scale-95"
            >
              <ChevronLeft size={15} />
              Back
            </button>

            {/* Switch pack */}
            <button
              onClick={handleSwitch}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-medium text-slate-500 shadow-[0_1px_3px_rgba(0,0,0,0.07)] transition-all active:scale-95"
            >
              <RefreshCw size={13} />
              Switch pack
            </button>
          </div>

        </div>
      )}

    </main>
  );
}