"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import LightCurve from "@/components/charts/LightCurve";
import trappist1Data from "@/data/trappist1-lightcurve.json";
import { Slider, LabPanel, Readout } from "./LabControls";

const TransitScene = dynamic(() => import("@/components/three/TransitScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square max-w-md bg-[var(--ink-2)] rounded-lg animate-pulse" />
  ),
});

const STAR_RADIUS = 1.5;
const TRAPPIST_B_DEPTH = 0.0072; // ≈7200 ppm in normalized flux

function generateLightCurve(radius: number) {
  const points: { time: number; flux: number }[] = [];
  const transitDepth = (radius * radius) / (STAR_RADIUS * STAR_RADIUS);
  const ingressDuration = 0.3;

  for (let t = -0.8; t <= 0.8; t += 0.02) {
    let flux = 1.0;
    const absT = Math.abs(t);
    if (absT < ingressDuration - 0.05) {
      flux = 1.0 - transitDepth;
    } else if (absT < ingressDuration + 0.05) {
      const frac = (absT - (ingressDuration - 0.05)) / 0.1;
      flux = 1.0 - transitDepth * (1 - frac);
    }
    flux += (Math.random() - 0.5) * 0.0008;
    points.push({ time: t, flux });
  }
  return points;
}

export default function TransitSimulator() {
  const [planetRadius, setPlanetRadius] = useState(0.15);
  const phaseRef = useRef(0);
  const lightCurveData = useMemo(() => generateLightCurve(planetRadius), [planetRadius]);
  const depthPct = ((planetRadius * planetRadius) / (STAR_RADIUS * STAR_RADIUS)) * 100;
  const sizeVsTrappist = ((planetRadius * planetRadius) / (STAR_RADIUS * STAR_RADIUS)) / TRAPPIST_B_DEPTH;
  const matchesTrappist = Math.abs(sizeVsTrappist - 1) < 0.12;

  const setEarth = useCallback(() => setPlanetRadius(0.15), []);
  const setTrappistB = useCallback(() => setPlanetRadius(STAR_RADIUS * Math.sqrt(TRAPPIST_B_DEPTH)), []);
  const setJupiter = useCallback(() => setPlanetRadius(0.5), []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 items-center">
      <div className="flex flex-col items-center">
        <TransitScene
          planetRadius={planetRadius}
          onPhase={(p) => { phaseRef.current = p; }}
        />
        <p className="mt-3 mono text-[0.68rem] uppercase tracking-[0.2em] text-[var(--mist)]">
          Drag to rotate
        </p>
      </div>

      <LabPanel title="The Lab · drag, watch, compare">
        <Slider
          label="Planet radius (relative)"
          min={0.05}
          max={0.5}
          step={0.005}
          value={planetRadius}
          onChange={setPlanetRadius}
          format={(v) => `${(v / 0.15).toFixed(2)}× Earth`}
        />

        <div className="flex gap-2 -mt-1">
          {[
            { label: "Earth", action: setEarth },
            { label: "TRAPPIST-1 b", action: setTrappistB },
            { label: "Jupiter", action: setJupiter },
          ].map((p) => (
            <button
              key={p.label}
              onClick={p.action}
              className="mono text-[0.65rem] uppercase tracking-wider text-[var(--mist)] hover:text-[var(--ember)] transition-colors border border-white/[0.06] hover:border-[var(--ember)]/50 rounded-full px-3 py-1.5"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="pt-4 border-t border-white/[0.05] space-y-2.5">
          <Readout label="Transit depth" value={`${depthPct.toFixed(2)} %`} emphasis />
          <Readout label="Size vs star" value={`${(planetRadius / STAR_RADIUS * 100).toFixed(1)} %`} />
          <Readout
            label="vs TRAPPIST-1 b"
            value={
              matchesTrappist
                ? "≈ MATCH"
                : sizeVsTrappist > 1
                  ? `${sizeVsTrappist.toFixed(1)}× deeper`
                  : `${(1 / sizeVsTrappist).toFixed(1)}× shallower`
            }
            emphasis={matchesTrappist}
          />
        </div>

        <div className="pt-2">
          <LightCurve
            data={lightCurveData}
            label={`Yours — depth ${depthPct.toFixed(2)}% · ghost overlay: TRAPPIST-1 b`}
            color="var(--ember)"
            phaseRef={phaseRef}
          />
          {/* Ghost overlay: faint trace of real TRAPPIST-1 b */}
          <div className="-mt-[300px] pointer-events-none opacity-30">
            <LightCurve
              data={trappist1Data.planets.b.data}
              label=""
              color="#f4ecdc"
            />
          </div>
        </div>
      </LabPanel>
    </div>
  );
}
