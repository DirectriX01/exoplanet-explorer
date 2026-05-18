"use client";

import { use, useRef } from "react";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
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
import Frame from "@/components/nasa/Frame";
import Reticle from "@/components/nasa/Reticle";
import Sonifier from "@/components/interactive/Sonifier";
import { plexMono } from "@/lib/nasa-fonts";

const StarSystem = dynamic(() => import("@/components/three/StarSystem"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square bg-[var(--ink-2)] animate-pulse" />
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

const STATUS = {
  nominal: "#00d97e",
  warning: "#ffb000",
  white: "#ffffff",
};

const methodSlugs: Record<string, string> = {
  Transit: "transit",
  "Radial Velocity": "radial-velocity",
  Imaging: "direct-imaging",
  Microlensing: "microlensing",
  Astrometry: "astrometry",
};

const methodChannel: Record<string, string> = {
  Transit: "TRN",
  "Radial Velocity": "DOP",
  Imaging: "IMG",
  Microlensing: "MCL",
  Astrometry: "AST",
};

function formatPeriod(days: number | null) {
  if (days == null) return "—";
  if (days < 1) return `${(days * 24).toFixed(1)} h`;
  if (days < 365) return `${formatNumber(days, 1)} d`;
  return `${formatNumber(days / 365.25, 1)} yr`;
}

function Field({
  label,
  value,
  status = "data",
}: {
  label: string;
  value: string;
  status?: "nominal" | "warning" | "data";
}) {
  const color =
    status === "nominal" ? STATUS.nominal : status === "warning" ? STATUS.warning : STATUS.white;
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5 border-b border-white/[0.05] last:border-0">
      <span className="text-[0.6rem] uppercase tracking-[0.22em] text-white/45">
        {label}
      </span>
      <span className="text-[0.78rem] tabular-nums" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

function Signal({
  planet,
  phaseRef,
}: {
  planet: Exoplanet;
  phaseRef: React.RefObject<number>;
}) {
  if (planet.slug === "trappist-1-b") {
    const fluxes = trappist1Data.planets.b.data.map((d) => d.flux);
    const fmin = Math.min(...fluxes);
    const fmax = Math.max(...fluxes);
    return (
      <div className="space-y-4">
        <LightCurve
          data={trappist1Data.planets.b.data}
          label="TRN · Spitzer photometry"
          color={STATUS.warning}
          phaseRef={phaseRef}
        />
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/[0.05]">
          <p className="text-[0.7rem] uppercase tracking-[0.18em] text-white/55 max-w-[55%]">
            The data, as audio. Pitch drops where the planet blocks the star.
          </p>
          <Sonifier
            values={fluxes}
            vmin={fmin}
            vmax={fmax}
            duration={6}
            label="Hear the transit"
            hint="Web audio · 6 sec"
          />
        </div>
      </div>
    );
  }
  if (planet.slug === "51-peg-b") {
    const vels = peg51Data.data.map((d) => d.velocity);
    const vmin = Math.min(...vels);
    const vmax = Math.max(...vels);
    return (
      <div className="space-y-4">
        <VelocityCurve
          fitData={peg51Data.data}
          observedData={peg51Data.observed_points}
          label="DOP · ELODIE RV · 4.23 d period"
          color={STATUS.warning}
          phaseRef={phaseRef}
        />
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/[0.05]">
          <p className="text-[0.7rem] uppercase tracking-[0.18em] text-white/55 max-w-[55%]">
            The wobble, as audio. Pitch follows the star's velocity.
          </p>
          <Sonifier
            values={vels}
            vmin={vmin}
            vmax={vmax}
            duration={5}
            label="Hear the wobble"
            hint="Web audio · 5 sec"
          />
        </div>
      </div>
    );
  }
  const blurb: Record<string, string> = {
    Transit:
      "Periodic dip in stellar flux at each orbit. Depth proportional to (Rp/Rs)². Period from repeat interval.",
    "Radial Velocity":
      "Sinusoidal Doppler shift in stellar spectra. Amplitude reveals minimum mass; period reveals orbit.",
    Imaging:
      "Direct photon detection from the planet. Coronagraph + adaptive optics suppress the host star's glare.",
    Microlensing:
      "Brief asymmetric spike on a gravitational lensing curve. Single-event, non-repeating.",
    Astrometry:
      "Microarcsecond positional shift of the star against background. Requires decade-scale baselines.",
  };
  return (
    <div className="py-4">
      <p className="text-[0.62rem] uppercase tracking-[0.22em] text-white/45 mb-3">
        SIGNAL CLASS · {methodChannel[planet.discoveryMethod] ?? "—"}
      </p>
      <p className="text-[0.85rem] text-white/80 leading-relaxed">
        {blurb[planet.discoveryMethod] ?? "—"}
      </p>
    </div>
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
  const channel = methodChannel[planet.discoveryMethod] ?? "—";
  const story = planet.discoveryStory;
  const targetCode = planet.slug.toUpperCase();

  // Render-size scaling for the StarSystem
  const planetSize = planet.radiusEarth
    ? Math.min(Math.max(planet.radiusEarth * 0.03, 0.18), 0.5)
    : 0.18;
  const starRadius = Math.min(planet.starRadiusSun || 1, 1.6);

  const phaseRef = useRef(0);

  return (
    <div
      className={`${plexMono.variable} relative min-h-[100svh] pt-20 pb-16 px-4 sm:px-8`}
      style={{ fontFamily: "var(--font-plex), ui-monospace, monospace" }}
    >
      {/* MISSION HEADER */}
      <div className="mx-auto max-w-7xl mb-6 flex flex-wrap items-center justify-between gap-3 text-[0.6rem] uppercase tracking-[0.25em] text-white/55">
        <div className="flex gap-5 flex-wrap">
          <span className="text-white">EXOPLANET//ARCHIVE</span>
          <span>TGT · {targetCode}</span>
          <span>MTHD · {channel}</span>
          <span>YR · {planet.discoveryYear}</span>
        </div>
        <div className="flex items-center gap-5">
          <span style={{ color: STATUS.nominal }}>● CONFIRMED</span>
          <Link
            href="/catalog"
            className="text-white/70 hover:text-white transition-colors"
          >
            ← ARCHIVE
          </Link>
        </div>
      </div>

      {/* PAGE TITLE */}
      <div className="mx-auto max-w-7xl mb-8">
        <h1 className="text-[1.6rem] sm:text-[2.2rem] font-medium text-white leading-tight">
          {planet.name}
        </h1>
        <p className="text-[0.72rem] uppercase tracking-[0.2em] text-white/55 mt-1.5">
          {planet.hostname} system · {planet.discoveryFacility}
        </p>
      </div>

      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-5">
        {/* OBSERVED SYSTEM */}
        <Frame
          label="OBSERVED SYSTEM"
          meta={`CH 1 · STR-${channel}`}
          status="nominal"
          padded={false}
        >
          <div className="relative aspect-square">
            <StarSystem
              starTemp={planet.starTempK || 5778}
              starRadius={starRadius}
              planetOrbit={3}
              planetSize={planetSize}
              className="!max-w-none w-full"
            />
            <Reticle />
            <div className="absolute top-2 left-3 text-[0.55rem] uppercase tracking-[0.2em] text-white/55">
              CAM 01 · {planet.starTempK || "—"} K
            </div>
            <div className="absolute bottom-2 right-3 text-[0.55rem] uppercase tracking-[0.2em] text-white/55">
              ORBIT {planet.semiMajorAxisAU ? `${formatNumber(planet.semiMajorAxisAU, 3)} AU` : "—"}
            </div>
          </div>
        </Frame>

        {/* TELEMETRY · SIGNAL */}
        <Frame
          label={`TELEMETRY · ${channel}`}
          meta="CH 2 · SIG-A"
          status="nominal"
          padded={false}
        >
          <div className="p-4 min-h-[300px]">
            <Signal planet={planet} phaseRef={phaseRef} />
          </div>
        </Frame>

        {/* ORBITAL PARAMETERS */}
        <Frame label="ORBITAL PARAMETERS" meta="REF · NEA" status="data">
          <Field label="Period" value={formatPeriod(planet.orbitalPeriodDays)} status="nominal" />
          <Field
            label="Semi-major axis"
            value={planet.semiMajorAxisAU ? `${formatNumber(planet.semiMajorAxisAU, 3)} AU` : "—"}
          />
          <Field
            label="Eccentricity"
            value={planet.eccentricity != null ? formatNumber(planet.eccentricity, 3) : "—"}
          />
          <Field
            label="Equilibrium temp"
            value={
              planet.equilibriumTempK
                ? `${planet.equilibriumTempK} K · ${kelvinToCelsius(planet.equilibriumTempK)} °C`
                : "—"
            }
            status={planet.equilibriumTempK && planet.equilibriumTempK > 1000 ? "warning" : "data"}
          />
          <Field label="Discovery facility" value={planet.discoveryFacility} />
          <Field
            label="Method"
            value={planet.discoveryMethod.toUpperCase()}
            status="nominal"
          />
        </Frame>

        {/* PHYSICAL PROPERTIES */}
        <Frame label="PHYSICAL PROPERTIES" meta="DERIVED" status="data">
          <Field
            label="Radius"
            value={
              planet.radiusEarth
                ? `${formatNumber(planet.radiusEarth)} R⊕`
                : "—"
            }
            status="nominal"
          />
          <Field
            label="Class"
            value={planet.radiusEarth ? radiusCategory(planet.radiusEarth).toUpperCase() : "—"}
          />
          <Field
            label="Mass"
            value={planet.massEarth ? `${formatNumber(planet.massEarth)} M⊕` : "—"}
          />
          <Field
            label="Distance from Earth"
            value={
              planet.distanceParsecs
                ? `${parsecsToLightYears(planet.distanceParsecs)} ly · ${formatNumber(planet.distanceParsecs)} pc`
                : "—"
            }
          />
        </Frame>

        {/* HOST STAR */}
        <Frame label={`HOST · ${planet.hostname}`} meta="STELLAR" status="data">
          <Field label="Effective temp" value={planet.starTempK ? `${planet.starTempK} K` : "—"} />
          <Field
            label="Radius (☉)"
            value={planet.starRadiusSun ? formatNumber(planet.starRadiusSun) : "—"}
          />
          <Field
            label="Mass (☉)"
            value={planet.starMassSun ? formatNumber(planet.starMassSun) : "—"}
          />
          <Field
            label="Spectral class (inferred)"
            value={
              planet.starTempK
                ? planet.starTempK > 10000 ? "O/B"
                  : planet.starTempK > 7500 ? "A"
                  : planet.starTempK > 6000 ? "F"
                  : planet.starTempK > 5200 ? "G"
                  : planet.starTempK > 4000 ? "K"
                  : planet.starTempK > 2500 ? "M"
                  : "L/T"
                : "—"
            }
          />
        </Frame>

        {/* MISSION LOG — full width */}
        <Frame
          label="MISSION LOG · DISCOVERY"
          meta={story?.date ? `${story.date}` : `${planet.discoveryYear}`}
          status="data"
          className="lg:col-span-2"
        >
          {story ? (
            <div className="space-y-3 text-[0.78rem] leading-relaxed text-white/80">
              {story.paragraphs.map((p, i) => (
                <p key={i}>
                  <span
                    style={{ color: i === 0 ? STATUS.nominal : i === 1 ? STATUS.warning : STATUS.nominal }}
                  >
                    [T+{String(i * 100).padStart(4, "0")}]
                  </span>{" "}
                  {p}
                </p>
              ))}
              {story.people && story.people.length > 0 && (
                <p className="text-white/55 text-[0.7rem] mt-4 uppercase tracking-[0.2em]">
                  CREW · {story.people.join(" · ")}
                </p>
              )}
            </div>
          ) : (
            <p className="text-[0.78rem] leading-relaxed text-white/75">
              {planet.description ??
                `${planet.name} confirmed ${planet.discoveryYear} at ${planet.discoveryFacility} via ${planet.discoveryMethod}.`}
            </p>
          )}
          <Link
            href={`/methods/${methodSlug}`}
            className="mt-6 inline-flex items-center gap-2 text-[0.66rem] uppercase tracking-[0.22em] text-white/70 hover:text-white transition-colors"
          >
            View detection method · {channel} →
          </Link>
        </Frame>
      </div>

      {/* FOOTER */}
      <div className="mx-auto max-w-7xl mt-8 flex justify-between text-[0.58rem] uppercase tracking-[0.25em] text-white/40">
        <span>END OF RECORD</span>
        <span>{targetCode} · ARCHIVE</span>
      </div>
    </div>
  );
}
