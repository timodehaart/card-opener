"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Bell, Clock3, Gift, Mail, Plus } from "lucide-react";

const PACK_TIMER_SECONDS = 12 * 60 * 60;
const STORAGE_KEY = "pack-timer-state";

export default function HomePage() {
  const [giftCount, setGiftCount] = useState(2);
  const [secondsLeft, setSecondsLeft] = useState(PACK_TIMER_SECONDS);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved) as {
        giftCount: number;
        endTime: number;
      };

      const remaining = Math.max(
        0,
        Math.floor((parsed.endTime - Date.now()) / 1000)
      );

      setGiftCount(parsed.giftCount);
      setSecondsLeft(parsed.giftCount >= 2 ? PACK_TIMER_SECONDS : remaining);
    } else {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          giftCount: 2,
          endTime: Date.now() + PACK_TIMER_SECONDS * 1000,
        })
      );
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((current) => {
        if (giftCount >= 2) {
          return PACK_TIMER_SECONDS;
        }

        if (current <= 1) {
          const nextGiftCount = Math.min(giftCount + 1, 2);

          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              giftCount: nextGiftCount,
              endTime: Date.now() + PACK_TIMER_SECONDS * 1000,
            })
          );

          setGiftCount(nextGiftCount);
          return PACK_TIMER_SECONDS;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [giftCount]);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);

  const progress =
    giftCount >= 2 ? 100 : (secondsLeft / PACK_TIMER_SECONDS) * 100;

  return (
    <main className="min-h-screen">
      {/* Top user section */}
      <section className="relative h-[88px] bg-white">
        <div className="absolute left-0 top-1/2 h-[30px] w-[150px] -translate-y-1/2 rounded-r-full bg-white shadow-[0_3px_14px_rgba(0,0,0,0.16)]">
          <div className="absolute left-[18px] top-1/2 flex -translate-y-1/2 gap-[6px]">
            <div className="rounded-[6px] bg-white p-[4px] shadow-[0_3px_10px_rgba(0,0,0,0.22)]">
              <Image src="/cards/card-1.png" alt="Card 1" width={35} height={46} className="h-[46px] w-[35px] rounded-[3px] object-cover" />
            </div>

            <div className="rounded-[6px] bg-white p-[4px] shadow-[0_3px_10px_rgba(0,0,0,0.22)]">
              <Image src="/cards/card-2.png" alt="Card 2" width={35} height={46} className="h-[46px] w-[35px] rounded-[3px] object-cover" />
            </div>
          </div>

          <button aria-label="Add card" className="absolute right-[12px] top-1/2 flex h-[20px] w-[20px] -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_3px_14px_rgba(0,0,0,0.18)]">
            <Plus size={12} strokeWidth={2.6} />
          </button>
        </div>

        <div className="absolute left-1/2 top-1/2 flex h-[46px] w-[46px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_3px_14px_rgba(0,0,0,0.18)]">
          <Image src="/profile/profile-bunny.png" alt="Profile" width={38} height={38} className="h-[38px] w-[38px] rounded-full object-cover" />
        </div>

        <div className="absolute right-[16px] top-1/2 flex -translate-y-1/2 items-center gap-[10px]">
          <button aria-label="Notifications" className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white shadow-[0_3px_14px_rgba(0,0,0,0.16)]">
            <Bell size={16} strokeWidth={2.2} />
          </button>

          <button aria-label="Messages" className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white shadow-[0_3px_14px_rgba(0,0,0,0.16)]">
            <Mail size={16} strokeWidth={2.2} />
          </button>
        </div>
      </section>

      {/* Pack section */}
      <section className="relative mx-[14px] mt-[20px] h-[250px] overflow-visible rounded-[22px] bg-white shadow-[0_3px_12px_rgba(0,0,0,0.16)]">
        <div className="absolute inset-0 overflow-hidden rounded-[22px]">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#06B6D4_0%,#3B82F6_50%,#2563EB_100%)] opacity-50" />
          <div className="absolute bottom-[-40px] left-[-80px] h-[180px] w-[700px] -rotate-[17deg] bg-white" />
        </div>

        <div className="relative z-10 flex h-full items-start justify-center gap-0 pt-[18px]">
          <Image src="/packs/art_pack.png" alt="Modern Art" width={120} height={214} className="relative left-[32px] h-[214px] w-auto object-contain" />
          <Image src="/packs/philosophy_pack.png" alt="Age of Reason" width={120} height={214} className="h-[214px] w-auto object-contain" />
          <Image src="/packs/science_pack.png" alt="Scientific Revolution" width={120} height={214} className="relative right-[32px] h-[214px] w-auto object-contain" />
        </div>

        {/* Timer + Gift */}
        <div className="absolute bottom-[-16px] left-1/2 z-20 flex -translate-x-1/2 items-center gap-[14px]">
          <div className="relative flex h-[32px] w-[120px] flex-col items-center justify-center rounded-full bg-white shadow-[0_3px_10px_rgba(0,0,0,0.16)]">
            <div className="absolute top-[6px] h-[7.5px] w-[91px] rounded-full bg-neutral-100 shadow-inner">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#06B6D4_0%,#3B82F6_50%,#2563EB_100%)] transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-[11px] flex items-center gap-[4px] text-[12px] font-medium text-neutral-300">
              <Clock3 size={11} strokeWidth={2} />
              <span>
                {String(hours).padStart(2, "0")} hr{" "}
                {String(minutes).padStart(2, "0")} min
              </span>
            </div>
          </div>

          <button aria-label="Open gift" className="relative flex h-[32px] w-[36px] items-center justify-center rounded-[8px] bg-white shadow-[0_3px_10px_rgba(0,0,0,0.16)]">
            <span className="absolute left-[-7px] top-1/2 h-0 w-0 -translate-y-1/2 border-y-[6px] border-r-[8px] border-y-transparent border-r-white" />
            <Gift size={22} strokeWidth={1.2} />
            <span className="absolute bottom-[3px] right-[3px] flex h-[13px] w-[13px] items-center justify-center rounded-full bg-white text-[8px] font-medium shadow-[0_2px_5px_rgba(0,0,0,0.16)]">
              {giftCount}
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}