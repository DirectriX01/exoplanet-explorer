"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import VelocityCurve from "@/components/charts/VelocityCurve";
import Frame from "@/components/nasa/Frame";
import Reticle from "@/components/nasa/Reticle";
import { plexMono } from "@/lib/nasa-fonts";
import rvData from "@/data/51pegb-rv.json";

const WobbleScene = dynamic(() => import("@/components/three/WobbleScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square max-w-md bg-[var(--ink-2)] animate-pulse" />
  ),
});

// NASA palette overrides — status colors instead of ember
const STATUS = {
  nominal: "#00d97e",
  warning: "#ffb000",
  white: "#ffffff",
};

function nowFrame() {
  // Static for SSR consistency; in a real telemetry rig this would tick.
  return "2026-05-17T08:30:00Z";
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
    <div className="flex items-baseline justify-between gap-4 py-1.5 border-b border-white/[0.04] last:border-0">
      <span className="text-[0.6rem] uppercase tracking-[0.22em] text-white/45">{label}</span>
      <span className="text-[0.78rem] tabular-nums" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

export default function NasaRadialVelocityPage() {
  const phaseRef = useRef(0);

  return (
    <div
      className={`${plexMono.variable} relative min-h-[100svh] pt-20 pb-16 px-4 sm:px-8`}
      style={{ fontFamily: "var(--font-plex), ui-monospace, monospace" }}
    >
      {/* MISSION HEADER */}
      <div className="mx-auto max-w-7xl mb-6 flex flex-wrap items-center justify-between gap-3 text-[0.6rem] uppercase tracking-[0.25em] text-white/55">
        <div className="flex gap-5">
          <span className="text-white">EXOPLANET//LABS</span>
          <span>FRAME 002</span>
          <span>{nowFrame()}</span>
        </div>
        <div className="flex items-center gap-5">
          <span>TGT · 51-PEG-B</span>
          <span style={{ color: STATUS.nominal }}>● NOMINAL</span>
          <Link
            href="/methods/radial-velocity"
            className="text-white/70 hover:text-white transition-colors"
          >
            ← STANDARD VIEW
          </Link>
        </div>
      </div>

      {/* PAGE TITLE */}
      <div className="mx-auto max-w-7xl mb-8">
        <h1 className="text-[1.6rem] sm:text-[2rem] font-medium text-white leading-tight">
          RADIAL VELOCITY — 51 PEGASI b
        </h1>
        <p className="text-[0.75rem] text-white/55 mt-1.5 max-w-2xl">
          Telemetry view. The orbital fit is overlaid on the ELODIE measurements
          from Haute-Provence Observatory. Scene cursor synchronized to chart
          cursor across orbital phase.
        </p>
      </div>

      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-5">
        {/* OBSERVED SYSTEM */}
        <Frame label="OBSERVED SYSTEM" meta="CH 1 · WBL-A" status="nominal" padded={false}>
          <div className="relative aspect-square">
            <WobbleScene
              amplitude={0.3}
              onPhase={(p) => {
                phaseRef.current = p;
              }}
              className="!max-w-none w-full"
            />
            <Reticle />
            {/* corner tickmark callouts */}
            <div className="absolute top-2 left-3 text-[0.55rem] uppercase tracking-[0.2em] text-white/55">
              CAM 01 · ZOOM 1.0x
            </div>
            <div className="absolute bottom-2 right-3 text-[0.55rem] uppercase tracking-[0.2em] text-white/55">
              ALIGN OK
            </div>
          </div>
        </Frame>

        {/* TELEMETRY */}
        <Frame label="TELEMETRY · RV" meta="CH 2 · DOP-A" status="nominal" padded={false}>
          <div className="p-4">
            <VelocityCurve
              fitData={rvData.data}
              observedData={rvData.observed_points}
              label="VEL · m/s vs ORBITAL PHASE"
              color={STATUS.warning}
              phaseRef={phaseRef}
            />
          </div>
        </Frame>

        {/* PARAMETERS */}
        <Frame label="ORBITAL PARAMETERS" meta="REF · NASA EXOPLANET ARCHIVE" status="data">
          <Field label="Period" value="4.23 d" status="nominal" />
          <Field label="Amplitude (K)" value="56.0 m/s" status="nominal" />
          <Field label="Systemic velocity" value="-33.2 km/s" />
          <Field label="Eccentricity" value="0.013" />
          <Field label="Semi-major axis" value="0.052 AU" />
          <Field label="Discovery year" value="1995" />
        </Frame>

        {/* HOST STAR */}
        <Frame label="HOST · 51 PEGASI" meta="HD 217014" status="data">
          <Field label="Spectral type" value="G2 IV" />
          <Field label="Effective temp" value="5793 K" />
          <Field label="Radius (☉)" value="1.27" />
          <Field label="Mass (☉)" value="1.11" />
          <Field label="Distance" value="50.9 ly" />
          <Field label="Apparent mag" value="5.49" />
        </Frame>

        {/* MISSION NOTES — spans full width */}
        <Frame
          label="MISSION LOG · DISCOVERY"
          meta="1995-10-06 · MAYOR/QUELOZ"
          status="data"
          className="lg:col-span-2"
        >
          <div className="space-y-3 text-[0.78rem] leading-relaxed text-white/80">
            <p>
              <span style={{ color: STATUS.nominal }}>[T+0000]</span> ELODIE spectrograph at Haute-Provence
              Observatory acquires first usable radial-velocity measurement of 51 Pegasi. Doppler-shift
              method targeting Sun-like main-sequence stars for substellar companions.
            </p>
            <p>
              <span style={{ color: STATUS.warning }}>[T+0142]</span> Periodic Doppler signal detected.
              Period 4.23 days. Amplitude 56 m/s. Inferred minimum mass ≈ 0.46 Mⱼ. Orbital separation 0.052 AU
              — interior to Mercury. No model of planet formation predicts this configuration.
            </p>
            <p>
              <span style={{ color: STATUS.nominal }}>[T+0179]</span> Result announced 6 October 1995 at the
              9th Cambridge Workshop on Cool Stars in Florence. Independent confirmation by Marcy &amp; Butler
              within four days. <span className="text-white">FIRST CONFIRMED EXOPLANET AROUND A MAIN-SEQUENCE STAR.</span>
            </p>
            <p className="text-white/55 text-[0.7rem] mt-4">
              Nobel Prize in Physics — Mayor &amp; Queloz, 2019. Method has since identified &gt; 1,000 confirmed
              planets via Doppler signature.
            </p>
          </div>
        </Frame>
      </div>

      {/* FOOTER */}
      <div className="mx-auto max-w-7xl mt-8 flex justify-between text-[0.58rem] uppercase tracking-[0.25em] text-white/40">
        <span>END OF FRAME</span>
        <span>EOT · {nowFrame()}</span>
      </div>
    </div>
  );
}
