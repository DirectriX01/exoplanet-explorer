"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import PositionTrace from "@/components/charts/PositionTrace";
import { getMethodBySlug } from "@/data/methods";

const AstrometryScene = dynamic(
  () => import("@/components/three/AstrometryScene"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-square max-w-md bg-[var(--ink-2)] rounded-lg animate-pulse" />
    ),
  }
);

export default function AstrometryPage() {
  const method = getMethodBySlug("astrometry")!;

  return (
    <article className="relative">
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
            § Method 05 — Astrometry · {method.planetsFound.toLocaleString()} planets
          </motion.p>
          <motion.h1
            className="display-italic text-[var(--paper)] leading-[0.95] tracking-tight mb-8"
            style={{ fontSize: "var(--t-hero)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            A star drifts.
            <br />
            But not in a straight line.
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

      <section className="relative py-20 sm:py-28 px-5 sm:px-10 md:px-16 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <p className="mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-10">
            § The Signal — wobble on the sky
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center">
              <AstrometryScene />
              <p className="mt-4 mono text-[0.66rem] uppercase tracking-[0.18em] text-[var(--mist)] text-center max-w-xs">
                The star traces a wobbly path against background stars. The wobble is the planet pulling it in a small counter-orbit.
              </p>
            </div>
            <div>
              <PositionTrace />
              <p className="mt-4 text-[var(--paper-dim)] text-sm leading-relaxed">
                Right Ascension vs Declination over time. The overall drift is the star's proper motion; the small oscillation riding on top is the planet's gravitational signature — microarcseconds across years.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 px-5 sm:px-10 md:px-16 border-t border-white/[0.05]">
        <div className="max-w-[64ch] mx-auto">
          <p className="mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-6">
            § Why so rare?
          </p>
          <p className="text-[var(--paper-dim)]" style={{ fontSize: "1.05rem", lineHeight: 1.75 }}>
            Only a handful of planets have been confirmed by astrometry. Detecting the wobble requires measuring stellar positions to within microarcseconds — like spotting a coin on the Moon from Earth. ESA's Gaia, mapping two billion stars since 2013, is expected to unveil thousands of new planets through their tiny astrometric signatures.
          </p>
        </div>
      </section>

      <section className="relative py-28 px-5 sm:px-10 md:px-16 border-t border-white/[0.05]">
        <div className="max-w-[64ch] mx-auto">
          <p className="mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-8">
            § Discovery Story · 2010-04-19
          </p>
          <h2
            className="display-italic text-[var(--paper)] leading-[1.05] mb-10"
            style={{ fontSize: "var(--t-display)" }}
          >
            HD 176051 b — wobble on the sky.
          </h2>
          <p
            className="drop-cap text-[var(--paper)]"
            style={{ fontSize: "1.15rem", lineHeight: 1.75 }}
          >
            In 2010, Matthew Muterspaugh's team at the Palomar Testbed Interferometer reported a Jupiter-mass planet orbiting the nearby binary HD 176051. The detection came from years of precise interferometric measurements of the two stars' relative positions.
          </p>
          <p className="mt-6 text-[var(--paper-dim)]" style={{ fontSize: "1.05rem", lineHeight: 1.75 }}>
            This was among the first reliable astrometric detections — validating a technique astronomers had dreamed about for over a century. As precision improves, astrometry is poised to find planets other methods miss, including true Earth analogues around the nearest stars.
          </p>
          <Link
            href="/catalog/hd-176051-b"
            className="mt-12 inline-flex items-center gap-2 ember-link mono text-[0.78rem] uppercase tracking-wider"
          >
            See HD 176051 b →
          </Link>
        </div>
      </section>
    </article>
  );
}
