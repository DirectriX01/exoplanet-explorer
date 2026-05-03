"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import CinemaShell, { useCinemaProgress } from "@/components/cinema/CinemaShell";
import Act from "@/components/cinema/Act";
import LightCurve from "@/components/charts/LightCurve";
import { TransitSceneContent } from "@/components/three/TransitScene";
import { Slider, LabPanel, Readout } from "@/components/interactive/LabControls";
import trappist1Data from "@/data/trappist1-lightcurve.json";
import { rangeProgress } from "@/lib/scroll";

const Backdrop = dynamic(() => import("@/components/cinema/Backdrop"));

const STAR_RADIUS = 1.5;
const TRAPPIST_B_DEPTH = 0.0072;

/** Bridges scroll progress to scene props. */
function SceneStage({ planetRadius }: { planetRadius: number }) {
  const progress = useCinemaProgress();
  // During Act III (after 66%), slow the orbit so the user can study it
  const speed = progress < 0.66 ? 0.6 : 0.25;
  return (
    <TransitSceneContent
      planetRadius={planetRadius}
      speed={speed}
      progress={progress}
    />
  );
}

function generateLightCurve(radius: number) {
  const points: { time: number; flux: number }[] = [];
  const depth = (radius * radius) / (STAR_RADIUS * STAR_RADIUS);
  const ingress = 0.3;
  for (let t = -0.8; t <= 0.8; t += 0.02) {
    let f = 1.0;
    const a = Math.abs(t);
    if (a < ingress - 0.05) f = 1 - depth;
    else if (a < ingress + 0.05) f = 1 - depth * (1 - (a - (ingress - 0.05)) / 0.1);
    points.push({ time: t, flux: f + (Math.random() - 0.5) * 0.0008 });
  }
  return points;
}

