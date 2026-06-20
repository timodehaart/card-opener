"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";

const KEYFRAMES = `
  @keyframes pulse-ring {
    0%   { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(1.9); opacity: 0; }
  }
  @keyframes card-land {
    0%   { opacity: 0; transform: scale(0.45) translateY(-40px) rotate(-6deg); }
    65%  { transform: scale(1.08) translateY(3px) rotate(0deg); }
    100% { opacity: 1; transform: scale(1) translateY(0) rotate(0deg); }
  }
  @keyframes card-play-out {
    0%   { opacity: 1; transform: translateY(-12px) scale(1); }
    100% { opacity: 0; transform: translateY(-50px) scale(0.45) rotate(6deg); }
  }
  @keyframes card-attack-up {
    0%   { transform: translateY(0) scale(1); }
    35%  { transform: translateY(-56px) scale(1.12); }
    60%  { transform: translateY(6px) scale(0.95); }
    100% { transform: translateY(0) scale(1); }
  }
  @keyframes card-shake {
    0%,100% { transform: translateX(0) rotate(0deg); }
    15%  { transform: translateX(-11px) rotate(-2.5deg); }
    35%  { transform: translateX(11px) rotate(2.5deg); }
    55%  { transform: translateX(-7px) rotate(-1deg); }
    75%  { transform: translateX(7px) rotate(1deg); }
  }
  @keyframes float-damage {
    0%   { opacity: 1; transform: translateY(0) scale(1.5); }
    20%  { transform: translateY(-12px) scale(1.7); }
    100% { opacity: 0; transform: translateY(-70px) scale(0.8); }
  }
  @keyframes card-draw-in {
    0%   { opacity: 0; transform: translateX(70px) scale(0.4) rotate(14deg); }
    100% { opacity: 1; transform: translateX(0) scale(1) rotate(0deg); }
  }
  @keyframes opp-card-play {
    0%   { opacity: 0; transform: translateY(-70px) scale(0.4) rotate(-6deg); }
    65%  { transform: translateY(4px) scale(1.08); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes coach-in {
    0%   { opacity: 0; transform: translateY(12px); }
    100% { opacity: 1; transform: translateY(0); }
  }
`;

// ── Card data ──────────────────────────────────────────────────────────────────

type CardData = {
  name: string;
  type: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Legendary";
  atk: number;
  def: number;
  ability: string;
  gradient: string;
  typeColor: string;
  art: string;
};

const CARDS: Record<string, CardData> = {
  emberDrake: {
    name: "Ember Drake",
    type: "Fire",
    rarity: "Rare",
    atk: 450,
    def: 200,
    ability: "Blaze — +50 damage when opponent has below 5 HP.",
    gradient: "from-orange-700 via-red-700 to-rose-900",
    typeColor: "bg-orange-500",
    art: "🐉",
  },
  stoneSentinel: {
    name: "Stone Sentinel",
    type: "Earth",
    rarity: "Common",
    atk: 280,
    def: 600,
    ability: "Fortify — Gains +100 DEF each time it is attacked.",
    gradient: "from-stone-600 via-stone-700 to-stone-900",
    typeColor: "bg-stone-500",
    art: "🗿",
  },
  crystalSpirit: {
    name: "Crystal Spirit",
    type: "Water",
    rarity: "Uncommon",
    atk: 320,
    def: 350,
    ability: "Reflect — 20% chance to deflect damage back.",
    gradient: "from-cyan-600 via-blue-700 to-blue-900",
    typeColor: "bg-cyan-500",
    art: "💎",
  },
  voidmancer: {
    name: "Voidmancer",
    type: "Dark",
    rarity: "Legendary",
    atk: 520,
    def: 150,
    ability: "Drain — Restores 1 HP when this card deals damage.",
    gradient: "from-violet-700 via-purple-800 to-indigo-900",
    typeColor: "bg-violet-600",
    art: "🌑",
  },
};

