"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import VelocityCurve from "@/components/charts/VelocityCurve";
import { getMethodBySlug } from "@/data/methods";
import rvData from "@/data/51pegb-rv.json";

const WobbleScene = dynamic(() => import("@/components/three/WobbleScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square max-w-md bg-[var(--ink-2)] rounded-lg animate-pulse" />
  ),
});

export default function RadialVelocityPage() {
  const method = getMethodBySlug("radial-velocity")!;
  const phaseRef = useRef(0);

  return (
    <article className="relative">
      {/* HERO */}
      <section className="relative min-h-[80svh] flex items-center px-5 sm:px-10 md:px-16 pt-20">
        <div className="max-w-4xl">
          <Link
            href="/methods"
            className="mono text-[0.7rem] uppercase tracking-[0.2em] text-[var(--mist)] hover:text-[var(--paper)] transition-colors"
          >
            ← All Methods
          </Link>
          <motion.p
            className="mt-8 mb-6 mono text-[0.72rem] uppercase tracking-[0.3em] text-[var(--ember)]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            § Method 02 — Radial Velocity · {method.planetsFound.toLocaleString()} planets
          </motion.p>
          <motion.h1
            className="display-italic text-[var(--paper)] leading-[0.95] tracking-tight mb-8"
            style={{ fontSize: "var(--t-hero)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            The star wobbles.
            <br />
            We hear it.
          </motion.h1>
          <motion.p
            className="text-[var(--paper-dim)] max-w-2xl leading-relaxed"
            style={{ fontSize: "1.1rem" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.4 }}
          >
            {method.description}
          </motion.p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative py-20 sm:py-28 px-5 sm:px-10 md:px-16">
        <div className="max-w-[64ch] mx-auto">
          <p className="mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-6">
            § How It Works
          </p>
          <p
            className="drop-cap text-[var(--paper)]"
            style={{ fontSize: "1.15rem", lineHeight: 1.75 }}
          >
            {method.howItWorks}
          </p>
        </div>
      </section>

      {/* SCENE + CHART */}
      <section className="relative py-20 sm:py-28 px-5 sm:px-10 md:px-16 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <p className="mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-10">
            § The Signal — 51 Pegasi b
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center">
              <WobbleScene amplitude={0.3} onPhase={(p) => { phaseRef.current = p; }} />
              <p className="mt-4 mono text-[0.66rem] uppercase tracking-[0.18em] text-[var(--mist)] text-center">
                Star illumination shifts <span className="text-[#7eb6ff]">blue</span> when
                approaching, <span className="text-[#ff7e7e]">red</span> when receding
              </p>
            </div>
            <div>
              <VelocityCurve
                fitData={rvData.data}
                observedData={rvData.observed_points}
                label="51 Pegasi b · ELODIE observations"
                color="var(--ember)"
                phaseRef={phaseRef}
              />
              <p className="mt-4 text-[var(--paper-dim)] text-sm leading-relaxed">
                The smooth curve is the orbital fit. Dots with error bars are the actual
                ELODIE measurements that Mayor and Queloz collected at Haute-Provence
                Observatory in 1994-95.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DISCOVERY STORY */}
      <section className="relative py-28 px-5 sm:px-10 md:px-16 border-t border-white/[0.05]">
        <div className="max-w-[64ch] mx-auto">
          <p className="mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-8">
            § Discovery Story · 1995-10-06
          </p>
          <h2
            className="display-italic text-[var(--paper)] leading-[1.05] mb-10"
            style={{ fontSize: "var(--t-display)" }}
          >
            The planet that changed everything.
          </h2>
          <p
            className="drop-cap text-[var(--paper)]"
            style={{ fontSize: "1.15rem", lineHeight: 1.75 }}
          >
            In October 1995, Michel Mayor and Didier Queloz announced they had found a
            planet orbiting the sun-like star 51 Pegasi — the first confirmed exoplanet
            around a main-sequence star. The community met it with excitement and
            disbelief in roughly equal measure.
          </p>
          <p className="mt-6 text-[var(--paper-dim)]" style={{ fontSize: "1.05rem", lineHeight: 1.75 }}>
            The planet was a shock: a gas giant half the mass of Jupiter, but orbiting
            its star every 4.2 days — far closer than Mercury is to our Sun. Dubbed a
            "hot Jupiter," it defied existing theories of planet formation and opened a
            new field of astronomy.
          </p>
          <p className="mt-6 text-[var(--paper-dim)]" style={{ fontSize: "1.05rem", lineHeight: 1.75 }}>
            Mayor and Queloz were awarded the 2019 Nobel Prize in Physics for the
            discovery. The radial-velocity technique they pioneered has since uncovered
            more than a thousand worlds.
          </p>
          <Link
            href="/catalog/51-peg-b"
            className="mt-12 inline-flex items-center gap-2 ember-link mono text-[0.78rem] uppercase tracking-wider"
          >
            See 51 Pegasi b →
          </Link>

          <div className="mt-16 pt-6 border-t border-white/[0.05] mono text-[0.66rem] uppercase tracking-[0.18em] text-[var(--mist)]">
            <Link href="/labs/radial-velocity-nasa" className="hover:text-[var(--paper)] transition-colors">
              ⌜ LABS · View this page in NASA mission-control aesthetic →
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
