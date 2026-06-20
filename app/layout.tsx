"use client";

import localFont from "next/font/local";
import { usePathname } from "next/navigation";
import Header from "./components/header";
import "./globals.css";

const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/Satoshi-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-Medium.otf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const shouldAllowOverflow =
    pathname.startsWith("/challenges") ||
    pathname.startsWith("/collection") ||
    pathname.startsWith("/gameplay");

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${satoshi.variable} bg-neutral-100 flex items-start justify-center min-h-screen`}
      >
        <div className="relative flex h-[100dvh] w-[375px] max-w-[375px] flex-col overflow-hidden bg-white shadow-xl">
          <Header />

          <div
            className={`flex-1 ${
              shouldAllowOverflow ? "overflow-y-auto" : "overflow-hidden"
            }`}
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}