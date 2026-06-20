"use client";

import { useState } from "react";
import { ArrowLeft, RotateCcw, Shield, Sword, Trophy, Zap } from "lucide-react";
import PhilosophyDuelGuide from "./PhilosophyDuelGuide";
import {
  battleRounds,
  philosophers,
  type PhilosopherId,
} from "./philosophy-duel-data";

type BattleState = "choose" | "battle" | "result";
type TurnResult = "success" | "fail" | null;

const DAMAGE = 12;

const GREEN_GRADIENT =
  "linear-gradient(135deg,#10B981 0%,#22C55E 50%,#84CC16 100%)";

export default function PhilosophyDuelGame({ onBack }: { onBack: () => void }) {
  const [battleState, setBattleState] = useState<BattleState>("choose");
  const [playerId, setPlayerId] = useState<PhilosopherId | null>(null);
  const [enemyId] = useState<PhilosopherId>("nietzsche");

  const [roundIndex, setRoundIndex] = useState(0);
  const [playerHp, setPlayerHp] = useState(35);
  const [enemyHp, setEnemyHp] = useState(35);
  const [score, setScore] = useState(0);

  const [selectedMove, setSelectedMove] = useState<string | null>(null);
  const [turnResult, setTurnResult] = useState<TurnResult>(null);
  const [battleLog, setBattleLog] = useState("Enemy is preparing an attack...");

  const [guideOpen, setGuideOpen] = useState(true);
  const [guideStep, setGuideStep] = useState(0);

  const player = playerId ? philosophers[playerId] : null;
  const enemy = philosophers[enemyId];
  const round = battleRounds[roundIndex];

  const isAnswered = selectedMove !== null;
  const isLastRound = roundIndex === battleRounds.length - 1;

  function startBattle(id: PhilosopherId) {
    const chosen = philosophers[id];

    setPlayerId(id);
    setPlayerHp(chosen.hp);
    setEnemyHp(enemy.hp);
    setBattleState("battle");
    setBattleLog(`${enemy.name} enters the arena.`);
  }

  function chooseMove(move: string) {
    if (isAnswered || !round) return;

    setSelectedMove(move);

    if (move === round.correctMove) {
      setTurnResult("success");
      setScore((prev) => prev + 1);
      setEnemyHp((prev) => Math.max(0, prev - DAMAGE));
      setBattleLog(`${move} was the perfect counter. Enemy takes ${DAMAGE} damage.`);
    } else {
      setTurnResult("fail");
      setPlayerHp((prev) => Math.max(0, prev - DAMAGE));
      setBattleLog(`${move} failed. You take ${DAMAGE} damage.`);
    }
  }

  function nextRound() {
    setSelectedMove(null);
    setTurnResult(null);

    if (isLastRound || playerHp <= 0 || enemyHp <= 0) {
      setBattleState("result");
      return;
    }

    setRoundIndex((prev) => prev + 1);
    setBattleLog("Enemy is preparing the next attack...");
  }

  function restart() {
    setBattleState("choose");
    setPlayerId(null);
    setRoundIndex(0);
    setPlayerHp(35);
    setEnemyHp(35);
    setScore(0);
    setSelectedMove(null);
    setTurnResult(null);
    setBattleLog("Enemy is preparing an attack...");
    setGuideOpen(true);
    setGuideStep(0);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F7F7] text-neutral-900">
      <div className="absolute left-[-90px] top-[-90px] h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="absolute right-[-120px] top-[240px] h-72 w-72 rounded-full bg-lime-300/20 blur-3xl" />
      <div className="absolute bottom-[-120px] left-8 h-72 w-72 rounded-full bg-green-300/20 blur-3xl" />

      <header className="relative flex items-center gap-3 bg-white px-6 py-5 shadow-[0_3px_14px_rgba(0,0,0,0.10)]">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-500 shadow-[0_3px_14px_rgba(0,0,0,0.14)] transition-colors hover:text-neutral-900"
        >
          <ArrowLeft size={18} />
        </button>

        <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold text-neutral-900">
          Philosophy Duel
        </h1>
      </header>

      <section className="relative mx-auto min-h-screen max-w-[430px] px-5 py-5">
        {battleState === "choose" && (
          <>
            <section className="relative mb-5 overflow-hidden rounded-[2rem] border border-white bg-white p-6 shadow-[0_3px_12px_rgba(0,0,0,0.14)]">
              <div
                className="absolute inset-0 opacity-30"
                style={{ background: GREEN_GRADIENT }}
              />
              <div
                className="absolute inset-0 bg-white"
                style={{
                  clipPath: "polygon(0 78%, 100% 45%, 100% 100%, 0% 100%)",
                }}
              />

              <div className="relative z-10">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-emerald-500">
                  Choose Your Fighter
                </p>

                <h1 className="text-5xl font-black leading-none text-neutral-900">
                  Mind Battle Arena
                </h1>

                <p className="mt-4 text-sm leading-relaxed text-neutral-500">
                  Pick a philosopher. In battle, the enemy attacks with ideas.
                  Choose the best counter move to deal damage.
                </p>
              </div>
            </section>

            <section className="grid gap-4">
              {Object.values(philosophers).map((philosopher) => (
                <PhilosopherSelectCard
                  key={philosopher.id}
                  id={philosopher.id}
                  onSelect={() => startBattle(philosopher.id)}
                />
              ))}
            </section>
          </>
        )}

        {battleState === "battle" && player && round && (
          <>
            <section className="mb-5 rounded-[2rem] border border-white bg-white p-5 shadow-[0_3px_12px_rgba(0,0,0,0.14)]">
              <div className="mb-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <FighterCard
                  id={player.id}
                  hp={playerHp}
                  maxHp={player.hp}
                  side="You"
                  active={turnResult === "success"}
                />

                <div
                  className="rounded-full px-3 py-2 text-sm font-black text-white shadow-[0_3px_10px_rgba(0,0,0,0.14)]"
                  style={{ background: GREEN_GRADIENT }}
                >
                  VS
                </div>

                <FighterCard
                  id={enemyId}
                  hp={enemyHp}
                  maxHp={enemy.hp}
                  side="Enemy"
                  active={turnResult === "fail"}
                />
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-emerald-600">
                  <Sword size={16} />
                  <p className="text-xs font-black uppercase tracking-[0.25em]">
                    Enemy Attack · Round {roundIndex + 1}/3
                  </p>
                </div>

                <h2 className="text-xl font-black leading-tight text-neutral-900">
                  {round.enemyAttack}
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                  “{round.attackText}”
                </p>
              </div>

              <div className="mt-4 rounded-2xl bg-neutral-50 p-4">
                <p className="text-xs font-black uppercase tracking-widest text-emerald-500">
                  Battle Log
                </p>
                <p className="mt-2 text-sm font-semibold text-neutral-500">
                  {battleLog}
                </p>
              </div>
            </section>

            <section className="mb-5 rounded-[2rem] border border-white bg-white p-5 shadow-[0_3px_12px_rgba(0,0,0,0.14)]">
              <div className="mb-4 flex items-center gap-2">
                <Shield size={17} className="text-emerald-500" />
                <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">
                  Choose Counter Move
                </p>
              </div>

              <div className="grid gap-3">
                {round.playerMoves.map((move) => {
                  const picked = selectedMove === move;
                  const correct = round.correctMove === move;

                  return (
                    <button
                      key={move}
                      onClick={() => chooseMove(move)}
                      disabled={isAnswered}
                      className={`rounded-2xl border p-4 text-left text-sm font-black transition-all ${
                        isAnswered
                          ? correct
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                            : picked
                            ? "border-red-300 bg-red-50 text-red-700"
                            : "border-neutral-100 bg-neutral-50 text-neutral-300"
                          : "border-neutral-100 bg-neutral-50 text-neutral-700 hover:-translate-y-1 hover:border-emerald-300 hover:bg-emerald-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{move}</span>
                        {isAnswered && correct && <span>✅</span>}
                        {isAnswered && picked && !correct && <span>❌</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {isAnswered && (
              <section
                className={`rounded-[2rem] p-5 shadow-[0_3px_12px_rgba(0,0,0,0.14)] ${
                  turnResult === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Zap size={18} />
                  <p className="text-lg font-black">
                    {turnResult === "success"
                      ? "Counter Attack!"
                      : "Counter Failed!"}
                  </p>
                </div>

                <p className="mt-2 text-sm font-semibold leading-relaxed">
                  {turnResult === "success"
                    ? round.successText
                    : round.failText}
                </p>

                <p className="mt-3 text-xl font-black">
                  {turnResult === "success"
                    ? `Enemy -${DAMAGE} HP`
                    : `You -${DAMAGE} HP`}
                </p>

                <button
                  onClick={nextRound}
                  className="mt-4 w-full rounded-full py-3 text-sm font-black uppercase tracking-widest text-white"
                  style={{ background: GREEN_GRADIENT }}
                >
                  {isLastRound || playerHp <= 0 || enemyHp <= 0
                    ? "Finish Duel"
                    : "Next Attack"}
                </button>
              </section>
            )}
          </>
        )}

        {battleState === "result" && (
          <section className="rounded-[2rem] border border-white bg-white p-6 text-center shadow-[0_3px_12px_rgba(0,0,0,0.14)]">
            <Trophy className="mx-auto text-emerald-500" size={48} />

            <p className="mt-4 text-xs font-black uppercase tracking-[0.35em] text-emerald-500">
              Duel Complete
            </p>

            <h1 className="mt-3 text-5xl font-black text-neutral-900">
              {score === 3 ? "Perfect Victory" : playerHp >= enemyHp ? "Victory" : "Defeat"}
            </h1>

            <p className="mt-4 text-xl font-black text-neutral-900">
              {score}/3 Counters
            </p>

            <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-emerald-700">
              <p className="text-xs font-black uppercase tracking-widest">
                Reward
              </p>
              <p className="mt-1 text-2xl font-black">
                +{score === 3 ? 100 : score * 25} Insight
              </p>
            </div>

            <button
              onClick={restart}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-100 py-4 text-sm font-black uppercase tracking-widest text-neutral-500"
            >
              <RotateCcw size={16} />
              Duel Again
            </button>
          </section>
        )}

        {guideOpen && (
          <PhilosophyDuelGuide
            step={guideStep}
            setStep={setGuideStep}
            onClose={() => setGuideOpen(false)}
          />
        )}
      </section>
    </main>
  );
}

function PhilosopherSelectCard({
  id,
  onSelect,
}: {
  id: PhilosopherId;
  onSelect: () => void;
}) {
  const philosopher = philosophers[id];

  return (
    <button
      onClick={onSelect}
      className="overflow-hidden rounded-[2rem] border border-white bg-white text-left shadow-[0_3px_12px_rgba(0,0,0,0.14)] transition hover:-translate-y-1 hover:shadow-[0_6px_18px_rgba(0,0,0,0.16)]"
    >
      <div className={`h-2 bg-gradient-to-r ${philosopher.theme}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-neutral-900">
              {philosopher.name}
            </h2>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-neutral-400">
              {philosopher.title}
            </p>
          </div>

          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${philosopher.theme} text-3xl shadow-xl`}
          >
            {philosopher.icon}
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <StatBar label="Logic" value={philosopher.stats.logic} />
          <StatBar label="Influence" value={philosopher.stats.influence} />
          <StatBar label="Creativity" value={philosopher.stats.creativity} />
          <StatBar label="Rebellion" value={philosopher.stats.rebellion} />
        </div>

        <div className="mt-5 rounded-2xl bg-neutral-50 p-4">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-500">
            Moves
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {philosopher.moves.map((move) => (
              <span
                key={move}
                className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-neutral-500 shadow-[0_2px_6px_rgba(0,0,0,0.08)]"
              >
                {move}
              </span>
            ))}
          </div>
        </div>

        <div
          className="mt-5 rounded-full py-3 text-center text-sm font-black uppercase tracking-widest text-white"
          style={{ background: GREEN_GRADIENT }}
        >
          Select Fighter
        </div>
      </div>
    </button>
  );
}

function FighterCard({
  id,
  hp,
  maxHp,
  side,
  active,
}: {
  id: PhilosopherId;
  hp: number;
  maxHp: number;
  side: string;
  active: boolean;
}) {
  const philosopher = philosophers[id];

  return (
    <div
      className={`rounded-[1.5rem] border border-neutral-100 bg-neutral-50 p-3 text-center transition-all ${
        active ? "scale-110 shadow-[0_3px_18px_rgba(16,185,129,0.35)]" : ""
      }`}
    >
      <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">
        {side}
      </p>

      <div
        className={`mx-auto mt-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${philosopher.theme} text-3xl font-black shadow-xl`}
      >
        {philosopher.icon}
      </div>

      <p className="mt-2 text-sm font-black text-neutral-900">
        {philosopher.name}
      </p>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full rounded-full bg-emerald-400 transition-all duration-500"
          style={{ width: `${(hp / maxHp) * 100}%` }}
        />
      </div>

      <p className="mt-1 text-[10px] font-bold text-neutral-400">
        {hp}/{maxHp} HP
      </p>
    </div>
  );
}

function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs font-bold uppercase tracking-widest text-neutral-400">
        <span>{label}</span>
        <span>{value}/10</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full"
          style={{
            width: `${value * 10}%`,
            background: GREEN_GRADIENT,
          }}
        />
      </div>
    </div>
  );
}