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
  title: "Exoplanet Explorer · How we find worlds beyond our own",
  description:
    "An interactive look at the five ways we've found thousands of planets around other stars. Real NASA data. Built by Abhinav.",
  keywords: [
    "exoplanets",
    "space",
    "astronomy",
    "transit method",
    "radial velocity",
    "NASA",
    "interactive",
    "TRAPPIST-1",
  ],
  authors: [{ name: "Abhinav", url: "https://github.com/DirectriX01" }],
  creator: "Abhinav (@DirectriX01)",
  openGraph: {
    title: "Exoplanet Explorer",
    description:
      "Five ways we find planets around other stars. Scroll through it.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${sansFont.variable} ${monoFont.variable} antialiased`}
      style={{ background: "var(--ink)" }}
    >
      <body className="flex flex-col text-[var(--paper)]">
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
