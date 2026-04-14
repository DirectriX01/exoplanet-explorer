"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import LightCurve from "@/components/charts/LightCurve";

const TransitScene = dynamic(
  () => import("@/components/three/TransitScene"),
  { ssr: false, loading: () => <div className="w-full aspect-square max-w-md bg-white/5 rounded-2xl animate-pulse" /> }
);

export default function TransitSimulator() {
  const [planetRadius, setPlanetRadius] = useState(0.15);

  const generateLightCurve = useCallback((radius: number) => {
    const points = [];
    const starRadius = 1.5;
    const transitDepth = (radius * radius) / (starRadius * starRadius);
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

      flux += (Math.random() - 0.5) * 0.001;
      points.push({ time: t, flux });
    }
    return points;
  }, []);

  const lightCurveData = useMemo(
    () => generateLightCurve(planetRadius),
    [planetRadius, generateLightCurve]
  );

  const depthPercent = ((planetRadius * planetRadius) / (1.5 * 1.5) * 100).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/5 bg-[#0a0520]/40 p-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          Interactive Transit Simulator
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          Adjust the planet size and watch how it affects the light curve.
          A larger planet blocks more starlight, creating a deeper dip.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* 3D Scene */}
          <div className="flex flex-col items-center">
            <TransitScene planetRadius={planetRadius} />
            <div className="mt-4 text-center">
              <p className="text-xs text-slate-500">
                Drag to rotate the view
              </p>
            </div>
          </div>

          {/* Controls + Chart */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-slate-300">
                  Planet Radius
                </label>
                <span className="text-sm font-mono text-amber-400">
                  {(planetRadius / 0.15).toFixed(1)}x Earth
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.01"
                value={planetRadius}
                onChange={(e) => setPlanetRadius(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Small (Earth-like)</span>
                <span>Large (Jupiter-like)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/5 p-3">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Transit Depth
                </div>
                <div className="text-lg font-mono font-semibold text-amber-400">
                  {depthPercent}%
                </div>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Size Ratio
                </div>
                <div className="text-lg font-mono font-semibold text-white">
                  {(planetRadius / 1.5 * 100).toFixed(1)}%
                </div>
                <div className="text-[10px] text-slate-500">of star</div>
              </div>
            </div>

            <LightCurve
              data={lightCurveData}
              label={`Simulated Light Curve (depth: ${depthPercent}%)`}
              color="#f59e0b"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
