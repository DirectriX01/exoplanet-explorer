"use client";

import type { ReactNode } from "react";
import { useCinemaProgress } from "./CinemaShell";
import { rangeProgress } from "@/lib/scroll";

type Position = "right" | "left" | "bottom" | "center";

type Props = {
  /** 0..1 progress within the parent CinemaShell where this Act becomes active. */
  start: number;
  end: number;
  position?: Position;
  children: ReactNode;
  /** When true the Act consumes pointer events (e.g. it contains lab controls). */
  interactive?: boolean;
};

const outerClassFor: Record<Position, string> = {
  right:
    "right-5 sm:right-10 md:right-16 lg:right-24 top-1/2 -translate-y-1/2 max-w-[90vw] sm:max-w-md",
  left:
    "left-5 sm:left-10 md:left-16 lg:left-24 top-1/2 -translate-y-1/2 max-w-[90vw] sm:max-w-md",
  bottom:
    "bottom-10 sm:bottom-14 left-5 right-5 sm:left-10 sm:right-10 md:left-16 md:right-16",
  center:
    "inset-x-5 top-1/2 -translate-y-1/2 sm:inset-x-12 md:inset-x-24 text-center",
};

export default function Act({
  start,
  end,
  position = "right",
  interactive = false,
  children,
}: Props) {
  const p = useCinemaProgress();
  const local = rangeProgress(p, start, end);

  // S-curve: fade in over first 18%, hold, fade out over last 18%
  const opacity =
    local <= 0 || local >= 1
      ? 0
      : local < 0.18
        ? local / 0.18
        : local > 0.82
          ? (1 - local) / 0.18
          : 1;
  const translate = (1 - opacity) * 24;

  return (
    <div
      className={`absolute ${outerClassFor[position]} ${
        interactive ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        style={{
          opacity,
          transform: `translate3d(0, ${translate}px, 0)`,
          willChange: "opacity, transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
