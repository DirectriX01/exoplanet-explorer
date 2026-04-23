"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import catalogData from "@/data/catalog.json";
import type { Exoplanet } from "@/lib/types";
import {
  formatNumber,
  parsecsToLightYears,
  radiusCategory,
  kelvinToCelsius,
} from "@/lib/utils";

const StarSystem = dynamic(
  () => import("@/components/three/StarSystem"),
  { ssr: false, loading: () => <div className="w-full aspect-square max-w-md bg-white/5 rounded-2xl animate-pulse" /> }
);

const planets = catalogData as Exoplanet[];

const methodColors: Record<string, string> = {
  Transit: "#f59e0b",
  "Radial Velocity": "#6366f1",
  Imaging: "#ec4899",
  Microlensing: "#10b981",
  Astrometry: "#8b5cf6",
};

const methodSlugs: Record<string, string> = {
  Transit: "transit",
  "Radial Velocity": "radial-velocity",
  Imaging: "direct-imaging",
  Microlensing: "microlensing",
  Astrometry: "astrometry",
};

export default function PlanetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const planet = planets.find((p) => p.slug === slug);

  if (!planet) {
    notFound();
  }

  const color = methodColors[planet.discoveryMethod] || "#6366f1";
  const methodSlug = methodSlugs[planet.discoveryMethod] || "transit";

  const stats = [
    {
      label: "Discovery Year",
      value: planet.discoveryYear.toString(),
    },
    {
      label: "Method",
      value: planet.discoveryMethod,
      link: `/methods/${methodSlug}`,
    },
    {
      label: "Facility",
      value: planet.discoveryFacility,
    },
    {
      label: "Distance",
      value: planet.distanceParsecs
        ? `${parsecsToLightYears(planet.distanceParsecs)} light-years`
        : "Unknown",
    },
    {
      label: "Radius",
      value: planet.radiusEarth
        ? `${formatNumber(planet.radiusEarth)} Earth radii`
        : "Unknown",
      sub: planet.radiusEarth ? radiusCategory(planet.radiusEarth) : undefined,
    },
    {
      label: "Mass",
      value: planet.massEarth
        ? `${formatNumber(planet.massEarth)} Earth masses`
        : "Unknown",
    },
    {
      label: "Orbital Period",
      value: planet.orbitalPeriodDays
        ? planet.orbitalPeriodDays < 1
          ? `${(planet.orbitalPeriodDays * 24).toFixed(1)} hours`
          : planet.orbitalPeriodDays < 365
            ? `${formatNumber(planet.orbitalPeriodDays, 1)} days`
            : `${formatNumber(planet.orbitalPeriodDays / 365.25, 1)} years`
        : "Unknown",
    },
    {
      label: "Semi-major Axis",
      value: planet.semiMajorAxisAU
        ? `${formatNumber(planet.semiMajorAxisAU, 3)} AU`
        : "Unknown",
    },
    {
      label: "Temperature",
      value: planet.equilibriumTempK
        ? `${planet.equilibriumTempK} K (${kelvinToCelsius(planet.equilibriumTempK)}°C)`
        : "Unknown",
    },
    {
      label: "Eccentricity",
      value: planet.eccentricity != null
        ? formatNumber(planet.eccentricity, 3)
        : "Unknown",
    },
    {
      label: "Host Star Temp",
      value: planet.starTempK ? `${planet.starTempK} K` : "Unknown",
    },
    {
      label: "Host Star Radius",
      value: planet.starRadiusSun
        ? `${formatNumber(planet.starRadiusSun)} Solar radii`
        : "Unknown",
    },
  ];

  // Scale planet for 3D view
  const planetSizeScale = planet.radiusEarth
    ? Math.min(Math.max(planet.radiusEarth * 0.03, 0.05), 0.5)
    : 0.15;

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-white transition-colors mb-8"
          >
            &larr; Back to Catalog
          </Link>

          <div className="flex items-start gap-4 mb-6">
            <div
              className="w-4 h-4 mt-2 rounded-full flex-shrink-0"
              style={{
                background: `radial-gradient(circle at 35% 35%, ${color}cc, ${color}44)`,
                boxShadow: `0 0 12px ${color}33`,
              }}
            />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {planet.name}
              </h1>
              <p className="text-slate-400 mt-1">
                {planet.hostname} system &middot;{" "}
                <Link
                  href={`/methods/${methodSlug}`}
                  className="transition-colors hover:text-white"
                  style={{ color }}
                >
                  Discovered via {planet.discoveryMethod} &rarr;
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3D Scene */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <StarSystem
              starTemp={planet.starTempK || 5778}
              starRadius={Math.min(planet.starRadiusSun || 1, 2)}
              planetOrbit={3}
              planetSize={planetSizeScale}
            />
            <p className="text-xs text-slate-500 mt-2">
              Interactive 3D view (drag to rotate)
            </p>

            {/* Size comparison */}
            {planet.radiusEarth && (
              <div className="mt-6 rounded-xl bg-white/5 p-5 w-full max-w-md">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Size Comparison
                </h3>
                <div className="flex items-end justify-center gap-6">
                  <div className="flex flex-col items-center">
                    <div
                      className="rounded-full bg-blue-400"
                      style={{
                        width: 24,
                        height: 24,
                      }}
                    />
                    <span className="text-[10px] text-slate-500 mt-2">
                      Earth
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className="rounded-full"
                      style={{
                        width: Math.min(
                          Math.max(24 * planet.radiusEarth, 8),
                          200
                        ),
                        height: Math.min(
                          Math.max(24 * planet.radiusEarth, 8),
                          200
                        ),
                        background: `radial-gradient(circle at 35% 35%, ${color}cc, ${color}44)`,
                      }}
                    />
                    <span className="text-[10px] text-slate-500 mt-2">
                      {planet.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {planet.radiusEarth.toFixed(2)}x Earth
                    </span>
                  </div>
                  {planet.radiusEarth > 5 && (
                    <div className="flex flex-col items-center">
                      <div
                        className="rounded-full bg-orange-400/60"
                        style={{
                          width: 24 * 11.2,
                          height: 24 * 11.2,
                          maxWidth: 200,
                          maxHeight: 200,
                        }}
                      />
                      <span className="text-[10px] text-slate-500 mt-2">
                        Jupiter
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {planet.description && (
              <div className="mb-6 rounded-xl border border-white/5 bg-[#0a0520]/40 p-5">
                <p className="text-sm text-slate-300 leading-relaxed">
                  {planet.description}
                </p>
              </div>
            )}

            <div className="rounded-xl border border-white/5 bg-[#0a0520]/40 p-5">
              <h2 className="text-lg font-semibold text-white mb-4">
                Properties
              </h2>
              <div className="space-y-0">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-start justify-between py-2.5 border-b border-white/5 last:border-0"
                  >
                    <span className="text-xs text-slate-500">
                      {stat.label}
                    </span>
                    <div className="text-right">
                      {stat.link ? (
                        <Link
                          href={stat.link}
                          className="text-sm font-medium transition-colors hover:text-white"
                          style={{ color }}
                        >
                          {stat.value} &rarr;
                        </Link>
                      ) : (
                        <span className="text-sm text-slate-200">
                          {stat.value}
                        </span>
                      )}
                      {stat.sub && (
                        <div className="text-[10px] text-slate-500">
                          {stat.sub}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
