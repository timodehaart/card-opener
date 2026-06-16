import type { Metadata } from "next";
import localFont from "next/font/local";
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

export const metadata: Metadata = {
  title: "Card Opener",
  description: "Pick a pack and open your cards.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={satoshi.variable}>
        <div className="relative mx-auto flex h-[100dvh] w-[375px] max-w-[375px] flex-col overflow-hidden bg-white">
          <Header />
          <div className="flex-1 overflow-hidden">{children}</div>
        </div>
      </body>
    </html>
  );
}