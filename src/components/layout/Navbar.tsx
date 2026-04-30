"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/methods", label: "Methods" },
  { href: "/catalog", label: "Catalog" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [materialized, setMaterialized] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const goingUp = y < lastY;
        setMaterialized(y > 24 && (goingUp || y > 320));
        lastY = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-[55] transition-all duration-500",
        "ease-[cubic-bezier(0.32,0.72,0,1)]",
        materialized || mobileOpen
          ? "bg-[var(--ink)]/85 backdrop-blur-xl border-b border-white/[0.04]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--ember)] group-hover:scale-150 transition-transform duration-300"
            style={{ boxShadow: "0 0 12px var(--ember-glow)" }}
          />
          <span className="display text-[1.05rem] tracking-tight text-[var(--paper)]">
            Exoplanet Explorer
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-1">
          {links.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative px-4 py-2 text-[0.78rem] mono tracking-wider uppercase transition-colors",
                  active
                    ? "text-[var(--paper)]"
                    : "text-[var(--mist)] hover:text-[var(--paper)]"
                )}
              >
                {l.label}
                {active && (
                  <span
                    aria-hidden
                    className="absolute left-1/2 -translate-x-1/2 bottom-1.5 h-[3px] w-[3px] rounded-full bg-[var(--ember)]"
                    style={{ boxShadow: "0 0 8px var(--ember-glow)" }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <button
          className="sm:hidden text-[var(--paper)] p-2 -mr-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            {mobileOpen ? (
              <>
                <line x1="6" y1="6" x2="16" y2="16" />
                <line x1="6" y1="16" x2="16" y2="6" />
              </>
            ) : (
              <>
                <line x1="4" y1="8" x2="18" y2="8" />
                <line x1="4" y1="14" x2="18" y2="14" />
              </>
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="sm:hidden border-t border-white/[0.05]">
          <div className="flex flex-col px-5 py-3 gap-0.5">
            {links.map((l) => {
              const active =
                l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "py-3 mono text-[0.8rem] uppercase tracking-wider transition-colors",
                    active ? "text-[var(--ember)]" : "text-[var(--mist)]"
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
