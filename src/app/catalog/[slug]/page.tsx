"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import catalogData from "@/data/catalog.json";
import trappist1Data from "@/data/trappist1-lightcurve.json";
import peg51Data from "@/data/51pegb-rv.json";
import type { Exoplanet } from "@/lib/types";
import {
  formatNumber,
  parsecsToLightYears,
  radiusCategory,
  kelvinToCelsius,
} from "@/lib/utils";

const StarSystem = dynamic(() => import("@/components/three/StarSystem"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square bg-[var(--ink-2)] rounded-lg animate-pulse" />
  ),
});

const LightCurve = dynamic(() => import("@/components/charts/LightCurve"), {
  ssr: false,
});
const VelocityCurve = dynamic(
  () => import("@/components/charts/VelocityCurve"),
  { ssr: false }
);

const planets = catalogData as Exoplanet[];

const methodSlugs: Record<string, string> = {
  Transit: "transit",
  "Radial Velocity": "radial-velocity",
  Imaging: "direct-imaging",
  Microlensing: "microlensing",
  Astrometry: "astrometry",
};

function formatPeriod(days: number | null) {
  if (days == null) return "Unknown";
  if (days < 1) return `${(days * 24).toFixed(1)} h`;
  if (days < 365) return `${formatNumber(days, 1)} d`;
  return `${formatNumber(days / 365.25, 1)} yr`;
}

function PropRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-3 border-b border-white/[0.06] last:border-0">
      <span className="mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--mist)]">
        {label}
      </span>
      {href ? (
        <Link
          href={href}
          className="text-[0.95rem] text-[var(--ember)] hover:text-[var(--ember-soft)] transition-colors"
        >
          {value} →
        </Link>
      ) : (
        <span className="text-[0.95rem] text-[var(--paper)] mono tabular-nums">
          {value}
        </span>
      )}
    </div>
  );
}

function Signal({ planet }: { planet: Exoplanet }) {
  if (planet.slug === "trappist-1-b") {
    return (
      <LightCurve
        data={trappist1Data.planets.b.data}
        label={`TRAPPIST-1 b — Spitzer photometry (depth ${trappist1Data.planets.b.depth_ppm} ppm)`}
        color="var(--ember)"
      />
    );
  }
  if (planet.slug === "51-peg-b") {
    return (
      <VelocityCurve
        fitData={peg51Data.data}
        observedData={peg51Data.observed_points}
        label="51 Pegasi b — ELODIE radial velocities, 4.23-day period"
        color="var(--ember)"
      />
    );
  }
  const blurb: Record<string, string> = {
    Transit:
      "A periodic dip of a fraction of a percent in starlight, repeating every orbit. The depth gives the planet's size; the spacing gives the period.",
    "Radial Velocity":
      "A sinusoidal Doppler shift in the star's spectral lines as the planet tugs it back and forth along our line of sight. Amplitude reveals mass and orbit.",
    Imaging:
      "An actual photon from the planet, resolved as a faint dot beside a much brighter star. Coronagraphs and adaptive optics suppress the glare.",
    Microlensing:
      "A brief, asymmetric spike riding on the smooth gravitational lensing curve of a foreground star — over in hours, never to repeat.",
    Astrometry:
      "Microarcsecond shifts in the star's position on the sky as it orbits the common centre of mass with its unseen companion. Decades of measurements required.",
  };
  return (
    <p className="text-[var(--paper-dim)] leading-relaxed italic display-italic">
      {blurb[planet.discoveryMethod] ?? "—"}
    </p>
  );
}

