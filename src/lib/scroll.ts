"use client";

import { useEffect, useState, type RefObject } from "react";
import Lenis from "lenis";

let lenisInstance: Lenis | null = null;
const subscribers = new Set<(scroll: number) => void>();

function ensureLenis() {
  if (lenisInstance || typeof window === "undefined") return lenisInstance;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  lenisInstance = new Lenis({
    autoRaf: true,
    smoothWheel: !reduced,
    touchMultiplier: 2,
    lerp: reduced ? 1 : 0.1,
  });
  lenisInstance.on("scroll", ({ scroll }: { scroll: number }) => {
    subscribers.forEach((cb) => cb(scroll));
  });
  return lenisInstance;
}

export function useLenis() {
  useEffect(() => {
    ensureLenis();
    // do not destroy on unmount — Lenis is app-wide and survives route changes
  }, []);
}

/**
 * Returns a 0..1 progress value for how far `ref` has been scrolled through
 * its parent viewport. 0 = element top hits viewport bottom; 1 = element
 * bottom leaves viewport top.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    ensureLenis();
    if (!ref.current) return;

    const compute = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const passed = vh - rect.top;
      const p = Math.max(0, Math.min(1, passed / total));
      setProgress(p);
    };

    compute();
    const unsub = (_: number) => compute();
    subscribers.add(unsub);
    window.addEventListener("resize", compute);
    return () => {
      subscribers.delete(unsub);
      window.removeEventListener("resize", compute);
    };
  }, [ref]);

  return progress;
}

/** Map a 0..1 progress through a sub-range [a, b], clamped, normalized to 0..1. */
export function rangeProgress(p: number, a: number, b: number) {
  if (b <= a) return 0;
  return Math.max(0, Math.min(1, (p - a) / (b - a)));
}
