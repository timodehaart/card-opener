"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Brain,
  Brush,
  FlaskConical,
  Lightbulb,
  Lock,
  Puzzle,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import ChallengeCard from "./ChallengeCard";
import PhilosophyDuelGame from "./PhilosophyDuelGame";
import { cards, dailyChallenge } from "./challenge-data";

const GREEN_GRADIENT =
  "linear-gradient(135deg,#10B981 0%,#22C55E 50%,#84CC16 100%)";

const KEYFRAMES = `
@keyframes pulse-ring {
  0% { transform: scale(1); opacity: .8; }
  100% { transform: scale(1.7); opacity: 0; }
}
@keyframes slot-land {
  0% { transform: scale(.7) translateY(-20px); opacity: 0; }
  70% { transform: scale(1.08) translateY(2px); opacity: 1; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}
@keyframes wrong-shake {
  0%,100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}
@keyframes reward-pop {
  0% { opacity: 0; transform: translateY(20px) scale(.8); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes lock-glow {
  0%, 100% { box-shadow: 0 0 0 rgba(16,185,129,0); }
  50% { box-shadow: 0 0 36px rgba(16,185,129,.35); }
}
@keyframes guide-in {
  0% { opacity: 0; transform: translateY(28px) scale(.96); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
`;

type Result = "perfect" | "shape" | "conflict" | "wrong" | "";
type Screen = "hub" | "shape-lock" | "philosophy-duel";

const GUIDE_STEPS = [
  {
    title: "Welcome to Shape Locks",
    text: "In this challenge you unlock hidden connections between thinkers by combining cards.",
    icon: "🧩",
  },
  {
    title: "Use the card shapes",
    text: "Each card has a connector shape. Triangle cards link to reason, square cards to systems, waves to creativity and fractures to conflict.",
    icon: "△",
  },
  {
    title: "Place two cards",
    text: "On desktop you can drag cards into the slots. On mobile you tap a card first and then tap an empty slot.",
    icon: "🎴",
  },
  {
    title: "Solve the Thought Lock",
    text: "Use the mystery clue to find the strongest pair. You only have 3 attempts, so choose carefully.",
    icon: "🔒",
  },
];

