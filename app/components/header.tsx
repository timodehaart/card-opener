"use client";

import Link from "next/link";
import {
  Menu,
  X,
  Home,
  Library,
  ScanLine,
  Puzzle,
  Gamepad2,
  Swords,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Collection", href: "/collection", icon: Library },
  { label: "Card Scanner", href: "/card-scanner", icon: ScanLine },
  { label: "Challenges", href: "/challenges", icon: Puzzle },
  { label: "Battle Ground", href: "/gameplay", icon: Swords },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="relative z-50 h-10 border-b border-neutral-200 bg-white">
        <button
          aria-label="Open menu"
          onClick={() => setIsOpen(true)}
          className="absolute left-4 top-1/2 -translate-y-1/2"
        >
          <Menu size={24} />
        </button>

        <h1 className="flex h-full items-center justify-center text-[16px] font-medium">
          Dezcartes
        </h1>
      </header>

      <div
        className={`fixed inset-0 z-50 bg-black/20 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[240px] bg-white shadow-lg transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          aria-label="Close menu"
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4"
        >
          <X size={22} />
        </button>

        <nav className="mt-16 flex flex-col gap-5 px-6">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 text-[16px] font-medium"
              >
                <Icon size={17} strokeWidth={1.8} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}