export default function TransitPage() {
  const [planetRadius, setPlanetRadius] = useState(0.15);
  const labCurve = useMemo(() => generateLightCurve(planetRadius), [planetRadius]);
  const depthPct = ((planetRadius * planetRadius) / (STAR_RADIUS * STAR_RADIUS)) * 100;

  return (
    <article className="relative">
      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-center px-5 sm:px-10 md:px-16">
        <Backdrop />
        <div className="relative max-w-4xl">
          <motion.p
            className="mono text-[0.72rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            § Method 01 — The Transit
          </motion.p>
          <motion.h1
            className="display-italic text-[var(--paper)] leading-[0.92] tracking-tight mb-8"
            style={{ fontSize: "var(--t-hero)" }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            How starlight tells us
            <br />
            a world is there
          </motion.h1>
          <motion.p
            className="text-[var(--paper-dim)] max-w-2xl leading-relaxed"
            style={{ fontSize: "1.1rem" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            More than four thousand worlds have been found by watching their stars
            blink — a periodic, predictable dimming that happens only when a planet
            crosses our line of sight. Scroll through the geometry.
          </motion.p>
          <motion.div
            className="mt-12 mono text-[0.7rem] uppercase tracking-[0.2em] text-[var(--mist)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            ↓ scroll
          </motion.div>
        </div>
      </section>

      {/* THE CINEMA */}
      <CinemaShell
        height="380svh"
        cameraPosition={[0, 1.2, 6]}
        cameraFov={50}
        scene={<SceneStage planetRadius={planetRadius} />}
      >
        <Act start={0.0} end={0.34} position="right">
          <div className="rounded-2xl bg-[var(--ink)]/65 backdrop-blur-md p-6 sm:p-8 border border-white/[0.04]">
            <p className="mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-4">
              Act I — The Geometry
            </p>
            <h2
              className="display text-[var(--paper)] leading-[1.05] mb-4"
              style={{ fontSize: "var(--t-section)" }}
            >
              A planet, an orbit, a line of sight.
            </h2>
            <p className="text-[var(--paper-dim)] leading-relaxed">
              Every planet traces an orbit around its star. If that orbit happens
              to be aligned with us — edge-on — the planet sweeps in front of the
              star on every pass.
            </p>
          </div>
        </Act>

        <Act start={0.34} end={0.66} position="bottom">
          <div className="rounded-2xl bg-[var(--ink)]/65 backdrop-blur-md p-6 sm:p-8 border border-white/[0.04] max-w-3xl mx-auto">
            <p className="mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-4">
              Act II — The Signal
            </p>
            <h2
              className="display text-[var(--paper)] leading-[1.05] mb-4"
              style={{ fontSize: "var(--t-section)" }}
            >
              The star dims, by a precise amount.
            </h2>
            <p className="text-[var(--paper-dim)] leading-relaxed mb-6">
              The depth of the dip tells you the planet's size relative to the
              star. Spitzer captured this signal from TRAPPIST-1 b — about 0.72%,
              repeating every 1.5 days.
            </p>
            <LightCurve
              data={trappist1Data.planets.b.data}
              label="TRAPPIST-1 b · real Spitzer photometry"
              color="var(--ember)"
            />
          </div>
        </Act>

        <Act start={0.66} end={1.0} position="right" interactive>
          <LabPanel title="Act III — The Lab" className="w-[88vw] sm:w-[420px]">
            <Slider
              label="Planet radius"
              min={0.05}
              max={0.5}
              step={0.005}
              value={planetRadius}
              onChange={setPlanetRadius}
              format={(v) => `${(v / 0.15).toFixed(2)}× Earth`}
            />
            <div className="space-y-2.5">
              <Readout label="Transit depth" value={`${depthPct.toFixed(2)} %`} emphasis />
              <Readout
                label="vs TRAPPIST-1 b"
                value={
                  Math.abs(depthPct / (TRAPPIST_B_DEPTH * 100) - 1) < 0.12
                    ? "≈ MATCH"
                    : depthPct / (TRAPPIST_B_DEPTH * 100) > 1
                      ? `${(depthPct / (TRAPPIST_B_DEPTH * 100)).toFixed(1)}× deeper`
                      : `${(TRAPPIST_B_DEPTH * 100 / depthPct).toFixed(1)}× shallower`
                }
              />
            </div>
            <LightCurve
              data={labCurve}
              label="Your simulated transit"
              color="var(--ember)"
            />
          </LabPanel>
        </Act>
      </CinemaShell>

      {/* DISCOVERY STORY (article) */}
      <section className="relative py-28 sm:py-36 px-5 sm:px-10 md:px-16 border-t border-white/[0.05]">
        <div className="max-w-[64ch] mx-auto">
          <p className="mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-8">
            § Discovery Story
          </p>
          <h2
            className="display-italic text-[var(--paper)] leading-[1.05] mb-10"
            style={{ fontSize: "var(--t-display)" }}
          >
            From a 1999 hint to seven Earth-sized worlds.
          </h2>
          <p
            className="drop-cap text-[var(--paper)]"
            style={{ fontSize: "1.15rem", lineHeight: 1.75 }}
          >
            The first transiting exoplanet was caught in 1999 by David Charbonneau and Greg Henry — a gas giant called HD 209458 b whose 1.7% dimming was visible from a small backyard-class telescope. It was proof of concept: an Earth-sized telescope could find Earth-sized worlds if the geometry cooperated.
          </p>
          <p className="mt-6 text-[var(--paper-dim)]" style={{ fontSize: "1.05rem", lineHeight: 1.75 }}>
            NASA's Kepler mission, launched 2009, stared at a single patch of sky for four years and watched 150,000 stars at once. It returned thousands of confirmed planets and pushed the technique to its physical limit — picking out Earth-sized worlds in habitable orbits around Sun-like stars.
          </p>
          <p className="mt-6 text-[var(--paper-dim)]" style={{ fontSize: "1.05rem", lineHeight: 1.75 }}>
            The TRAPPIST-1 system, found in 2016 by a small 60 cm telescope in Chile, remains the cleanest demonstration of what transits can do: seven rocky planets, three in the habitable zone, all detected through repeating dips in the light of a single dim red dwarf 40 light-years away.
          </p>
          <Link
            href="/catalog/trappist-1-b"
            className="mt-12 inline-flex items-center gap-2 ember-link mono text-[0.78rem] uppercase tracking-wider"
          >
            See TRAPPIST-1 b →
          </Link>
        </div>
      </section>
    </article>
  );
}
