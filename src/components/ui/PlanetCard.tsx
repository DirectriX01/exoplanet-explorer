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
  const color = methodColors[planet.discoveryMethod] || "#6366f1";
  const sizeRatio = planet.radiusEarth ? Math.min(planet.radiusEarth, 20) : 1;
  const dotSize = Math.max(8, Math.min(40, sizeRatio * 4));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        href={`/catalog/${planet.slug}`}
        className="group block rounded-2xl border border-white/5 bg-[#0a0520]/60 backdrop-blur-sm p-5 transition-all duration-300 hover:border-white/10 hover:bg-[#0a0520]/80"
      >
        <div className="flex items-start gap-4">
          {/* Planet dot */}
          <div className="relative mt-1 flex-shrink-0">
            <div
              className="rounded-full"
              style={{
                width: dotSize,
                height: dotSize,
                background: `radial-gradient(circle at 35% 35%, ${color}cc, ${color}44)`,
                boxShadow: `0 0 ${dotSize / 2}px ${color}33`,
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-white truncate group-hover:text-gradient transition-colors">
              {planet.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {planet.hostname} &middot; {planet.discoveryYear}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{
                  background: `${color}15`,
                  color: color,
                  border: `1px solid ${color}30`,
                }}
              >
                {planet.discoveryMethod}
              </span>
              {planet.radiusEarth && (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-white/5 text-slate-400 border border-white/5">
                  {radiusCategory(planet.radiusEarth)}
                </span>
              )}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
              {planet.radiusEarth && (
                <div>
                  <span className="text-slate-500">Radius</span>
                  <span className="ml-1 text-slate-300">
                    {planet.radiusEarth.toFixed(2)} R&#x2295;
                  </span>
                </div>
              )}
              {planet.distanceParsecs && (
                <div>
                  <span className="text-slate-500">Distance</span>
                  <span className="ml-1 text-slate-300">
                    {parsecsToLightYears(planet.distanceParsecs)} ly
                  </span>
                </div>
              )}
              {planet.orbitalPeriodDays && (
                <div>
                  <span className="text-slate-500">Period</span>
                  <span className="ml-1 text-slate-300">
                    {planet.orbitalPeriodDays < 1
                      ? `${(planet.orbitalPeriodDays * 24).toFixed(1)} hrs`
                      : planet.orbitalPeriodDays < 365
                        ? `${planet.orbitalPeriodDays.toFixed(1)} days`
                        : `${(planet.orbitalPeriodDays / 365.25).toFixed(1)} yrs`}
                  </span>
                </div>
              )}
              {planet.equilibriumTempK && (
                <div>
                  <span className="text-slate-500">Temp</span>
                  <span className="ml-1 text-slate-300">
                    {planet.equilibriumTempK} K
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
