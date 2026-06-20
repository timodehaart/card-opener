"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const ALL_MATCHES = [
  { result: "W", opponent: "vs. Master", deck: "Philosophy Deck", mode: "Advanced", date: "Jun 3", duration: "14m" },
  { result: "L", opponent: "vs. Master", deck: "Art Deck", mode: "Advanced", date: "Jun 3", duration: "12m" },
  { result: "W", opponent: "vs. Scholar", deck: "Philosophy Deck", mode: "Intermediate", date: "Jun 2", duration: "10m" },
  { result: "W", opponent: "vs. Scholar", deck: "Philosophy Deck", mode: "Intermediate", date: "Jun 1", duration: "10m" },
  { result: "L", opponent: "vs. Master", deck: "Science Deck", mode: "Advanced", date: "May 31", duration: "12m" },
  { result: "W", opponent: "vs. Novice", deck: "Art Deck", mode: "Beginner", date: "May 30", duration: "11m" },
  { result: "W", opponent: "vs. Novice", deck: "Science Deck", mode: "Beginner", date: "May 29", duration: "10m" },
  { result: "L", opponent: "vs. Master", deck: "Philosophy Deck", mode: "Advanced", date: "May 28", duration: "15m" },
];

type Filter = "All" | "Wins" | "Losses";
const FILTERS: Filter[] = ["All", "Wins", "Losses"];

const wins = ALL_MATCHES.filter((m) => m.result === "W").length;
const losses = ALL_MATCHES.filter((m) => m.result === "L").length;
const winRate = Math.round((wins / ALL_MATCHES.length) * 100);

export default function HistoryPage() {
  const [filter, setFilter] = useState<Filter>("All");

  const matches = ALL_MATCHES.filter((m) => {
    if (filter === "Wins") return m.result === "W";
    if (filter === "Losses") return m.result === "L";
    return true;
  });

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
          Match History
        </h1>
      </header>

      <div className="flex-1 px-6 py-5">
        {/* Stats */}
        <div className="mb-5 grid grid-cols-3 gap-3">
          <div className="rounded-[18px] border border-white bg-white p-3 text-center shadow-[0_3px_12px_rgba(0,0,0,0.10)]">
            <span className="block font-mono text-2xl font-bold text-blue-500">
              {wins}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wide text-neutral-400">
              Wins
            </span>
          </div>

          <div className="rounded-[18px] border border-white bg-white p-3 text-center shadow-[0_3px_12px_rgba(0,0,0,0.10)]">
            <span className="block font-mono text-2xl font-bold text-neutral-500">
              {losses}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wide text-neutral-400">
              Losses
            </span>
          </div>

          <div className="rounded-[18px] border border-white bg-white p-3 text-center shadow-[0_3px_12px_rgba(0,0,0,0.10)]">
            <span className="block font-mono text-2xl font-bold text-emerald-400">
              {winRate}%
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wide text-neutral-400">
              Win Rate
            </span>
          </div>
        </div>

        {/* Filter chips */}
        <div className="mb-4 flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
                filter === f
                  ? "border-blue-100 bg-blue-50 text-blue-600"
                  : "border-neutral-200 bg-white text-neutral-400 hover:border-blue-100 hover:text-blue-500"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Match list */}
        <div className="flex flex-col overflow-hidden rounded-[22px] bg-white px-4 shadow-[0_3px_12px_rgba(0,0,0,0.10)]">
          {matches.map((match, i) => (
            <div
              key={i}
              className="flex items-center gap-3 border-b border-neutral-100 py-3.5 last:border-0"
            >
              {/* Result badge */}
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                  match.result === "W"
                    ? "bg-[linear-gradient(135deg,#06B6D4_0%,#3B82F6_50%,#2563EB_100%)] text-white shadow-[0_3px_10px_rgba(0,0,0,0.12)] opacity-80"
                    : "border border-neutral-200 bg-neutral-50 text-neutral-400"
                }`}
              >
                {match.result}
              </div>

              {/* Opponent + deck */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-neutral-900">
                  {match.opponent}
                </p>
                <p className="font-mono text-[10px] text-neutral-400">
                  {match.deck}
                </p>
              </div>

              {/* Mode + date */}
              <div className="shrink-0 text-right">
                <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 font-mono text-[9px] text-blue-500">
                  {match.mode}
                </span>
                <p className="mt-1 font-mono text-[9px] text-neutral-300">
                  {match.date} · {match.duration}
                </p>
              </div>
            </div>
          ))}

          {matches.length === 0 && (
            <p className="py-10 text-center font-mono text-sm text-neutral-400">
              No matches found.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
