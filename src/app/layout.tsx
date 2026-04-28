import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { displayFont, sansFont, monoFont } from "@/lib/fonts";
import Navbar from "@/components/layout/Navbar";
import Grain from "@/components/ui/Grain";
import Veil from "@/components/ui/Veil";
import SmoothScroll from "@/components/cinema/SmoothScroll";
import "./globals.css";

const Backdrop = dynamic(() => import("@/components/cinema/Backdrop"));

export const metadata: Metadata = {
  title: "Exoplanet Explorer — How We Find Worlds Beyond Our Own",
  description:
    "An interactive journey through the methods scientists use to discover planets orbiting distant stars, featuring real data from NASA.",
  keywords: [
    "exoplanets",
    "space",
    "astronomy",
    "transit method",
    "radial velocity",
    "NASA",
    "interactive",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${sansFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--ink)] text-[var(--paper)]">
        <SmoothScroll />
        <Backdrop />
        <Veil />
        <Grain />
        <Navbar />
        <main className="flex-1 relative z-[1]">{children}</main>
      </body>
    </html>
  );
}