export default function PlanetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const planet = planets.find((p) => p.slug === slug);
  if (!planet) notFound();

  const methodSlug = methodSlugs[planet.discoveryMethod] ?? "transit";
  const story = planet.discoveryStory;

  return (
    <article className="relative">
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[100svh] flex flex-col">
        <div className="px-5 sm:px-10 md:px-16 pt-24">
          <Link
            href="/catalog"
            className="mono text-[0.7rem] uppercase tracking-[0.2em] text-[var(--mist)] hover:text-[var(--paper)] transition-colors"
          >
            ← Catalog
          </Link>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 px-5 sm:px-10 md:px-16 py-10 items-center">
          <div className="aspect-square max-w-[640px] mx-auto w-full">
            <StarSystem
              starTemp={planet.starTempK || 5778}
              starRadius={Math.min(planet.starRadiusSun || 1, 2)}
              planetOrbit={3}
              planetSize={
                planet.radiusEarth
                  ? Math.min(Math.max(planet.radiusEarth * 0.03, 0.05), 0.5)
                  : 0.15
              }
            />
          </div>

          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--mist)] mb-4">
              {planet.hostname} system · {planet.discoveryYear}
            </p>
            <h1
              className="display-italic text-[var(--paper)] leading-[0.95] tracking-tight"
              style={{ fontSize: "var(--t-hero)" }}
            >
              {planet.name}
            </h1>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 mono text-[0.78rem] tabular-nums text-[var(--paper-dim)]">
              <span>
                {planet.radiusEarth
                  ? `${formatNumber(planet.radiusEarth)} R⊕`
                  : "— R⊕"}
              </span>
              <span>
                {planet.distanceParsecs
                  ? `${parsecsToLightYears(planet.distanceParsecs)} ly`
                  : "— ly"}
              </span>
              <Link
                href={`/methods/${methodSlug}`}
                className="text-[var(--ember)] hover:text-[var(--ember-soft)] transition-colors uppercase tracking-wider"
              >
                {planet.discoveryMethod}
              </Link>
            </div>
          </motion.header>
        </div>
      </section>

      {/* ─── § DISCOVERY ──────────────────────────────────── */}
      <section className="relative py-24 sm:py-32 px-5 sm:px-10 md:px-16">
        <div className="max-w-[64ch] mx-auto">
          <p className="mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-6">
            § Discovery {story?.date && `· ${story.date}`}
          </p>
          {story ? (
            <>
              <p
                className="drop-cap text-[var(--paper)]"
                style={{ fontSize: "1.15rem", lineHeight: 1.7 }}
              >
                {story.paragraphs[0]}
              </p>
              {story.paragraphs.slice(1).map((p, i) => (
                <p
                  key={i}
                  className="mt-6 text-[var(--paper-dim)]"
                  style={{ fontSize: "1.05rem", lineHeight: 1.75 }}
                >
                  {p}
                </p>
              ))}
              {story.people && story.people.length > 0 && (
                <p className="mt-10 mono text-[0.72rem] uppercase tracking-[0.2em] text-[var(--mist)]">
                  {story.people.join(" · ")}
                </p>
              )}
            </>
          ) : (
            <p
              className="text-[var(--paper-dim)]"
              style={{ fontSize: "1.05rem", lineHeight: 1.75 }}
            >
              {planet.description ??
                `${planet.name} was discovered in ${planet.discoveryYear} at ${planet.discoveryFacility} using the ${planet.discoveryMethod} method.`}
            </p>
          )}
        </div>
      </section>

      {/* ─── § THE SIGNAL ─────────────────────────────────── */}
      <section className="relative py-20 sm:py-28 px-5 sm:px-10 md:px-16 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <p className="mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-6">
            § The Signal
          </p>
          <h2
            className="display text-[var(--paper)] mb-10"
            style={{ fontSize: "var(--t-section)" }}
          >
            What the telescope actually saw
          </h2>
          <Signal planet={planet} />
        </div>
      </section>

      {/* ─── § PROPERTIES ─────────────────────────────────── */}
      <section className="relative py-20 sm:py-28 px-5 sm:px-10 md:px-16 border-t border-white/[0.05]">
        <div className="max-w-3xl mx-auto">
          <p className="mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-6">
            § Properties
          </p>
          <div>
            <PropRow label="Discovery year" value={String(planet.discoveryYear)} />
            <PropRow
              label="Method"
              value={planet.discoveryMethod}
              href={`/methods/${methodSlug}`}
            />
            <PropRow label="Facility" value={planet.discoveryFacility} />
            <PropRow
              label="Distance"
              value={
                planet.distanceParsecs
                  ? `${parsecsToLightYears(planet.distanceParsecs)} ly`
                  : "—"
              }
            />
            <PropRow
              label="Radius"
              value={
                planet.radiusEarth
                  ? `${formatNumber(planet.radiusEarth)} R⊕ · ${radiusCategory(planet.radiusEarth)}`
                  : "—"
              }
            />
            <PropRow
              label="Mass"
              value={planet.massEarth ? `${formatNumber(planet.massEarth)} M⊕` : "—"}
            />
            <PropRow label="Orbital period" value={formatPeriod(planet.orbitalPeriodDays)} />
            <PropRow
              label="Semi-major axis"
              value={
                planet.semiMajorAxisAU
                  ? `${formatNumber(planet.semiMajorAxisAU, 3)} AU`
                  : "—"
              }
            />
            <PropRow
              label="Temperature"
              value={
                planet.equilibriumTempK
                  ? `${planet.equilibriumTempK} K · ${kelvinToCelsius(planet.equilibriumTempK)} °C`
                  : "—"
              }
            />
            <PropRow
              label="Eccentricity"
              value={
                planet.eccentricity != null
                  ? formatNumber(planet.eccentricity, 3)
                  : "—"
              }
            />
            <PropRow
              label="Host star temp"
              value={planet.starTempK ? `${planet.starTempK} K` : "—"}
            />
            <PropRow
              label="Host star radius"
              value={
                planet.starRadiusSun
                  ? `${formatNumber(planet.starRadiusSun)} R☉`
                  : "—"
              }
            />
          </div>
        </div>
      </section>

      {/* ─── § IN CONTEXT ─────────────────────────────────── */}
      {planet.radiusEarth && (
        <section className="relative py-20 sm:py-28 px-5 sm:px-10 md:px-16 border-t border-white/[0.05]">
          <div className="max-w-3xl mx-auto">
            <p className="mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-6">
              § In Context
            </p>
            <h2
              className="display text-[var(--paper)] mb-10"
              style={{ fontSize: "var(--t-section)" }}
            >
              How big, against the worlds you know
            </h2>
            <div className="flex flex-wrap items-end justify-center gap-x-10 gap-y-6">
              <SizeBlob label="Earth" radiusEarth={1} color="#6aa3ff" />
              <SizeBlob
                label={planet.name}
                radiusEarth={planet.radiusEarth}
                color="var(--ember)"
                highlight
              />
              {planet.radiusEarth > 5 && (
                <SizeBlob label="Jupiter" radiusEarth={11.2} color="#d4a366" />
              )}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

function SizeBlob({
  label,
  radiusEarth,
  color,
  highlight = false,
}: {
  label: string;
  radiusEarth: number;
  color: string;
  highlight?: boolean;
}) {
  const px = Math.min(Math.max(28 * radiusEarth, 16), 220);
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="rounded-full"
        style={{
          width: px,
          height: px,
          background: `radial-gradient(circle at 32% 28%, ${color}, ${color}55 70%, transparent 100%)`,
          boxShadow: highlight ? `0 0 50px ${color}66` : undefined,
        }}
      />
      <span
        className={`mono text-[0.7rem] uppercase tracking-wider ${highlight ? "text-[var(--paper)]" : "text-[var(--mist)]"}`}
      >
        {label} · {radiusEarth.toFixed(2)}×
      </span>
    </div>
  );
}
