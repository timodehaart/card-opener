import Image from "next/image";
import { Bell, Mail, Plus } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7F7F7]">
      <section className="relative h-[88px] bg-white">
        {/* Left beam */}
        <div className="absolute left-0 top-1/2 h-[30px] w-[150px] -translate-y-1/2 rounded-r-full bg-white shadow-[0_3px_14px_rgba(0,0,0,0.16)]">
          {/* Cards with white background */}
          <div className="absolute left-[18px] top-1/2 flex -translate-y-1/2 gap-[6px]">
            <div className="rounded-[6px] bg-white p-[4px] shadow-[0_3px_10px_rgba(0,0,0,0.22)]">
              <Image
                src="/cards/card-1.png"
                alt="Card 1"
                width={35}
                height={46}
                className="h-[46px] w-[35px] rounded-[3px] object-cover"
              />
            </div>

            <div className="rounded-[6px] bg-white p-[4px] shadow-[0_3px_10px_rgba(0,0,0,0.22)]">
              <Image
                src="/cards/card-2.png"
                alt="Card 2"
                width={35}
                height={46}
                className="h-[46px] w-[35px] rounded-[3px] object-cover"
              />
            </div>
          </div>

          {/* Plus inside beam */}
          <button
            aria-label="Add card"
            className="absolute right-[12px] top-1/2 flex h-[20px] w-[20px] -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_3px_14px_rgba(0,0,0,0.18)]"
          >
            <Plus size={12} strokeWidth={2.6} />
          </button>
        </div>

        {/* Profile */}
        <div className="absolute left-1/2 top-1/2 flex h-[46px] w-[46px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_3px_14px_rgba(0,0,0,0.18)]">
          <Image
            src="/profile/profile-bunny.png"
            alt="Profile"
            width={38}
            height={38}
            className="h-[38px] w-[38px] rounded-full object-cover"
          />
        </div>

        {/* Right icons */}
        <div className="absolute right-[16px] top-1/2 flex -translate-y-1/2 items-center gap-[10px]">
          <button
            aria-label="Notifications"
            className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white shadow-[0_3px_14px_rgba(0,0,0,0.16)]"
          >
            <Bell size={16} strokeWidth={2.2} />
          </button>

          <button
            aria-label="Messages"
            className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white shadow-[0_3px_14px_rgba(0,0,0,0.16)]"
          >
            <Mail size={16} strokeWidth={2.2} />
          </button>
        </div>
      </section>
    </main>
  );
}