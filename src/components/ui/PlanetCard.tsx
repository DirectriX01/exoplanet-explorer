"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Exoplanet } from "@/lib/types";
import { radiusCategory, parsecsToLightYears } from "@/lib/utils";

const methodColors: Record<string, string> = {
  Transit: "#f59e0b",
  "Radial Velocity": "#6366f1",
  Imaging: "#ec4899",
  Microlensing: "#10b981",
  Astrometry: "#8b5cf6",
};

export default function PlanetCard({
  planet,
  index = 0,
}: {
  planet: Exoplanet;
  index?: number;
}) {
  const color = methodColors[planet.discoveryMethod] || "#ff6b3d";
  const sizeRatio = planet.radiusEarth ? Math.min(planet.radiusEarth, 20) : 1;
  const dotSize = Math.max(10, Math.min(44, sizeRatio * 4));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/catalog/${planet.slug}`}
        className="group block rounded-2xl border border-white/[0.05] bg-[var(--ink-2)]/55 backdrop-blur-sm p-5 transition-all duration-300 hover:border-[var(--ember)]/35 hover:bg-[var(--ink-2)]/85"
      >
        <div className="flex items-start gap-4">
          <div className="relative mt-1 flex-shrink-0">
            <div
              className="rounded-full"
              style={{
                width: dotSize,
                height: dotSize,
                background: `radial-gradient(circle at 35% 32%, ${color}, ${color}55 70%, transparent 100%)`,
                boxShadow: `0 0 ${dotSize / 1.5}px ${color}44`,
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="display text-[1.05rem] text-[var(--paper)] truncate group-hover:text-[var(--ember)] transition-colors">
              {planet.name}
            </h3>
            <p className="mono text-[0.66rem] uppercase tracking-wider text-[var(--mist)] mt-1">
              {planet.hostname} · {planet.discoveryYear}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <span
                className="mono text-[0.62rem] uppercase tracking-wider rounded-full px-2 py-0.5"
                style={{
                  background: `${color}1a`,
                  color,
                  border: `1px solid ${color}33`,
                }}
              >
                {planet.discoveryMethod}
              </span>
              {planet.radiusEarth && (
                <span className="mono text-[0.62rem] uppercase tracking-wider rounded-full px-2 py-0.5 bg-white/[0.04] text-[var(--mist)] border border-white/[0.05]">
                  {radiusCategory(planet.radiusEarth)}
                </span>
              )}
            </div>

            <div className="mt-3.5 grid grid-cols-2 gap-x-4 gap-y-1.5 mono text-[0.7rem] tabular-nums">
              {planet.radiusEarth && (
                <div className="flex justify-between">
                  <span className="text-[var(--mist)] uppercase tracking-wider text-[0.6rem]">R</span>
                  <span className="text-[var(--paper-dim)]">{planet.radiusEarth.toFixed(2)} R⊕</span>
                </div>
              )}
              {planet.distanceParsecs && (
                <div className="flex justify-between">
                  <span className="text-[var(--mist)] uppercase tracking-wider text-[0.6rem]">D</span>
                  <span className="text-[var(--paper-dim)]">{parsecsToLightYears(planet.distanceParsecs)} ly</span>
                </div>
              )}
              {planet.orbitalPeriodDays && (
                <div className="flex justify-between">
                  <span className="text-[var(--mist)] uppercase tracking-wider text-[0.6rem]">P</span>
                  <span className="text-[var(--paper-dim)]">
                    {planet.orbitalPeriodDays < 1
                      ? `${(planet.orbitalPeriodDays * 24).toFixed(1)} h`
                      : planet.orbitalPeriodDays < 365
                        ? `${planet.orbitalPeriodDays.toFixed(1)} d`
                        : `${(planet.orbitalPeriodDays / 365.25).toFixed(1)} y`}
                  </span>
                </div>
              )}
              {planet.equilibriumTempK && (
                <div className="flex justify-between">
                  <span className="text-[var(--mist)] uppercase tracking-wider text-[0.6rem]">T</span>
                  <span className="text-[var(--paper-dim)]">{planet.equilibriumTempK} K</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
