"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useRef, useState, useEffect } from "react";

const packs: Record<string, { src: string; alt: string }> = {
  philosophy: { src: "/packs/philosophy_pack.png", alt: "Age of Reason" },
  art:        { src: "/packs/art_pack.png",        alt: "Modern Art" },
  science:    { src: "/packs/science_pack.png",    alt: "Scientific Revolution" },
};

const CARDS = [
  { id: 1, src: "/cards/card-3.png", alt: "Card 1" },
  { id: 2, src: "/cards/card-4.png", alt: "Card 2" },
  { id: 3, src: "/cards/card-5.png", alt: "Card 3" },
];

function PackOpenInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") ?? "philosophy";
  const pack = packs[type] ?? packs.philosophy;

  const [opened, setOpened] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [glowPos, setGlowPos] = useState(0);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const swipeRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number | null>(null);
  const trackWidthRef = useRef(0);

  useEffect(() => {
    if (opened) return;
    let raf: number;
    let start: number | null = null;
    const duration = 1600;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const t = ((ts - start) % duration) / duration;
      const pos = t < 0.5 ? t * 2 : (1 - t) * 2;
      setGlowPos(pos);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [opened]);

  const onTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    trackWidthRef.current = swipeRef.current?.offsetWidth ?? 300;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (startXRef.current === null) return;
    const dx = e.touches[0].clientX - startXRef.current;
    setSwipeProgress(Math.min(Math.max(dx / trackWidthRef.current, 0), 1));
  };
  const onTouchEnd = () => {
    if (swipeProgress > 0.6) { setOpened(true); setSwipeProgress(1); }
    else setSwipeProgress(0);
    startXRef.current = null;
  };

  const mouseDown = useRef(false);
  const onMouseDown = (e: React.MouseEvent) => {
    mouseDown.current = true;
    startXRef.current = e.clientX;
    trackWidthRef.current = swipeRef.current?.offsetWidth ?? 300;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!mouseDown.current || startXRef.current === null) return;
    const dx = e.clientX - startXRef.current;
    setSwipeProgress(Math.min(Math.max(dx / trackWidthRef.current, 0), 1));
  };
  const onMouseUp = () => {
    if (swipeProgress > 0.6) { setOpened(true); setSwipeProgress(1); }
    else setSwipeProgress(0);
    mouseDown.current = false;
    startXRef.current = null;
  };

  return (
    <main
      className="relative flex h-full flex-col overflow-hidden"
      style={{ background: "linear-gradient(160deg, #dbeafe 0%, #e0f2fe 50%, #f0f9ff 100%)" }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {/* Hint text — pushed well down */}
      {!opened && (
        <p className="relative z-10 pt-20 text-center text-[14px] font-medium text-neutral-400 tracking-wide">
          Trace line to open
        </p>
      )}

      {/* OPENED: cards */}
      {opened && (
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5">
          <div className="w-full rounded-[24px] bg-white px-4 py-6 shadow-[0_4px_24px_rgba(0,0,0,0.10)]">
            <p className="mb-5 text-center text-[15px] font-semibold text-neutral-700">Cards Pulled</p>
            <div className="flex items-end justify-center gap-3">
              {CARDS.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
                  className="cursor-pointer overflow-hidden rounded-[10px] shadow-[0_3px_12px_rgba(0,0,0,0.15)] transition-all duration-300"
                  style={{ width: 95 }}
                >
                  <Image src={card.src} alt={card.alt} width={115} height={161} className="h-auto w-full object-cover" />
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-[12px] text-neutral-400">Tap any card to enlarge</p>
          </div>
        </div>
      )}

      {/* Expanded card overlay */}
      {opened && expandedCard !== null && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{ backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.35)" }}
          onClick={() => setExpandedCard(null)}
        >
          <div className="relative" style={{ width: "75%" }} onClick={e => e.stopPropagation()}>
            <Image
              src={CARDS.find(c => c.id === expandedCard)!.src}
              alt="Expanded card"
              width={280}
              height={392}
              className="h-auto w-full rounded-[16px] shadow-[0_12px_48px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>
      )}

      {/* Collect Cards — pinned to bottom */}
      {opened && (
        <div className="relative z-10 w-full px-5 pb-8 pt-4">
          <button
            onClick={() => router.replace("/")}
            className="h-[50px] w-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(59,130,246,0.4)] transition-transform active:scale-[0.98]"
          >
            Collect Cards
          </button>
        </div>
      )}

      {/* NOT OPENED: pack — top of pack starts at 35% down, rest bleeds off bottom */}
      {!opened && (
        <div
          className="absolute left-0 right-0 z-0"
          style={{ top: "35%", bottom: "-300px" }}
        >
          <div
            className="relative w-full h-full"
            style={{ position: "relative" }}
          >
            <Image
              src={pack.src}
              alt={pack.alt}
              fill
              className="drop-shadow-2xl"
              style={{ objectFit: "contain", objectPosition: "top center" }}
              priority
            />

            {/* Swipe strip at 21% from top of this container (= on the seal line) */}
            <div
              ref={swipeRef}
              className="absolute select-none z-10"
              style={{ top: "19.5%", left: "21%", right: "21%", height: "44px", marginTop: "-22px" }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown}
            >
              {/* Soft glow halo behind the track */}
              <div
                className="absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none rounded-full"
                style={{ height: "12px", background: "rgba(56,189,248,0.4)", filter: "blur(5px)" }}
              />
              {/* Track */}
              <div
                className="absolute top-1/2 left-0 right-0 h-[5px] -translate-y-1/2 rounded-full"
                style={{ background: "rgba(255,255,255,0.6)", boxShadow: "0 0 6px rgba(255,255,255,0.8)" }}
              >
                {/* Blue fill on swipe */}
                <div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{
                    width: `${swipeProgress * 100}%`,
                    background: "linear-gradient(90deg, #38bdf8, #3b82f6)",
                    boxShadow: "0 0 10px rgba(56,189,248,1)",
                    transition: swipeProgress === 0 ? "width 0.3s" : "none",
                  }}
                />
              </div>
              {/* Animated glow bead */}
              {swipeProgress === 0 && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    left: `calc(${glowPos * 100}% - 32px)`,
                    width: "64px",
                    height: "22px",
                    borderRadius: "9999px",
                    background: "radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(147,210,255,0.95) 40%, transparent 72%)",
                    filter: "blur(2px)",
                    boxShadow: "0 0 16px 6px rgba(147,210,255,0.7)",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function PackOpenPage() {
  return (
    <Suspense>
      <PackOpenInner />
    </Suspense>
  );
}