"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, User, ChevronLeft, ChevronRight, ShoppingBag, LayoutGrid, Clock, Package, Shuffle, Eye, X, Trophy, BookOpen } from "lucide-react";

type PackType = "science" | "philosophy" | "art";
type NavTab = "home" | "collection" | "challenges" | "mechanics" | "shop";
type Screen = "home" | "detail" | "opening";

interface CardData {
  name: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Ultra Rare";
  description: string;
  image: string;
}

interface Pack {
  id: PackType;
  name: string;
  subtitle: string;
  type: string;
  packImage: string;
  glowColor: string;
  gradientA: string;
  gradientB: string;
  accentColor: string;
  cards: CardData[];
}

const SCIENCE_CARDS: CardData[] = [
  { name: "The Library",       rarity: "Rare",       description: "Draw 3 cards and keep one.",                               image: "/card1.png" },
  { name: "DNA",               rarity: "Ultra Rare", description: "Copy an Ally's effects until end of turn.",                image: "/card2.png" },
  { name: "Schrödinger's Cat", rarity: "Uncommon",   description: "Both active & inactive. Leaving play: draw 1, discard 1.", image: "/card3.png" },
  { name: "Creation Touch",    rarity: "Rare",       description: "Activate a dormant ability on any card.",                  image: "/card4.png" },
  { name: "The Murmuration",   rarity: "Common",     description: "Split any card's power across two targets.",               image: "/card5.png" },
];

const PHILOSOPHY_CARDS: CardData[] = [
  { name: "Cogito Ergo Sum",   rarity: "Ultra Rare", description: "Resurrect any eliminated card.",                           image: "/card3.png" },
  { name: "Socratic Method",   rarity: "Rare",       description: "Ask three questions — opponent reveals their strategy.",   image: "/card4.png" },
  { name: "The Dialectic",     rarity: "Uncommon",   description: "Merge two opposing cards into a synthesis.",               image: "/card1.png" },
  { name: "Kant's Imperative", rarity: "Common",     description: "Neutralize all illegal moves for one turn.",               image: "/card5.png" },
  { name: "Plato's Cave",      rarity: "Rare",       description: "Reveal all hidden card effects on the board.",             image: "/card2.png" },
];

const ART_CARDS: CardData[] = [
  { name: "Warhol's Silkscreen", rarity: "Ultra Rare", description: "Duplicate any card four times.",                        image: "/card2.png" },
  { name: "Dali's Clock",        rarity: "Rare",       description: "Bend time — skip to any point in your turn order.",     image: "/card1.png" },
  { name: "Rothko's Field",      rarity: "Uncommon",   description: "All cards gain +2 presence for one turn.",               image: "/card5.png" },
  { name: "Pollock's Drip",      rarity: "Common",     description: "Random buff applied to random cards.",                   image: "/card3.png" },
  { name: "Basquiat's Crown",    rarity: "Ultra Rare", description: "Crown a card — it becomes immune to elimination.",       image: "/card4.png" },
];

const packs: Pack[] = [
  {
    id: "science",
    name: "Scientific Revolution",
    subtitle: "Science Booster Pack",
    type: "SCIENCE",
    packImage: "/science_pack.png",
    glowColor: "rgba(59, 130, 246, 0.6)",
    gradientA: "#1d4ed8",
    gradientB: "#0ea5e9",
    accentColor: "#60a5fa",
    cards: SCIENCE_CARDS,
  },
  {
    id: "philosophy",
    name: "Age of Reason",
    subtitle: "Philosophy Booster Pack",
    type: "PHILOSOPHY",
    packImage: "/philosophy_pack.png",
    glowColor: "rgba(109, 40, 217, 0.65)",
    gradientA: "#6d28d9",
    gradientB: "#7c3aed",
    accentColor: "#a78bfa",
    cards: PHILOSOPHY_CARDS,
  },
  {
    id: "art",
    name: "Modern Art",
    subtitle: "Art Booster Pack",
    type: "ART",
    packImage: "/art_pack.png",
    glowColor: "rgba(194, 65, 12, 0.6)",
    gradientA: "#c2410c",
    gradientB: "#ea580c",
    accentColor: "#fb923c",
    cards: ART_CARDS,
  },
];

const CARDS_PER_PACK = 3;
const REGEN_SECONDS = 12 * 60 * 60;
const MAX_PACKS = 2;
const NAV_H = 58;

function formatTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h} hr ${String(m).padStart(2, "0")} min`;
  const sec = s % 60;
  return `${String(m).padStart(2, "0")} min ${String(sec).padStart(2, "0")} sec`;
}

function pickRandom<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

// ── Placeholder pages ──────────────────────────────────────────────────────
function CollectionPage() {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "0 32px" }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: "linear-gradient(135deg,#e0e7ff,#c7d2fe)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LayoutGrid size={28} color="#6366f1" />
      </div>
      <h2 style={{ fontFamily: "'Crimson Pro',Georgia,serif", fontSize: "1.6rem", fontWeight: 400, color: "#0f172a", margin: 0 }}>Collection</h2>
      <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", lineHeight: 1.5, margin: 0 }}>Your collected cards will appear here. Open packs to start building your collection.</p>
    </div>
  );
}

function ChallengesPage() {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "0 32px" }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: "linear-gradient(135deg,#fef3c7,#fde68a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Trophy size={28} color="#d97706" />
      </div>
      <h2 style={{ fontFamily: "'Crimson Pro',Georgia,serif", fontSize: "1.6rem", fontWeight: 400, color: "#0f172a", margin: 0 }}>Challenges</h2>
      <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", lineHeight: 1.5, margin: 0 }}>Daily and weekly challenges will be listed here. Complete them to earn rare cards and rewards.</p>
    </div>
  );
}

function MechanicsPage() {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "0 32px" }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <BookOpen size={28} color="#16a34a" />
      </div>
      <h2 style={{ fontFamily: "'Crimson Pro',Georgia,serif", fontSize: "1.6rem", fontWeight: 400, color: "#0f172a", margin: 0 }}>Game Mechanics</h2>
      <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", lineHeight: 1.5, margin: 0 }}>Rules, card interactions, and strategy guides will be explained here.</p>
    </div>
  );
}

function ShopPage() {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "0 32px" }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: "linear-gradient(135deg,#fce7f3,#fbcfe8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ShoppingBag size={28} color="#db2777" />
      </div>
      <h2 style={{ fontFamily: "'Crimson Pro',Georgia,serif", fontSize: "1.6rem", fontWeight: 400, color: "#0f172a", margin: 0 }}>Shop</h2>
      <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", lineHeight: 1.5, margin: 0 }}>Purchase booster packs and special bundles here. More items coming soon.</p>
    </div>
  );
}

export default function PackSelection() {
  const [navTab, setNavTab] = useState<NavTab>("home");
  const [activePackIdx, setActivePackIdx] = useState(1);
  const [screen, setScreen] = useState<Screen>("home");
  const [availablePacks, setAvailablePacks] = useState(1);
  const [secondsRemaining, setSecondsRemaining] = useState(Math.floor(REGEN_SECONDS * 0.75));
  const [openedCards, setOpenedCards] = useState<CardData[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [expandedCard, setExpandedCard] = useState<CardData | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const dragStartX = useRef<number | null>(null);
  const dragCurrentX = useRef<number>(0);

  const activePack = packs[activePackIdx];

  useEffect(() => {
    if (availablePacks >= MAX_PACKS) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) { setAvailablePacks((p) => Math.min(p + 1, MAX_PACKS)); return REGEN_SECONDS; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [availablePacks]);

  const timerProgress = 1 - secondsRemaining / REGEN_SECONDS;

  function goToDetail() { setScreen("detail"); }
  function goBack() { setScreen("home"); setOpenedCards([]); setRevealedCount(0); setSwipeProgress(0); }

  function handleOpenPack() { setScreen("opening"); setOpenedCards([]); setRevealedCount(0); setSwipeProgress(0); }

  function handleCollect() {
    setAvailablePacks(p => Math.max(0, p - 1));
    setScreen("home");
    setOpenedCards([]);
    setRevealedCount(0);
    setSwipeProgress(0);
  }

  function onPointerDown(e: React.PointerEvent) {
    dragStartX.current = e.clientX;
    dragCurrentX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (dragStartX.current === null) return;
    setSwipeProgress(Math.min(Math.max((e.clientX - dragStartX.current) / 180, 0), 1));
    dragCurrentX.current = e.clientX;
  }
  function onPointerUp() {
    if (dragStartX.current === null) return;
    const delta = dragCurrentX.current - (dragStartX.current ?? 0);
    dragStartX.current = null;
    if (delta > 100) { setSwipeProgress(1); setTimeout(triggerReveal, 280); }
    else setSwipeProgress(0);
  }

  function triggerReveal() {
    const drawn = pickRandom(activePack.cards, CARDS_PER_PACK);
    setOpenedCards(drawn);
    setRevealedCount(0);
    for (let i = 0; i < CARDS_PER_PACK; i++) {
      setTimeout(() => setRevealedCount(n => n + 1), 350 + i * 230);
    }
  }

  const allRevealed = openedCards.length > 0 && revealedCount >= CARDS_PER_PACK;

  // Nav items config
  const navItems: { id: NavTab; label: string; icon: (active: boolean) => React.ReactNode }[] = [
    {
      id: "home", label: "Home",
      icon: (a) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke={a ? "#6366f1" : "#94a3b8"} strokeWidth={a ? "2" : "1.5"} fill={a ? "#ede9fe" : "none"} />
          <path d="M9 21V12h6v9" stroke={a ? "#6366f1" : "#94a3b8"} strokeWidth={a ? "2" : "1.5"} />
        </svg>
      ),
    },
    {
      id: "collection", label: "Collection",
      icon: (a) => <LayoutGrid size={20} color={a ? "#6366f1" : "#94a3b8"} strokeWidth={a ? 2 : 1.5} fill={a ? "#ede9fe" : "none"} />,
    },
    {
      id: "challenges", label: "Challenges",
      icon: (a) => <Trophy size={20} color={a ? "#6366f1" : "#94a3b8"} strokeWidth={a ? 2 : 1.5} />,
    },
    {
      id: "mechanics", label: "Mechanics",
      icon: (a) => <BookOpen size={20} color={a ? "#6366f1" : "#94a3b8"} strokeWidth={a ? 2 : 1.5} />,
    },
    {
      id: "shop", label: "Shop",
      icon: (a) => <ShoppingBag size={20} color={a ? "#6366f1" : "#94a3b8"} strokeWidth={a ? 2 : 1.5} />,
    },
  ];

  // When switching away from home, reset sub-screens
  function handleNavTab(tab: NavTab) {
    setNavTab(tab);
    if (tab === "home") setScreen("home");
  }

  const isHomeSub = navTab === "home" && (screen === "detail" || screen === "opening");

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#f0f2f8",
      display: "flex", flexDirection: "column",
      maxWidth: 430, margin: "0 auto",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        * { box-sizing: border-box; }

        @keyframes fade-in { from{opacity:0} to{opacity:1} }
        .fade-in { animation: fade-in 0.2s ease forwards; }

        @keyframes pack-float {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .pack-float { animation: pack-float 4s ease-in-out infinite; }

        @keyframes glow-pulse {
          0%,100% { opacity:0.55; transform:scale(1); }
          50% { opacity:0.75; transform:scale(1.04); }
        }
        .glow-pulse { animation: glow-pulse 4s ease-in-out infinite; }

        @keyframes shimmer {
          0%{background-position:-200% center}
          100%{background-position:200% center}
        }
        .timer-bar {
          background: linear-gradient(90deg,#a78bfa,#818cf8,#67e8f9,#818cf8,#a78bfa);
          background-size: 300% 100%;
          animation: shimmer 3s linear infinite;
        }

        @keyframes slide-up {
          from{opacity:0;transform:translateY(16px)}
          to{opacity:1;transform:translateY(0)}
        }
        .slide-up { animation: slide-up 0.35s cubic-bezier(0.34,1.2,0.64,1) forwards; }

        @keyframes card-pop {
          0%{opacity:0;transform:translateY(40px) scale(0.82) rotateY(-18deg)}
          65%{transform:translateY(-4px) scale(1.03) rotateY(3deg)}
          100%{opacity:1;transform:translateY(0) scale(1) rotateY(0deg)}
        }
        .card-reveal { animation: card-pop 0.52s cubic-bezier(0.34,1.4,0.64,1) both; }

        @keyframes swipe-glow {
          0%{left:-60%;opacity:0} 15%{opacity:1} 85%{opacity:0.85} 100%{left:110%;opacity:0}
        }
        .swipe-glow-streak {
          position:absolute; top:0; bottom:0; width:50%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.85) 40%, rgba(255,255,255,1) 55%, rgba(255,255,255,0.85) 70%, transparent);
          animation: swipe-glow 2s ease-in-out infinite;
          pointer-events:none; border-radius:100px;
        }

        @keyframes pack-enter {
          from{opacity:0;transform:scale(0.88) translateY(16px)}
          to{opacity:1;transform:scale(1) translateY(0)}
        }
        .pack-enter { animation: pack-enter 0.4s cubic-bezier(0.34,1.3,0.64,1) forwards; }

        @keyframes card-expand {
          from{opacity:0;transform:scale(0.72)}
          to{opacity:1;transform:scale(1)}
        }
        .card-expand-img {
          animation: card-expand 0.32s cubic-bezier(0.34,1.4,0.64,1) both;
          max-width: min(82vw,320px);
          border-radius: 18px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6);
        }

        @keyframes modal-in {
          from{opacity:0;transform:translateY(22px) scale(0.97)}
          to{opacity:1;transform:none}
        }
        .modal-backdrop {
          position:fixed; inset:0; z-index:50;
          background:rgba(0,0,0,0.4); backdrop-filter:blur(6px);
          display:flex; align-items:flex-end; justify-content:center;
        }
        .modal-sheet {
          width:100%; max-width:430px; background:white;
          border-radius:28px 28px 0 0; overflow:hidden;
          animation: modal-in 0.3s cubic-bezier(0.34,1.2,0.64,1) both;
          max-height:80dvh; display:flex; flex-direction:column;
        }

        .open-btn {
          width:100%; border:none; border-radius:14px;
          padding:14px; font-size:14px; font-weight:700;
          letter-spacing:0.04em; color:white; cursor:pointer;
          transition:transform 0.15s ease;
          box-shadow:0 4px 20px rgba(0,0,0,0.25);
        }
        .open-btn:active { transform:scale(0.97); }

        .secondary-btn {
          border:1.5px solid rgba(255,255,255,0.15);
          border-radius:12px; padding:10px 14px;
          font-size:11px; font-weight:600;
          background:rgba(255,255,255,0.08);
          color:rgba(255,255,255,0.7); cursor:pointer;
          display:flex; align-items:center; justify-content:center; gap:5px;
          transition:all 0.15s ease; backdrop-filter:blur(8px);
        }
        .secondary-btn:active { transform:scale(0.97); }
        .secondary-btn:hover { background:rgba(255,255,255,0.15); color:white; }

        .pack-selector-tab {
          padding:6px 12px; border-radius:100px;
          border:none; background:transparent;
          font-size:9px; font-weight:700; letter-spacing:0.16em;
          text-transform:uppercase; cursor:pointer;
          transition:all 0.18s ease; color:#94a3b8;
        }
        .pack-selector-tab.active {
          background:white;
          box-shadow:0 1px 6px rgba(0,0,0,0.12);
          color:#1e293b;
        }
      `}</style>

      {/* ── Content area (fills above nav) ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>

        {/* ══════════ HOME SCREEN ══════════ */}
        {navTab === "home" && screen === "home" && (
          <div className="fade-in" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Top nav */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "44px 20px 10px", flexShrink: 0 }}>
              <button style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", border: "none", background: "none", cursor: "pointer" }}>
                <Menu size={21} color="#1e293b" />
              </button>
              <span style={{ fontFamily: "'Crimson Pro',Georgia,serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#1e293b" }}>DEZCARTES</span>
              <button style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #e2e8f0", borderRadius: "50%", background: "white", cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <User size={16} color="#64748b" />
              </button>
            </div>

            {/* Choose label */}
            <div style={{ textAlign: "center", paddingBottom: 8, flexShrink: 0 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#94a3b8", margin: 0 }}>Choose your booster</p>
            </div>

            {/* Pack type tabs */}
            <div style={{ display: "flex", justifyContent: "center", gap: 4, padding: "0 16px 10px", flexShrink: 0 }}>
              {packs.map((pack, i) => (
                <button key={pack.id} className={`pack-selector-tab${activePackIdx === i ? " active" : ""}`} onClick={() => setActivePackIdx(i)}>
                  {pack.type}
                </button>
              ))}
            </div>

            {/* Pack image + arrows — flex-1 to take remaining space */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", minHeight: 0 }}>
              <div className="glow-pulse" style={{ position: "absolute", width: "60%", aspectRatio: "1", borderRadius: "50%", background: `radial-gradient(circle, ${activePack.glowColor} 0%, transparent 70%)`, pointerEvents: "none" }} />

              <button onClick={() => setActivePackIdx((i) => (i - 1 + packs.length) % packs.length)}
                style={{ position: "absolute", left: 10, zIndex: 2, width: 34, height: 34, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <ChevronLeft size={15} color="#64748b" />
              </button>

              <div key={activePack.id} className="pack-float" style={{ position: "relative", zIndex: 1 }}
                onClick={goToDetail}>
                <img src={activePack.packImage} alt={activePack.name} style={{ height: "min(200px, calc(100% - 8px))", width: "auto", objectFit: "contain", filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.28))", display: "block", cursor: "pointer" }} />
              </div>

              <button onClick={() => setActivePackIdx((i) => (i + 1) % packs.length)}
                style={{ position: "absolute", right: 10, zIndex: 2, width: 34, height: 34, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <ChevronRight size={15} color="#64748b" />
              </button>
            </div>

            {/* Pack name + subtitle */}
            <div style={{ textAlign: "center", padding: "6px 20px 8px", flexShrink: 0 }}>
              <h2 style={{ fontFamily: "'Crimson Pro',Georgia,serif", fontSize: "1.7rem", fontWeight: 400, color: "#0f172a", margin: 0, letterSpacing: "-0.01em" }}>{activePack.name}</h2>
              <p style={{ fontSize: 11, fontWeight: 500, color: activePack.accentColor, marginTop: 2, marginBottom: 0 }}>{activePack.subtitle}</p>
            </div>

            {/* Timer card */}
            <div style={{ margin: "0 16px 10px", background: "white", borderRadius: 16, padding: "12px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.05)", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Clock size={12} color="#94a3b8" />
                  <span style={{ fontSize: 11, fontWeight: 500, color: "#64748b" }}>
                    {availablePacks >= MAX_PACKS ? "Packs full" : `${formatTime(secondsRemaining)} until next pack`}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Package size={12} color="#94a3b8" />
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#475569" }}>{availablePacks}<span style={{ fontWeight: 400, color: "#94a3b8" }}>/{MAX_PACKS}</span></span>
                  <span style={{ fontSize: 10, color: "#94a3b8" }}>available</span>
                </div>
              </div>
              <div style={{ height: 3, background: "#f1f5f9", borderRadius: 100, overflow: "hidden" }}>
                <div className="timer-bar" style={{ height: "100%", width: availablePacks >= MAX_PACKS ? "100%" : `${timerProgress * 100}%`, borderRadius: 100, transition: "width 1s linear" }} />
              </div>
            </div>

            {/* Open pack button */}
            <div style={{ padding: "0 16px 12px", flexShrink: 0 }}>
              <button className="open-btn" style={{ background: `linear-gradient(135deg, ${activePack.gradientA}, ${activePack.gradientB})` }} onClick={goToDetail}>
                Open Pack
              </button>
            </div>
          </div>
        )}

        {/* ══════════ DETAIL SCREEN ══════════ */}
        {navTab === "home" && screen === "detail" && (
          <div className="fade-in" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "linear-gradient(180deg,#0a0a18 0%,#0f0f24 60%,#1a0a2e 100%)" }}>
            {/* Top bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "44px 20px 16px", flexShrink: 0 }}>
              <button onClick={goBack} style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <ChevronLeft size={15} color="rgba(255,255,255,0.8)" />
              </button>
              <span style={{ fontFamily: "'Crimson Pro',Georgia,serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)" }}>DEZCARTES</span>
              <div style={{ width: 34 }} />
            </div>

            {/* Pack image */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", minHeight: 0 }}>
              <div className="glow-pulse" style={{ position: "absolute", width: "65%", aspectRatio: "1", borderRadius: "50%", background: `radial-gradient(circle, ${activePack.glowColor} 0%, transparent 70%)`, opacity: 0.8, pointerEvents: "none" }} />
              <div key={activePack.id} className="pack-enter pack-float" style={{ position: "relative", zIndex: 1 }}>
                <img src={activePack.packImage} alt={activePack.name} style={{ height: "min(210px, calc(100% - 8px))", width: "auto", objectFit: "contain", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))", display: "block" }} />
              </div>
            </div>

            {/* Pack info */}
            <div style={{ textAlign: "center", padding: "8px 20px 16px", flexShrink: 0 }}>
              <h2 style={{ fontFamily: "'Crimson Pro',Georgia,serif", fontSize: "1.9rem", fontWeight: 400, color: "white", margin: 0 }}>{activePack.name}</h2>
              <p style={{ fontSize: 11, fontWeight: 500, color: activePack.accentColor, marginTop: 4, marginBottom: 0 }}>{activePack.subtitle}</p>
            </div>

            {/* Buttons */}
            <div className="slide-up" style={{ padding: "0 16px 14px", display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
              <button className="open-btn" style={{ background: `linear-gradient(135deg, ${activePack.gradientA}, ${activePack.gradientB})` }} onClick={handleOpenPack}>
                Open Pack
              </button>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="secondary-btn" style={{ flex: 1 }} onClick={() => setActivePackIdx((activePackIdx + 1) % packs.length)}>
                  <Shuffle size={12} />Switch
                </button>
                <button className="secondary-btn" style={{ flex: 1 }} onClick={() => setPreviewOpen(true)}>
                  <Eye size={12} />Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ OPENING SCREEN ══════════ */}
        {navTab === "home" && screen === "opening" && (
          <div className="fade-in" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "linear-gradient(180deg,#0a0a18 0%,#0f0f24 60%,#1a0a2e 100%)", alignItems: "center" }}>
            {/* Top bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "44px 20px 12px", flexShrink: 0 }}>
              <button onClick={goBack} style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <ChevronLeft size={15} color="rgba(255,255,255,0.8)" />
              </button>
              <span style={{ fontFamily: "'Crimson Pro',Georgia,serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)" }}>DEZCARTES</span>
              <div style={{ width: 34 }} />
            </div>

            {openedCards.length === 0 ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, minHeight: 0 }}>
                <div style={{ position: "relative" }}>
                  <div className="glow-pulse" style={{ position: "absolute", inset: -32, borderRadius: "50%", background: `radial-gradient(circle, ${activePack.glowColor} 0%, transparent 70%)`, pointerEvents: "none", opacity: 0.9 }} />
                  <div style={{ position: "relative", zIndex: 1, width: 200, borderRadius: 14, overflow: "hidden", boxShadow: "0 12px 48px rgba(0,0,0,0.5)" }}>
                    <div
                      style={{ position: "relative", width: "100%", height: 36, background: `linear-gradient(90deg, ${activePack.gradientA}, ${activePack.gradientB})`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "grab", userSelect: "none", touchAction: "none", overflow: "hidden" }}
                      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
                    >
                      <div style={{ position: "absolute", left: 20, right: 20, height: 3, borderRadius: 100, background: "rgba(255,255,255,0.25)", overflow: "hidden" }}>
                        {swipeProgress < 0.08 && <div className="swipe-glow-streak" />}
                        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${swipeProgress * 100}%`, background: "rgba(255,255,255,0.9)", borderRadius: 100, transition: "width 0.08s ease" }} />
                      </div>
                      {swipeProgress < 0.04 && (
                        <span style={{ position: "relative", zIndex: 2, fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", pointerEvents: "none" }}>← swipe to open →</span>
                      )}
                    </div>
                    <img src={activePack.packImage} alt={activePack.name} style={{ width: "100%", display: "block" }} />
                  </div>
                </div>
                <p style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em", margin: 0 }}>Drag the bar at the top to reveal</p>
              </div>
            ) : (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, width: "100%", minHeight: 0 }}>
                <h2 style={{ fontFamily: "'Crimson Pro',Georgia,serif", fontSize: "1.6rem", fontWeight: 400, color: "white", margin: 0 }}>Your cards</h2>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-end", justifyContent: "center", padding: "0 16px", width: "100%" }}>
                  {openedCards.map((card, i) => (
                    i < revealedCount ? (
                      <div key={i} className="card-reveal" style={{ flex: "0 0 auto", width: 96, borderRadius: 12, overflow: "hidden", background: "white", boxShadow: "0 8px 28px rgba(0,0,0,0.4)", cursor: "pointer" }} onClick={() => setExpandedCard(card)}>
                        <img src={card.image} alt={card.name} style={{ width: "100%", display: "block", aspectRatio: "2/3", objectFit: "cover" }} />
                      </div>
                    ) : (
                      <div key={i} style={{ flex: "0 0 auto", width: 96, borderRadius: 12, overflow: "hidden", background: "rgba(255,255,255,0.08)" }}>
                        <div style={{ width: "100%", aspectRatio: "2/3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "rgba(255,255,255,0.3)" }}>?</div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
                {allRevealed && <p className="fade-in" style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 500, margin: 0 }}>Tap any card to enlarge</p>}
              </div>
            )}

            <div className="slide-up" style={{ width: "100%", padding: "0 16px 14px", flexShrink: 0 }}>
              {openedCards.length > 0 && allRevealed ? (
                <button className="open-btn" style={{ background: `linear-gradient(135deg, ${activePack.gradientA}, ${activePack.gradientB})` }} onClick={handleCollect}>Collect cards</button>
              ) : (
                <button onClick={goBack} className="secondary-btn" style={{ width: "100%", padding: "12px" }}><ChevronLeft size={13} />Back</button>
              )}
            </div>
          </div>
        )}

        {/* ══════════ PLACEHOLDER PAGES ══════════ */}
        {navTab === "collection" && (
          <div className="fade-in" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "44px 20px 16px", flexShrink: 0 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#94a3b8", margin: 0 }}>Your cards</p>
            </div>
            <CollectionPage />
          </div>
        )}
        {navTab === "challenges" && (
          <div className="fade-in" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "44px 20px 16px", flexShrink: 0 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#94a3b8", margin: 0 }}>Active challenges</p>
            </div>
            <ChallengesPage />
          </div>
        )}
        {navTab === "mechanics" && (
          <div className="fade-in" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "44px 20px 16px", flexShrink: 0 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#94a3b8", margin: 0 }}>How to play</p>
            </div>
            <MechanicsPage />
          </div>
        )}
        {navTab === "shop" && (
          <div className="fade-in" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "44px 20px 16px", flexShrink: 0 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#94a3b8", margin: 0 }}>Store</p>
            </div>
            <ShopPage />
          </div>
        )}
      </div>

      {/* ══════════ BOTTOM NAV ══════════ */}
      {!isHomeSub && (
        <nav style={{
          height: NAV_H, flexShrink: 0,
          background: "rgba(255,255,255,0.94)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(0,0,0,0.07)",
          display: "flex", alignItems: "stretch",
        }}>
          {navItems.map(({ id, label, icon }) => {
            const active = navTab === id;
            return (
              <button
                key={id}
                onClick={() => handleNavTab(id)}
                style={{
                  flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", gap: 2, border: "none", background: "none",
                  cursor: "pointer", padding: "6px 2px 4px",
                  fontSize: 8, fontWeight: 700, letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: active ? "#6366f1" : "#94a3b8",
                  transition: "color 0.15s ease",
                }}
              >
                {icon(active)}
                {label}
              </button>
            );
          })}
        </nav>
      )}

      {/* ══════════ PREVIEW SHEET ══════════ */}
      {previewOpen && (
        <div className="modal-backdrop" onClick={() => setPreviewOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 18px 10px" }}>
              <div>
                <h2 style={{ fontFamily: "'Crimson Pro',Georgia,serif", fontSize: "1.2rem", fontWeight: 400, color: "#0f172a", margin: 0 }}>{activePack.name}</h2>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#94a3b8", marginTop: 2, marginBottom: 0 }}>{activePack.cards.length} cards in this set</p>
              </div>
              <button onClick={() => setPreviewOpen(false)} style={{ width: 30, height: 30, borderRadius: "50%", border: "1.5px solid #e2e8f0", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <X size={13} color="#64748b" />
              </button>
            </div>
            <div style={{ height: 3, background: `linear-gradient(90deg, ${activePack.gradientA}, ${activePack.gradientB})`, flexShrink: 0 }} />
            <div style={{ overflowY: "auto", flex: 1, padding: "14px 14px 20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 9 }}>
                {activePack.cards.map((card, i) => (
                  <div key={i} style={{ borderRadius: 12, overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }} onClick={() => setExpandedCard(card)}>
                    <img src={card.image} alt={card.name} style={{ width: "100%", display: "block", aspectRatio: "2/3", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ EXPANDED CARD ══════════ */}
      {expandedCard && (
        <div className="fade-in" style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.82)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setExpandedCard(null)}>
          <img src={expandedCard.image} alt={expandedCard.name} className="card-expand-img" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}