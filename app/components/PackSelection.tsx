"use client";

import { useState } from "react";
import { Atom, Brain, Palette } from "lucide-react";

type PackType = "science" | "philosophy" | "art";

interface Pack {
  id: PackType;
  name: string;
  type: string;
  icon: React.ReactNode;
  iconBg: string;
  iconBorder: string;
  iconText: string;
  hoverBorder: string;
}

const packs: Pack[] = [
  {
    id: "science",
    name: "Scientific Revolution",
    type: "Science",
    icon: <Atom size={32} />,
    iconBg: "bg-blue-50",
    iconBorder: "border-blue-300",
    iconText: "text-blue-700",
    hoverBorder: "hover:border-blue-400",
  },
  {
    id: "philosophy",
    name: "Age of Reason",
    type: "Philosophy",
    icon: <Brain size={32} />,
    iconBg: "bg-violet-50",
    iconBorder: "border-violet-300",
    iconText: "text-violet-700",
    hoverBorder: "hover:border-violet-400",
  },
  {
    id: "art",
    name: "Modern Art",
    type: "Art",
    icon: <Palette size={32} />,
    iconBg: "bg-orange-50",
    iconBorder: "border-orange-300",
    iconText: "text-orange-700",
    hoverBorder: "hover:border-orange-400",
  },
];

export default function PackSelection() {
  const [tapped, setTapped] = useState<PackType | null>(null);

  function handleOpen(pack: Pack) {
    setTapped(pack.id);
    setTimeout(() => setTapped(null), 180);
    // TODO: add your navigation or pack-open logic here
    console.log("Opening pack:", pack.name);
  }

  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center gap-12 bg-white px-6 py-16">

      {/* Header */}
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          Choose your booster
        </p>
        <p className="font-serif text-[1.6rem] font-light italic text-slate-700">
          Select one pack to open
        </p>
      </div>

      {/* Pack row */}
      <div className="flex w-full items-center justify-center gap-3 sm:gap-5">
        {packs.map((pack) => {
          const isTapped = tapped === pack.id;
          return (
            <button
              key={pack.id}
              onClick={() => handleOpen(pack)}
              className={[
                "relative flex flex-col items-center justify-center gap-4 rounded-2xl bg-white",
                "w-[29vw] max-w-[130px]",
                "aspect-[63/88]",
                "border border-slate-200",
                "shadow-[0_0_0_1.5px_rgba(15,15,15,0.06),0_2px_14px_rgba(15,15,15,0.07)]",
                "transition-all duration-150 ease-out",
                "hover:border-2 hover:shadow-[0_0_0_2px_rgba(15,15,15,0.09),0_4px_20px_rgba(15,15,15,0.10)]",
                pack.hoverBorder,
                isTapped ? "scale-95" : "active:scale-95",
              ].join(" ")}
            >
              {/* Icon circle */}
              <div
                className={[
                  "flex h-14 w-14 items-center justify-center rounded-full border-[1.5px] sm:h-16 sm:w-16",
                  pack.iconBg,
                  pack.iconBorder,
                  pack.iconText,
                ].join(" ")}
              >
                {pack.icon}
              </div>

              {/* Pack name */}
              <span className="px-3 text-center text-[9px] font-semibold uppercase leading-snug tracking-wide text-slate-800 sm:text-[10px]">
                {pack.name}
              </span>

              {/* Pack type */}
              <span className="font-serif text-[11px] font-light italic text-slate-400">
                {pack.type}
              </span>
            </button>
          );
        })}
      </div>

    </main>
  );
}