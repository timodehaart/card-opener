"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

// ── Diagram visuals ────────────────────────────────────────────────────────────

function Diagram({ type }: { type: string }) {
  if (type === "overview") {
    return (
      <div className="flex gap-4">
        {[
          { value: "2", label: "Players" },
          { value: "30", label: "Cards per deck" },
          { value: "20", label: "Starting HP" },
        ].map(({ value, label }) => (
          <div
            key={label}
            className="flex flex-1 flex-col items-center gap-1 rounded-xl border border-neutral-100 bg-white py-3 shadow-[0_3px_10px_rgba(0,0,0,0.08)]"
          >
            <span className="font-mono text-2xl font-bold text-blue-500">
              {value}
            </span>
            <span className="mx-1 text-center font-mono text-[10px] text-neutral-400">
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (type === "setup") {
    return (
      <div className="w-full text-xs">
        <div className="mb-2 flex items-center justify-between rounded-lg border border-rose-100 bg-rose-50 px-3 py-2">
          <span className="font-semibold text-rose-500">Opponent — 20 HP</span>
          <div className="flex w-[35%] justify-between">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-6 w-4 rounded border border-neutral-200 bg-white shadow-[0_2px_5px_rgba(0,0,0,0.08)]"
              />
            ))}
          </div>
        </div>

        <div className="mx-auto flex w-[40%] items-center justify-between py-0.5">
          <div className="flex h-12 w-9 items-center justify-center rounded border-2 border-dashed border-neutral-200 text-[9px] text-neutral-300">
            slot
          </div>
          <span className="mx-1 text-neutral-300">⚔</span>
          <div className="flex h-12 w-9 items-center justify-center rounded border-2 border-dashed border-neutral-200 text-[9px] text-neutral-300">
            slot
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2">
          <span className="font-semibold text-emerald-500">You — 20 HP</span>
          <div className="flex w-[35%] justify-between">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-6 w-4 rounded border border-neutral-200 bg-gradient-to-b from-white to-neutral-100 shadow-[0_2px_5px_rgba(0,0,0,0.08)]"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "turns") {
    const phases = [
      { label: "Draw", cls: "text-cyan-600 border-cyan-100 bg-cyan-50" },
      { label: "Play", cls: "text-blue-600 border-blue-100 bg-blue-50" },
      { label: "Battle", cls: "text-rose-500 border-rose-100 bg-rose-50" },
      { label: "End", cls: "text-neutral-500 border-neutral-100 bg-neutral-50" },
    ];

    return (
      <div className="flex items-center gap-1">
        {phases.map((p, i) => (
          <div key={p.label} className="flex items-center gap-1">
            <div className={`rounded-xl border px-3 py-2 text-xs font-semibold ${p.cls}`}>
              {p.label}
            </div>
            {i < 3 && <span className="text-xs text-neutral-300">→</span>}
          </div>
        ))}
      </div>
    );
  }

  if (type === "combat") {
    return (
      <div className="flex w-[90%] items-center justify-around">
        <div className="flex flex-col items-center gap-1 rounded-xl border border-orange-100 bg-orange-50 px-4 py-6">
          <span className="text-3xl">🐉</span>
          <span className="font-mono text-[10px] text-orange-500">ATK 450</span>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <span className="text-neutral-300">→</span>
          <div className="rounded-lg bg-neutral-50 px-2 py-1 text-center">
            <p className="font-mono text-[9px] text-neutral-400">450 − 350</p>
            <p className="font-mono text-sm font-bold text-rose-500">100 dmg</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 rounded-xl border border-cyan-100 bg-cyan-50 px-4 py-6">
          <span className="text-3xl">💎</span>
          <span className="font-mono text-[10px] text-blue-500">DEF 350</span>
        </div>
      </div>
    );
  }

  if (type === "types") {
    return (
      <div className="flex w-full justify-between">
        {[
          {
            icon: "🎲",
            label: "Connector",
            desc: "Ongoing",
            cls: "border-teal-100 bg-teal-50 text-teal-600",
          },
          {
            icon: "⚔️",
            label: "General",
            desc: "ATK + DEF",
            cls: "border-neutral-200 bg-neutral-50 text-neutral-600",
          },
          {
            icon: "✨",
            label: "Bonus",
            desc: "One-time",
            cls: "border-slate-200 bg-slate-50 text-slate-500",
          },
          {
            icon: "🃏",
            label: "Joker",
            desc: "ATK + DEF",
            cls: "border-amber-100 bg-amber-50 text-amber-600",
          },
        ].map((t) => (
          <div
            key={t.label}
            className={`h-[6.2rem] w-[4.5rem] rounded-xl border shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${t.cls}`}
          >
            <div className="flex h-full w-full flex-col items-center justify-center text-center">
              <span className="text-xl">{t.icon}</span>
              <span className="text-xs font-semibold">{t.label}</span>
              <span className="font-mono text-[9px] opacity-70">{t.desc}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "winning") {
    return (
      <div className="flex w-full flex-col gap-2.5">
        <div>
          <div className="mb-1 flex justify-between font-mono text-xs">
            <span className="text-emerald-500">You</span>
            <span className="text-emerald-500">12 HP</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-neutral-100">
            <div className="h-full rounded-full bg-emerald-400" style={{ width: "60%" }} />
          </div>
        </div>

        <div>
          <div className="mb-1 flex justify-between font-mono text-xs">
            <span className="text-rose-500">Opponent</span>
            <span className="text-rose-500">0 HP</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-neutral-100" />
        </div>

        <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 py-2 text-center text-sm font-bold text-blue-500">
          Victory!
        </div>
      </div>
    );
  }

  return null;
}

// ── Sections ───────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    label: "Overview",
    title: "How is Dezcartes Played?",
    visual: "overview",
    steps: [
      { title: "Two-player strategy", body: "A head-to-head card game — build a 30-card deck and battle until one player hits 0 HP." },
      { title: "Win condition", body: "Reduce your opponent's HP from 20 to 0 before they do the same to you." },
      { title: "Core loop", body: "Draw a card, play cards to the field, attack with them, and end your turn." },
    ],
  },
  {
    label: "Setup & Board",
    title: "Setup & The Board",
    visual: "setup",
    steps: [
      { title: "Shuffle & draw 5", body: "Shuffle your 30-card deck and draw 5 cards as your starting hand." },
      { title: "Decide first player", body: "Flip a coin — the first player draws 1 extra card before their opening turn." },
      { title: "Set HP to 20", body: "Both players start at 20 HP. Each side has 3 field slots for placing cards." },
    ],
  },
  {
    label: "Turns",
    title: "Turn Structure",
    visual: "turns",
    steps: [
      { title: "Draw", body: "Take 1 card from the top of your deck. No cards left? You lose immediately." },
      { title: "Play", body: "Place any number of cards from your hand onto your three field slots." },
      { title: "Battle", body: "Choose one of your field cards to declare an attack against the opponent." },
      { title: "End", body: "Pass your turn. Unused plays or attacks are forfeited — nothing carries over." },
    ],
  },
  {
    label: "Combat",
    title: "The Battle Phase",
    visual: "combat",
    steps: [
      { title: "Declare attacker", body: "Tap a card on your field to declare it as the attacker for this turn." },
      { title: "Choose target", body: "Target an opponent's field card. If they have none, you hit their HP directly." },
      { title: "Calculate damage", body: "Damage = ATK − DEF. The positive difference is dealt to the opponent's HP." },
      { title: "Blocked attack", body: "If ATK ≤ DEF, the attack is fully absorbed — no HP damage is dealt." },
    ],
  },
  {
    label: "Card Types",
    title: "Types of Cards",
    visual: "types",
    steps: [
      {
        title: "General",
        body: "The foundation of every duel. Generals carry ATK and DEF, standing at the front of your field to challenge opposing ideas."
      },
      {
        title: "Bonus",
        body: "A one-time spark of advantage. Bonus cards can strengthen a move, restore HP, or interrupt the opponent’s strategy."
      },
      {
        title: "Joker",
        body: "A rare and unpredictable force. Jokers also have ATK and DEF, but their power can twist the direction of a duel."
      },
      {
        title: "Connector",
        body: "A lasting link between ideas. Connector cards remain active and create ongoing effects that support your strategy."
      },
    ],
  },
  {
    label: "Winning",
    title: "How to Win",
    visual: "winning",
    steps: [
      { title: "Reduce HP to 0", body: "The game ends the moment any player's HP hits 0 — that player loses." },
      { title: "Empty deck", body: "If a player must draw but has no cards remaining, they immediately lose." },
      { title: "Concede", body: "A player may concede at any time on their turn — the opponent wins instantly." },
    ],
  },
];

// ── Page ───────────────────────────────────────────────────────────────────────

export default function RulesPage() {
  const [current, setCurrent] = useState(0);
  const section = SECTIONS[current];

  const chipsRef = useRef<HTMLDivElement | null>(null);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    chipRefs.current[current]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [current]);

  return (
  <main className="flex min-h-screen flex-col bg-[#F7F7F7] text-neutral-900">
    <header className="relative flex items-center gap-3 bg-white px-6 py-5 shadow-[0_3px_14px_rgba(0,0,0,0.10)]">
      <Link
        href="/gameplay"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-500 shadow-[0_3px_14px_rgba(0,0,0,0.14)] transition-colors hover:text-neutral-900"
      >
        <ArrowLeft size={18} />
      </Link>

      <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-neutral-900">
        The Laws of Dezcartes
      </h1>

      <span className="ml-auto font-mono text-xs text-neutral-400">
        {current + 1} / {SECTIONS.length}
      </span>
    </header>

    <div className="flex flex-1 flex-col gap-5 px-6 py-5">
      {/* Progress bar */}
      <div className="flex gap-1.5">
        {SECTIONS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < current
                ? "bg-blue-400"
                : i === current
                ? "bg-[linear-gradient(90deg,#06B6D4_0%,#3B82F6_50%,#2563EB_100%)]"
                : "bg-neutral-200"
            }`}
          />
        ))}
      </div>

      {/* Section chips */}
      <div
        ref={chipsRef}
        className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {SECTIONS.map((s, i) => (
          <button
            key={s.label}
            ref={(el) => {
              chipRefs.current[i] = el;
            }}
            onClick={() => setCurrent(i)}
            className={`shrink-0 rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
              i === current
                ? "border-blue-100 bg-blue-50 text-blue-600"
                : "border-neutral-200 bg-white text-neutral-400 hover:border-blue-100 hover:text-blue-500"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Section title */}
      <h2 className="text-2xl font-semibold text-neutral-900">
        {section.title}
      </h2>

      {/* Diagram */}
      <div className="flex h-auto items-center justify-center rounded-[22px] border border-white bg-white px-4 py-5 shadow-[0_3px_12px_rgba(0,0,0,0.12)]">
        <Diagram type={section.visual} />
      </div>

      {/* Steps */}
      <ol className="flex flex-col gap-4 rounded-[22px] bg-white p-4 shadow-[0_3px_12px_rgba(0,0,0,0.10)]">
        {section.steps.map((step, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#06B6D4_0%,#3B82F6_50%,#2563EB_100%)] font-mono text-[11px] font-bold text-white opacity-80">
              {i + 1}
            </span>

            <div>
              <p className="text-sm font-semibold text-neutral-900">
                {step.title}
              </p>
              <p className="mt-0.5 font-mono text-xs leading-relaxed text-neutral-400">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>

    {/* Prev / Next */}
    <div className="flex gap-3 bg-[#F7F7F7] px-6 pb-8 pt-2">
      <button
        onClick={() => setCurrent((c) => Math.max(0, c - 1))}
        disabled={current === 0}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-white py-3 text-sm font-semibold text-neutral-500 shadow-[0_3px_10px_rgba(0,0,0,0.10)] transition-colors hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={16} />
        Back
      </button>

      {current < SECTIONS.length - 1 ? (
        <button
          onClick={() => setCurrent((c) => c + 1)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,#06B6D4_0%,#3B82F6_50%,#2563EB_100%)] py-3 text-sm font-semibold text-white shadow-[0_3px_10px_rgba(0,0,0,0.14)] opacity-80 transition-opacity hover:opacity-100"
        >
          Next
          <ChevronRight size={16} />
        </button>
      ) : (
        <Link
          href="/gameplay"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,#06B6D4_0%,#3B82F6_50%,#2563EB_100%)] py-3 text-sm font-semibold text-white shadow-[0_3px_10px_rgba(0,0,0,0.14)] opacity-80 transition-opacity hover:opacity-100"
        >
          Done
          <ChevronRight size={16} />
        </Link>
      )}
    </div>
  </main>
);
}