export default function ChallengesPage() {
  const [screen, setScreen] = useState<Screen>("hub");

  const [guideOpen, setGuideOpen] = useState(false);
  const [guideStep, setGuideStep] = useState(0);

  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const [slots, setSlots] = useState<(string | null)[]>([null, null]);
  const [attemptsLeft, setAttemptsLeft] = useState(dailyChallenge.maxAttempts);
  const [hintUnlocked, setHintUnlocked] = useState(false);
  const [result, setResult] = useState<Result>("");
  const [claimed, setClaimed] = useState(false);

  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const reward =
    dailyChallenge.baseReward -
    (dailyChallenge.maxAttempts - attemptsLeft) * 20 -
    (hintUnlocked ? dailyChallenge.hintCost : 0);

  function startShapeLock() {
    setScreen("shape-lock");
    setGuideStep(0);
    setGuideOpen(true);
  }

  function handleDrop(slotIndex: number, mobileCardId?: string) {
    const cardToPlace = mobileCardId ?? draggedCardId;

    if (!cardToPlace || result === "perfect") return;
    if (slots.includes(cardToPlace)) return;

    const next = [...slots];
    next[slotIndex] = cardToPlace;

    setSlots(next);
    setResult("");
    setClaimed(false);
    setSelectedCardId(null);
  }

  function removeFromSlot(slotIndex: number) {
    if (result === "perfect") return;

    const next = [...slots];
    next[slotIndex] = null;

    setSlots(next);
    setResult("");
  }

  function solvePuzzle() {
    if (!slots[0] || !slots[1] || attemptsLeft <= 0) return;

    const first = cards.find((card) => card.id === slots[0]);
    const second = cards.find((card) => card.id === slots[1]);

    if (!first || !second) return;

    const perfect = dailyChallenge.correctPair.every((id) =>
      slots.includes(id)
    );

    if (perfect) {
      setResult("perfect");

      if (!isPracticeMode) {
        setDailyCompleted(true);
      }

      return;
    }

    setAttemptsLeft((prev) => Math.max(0, prev - 1));

    if (first.connector === second.connector) setResult("shape");
    else if (first.connector === "fracture" || second.connector === "fracture")
      setResult("conflict");
    else setResult("wrong");
  }

  function useHint() {
    setHintUnlocked(true);
  }

  function resetPuzzle(practice = false) {
    setSlots([null, null]);
    setAttemptsLeft(dailyChallenge.maxAttempts);
    setHintUnlocked(false);
    setResult("");
    setClaimed(false);
    setSelectedCardId(null);

    if (practice) {
      setIsPracticeMode(true);
    }
  }

  if (screen === "philosophy-duel") {
    return <PhilosophyDuelGame onBack={() => setScreen("hub")} />;
  }

  return (
    <main className="min-h-screen bg-[#F7F7F7] text-neutral-900">
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      <header className="relative flex items-center gap-3 bg-white px-6 py-5 shadow-[0_3px_14px_rgba(0,0,0,0.10)]">
        {screen === "hub" ? (
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-500 shadow-[0_3px_14px_rgba(0,0,0,0.14)] transition-colors hover:text-neutral-900"
          >
            <ArrowLeft size={18} />
          </Link>
        ) : (
          <button
            onClick={() => setScreen("hub")}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-500 shadow-[0_3px_14px_rgba(0,0,0,0.14)] transition-colors hover:text-neutral-900"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold text-neutral-900">
          {screen === "hub" ? "Challenge Hall" : "Shape Trial"}
        </h1>
      </header>

      <section className="relative mx-auto min-h-screen max-w-[430px] overflow-hidden px-5 py-5">
        <div className="absolute left-[-90px] top-[-80px] h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute right-[-120px] top-[260px] h-72 w-72 rounded-full bg-lime-300/20 blur-3xl" />
        <div className="absolute bottom-[-100px] left-10 h-64 w-64 rounded-full bg-green-300/20 blur-3xl" />

        {screen === "hub" ? (
          <ChallengeHub
            onStartShapeLock={startShapeLock}
            onStartPhilosophyDuel={() => setScreen("philosophy-duel")}
          />
        ) : (
          <>
            <section className="relative mb-5 overflow-hidden rounded-[2rem] border border-white bg-white p-5 shadow-[0_3px_12px_rgba(0,0,0,0.14)]">
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
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-2xl bg-white px-4 py-3 shadow-[0_3px_10px_rgba(0,0,0,0.12)]">
                    <p className="text-[10px] uppercase tracking-widest text-neutral-400">
                      Streak
                    </p>
                    <p className="text-xl font-black text-neutral-900">
                      🔥 {dailyChallenge.streak}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white px-4 py-3 text-right shadow-[0_3px_10px_rgba(0,0,0,0.12)]">
                    <p className="text-[10px] uppercase tracking-widest text-neutral-400">
                      Insight
                    </p>
                    <p className="text-xl font-black text-neutral-900">
                      ✦ {dailyChallenge.points}
                    </p>
                  </div>
                </div>

                <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-emerald-500">
                  {isPracticeMode ? "Practice Thought Lock" : "Daily Thought Lock"}
                </p>

                <h1 className="text-4xl font-black leading-none text-neutral-900">
                  {dailyChallenge.mission}
                </h1>

                <div className="mt-5 rounded-2xl bg-white p-4 shadow-[0_3px_10px_rgba(0,0,0,0.10)]">
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-500">
                    Mystery clue
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                    {dailyChallenge.mystery}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Stat label="Attempts" value={`${attemptsLeft}/3`} />
                  <Stat label="Goal" value="△ Lock" />
                  <Stat
                    label={isPracticeMode ? "Mode" : "Reward"}
                    value={isPracticeMode ? "Practice" : `+${Math.max(reward, 10)}`}
                  />
                </div>

                {dailyCompleted && !isPracticeMode && (
                  <div className="mt-4 rounded-2xl bg-emerald-50 p-3 text-center text-xs font-bold text-emerald-600">
                    Daily challenge completed. Practice mode is available after claiming.
                  </div>
                )}
              </div>
            </section>

            <section
              className="relative mb-5 rounded-[2rem] border border-white bg-white p-5 shadow-[0_3px_12px_rgba(0,0,0,0.14)]"
              style={{
                animation:
                  result === "wrong"
                    ? "wrong-shake .45s ease-in-out"
                    : result === "perfect"
                    ? "lock-glow 1.2s ease-in-out infinite"
                    : undefined,
              }}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-500">
                    Puzzle Board
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    {isMobile
                      ? "Tap a card then tap an empty slot"
                      : "Drag two cards and solve the shape lock"}
                  </p>
                </div>

                <button
                  onClick={() => resetPuzzle(isPracticeMode)}
                  className="rounded-full bg-neutral-100 px-3 py-2 text-xs font-bold text-neutral-500"
                >
                  Reset
                </button>
              </div>

              <div className="flex items-center justify-center">
                <PuzzleSlot
                  slotIndex={0}
                  cardId={slots[0]}
                  result={result}
                  onDrop={() => handleDrop(0)}
                  onTapPlace={() => {
                    if (selectedCardId) handleDrop(0, selectedCardId);
                  }}
                  onRemove={() => removeFromSlot(0)}
                />

                <button
                  onClick={solvePuzzle}
                  disabled={!slots[0] || !slots[1] || attemptsLeft <= 0}
                  className={`relative z-20 mx-[-8px] flex h-16 w-16 items-center justify-center rounded-full border-4 border-white text-2xl font-black shadow-[0_3px_14px_rgba(0,0,0,0.18)] transition-all ${
                    slots[0] && slots[1] && attemptsLeft > 0
                      ? "scale-110 text-white"
                      : "bg-neutral-100 text-neutral-300"
                  }`}
                  style={{
                    background:
                      slots[0] && slots[1] && attemptsLeft > 0
                        ? GREEN_GRADIENT
                        : undefined,
                  }}
                >
                  {slots[0] && slots[1] && attemptsLeft > 0 && (
                    <span
                      className="absolute inset-0 rounded-full border-2 border-emerald-400"
                      style={{ animation: "pulse-ring 1.1s ease-out infinite" }}
                    />
                  )}
                  🧩
                </button>

                <PuzzleSlot
                  slotIndex={1}
                  cardId={slots[1]}
                  result={result}
                  onDrop={() => handleDrop(1)}
                  onTapPlace={() => {
                    if (selectedCardId) handleDrop(1, selectedCardId);
                  }}
                  onRemove={() => removeFromSlot(1)}
                />
              </div>

              {isMobile && selectedCardId && (
                <p className="mt-3 text-center text-xs font-bold text-emerald-500">
                  Card selected. Tap an empty slot to place it.
                </p>
              )}

              <button
                onClick={useHint}
                disabled={hintUnlocked}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-100 py-3 text-sm font-bold text-neutral-500 disabled:opacity-40"
              >
                <Lightbulb size={16} />
                {hintUnlocked
                  ? "Hint unlocked"
                  : `Use hint -${dailyChallenge.hintCost} pts`}
              </button>

              {hintUnlocked && (
                <div className="mt-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
                  Hint: look for two cards with a <b>triangle edge</b> and a shared
                  focus on reason and knowledge.
                </div>
              )}

              {result && (
                <ResultPanel
                  result={result}
                  reward={Math.max(reward, 10)}
                  claimed={claimed}
                  setClaimed={setClaimed}
                  dailyCompleted={dailyCompleted}
                  isPracticeMode={isPracticeMode}
                  onPractice={() => resetPuzzle(true)}
                />
              )}
            </section>

            <section className="relative mb-6 rounded-[2rem] border border-white bg-white p-4 shadow-[0_3px_12px_rgba(0,0,0,0.14)]">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-500">
                  Weekly Chest
                </p>
                <p className="text-xs font-bold text-emerald-500">
                  {dailyChallenge.weeklyProgress}/{dailyChallenge.weeklyGoal}
                </p>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${
                      (dailyChallenge.weeklyProgress / dailyChallenge.weeklyGoal) *
                      100
                    }%`,
                    background: GREEN_GRADIENT,
                  }}
                />
              </div>
            </section>

            <section className="relative">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">
                Card Library
              </p>

              <div className="flex gap-4 overflow-x-auto pb-6">
                {cards.map((card) => (
                  <ChallengeCard
                    key={card.id}
                    card={card}
                    isUsed={slots.includes(card.id)}
                    hintUnlocked={hintUnlocked}
                    isMobile={isMobile}
                    isSelected={selectedCardId === card.id}
                    onSelect={() => setSelectedCardId(card.id)}
                    onDragStart={() => setDraggedCardId(card.id)}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {guideOpen && (
          <GuidePopup
            step={guideStep}
            setStep={setGuideStep}
            onClose={() => setGuideOpen(false)}
          />
        )}
      </section>
    </main>
  );
}

function ChallengeHub({
  onStartShapeLock,
  onStartPhilosophyDuel,
}: {
  onStartShapeLock: () => void;
  onStartPhilosophyDuel: () => void;
}) {
  return (
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
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-emerald-500">
            Dezcartes Challenges
          </p>

          <h1 className="text-4xl font-black leading-none text-neutral-900">
            Choose your daily trial
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-neutral-500">
            Solve puzzles, unlock insight points and discover hidden connections
            between art, science and philosophy.
          </p>

          <div className="mt-5 rounded-2xl bg-white p-4 shadow-[0_3px_10px_rgba(0,0,0,0.10)]">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-500">
              Today&apos;s bonus
            </p>
            <p className="mt-1 text-2xl font-black text-neutral-900">
              +100 Insight available
            </p>
          </div>
        </div>
      </section>

      <section className="relative mb-5 grid gap-3">
        <GameModeCard
          icon={<Puzzle size={22} />}
          title="Shape Locks"
          description="Daily puzzle: connect cards by matching shapes and hidden meanings."
          reward="+100 Insight"
          status="Playable now"
          active
          onClick={onStartShapeLock}
        />

        <GameModeCard
          icon={<Brain size={22} />}
          title="Philosophy Duel"
          description="Enter a battle arena and win 3 rounds of quotes, beliefs and mind stats."
          reward="+100 Insight"
          status="Playable now"
          active
          onClick={onStartPhilosophyDuel}
        />

        <GameModeCard
          icon={<Brush size={22} />}
          title="Art Connections"
          description="Match artists, symbols and emotions through visual clues."
          reward="+50 Insight"
          status="Coming soon"
        />

        <GameModeCard
          icon={<FlaskConical size={22} />}
          title="Science Mystery"
          description="Solve discovery-based puzzles about science and invention."
          reward="+50 Insight"
          status="Coming soon"
        />
      </section>

      <section className="relative rounded-[2rem] border border-white bg-white p-5 shadow-[0_3px_12px_rgba(0,0,0,0.14)]">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-500">
              Weekly Chest
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              Complete 5 challenges to unlock a reward.
            </p>
          </div>

          <Trophy className="text-emerald-500" size={24} />
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full w-[60%] rounded-full"
            style={{ background: GREEN_GRADIENT }}
          />
        </div>

        <p className="mt-3 text-xs font-bold text-emerald-500">
          3/5 challenges completed
        </p>
      </section>
    </>
  );
}

function GuidePopup({
  step,
  setStep,
  onClose,
}: {
  step: number;
  setStep: (step: number) => void;
  onClose: () => void;
}) {
  const current = GUIDE_STEPS[step];
  const isLast = step === GUIDE_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-5 pb-6 backdrop-blur-sm">
      <section
        className="w-full max-w-[390px] rounded-[2rem] border border-white bg-white p-6 shadow-[0_3px_18px_rgba(0,0,0,0.22)]"
        style={{ animation: "guide-in .3s ease-out forwards" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">
            Mission Guide
          </p>

          <button onClick={onClose} className="text-neutral-400">
            <X size={20} />
          </button>
        </div>

        <div
          className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl text-4xl text-white"
          style={{ background: GREEN_GRADIENT }}
        >
          {current.icon}
        </div>

        <h2 className="text-3xl font-black leading-none text-neutral-900">
          {current.title}
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-neutral-500">
          {current.text}
        </p>

        <div className="mt-6 flex gap-2">
          {GUIDE_STEPS.map((_, index) => (
            <div
              key={index}
              className="h-2 flex-1 rounded-full"
              style={{
                background: index <= step ? GREEN_GRADIENT : "#f5f5f5",
              }}
            />
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setStep(0)}
            className="flex-1 rounded-full border border-neutral-200 bg-white py-3 text-sm font-black text-neutral-500"
          >
            Again
          </button>

          <button
            onClick={() => {
              if (isLast) onClose();
              else setStep(step + 1);
            }}
            className="flex-1 rounded-full py-3 text-sm font-black uppercase tracking-widest text-white"
            style={{ background: GREEN_GRADIENT }}
          >
            {isLast ? "Done" : "Next"}
          </button>
        </div>
      </section>
    </div>
  );
}

function GameModeCard({
  icon,
  title,
  description,
  reward,
  status,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  reward: string;
  status: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={active ? onClick : undefined}
      className={`group rounded-[1.5rem] border border-white bg-white p-4 text-left shadow-[0_3px_12px_rgba(0,0,0,0.14)] transition-all ${
        active
          ? "hover:-translate-y-1 hover:shadow-[0_6px_18px_rgba(0,0,0,0.16)]"
          : "opacity-70"
      }`}
    >
      <div className="flex gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white"
          style={{ background: active ? GREEN_GRADIENT : "#e5e7eb" }}
        >
          {icon}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-black text-neutral-900">{title}</h2>
            <span
              className={`rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-widest ${
                active
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-neutral-100 text-neutral-400"
              }`}
            >
              {status}
            </span>
          </div>

          <p className="mt-1 text-sm leading-relaxed text-neutral-500">
            {description}
          </p>

          <p className="mt-3 text-xs font-black uppercase tracking-widest text-emerald-500">
            {reward}
          </p>
        </div>
      </div>
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 text-center shadow-[0_3px_10px_rgba(0,0,0,0.10)]">
      <p className="text-[9px] uppercase tracking-widest text-neutral-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-emerald-500">{value}</p>
    </div>
  );
}

function PuzzleSlot({
  slotIndex,
  cardId,
  result,
  onDrop,
  onRemove,
  onTapPlace,
}: {
  slotIndex: number;
  cardId: string | null;
  result: Result;
  onDrop: () => void;
  onRemove: () => void;
  onTapPlace: () => void;
}) {
  const card = cards.find((item) => item.id === cardId);

  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
      onClick={card ? onRemove : onTapPlace}
      className={`flex h-[155px] w-[108px] items-center justify-center border-2 text-center text-xs transition-all duration-700 ${
        result === "perfect"
          ? "border-emerald-400 shadow-[0_3px_14px_rgba(16,185,129,0.30)]"
          : "border-dashed border-neutral-200"
      } bg-neutral-50 text-neutral-300`}
      style={{
        clipPath:
          slotIndex === 0
            ? "polygon(12% 0%,100% 0%,100% 35%,84% 50%,100% 65%,100% 100%,12% 100%,0% 88%,0% 12%)"
            : "polygon(0% 0%,88% 0%,100% 12%,100% 88%,88% 100%,0% 100%,0% 65%,16% 50%,0% 35%)",
      }}
    >
      {!card && <span>Drop / Tap</span>}

      {card && (
        <div
          className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${card.gradient} p-[2px]`}
          style={{ animation: "slot-land .45s ease-out forwards" }}
        >
          <div className="flex h-full w-full flex-col items-center justify-center bg-white/95 px-2 text-neutral-900">
            <span className="text-2xl">{card.symbol}</span>
            <span className="mt-2 font-black uppercase">{card.name}</span>
            <span className="mt-1 text-[9px] uppercase tracking-widest text-neutral-400">
              {card.connector}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultPanel({
  result,
  reward,
  claimed,
  setClaimed,
  dailyCompleted,
  isPracticeMode,
  onPractice,
}: {
  result: Exclude<Result, "">;
  reward: number;
  claimed: boolean;
  setClaimed: (value: boolean) => void;
  dailyCompleted: boolean;
  isPracticeMode: boolean;
  onPractice: () => void;
}) {
  const content = {
    perfect: {
      title: "Perfect Thought Lock",
      text: "Kant and Descartes create the Triangle Reason Lock. Their shapes and ideas both connect through reason knowledge and truth.",
      style: "bg-emerald-50 text-emerald-700",
      reward: isPracticeMode
        ? "Practice completed"
        : `+${reward} Insight +1 Puzzle Fragment`,
      icon: <Sparkles size={18} />,
    },
    shape: {
      title: "Shape Match",
      text: "The shapes connect but the mystery clue is not fully solved yet. You found a visual relation but not the strongest concept.",
      style: "bg-emerald-50 text-emerald-700",
      reward: "+20 Insight",
      icon: <Lock size={18} />,
    },
    conflict: {
      title: "Fractured Link",
      text: "This pair creates tension. The connection is meaningful but unstable.",
      style: "bg-orange-50 text-orange-700",
      reward: "+10 Insight",
      icon: <Lock size={18} />,
    },
    wrong: {
      title: "No Lock",
      text: "These cards do not share a strong shape or concept connection yet.",
      style: "bg-red-50 text-red-700",
      reward: "No reward yet",
      icon: <Lock size={18} />,
    },
  }[result];

  return (
    <div
      className={`mt-4 rounded-2xl p-4 text-sm font-semibold leading-relaxed ${content.style}`}
      style={{ animation: "reward-pop .45s ease-out forwards" }}
    >
      <div className="flex items-center gap-2">
        {content.icon}
        <p className="text-lg font-black">{content.title}</p>
      </div>

      <p className="mt-2">{content.text}</p>

      <div className="mt-4 rounded-xl bg-white/70 p-3 text-center">
        <p className="text-xs font-black uppercase tracking-widest">Reward</p>
        <p className="mt-1 text-xl font-black">
          {claimed ? "Claimed ✓" : content.reward}
        </p>
      </div>

      {result !== "wrong" && !isPracticeMode && (
        <button
          onClick={() => setClaimed(true)}
          className="mt-4 w-full rounded-full py-3 text-sm font-black uppercase tracking-widest text-white"
          style={{ background: GREEN_GRADIENT }}
        >
          {claimed ? "Reward Claimed" : "Claim Reward"}
        </button>
      )}

      {result === "perfect" && (
        <div className="mt-4 rounded-2xl bg-white/70 p-4 text-center">
          <p className="text-xs font-black uppercase tracking-widest">
            {isPracticeMode ? "Practice Mode" : "Daily Challenge Complete"}
          </p>

          <p className="mt-2 text-sm font-semibold">
            {isPracticeMode
              ? "You can keep training this lock without affecting your daily reward."
              : dailyCompleted
              ? "Your daily reward is secured. A new daily lock unlocks tomorrow."
              : "Complete this daily lock to secure your reward."}
          </p>

          <button
            onClick={onPractice}
            className="mt-4 w-full rounded-full bg-white py-3 text-sm font-black uppercase tracking-widest text-neutral-500"
          >
            Practice Again
          </button>
        </div>
      )}
    </div>
  );
}