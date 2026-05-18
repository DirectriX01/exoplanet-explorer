"use client";

import { useState, useMemo, useRef, type RefObject } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import CinemaShell, { useCinemaProgress } from "@/components/cinema/CinemaShell";
import Act from "@/components/cinema/Act";
import LightCurve from "@/components/charts/LightCurve";
import { TransitSceneContent } from "@/components/three/TransitScene";
import { Slider, LabPanel, Readout } from "@/components/interactive/LabControls";
import trappist1Data from "@/data/trappist1-lightcurve.json";

const STAR_RADIUS = 1.5;
const TRAPPIST_B_DEPTH = 0.0072;

/** Bridges scroll progress to scene props. */
function SceneStage({
  planetRadius,
  phaseRef,
}: {
  planetRadius: number;
  phaseRef: RefObject<number>;
}) {
  const progress = useCinemaProgress();
  // During Act III (after 66%), slow the orbit so the user can study it
  const speed = progress < 0.66 ? 0.6 : 0.25;
  // Shift the scene leftward as the lab panel slides in on the right, so the
  // planet's full orbit stays visible instead of disappearing behind the panel.
  const actIIIp = Math.max(0, Math.min(1, (progress - 0.66) / 0.34));
  const offsetX = -2.6 * actIIIp;
  return (
    <group position={[offsetX, 0, 0]}>
      <TransitSceneContent
        planetRadius={planetRadius}
        speed={speed}
        progress={progress}
        onPhase={(p) => { phaseRef.current = p; }}
      />
    </group>
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
  const phaseRef = useRef(0);
  const labCurve = useMemo(() => generateLightCurve(planetRadius), [planetRadius]);
  const depthPct = ((planetRadius * planetRadius) / (STAR_RADIUS * STAR_RADIUS)) * 100;

  return (
    <article className="relative">
      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-center px-5 sm:px-10 md:px-16">
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
            We just wait
            <br />
            for the star
            <br />
            to blink.
          </motion.h1>
          <motion.p
            className="text-[var(--paper-dim)] max-w-2xl leading-relaxed"
            style={{ fontSize: "1.1rem" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            More than four thousand planets, all spotted this way. The trick
            is that a planet passing in front of its star dims the brightness
            by a tiny amount. Watch long enough and the dip repeats. Scroll.
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
        scene={<SceneStage planetRadius={planetRadius} phaseRef={phaseRef} />}
      >
        <Act start={0.0} end={0.34} position="right">
          <div className="rounded-2xl bg-[var(--ink-2)]/95 sm:bg-[var(--ink-2)]/75 backdrop-blur-xl p-6 sm:p-8 border border-white/[0.06]">
            <p className="mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-4">
              Act I — The Geometry
            </p>
            <h2
              className="display text-[var(--paper)] leading-[1.05] mb-4"
              style={{ fontSize: "var(--t-section)" }}
            >
              A planet, an orbit, our point of view.
            </h2>
            <p className="text-[var(--paper-dim)] leading-relaxed">
              Every planet goes around its star. If that orbit happens to line
              up with us, edge-on, the planet will pass in front of the star
              once every loop. Most planets don't line up with us at all. The
              ones that do are the ones we find.
            </p>
          </div>
        </Act>

        <Act start={0.34} end={0.66} position="bottom">
          <div className="rounded-2xl bg-[var(--ink-2)] sm:bg-[var(--ink-2)]/75 backdrop-blur-xl p-5 sm:p-8 border border-white/[0.06] max-w-3xl mx-auto">
            <p className="mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-4">
              Act II — The Signal
            </p>
            <h2
              className="display text-[var(--paper)] leading-[1.05] mb-4"
              style={{ fontSize: "var(--t-section)" }}
            >
              The star dims, by exactly the right amount.
            </h2>
            <p className="text-[var(--paper-dim)] leading-relaxed mb-6">
              How deep the dip goes tells us how big the planet is compared to
              the star. The chart below is the real signal NASA's Spitzer
              telescope picked up from TRAPPIST-1 b. About 0.72% drop in
              brightness, happening every 1.5 days like clockwork.
            </p>
            <LightCurve
              data={trappist1Data.planets.b.data}
              label="TRAPPIST-1 b · real Spitzer photometry"
              color="var(--ember)"
              phaseRef={phaseRef}
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
              phaseRef={phaseRef}
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
            From a hint in 1999 to seven Earth-sized worlds.
          </h2>
          <p
            className="drop-cap text-[var(--paper)]"
            style={{ fontSize: "1.15rem", lineHeight: 1.75 }}
          >
            The first one we caught this way was in 1999. Two astronomers, David Charbonneau and Greg Henry, watched a star called HD 209458 dim by about 1.7%. The wild part is the telescope was small enough that an amateur in their backyard could do it. They proved the whole thing was possible.
          </p>
          <p className="mt-6 text-[var(--paper-dim)]" style={{ fontSize: "1.05rem", lineHeight: 1.75 }}>
            Then NASA went big. The Kepler mission launched in 2009 and stared at one patch of sky for four years, tracking 150,000 stars at the same time. It found thousands of planets, including ones the size of Earth.
          </p>
          <p className="mt-6 text-[var(--paper-dim)]" style={{ fontSize: "1.05rem", lineHeight: 1.75 }}>
            The TRAPPIST-1 system came in 2016. A tiny 60 centimeter telescope in Chile caught the signal from a small red star 40 light years away. Seven Earth-sized planets, three of them at the right distance for liquid water. All found by watching the star flicker.
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
