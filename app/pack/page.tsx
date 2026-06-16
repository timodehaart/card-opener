"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Gift } from "lucide-react";
import { Suspense } from "react";

const packs = [
  {
    type: "philosophy",
    src: "/packs/philosophy_pack.png",
    alt: "Age of Reason",
    label: "Age of Reason",
    sublabel: "Philosophy",
    bgFrom: "#1a0a3e",
    bgTo: "#2e1065",
    accentFrom: "#7c3aed",
    accentTo: "#a855f7",
  },
  {
    type: "art",
    src: "/packs/art_pack.png",
    alt: "Modern Art",
    label: "Modern Art",
    sublabel: "Art",
    bgFrom: "#3b0a0a",
    bgTo: "#7f1d1d",
    accentFrom: "#dc2626",
    accentTo: "#f97316",
  },
  {
    type: "science",
    src: "/packs/science_pack.png",
    alt: "Scientific Revolution",
    label: "Scientific Revolution",
    sublabel: "Science",
    bgFrom: "#0a1f3b",
    bgTo: "#1e3a5f",
    accentFrom: "#0ea5e9",
    accentTo: "#06b6d4",
  },
];

function PackPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") ?? "philosophy";

  const currentIndex = packs.findIndex((p) => p.type === type);
  const pack = packs[currentIndex] ?? packs[0];

  const switchPack = () => {
    const next = packs[(currentIndex + 1) % packs.length];
    router.replace(`/pack?type=${next.type}`);
  };

  return (
    <main className="relative flex h-full flex-col items-center overflow-hidden bg-white">
      {/* Soft light-blue diagonal background matching the screenshot */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #dbeafe 0%, #e0f2fe 40%, #f0f9ff 60%, #ffffff 100%)",
        }}
      />

      {/* Back button */}
      <button
        onClick={() => router.back()}
        aria-label="Go back"
        className="absolute left-4 top-4 z-20 flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.12)]"
      >
        <ChevronLeft size={20} strokeWidth={2} />
      </button>

      {/* Pack image — centered in upper portion */}
      <div className="relative z-10 mt-[60px] flex flex-1 items-center justify-center">
        <Image
          src={pack.src}
          alt={pack.alt}
          width={220}
          height={320}
          className="h-auto w-[220px] object-contain drop-shadow-2xl"
          priority
        />
      </div>

      {/* Bottom card */}
      <div className="relative z-10 w-full rounded-t-[28px] bg-white px-5 pb-8 pt-6 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        {/* Controls row */}
        <div className="flex items-center justify-center gap-3">
          {/* Back arrow */}
          <button
            onClick={switchPack}
            aria-label="Previous pack"
            className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-neutral-200 bg-white shadow-sm"
          >
            <ChevronLeft size={18} strokeWidth={2} />
          </button>

          {/* Switch Pack pill */}
          <button
            onClick={switchPack}
            className="flex h-[40px] items-center justify-center rounded-full border border-neutral-200 bg-white px-6 text-[14px] font-medium text-neutral-700 shadow-sm"
          >
            Switch Pack
          </button>

          {/* Gift button */}
          <button
            aria-label="Open gift"
            className="relative flex h-[40px] w-[40px] items-center justify-center rounded-[10px] border border-neutral-200 bg-white shadow-sm"
          >
            <Gift size={20} strokeWidth={1.4} />
            <span className="absolute bottom-[4px] right-[4px] flex h-[13px] w-[13px] items-center justify-center rounded-full bg-white text-[8px] font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.18)]">
              2
            </span>
          </button>
        </div>

        {/* Open Pack button */}
        <button className="mt-4 h-[48px] w-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(59,130,246,0.4)] active:scale-[0.98] transition-transform">
          Open Pack
        </button>
      </div>
    </main>
  );
}

export default function PackPage() {
  return (
    <Suspense>
      <PackPageInner />
    </Suspense>
  );
}