const rarityBadge: Record<string, string> = {
  Common: "text-slate-400 border-slate-500",
  Uncommon: "text-emerald-400 border-emerald-500",
  Rare: "text-blue-400 border-blue-500",
  Legendary: "text-amber-400 border-amber-500",
};

function TcgCard({ card, size = "md", className = "" }: { card: CardData; size?: "sm" | "md"; className?: string }) {
  const s = {
    sm: { w: "w-24", art: "h-14 text-2xl", name: "text-[9px]", stat: "text-[8px]", ability: "text-[7px]" },
    md: { w: "w-32", art: "h-[72px] text-3xl", name: "text-[11px]", stat: "text-[9px]", ability: "text-[8px]" },
  }[size];
  return (
    <div className={`flex ${s.w} flex-col overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b shadow-xl ${card.gradient} ${className}`}>
      <div className="flex items-center justify-between px-2 pt-2">
        <span className={`truncate font-bold text-white ${s.name}`}>{card.name}</span>
        <span className={`ml-1 shrink-0 rounded px-1 py-0.5 text-[7px] font-bold text-white ${card.typeColor}`}>{card.type}</span>
      </div>
      <div className={`mx-2 mt-1 flex ${s.art} items-center justify-center rounded-lg bg-black/30`}>{card.art}</div>
      <div className="mx-2 mt-0.5 flex justify-end">
        <span className={`rounded border px-1 text-[6px] font-semibold ${rarityBadge[card.rarity]}`}>{card.rarity}</span>
      </div>
      <div className="mx-2 mt-1 flex flex-col gap-0.5">
        {[
          { label: "ATK", value: card.atk, bar: "bg-red-400", color: "text-red-400" },
          { label: "DEF", value: card.def, bar: "bg-blue-400", color: "text-blue-400" },
        ].map(({ label, value, bar, color }) => (
          <div key={label} className={`flex items-center gap-1 ${s.stat}`}>
            <span className={`w-5 font-bold ${color}`}>{label}</span>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <div className={`h-full rounded-full ${bar}`} style={{ width: `${(value / 600) * 100}%` }} />
            </div>
            <span className="w-6 text-right font-mono text-white/90">{value}</span>
          </div>
        ))}
      </div>
      <div className="mx-2 mb-2 mt-1 rounded-lg bg-black/30 p-1">
        <p className={`leading-snug text-white/70 ${s.ability}`}>{card.ability}</p>
      </div>
    </div>
  );
}

function GlowRing({ color }: { color: "emerald" | "cyan" }) {
  const cls = color === "emerald" ? "border-emerald-400" : "border-cyan-400";
  return (
    <>
      <div className={`pointer-events-none absolute inset-0 z-20 rounded-xl border-2 ${cls}`} />
      <div className={`pointer-events-none absolute inset-0 z-20 rounded-xl border-2 ${cls}`} style={{ animation: "pulse-ring 1.1s ease-out infinite" }} />
    </>
  );
}

function TapLabel({ label, color }: { label: string; color: "emerald" | "cyan" }) {
  return (
    <div className={`absolute -bottom-6 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap animate-pulse font-mono text-[10px] font-bold ${color === "emerald" ? "text-emerald-400" : "text-cyan-400"}`}>
      {label}
    </div>
  );
}

// ── Phase state ────────────────────────────────────────────────────────────────

type Phase = "draw" | "play" | "opp_play" | "attack" | "done";
const STEPS: Phase[] = ["draw", "play", "opp_play", "attack", "done"];

