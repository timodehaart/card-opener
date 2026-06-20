import Link from "next/link";
import {
  ArrowLeft,
  Swords,
  Home,
  Layers,
  Gamepad2,
  User,
  LucidePuzzle,
  ScrollText,
  HistoryIcon,
  Dumbbell,
} from "lucide-react";

const TILES = [
  {
    num: "01",
    title: "The Laws of Dezcartes",
    desc: "Your training guide before entering the arena.",
    Icon: ScrollText,
    href: "/gameplay/rules",
  },
  {
    num: "02",
    title: "Training Ground",
    desc: "Train with hints before entering real battles.",
    Icon: Dumbbell,
    href: "/gameplay/tutorial",
  },
  {
    num: "03",
    title: "Battle Ground",
    desc: "Choose your path: Novice, Scholar, or Master.",
    Icon: Swords,
    href: "/gameplay/modes",
  },
  {
    num: "04",
    title: "Match History",
    desc: "Look back on your battles and refine your next strategy.",
    Icon: HistoryIcon,
    href: "/gameplay/history",
  },
];

const NAV = [
  { label: "Home", Icon: Home, href: "/" },
  { label: "Collection", Icon: Layers, href: "#" },
  { label: "Puzzles", Icon: LucidePuzzle, href: "#" },
  { label: "Play", Icon: Gamepad2, href: "/gameplay", active: true },
  { label: "You", Icon: User, href: "#" },
];

export default function GameplayHub() {
  return (
    <main className="flex min-h-screen flex-col bg-[#F7F7F7] text-neutral-900 pb-20">
      <header className="relative flex items-center gap-3 bg-white px-6 py-5 shadow-[0_3px_14px_rgba(0,0,0,0.10)]">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-500 shadow-[0_3px_14px_rgba(0,0,0,0.14)] transition-colors hover:text-neutral-900"
        >
          <ArrowLeft size={18} />
        </Link>

        <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold text-neutral-900">
          The Battle Ground
        </h1>
      </header>

      <div className="flex-1 px-6 py-6">
        <section className="mb-7 overflow-hidden rounded-[22px] bg-white shadow-[0_3px_12px_rgba(0,0,0,0.16)]">
          <div className="relative h-[135px] overflow-hidden rounded-[22px]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#06B6D4_0%,#3B82F6_50%,#2563EB_100%)] opacity-50" />

            <div className="relative z-10 flex h-full flex-col justify-center px-5">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/85 w-[90%]">
                Learn the game and put your skills to the test.
              </p>
              <h2 className="mt-2 max-w-[250px] text-[22px] font-semibold leading-tight text-white">
                Welcome to the Battle Ground. Let's Play!
              </h2>
            </div>
          </div>
        </section>

        <div>
          {TILES.map(({ num, title, desc, Icon, href }) => (
            <Link
              key={href}
              href={href}
              className="group my-5 flex flex-col gap-4 rounded-[22px] border border-white bg-white p-4 shadow-[0_3px_12px_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(0,0,0,0.16)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#06B6D4_0%,#3B82F6_50%,#2563EB_100%)] text-white shadow-[0_3px_10px_rgba(0,0,0,0.14)] opacity-80">
                  <Icon size={18} />
                </div>

                <span className="rounded-full bg-neutral-100 px-3 py-1 font-mono text-[10px] font-bold text-neutral-400">
                  {num}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-base font-semibold leading-tight text-neutral-900">
                  {title}
                </h3>
                <p className="font-mono text-[11px] leading-snug text-neutral-400">
                  {desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
