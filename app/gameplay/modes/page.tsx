import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

const MODES = [
  {
    title: "Novice",
    tag: "Beginner",
    desc: "A relaxed mode for grasping the basics, learning card flow, and exploring moves without pressure.",
    cta: "Start Battle",
  },
  {
    title: "Scholar",
    tag: "Intermediate",
    desc: "A focused mode for sharpening your tactics and practice more intentional decision-making.",
    cta: "Start Battle",
  },
  {
    title: "Master",
    tag: "Advanced",
    desc: "A demanding mode for proving your strategy through tougher battles and less room for mistakes.",
    cta: "Start Battle",
  },
];

export default function ModesPage() {
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
          Battle Ground
        </h1>
      </header>

      <div className="flex flex-col items-center px-6 py-5">
        <p className="mb-5 font-mono text-xs leading-relaxed text-neutral-400">
          Pick a level and start your battle!
        </p>

        <div className="flex w-full flex-col gap-4">
          {MODES.map((mode) => (
            <div
              key={mode.title}
              className="flex flex-col gap-3 rounded-[22px] border border-white bg-white p-5 shadow-[0_3px_12px_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(0,0,0,0.16)]"
            >
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-neutral-900">
                  {mode.title}
                </h3>

                <span className="ml-auto rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 font-mono text-[10px] text-blue-500">
                  {mode.tag}
                </span>
              </div>

              <p className="font-mono text-xs leading-relaxed text-neutral-400">
                {mode.desc}
              </p>

              <button className="flex items-center gap-1.5 self-start rounded-xl bg-[linear-gradient(135deg,#06B6D4_0%,#3B82F6_50%,#2563EB_100%)] px-4 py-2 text-sm font-semibold text-white shadow-[0_3px_10px_rgba(0,0,0,0.14)] opacity-80 transition-opacity hover:opacity-100">
                {mode.cta}
                <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