const COACH: Record<Phase, { tag: string; body: string }> = {
  draw: {
    tag: "Step 1 / 5 — Draw",
    body: "Every turn starts with a draw. Tap the glowing deck to pull a card into your hand.",
  },
  play: {
    tag: "Step 2 / 5 — Play a Card",
    body: "You drew Ember Drake! Tap the glowing card in your hand to place it on the battlefield.",
  },
  opp_play: {
    tag: "Step 3 / 5 — Opponent's Turn",
    body: "",
  },
  attack: {
    tag: "Step 4 / 5 — Attack!",
    body: "Both players have a card on the field. Tap your Ember Drake to launch an attack.",
  },
  done: {
    tag: "Step 5 / 5 — Nice hit!",
    body: "Ember Drake ATK 450 vs Stone Sentinel DEF 200 — that's 3 damage. Keep attacking to reduce their HP to 0.",
  },
};

const INITIAL_HAND: string[] = ["crystalSpirit", "voidmancer"];

// ── Page ───────────────────────────────────────────────────────────────────────

export default function TutorialPage() {
  const [phase, setPhase] = useState<Phase>("draw");
  const [opponentHp, setOpponentHp] = useState(20);
  const [playerField, setPlayerField] = useState<string | null>(null);
  const [opponentField, setOpponentField] = useState<string | null>(null);
  const [hand, setHand] = useState<string[]>(INITIAL_HAND);

  const [drawAnim, setDrawAnim] = useState(false);
  const [playOutAnim, setPlayOutAnim] = useState(false);
  const [fieldLandAnim, setFieldLandAnim] = useState(false);
  const [oppLandAnim, setOppLandAnim] = useState(false);
  const [attackAnim, setAttackAnim] = useState(false);
  const [shakeAnim, setShakeAnim] = useState(false);
  const [showDmg, setShowDmg] = useState(false);

  useEffect(() => {
    if (phase !== "opp_play") return;
    const t1 = setTimeout(() => { setOppLandAnim(true); setOpponentField("stoneSentinel"); }, 1000);
    const t2 = setTimeout(() => { setOppLandAnim(false); setPhase("attack"); }, 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [phase]);

  function handleDeckClick() {
    if (phase !== "draw") return;
    setDrawAnim(true);
    setTimeout(() => { setHand((h) => ["emberDrake", ...h]); setDrawAnim(false); setPhase("play"); }, 620);
  }

  function handleHandCardClick(key: string) {
    if (phase !== "play" || key !== "emberDrake") return;
    setPlayOutAnim(true);
    setTimeout(() => {
      setHand((h) => h.filter((k) => k !== key));
      setPlayOutAnim(false); setFieldLandAnim(true); setPlayerField("emberDrake");
      setTimeout(() => { setFieldLandAnim(false); setPhase("opp_play"); }, 520);
    }, 360);
  }

  function handlePlayerFieldClick() {
    if (phase !== "attack" || attackAnim) return;
    setAttackAnim(true);
    setTimeout(() => {
      setAttackAnim(false); setShakeAnim(true); setShowDmg(true);
      setTimeout(() => {
        setShakeAnim(false);
        setTimeout(() => { setShowDmg(false); setOpponentHp((h) => Math.max(0, h - 3)); setPhase("done"); }, 280);
      }, 580);
    }, 520);
  }

  function restart() {
    setPhase("draw"); setOpponentHp(20); setPlayerField(null); setOpponentField(null);
    setHand(INITIAL_HAND); setDrawAnim(false); setPlayOutAnim(false); setFieldLandAnim(false);
    setOppLandAnim(false); setAttackAnim(false); setShakeAnim(false); setShowDmg(false);
  }

  const phaseIdx = STEPS.indexOf(phase);
  const coach = COACH[phase];
  const oppHandCount = opponentField ? 4 : 5;

  return (
    <main className="flex min-h-screen flex-col bg-[#F7F7F7] text-neutral-900">
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      {/* Wireframe-style header */}
      <header className="relative flex items-center justify-between bg-white px-6 py-4 shadow-[0_3px_14px_rgba(0,0,0,0.10)]">
        <Link
          href="/gameplay"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-500 shadow-[0_3px_14px_rgba(0,0,0,0.14)] transition-colors hover:text-neutral-900"
        >
          <ArrowLeft size={18} />
        </Link>

        <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-neutral-900">
          Battle Ground
        </h1>

        <span className="font-mono text-xs text-neutral-400">
          Step {phaseIdx + 1} / {STEPS.length}
        </span>
      </header>

      {/* ── COACH MARK ─────────────────────────────────────────────── */}
      <div
        className="mx-5 mt-[2rem] absolute top-[6rem] z-10 rounded-[22px] border border-white bg-white p-4 shadow-[0_3px_14px_rgba(0,0,0,0.14)]"
        style={{ animation: "coach-in 0.3s ease-out" }}
        key={phase}
      >
        <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-blue-500">
          {coach.tag}
        </span>
        <p className="text-[14px] leading-snug text-neutral-500">{coach.body}</p>

        {phase === "done" && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={restart}
              className="flex-1 rounded-xl border border-neutral-200 bg-white py-2.5 text-sm font-semibold text-neutral-500 shadow-[0_3px_10px_rgba(0,0,0,0.10)] transition-colors hover:text-neutral-900"
            >
              Replay
            </button>

            <Link
              href="/gameplay"
              className="flex-1 rounded-xl bg-[linear-gradient(135deg,#06B6D4_0%,#3B82F6_50%,#2563EB_100%)] py-2.5 text-center text-sm font-semibold text-white shadow-[0_3px_10px_rgba(0,0,0,0.14)] opacity-80 transition-opacity hover:opacity-100"
            >
              Finish Tutorial
            </Link>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col items-center gap-4 px-4 py-5">
        {/* ── GAME BOARD ─────────────────────────────────────────────── */}
        <div className="w-full max-w-md mt-12">

          {/* Opponent */}
          <div className="rounded-t-[22px] border border-white bg-white px-4 pb-4 pt-3 shadow-[0_3px_12px_rgba(0,0,0,0.10)]">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-400">Opponent</span>
              <div className="flex items-center gap-1">
                <Heart size={10} className="text-rose-400" />
                <span className="font-mono text-xs text-rose-400">{opponentHp} HP</span>
              </div>
            </div>
            <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-rose-500 transition-all duration-700" style={{ width: `${(opponentHp / 20) * 100}%` }} />
            </div>
            <div className="mb-4 flex justify-center gap-1">
              {[...Array(oppHandCount)].map((_, i) => (
                <div key={i} className="flex h-8 w-6 items-center justify-center rounded-md border border-neutral-200 bg-gradient-to-b from-white to-neutral-100 font-mono text-[9px] text-neutral-300 shadow-[0_2px_5px_rgba(0,0,0,0.08)]">?</div>
              ))}
            </div>
            <div className="relative flex min-h-[130px] items-center justify-center">
              {opponentField ? (
                <div className="relative" style={{ animation: oppLandAnim ? "opp-card-play 0.55s ease-out forwards" : shakeAnim ? "card-shake 0.52s ease-in-out" : undefined }}>
                  <TcgCard card={CARDS[opponentField]} size="md" />
                  {showDmg && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center" style={{ animation: "float-damage 1s ease-out forwards" }}>
                      <span className="rounded-full bg-rose-600 px-3 py-1 text-lg font-black text-white shadow-xl ring-2 ring-rose-400/60">−3 HP</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-[130px] w-32 items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 font-mono text-xs text-neutral-300">
                  {phase === "opp_play" ? <span className="animate-pulse text-neutral-400">Placing…</span> : "Opponent Field"}
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2 border-x border-white bg-[#F7F7F7] px-4 py-2">
            <div className="h-px flex-1 bg-neutral-200" />
            <span className="font-mono text-[10px] font-semibold tracking-widest text-neutral-300">
              ⚔ BATTLE ZONE
            </span>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          {/* Player */}
          <div className="rounded-b-[22px] border border-white bg-white px-4 pb-4 pt-3 shadow-[0_3px_12px_rgba(0,0,0,0.10)]">
            <div className="relative mb-4 flex min-h-[130px] items-center justify-center">
              {playerField ? (
                <div
                  onClick={handlePlayerFieldClick}
                  className={`relative ${phase === "attack" && !attackAnim ? "cursor-pointer" : ""}`}
                  style={{ animation: fieldLandAnim ? "card-land 0.52s ease-out forwards" : attackAnim ? "card-attack-up 0.55s ease-in-out" : undefined }}
                >
                  {phase === "attack" && !attackAnim && (
                    <>
                      <GlowRing color="emerald" />
                      <TapLabel label="↑ TAP TO ATTACK" color="emerald" />
                    </>
                  )}
                  <TcgCard card={CARDS[playerField]} size="md" />
                </div>
              ) : (
                <div className="flex h-[130px] w-32 items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 font-mono text-xs text-neutral-300">Your Field</div>
              )}
            </div>

            {/* Hand + Deck */}
            <div className="mt-6 flex items-end justify-center">
              <div className="w-fit flex items-end">
                {drawAnim && (
                  <div className="flex-shrink-0" style={{ animation: "card-draw-in 0.52s ease-out forwards" }}>
                    <TcgCard card={CARDS.emberDrake} size="sm" />
                  </div>
                )}
                {hand.map((key) => {
                  const isGlowing = phase === "play" && key === "emberDrake";
                  const isOutAnim = playOutAnim && key === "emberDrake";
                  const isDisabled = phase === "play" && key !== "emberDrake";
                  return (
                    <div
                      key={key}
                      onClick={() => handleHandCardClick(key)}
                      className={`mx-1 w-24 relative flex-shrink-0 transition-transform duration-200 ${isGlowing && !isOutAnim ? "z-10 -translate-y-3 cursor-pointer" : ""} ${isDisabled ? "cursor-not-allowed opacity-40" : ""}`}
                      style={{ animation: isOutAnim ? "card-play-out 0.36s ease-in forwards" : undefined }}
                    >
                      {isGlowing && !isOutAnim && (
                        <>
                          <GlowRing color="emerald" />
                          <TapLabel label="↑ PLAY" color="emerald" />
                        </>
                      )}
                      <TcgCard card={CARDS[key]} size="sm" />
                    </div>
                  );
                })}
              </div>

              {/* Deck */}
              <div
                onClick={handleDeckClick}
                className={`absolute translate-x-[135%] translate-y-[-230%] flex-shrink-0 ${phase === "draw" ? "cursor-pointer" : "pointer-events-none opacity-40"}`}
              >
                {phase === "draw" && (
                  <>
                    <GlowRing color="cyan" />
                    <TapLabel label="↑ DRAW" color="cyan" />
                  </>
                )}
                <div className="relative h-[130px] w-24">
                  {[2, 1, 0].map((i) => (
                    <div key={i} className="absolute inset-0 rounded-xl border border-blue-100 bg-gradient-to-b from-white to-blue-50 shadow-[0_2px_8px_rgba(0,0,0,0.08)]" style={{ transform: `translate(${i * 1.5}px, ${i * -2}px)` }} />
                  ))}
                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-blue-100 bg-gradient-to-b from-white to-blue-50 shadow-[0_3px_10px_rgba(0,0,0,0.12)]">
                    <span className="select-none text-xl">🂠</span>
                    <span className="mt-1 font-mono text-[8px] font-bold uppercase tracking-wider text-blue-400">
                      Deck
                    </span>
                    <span className="font-mono text-[8px] text-neutral-400">
                      26 cards
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Player HP */}
            <div className="mt-6">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400">You</span>
                <div className="flex items-center gap-1">
                  <Heart size={10} className="text-emerald-400" />
                  <span className="font-mono text-xs text-emerald-400">20 HP</span>
                </div>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-full rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
