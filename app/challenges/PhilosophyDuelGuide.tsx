import { X } from "lucide-react";

const GREEN_GRADIENT =
  "linear-gradient(135deg,#10B981 0%,#22C55E 50%,#84CC16 100%)";

const GUIDE_STEPS = [
  {
    icon: "⚔️",
    title: "Welcome to Philosophy Duel",
    text: "This is a battle of ideas. Read the enemy attack and choose the best counter move.",
  },
  {
    icon: "🧠",
    title: "Think before you strike",
    text: "Each round tests a different idea: morality, doubt, balance or truth.",
  },
  {
    icon: "⚡",
    title: "Win three rounds",
    text: "Correct counters damage the enemy. A perfect duel gives the highest Insight reward.",
  },
];

export default function PhilosophyDuelGuide({
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
      <section className="w-full max-w-[390px] rounded-[2rem] border border-white bg-white p-6 shadow-[0_3px_18px_rgba(0,0,0,0.22)]">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">
            Duel Guide
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
            {isLast ? "Start" : "Next"}
          </button>
        </div>
      </section>
    </div>
  );
}