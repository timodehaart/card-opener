"use client";

import { useEffect, useState } from "react";
import {
  Atom,
  Brain,
  ChevronLeft,
  ChevronRight,
  Clock,
  Package,
  Palette,
} from "lucide-react";

type PackType = "science" | "philosophy" | "art";

interface Pack {
  id: PackType;
  name: string;
  subtitle: string;
  type: string;
  packImage: string;
  gradientA: string;
  gradientB: string;
  accentColor: string;
  glowColor: string;
  Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
}

const packs: Pack[] = [
  {
    id: "science",
    name: "Scientific Revolution",
    subtitle: "Science Booster Pack",
    type: "SCIENCE",
    packImage: "/science_pack.png",
    gradientA: "#2563eb",
    gradientB: "#3b82f6",
    accentColor: "#4f8cff",
    glowColor: "rgba(59,130,246,.55)",
    Icon: Atom,
  },
  {
    id: "philosophy",
    name: "Age of Reason",
    subtitle: "Philosophy Booster Pack",
    type: "PHILOSOPHY",
    packImage: "/philosophy_pack.png",
    gradientA: "#7c3aed",
    gradientB: "#a855f7",
    accentColor: "#9b5cff",
    glowColor: "rgba(124,58,237,.58)",
    Icon: Brain,
  },
  {
    id: "art",
    name: "Modern Art",
    subtitle: "Art Booster Pack",
    type: "ART",
    packImage: "/art_pack.png",
    gradientA: "#ea580c",
    gradientB: "#fb923c",
    accentColor: "#ff8a3d",
    glowColor: "rgba(251,146,60,.5)",
    Icon: Palette,
  },
];

const REGEN_SECONDS = 12 * 60 * 60;
const MAX_PACKS = 2;

function formatTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h} hr ${String(m).padStart(2, "0")} min`;
  return `${String(m).padStart(2, "0")} min`;
}

export default function PackSelection() {
  const [activePackIdx, setActivePackIdx] = useState(0);
  const [availablePacks, setAvailablePacks] = useState(1);
  const [secondsRemaining, setSecondsRemaining] = useState(Math.floor(REGEN_SECONDS * 0.5));

  const activePack = packs[activePackIdx];

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

  return (
    <main className="dz-screen">
      <style>{`
        * { box-sizing: border-box; }

        .dz-screen {
          position: relative;
          width: 100%;
          max-width: 430px;
          margin: 0 auto;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          height: calc(100dvh - var(--app-header-height, 73px));
          min-height: 0;
          padding: 14px 16px 12px;
          align-items: center;
          color: #f8fafc;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background:
            radial-gradient(circle at 50% 32%, rgba(25, 58, 125, .24), transparent 35%),
            radial-gradient(circle at 50% 72%, rgba(36, 67, 130, .16), transparent 38%),
            linear-gradient(180deg, #07111f 0%, #040b16 55%, #020815 100%);
        }

        .dz-screen::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(90deg, transparent, rgba(80, 130, 255, .045), transparent),
            radial-gradient(circle at 20% 10%, rgba(75, 120, 255, .08), transparent 22%);
        }

        .dz-kicker {
          position: relative;
          z-index: 1;
          margin: 0 0 16px;
          text-align: center;
          color: #99a8bd;
          font-size: 12px;
          font-weight: 600;
          line-height: 1;
          letter-spacing: .34em;
          text-transform: uppercase;
        }

        .dz-tabs {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          width: 100%;
          max-width: none;
          margin-bottom: 20px;
        }

        .dz-tab {
          position: relative;
          height: 84px;
          border: 1px solid rgba(117, 134, 165, .24);
          border-radius: 18px;
          background: rgba(8, 17, 32, .45);
          box-shadow: inset 0 0 18px rgba(255,255,255,.015);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: border-color .18s ease, box-shadow .18s ease, transform .18s ease;
        }

        .dz-tab.active {
          border-color: var(--accent);
          box-shadow: 0 0 24px color-mix(in srgb, var(--accent) 22%, transparent), inset 0 0 24px color-mix(in srgb, var(--accent) 7%, transparent);
        }

        .dz-tab.active::after,
        .dz-tab.active::before {
          display: none;
        }

        .dz-tab-label {
          color: #d8dfec;
          font-size: 12px;
          font-weight: 750;
          letter-spacing: .015em;
          white-space: nowrap;
        }

        .dz-pack-wrap {
          position: relative;
          z-index: 1;
          height: clamp(330px, 54dvh, 390px);
          flex: 0 1 auto;
          min-height: 300px;
          width: 100%;
          max-width: none;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(117, 134, 165, .22);
          border-radius: 34px;
          background:
            radial-gradient(circle at 50% 42%, var(--glow), transparent 44%),
            rgba(8, 17, 32, .34);
          box-shadow: inset 0 0 48px rgba(255,255,255,.018);
        }

        .dz-arrow {
          position: absolute;
          top: 50%;
          width: 52px;
          height: 52px;
          border-radius: 999px;
          border: 1px solid rgba(65, 116, 255, .35);
          background: rgba(9, 25, 51, .78);
          box-shadow: 0 0 20px rgba(38, 93, 225, .12);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transform: translateY(-50%);
        }

        .dz-arrow.left { left: 16px; }
        .dz-arrow.right { right: 16px; }

        .dz-pack-glow {
          position: absolute;
          width: min(66vw, 260px);
          height: min(66vw, 260px);
          border-radius: 999px;
          background: radial-gradient(circle, var(--glow), transparent 70%);
          filter: blur(4px);
          opacity: .75;
          animation: dz-pulse 4s ease-in-out infinite;
        }

        .dz-pack {
          position: relative;
          z-index: 2;
          height: min(47dvh, 340px);
          max-height: calc(100% - 24px);
          max-width: 76%;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 24px 42px rgba(0, 0, 0, .55));
          animation: dz-float 4s ease-in-out infinite;
        }

        .dz-timer {
          position: relative;
          z-index: 1;
          height: 70px;
          width: 100%;
          max-width: none;
          margin: 0 auto;
          padding: 0 16px;
          border-radius: 18px;
          border: 1px solid rgba(117, 134, 165, .22);
          background: rgba(8, 17, 32, .72);
          display: grid;
          grid-template-columns: minmax(0, 1fr) 1px minmax(0, 1fr);
          align-items: center;
          box-shadow: 0 0 30px rgba(8, 17, 32, .3);
        }

        .dz-divider {
          height: 38px;
          background: rgba(117, 134, 165, .18);
        }

        .dz-stat {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .dz-stat svg {
          flex: 0 0 auto;
        }

        .dz-stat > div {
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .dz-stat {
          justify-content: center;
        }

        .dz-stat.right {
          justify-content: center;
        }

        .dz-stat strong {
          display: block;
          color: #f8fafc;
          font-size: 17px;
          line-height: 1.05;
          white-space: nowrap;
          font-weight: 600;
        }

        .dz-stat span {
          display: block;
          margin-top: 4px;
          color: #9aa8bc;
          font-size: 11px;
          line-height: 1.15;
          font-weight: 400;
        }



        @media (max-width: 380px) {
          .dz-screen { padding-left: 16px; padding-right: 16px; }
          .dz-tabs { gap: 12px; }
          .dz-tab { height: 84px; }
          .dz-tab-label { font-size: 12px; }
          .dz-timer { padding: 0 14px; }
          .dz-stat { gap: 9px; }
          .dz-stat strong { font-size: 16px; }
          .dz-stat span { font-size: 11px; }
        }

        @media (max-height: 620px) {
          .dz-screen { padding-top: 10px; padding-bottom: 10px; }
          .dz-kicker { margin-bottom: 12px; font-size: 11px; }
          .dz-tabs { margin-bottom: 14px; }
          .dz-tab { height: 76px; }
          .dz-pack-wrap { height: 318px; min-height: 280px; margin-bottom: 14px; }
          .dz-pack { height: min(44dvh, 300px); }
          .dz-timer { height: 66px; }
        }

        @keyframes dz-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }

        @keyframes dz-pulse {
          0%, 100% { opacity: .48; transform: scale(1); }
          50% { opacity: .74; transform: scale(1.06); }
        }
      `}</style>

      <h1 className="dz-kicker">Choose your booster</h1>

      <section className="dz-tabs" aria-label="Booster categories">
        {packs.map((pack, index) => {
          const Icon = pack.Icon;
          const active = activePackIdx === index;
          return (
            <button
              key={pack.id}
              type="button"
              className={`dz-tab${active ? " active" : ""}`}
              style={{ "--accent": pack.accentColor } as React.CSSProperties}
              onClick={() => setActivePackIdx(index)}
            >
              <Icon size={30} color={pack.accentColor} strokeWidth={2.25} />
              <span className="dz-tab-label">{pack.type}</span>
            </button>
          );
        })}
      </section>

      <section
        className="dz-pack-wrap"
        style={{
          "--glow": activePack.glowColor,
        } as React.CSSProperties}
      >
        <button
          type="button"
          aria-label="Previous pack"
          className="dz-arrow left"
          onClick={() => setActivePackIdx((i) => (i - 1 + packs.length) % packs.length)}
        >
          <ChevronLeft size={28} color="#4f8cff" strokeWidth={2.25} />
        </button>

        <div className="dz-pack-glow" />
        <img className="dz-pack" src={activePack.packImage} alt={activePack.name} />

        <button
          type="button"
          aria-label="Next pack"
          className="dz-arrow right"
          onClick={() => setActivePackIdx((i) => (i + 1) % packs.length)}
        >
          <ChevronRight size={28} color="#4f8cff" strokeWidth={2.25} />
        </button>
      </section>


      <section className="dz-timer" aria-label="Pack timer">
        <div className="dz-stat">
          <Clock size={24} color="#4f8cff" strokeWidth={2.2} />
          <div>
            <strong>{availablePacks >= MAX_PACKS ? "Packs full" : formatTime(secondsRemaining)}</strong>
            <span>until next pack</span>
          </div>
        </div>

        <div className="dz-divider" />

        <div className="dz-stat right">
          <Package size={24} color="#4f8cff" strokeWidth={2.2} />
          <div>
            <strong>{availablePacks} / {MAX_PACKS}</strong>
            <span>packs available</span>
          </div>
        </div>
      </section>
    </main>
  );
}
