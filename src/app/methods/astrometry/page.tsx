"use client";

import { useRef } from "react";
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
  const phaseRef = useRef(0);

  return (
    <article className="relative px-5 sm:px-10 md:px-16">
     <div className="max-w-6xl mx-auto">
      <section className="relative min-h-[80svh] flex items-center pt-20">
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
            The star
            <br />
            wiggles
            <br />
            on the sky.
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

      <section className="relative py-20 sm:py-28">
        <div className="max-w-[64ch]">
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

      <section className="relative py-20 sm:py-28 border-t border-white/[0.05]">
        <div>
          <p className="mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-10">
            § The Signal — wobble on the sky
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center">
              <AstrometryScene onPhase={(p) => { phaseRef.current = p; }} />
              <p className="mt-4 mono text-[0.66rem] uppercase tracking-[0.18em] text-[var(--mist)] text-center max-w-xs">
                The star traces a wobbly path against background stars. The wobble is the planet pulling it in a small counter-orbit.
              </p>
            </div>
            <div>
              <PositionTrace phaseRef={phaseRef} />
              <p className="mt-4 text-[var(--paper-dim)] text-sm leading-relaxed">
                Right Ascension vs Declination over time. The overall drift is the star's proper motion; the small oscillation riding on top is the planet's gravitational signature — microarcseconds across years.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 border-t border-white/[0.05]">
        <div className="max-w-[64ch]">
          <p className="mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-6">
            § Why so rare?
          </p>
          <p className="text-[var(--paper-dim)]" style={{ fontSize: "1.05rem", lineHeight: 1.75 }}>
            Only a few planets have actually been found this way. The wobbles are stupidly small. We're talking the equivalent of spotting a coin on the moon from earth. The European Space Agency's Gaia mission has been mapping two billion stars since 2013 with exactly this precision. It's expected to drop thousands of new planets on us when the data finishes processing.
          </p>
        </div>
      </section>

      <section className="relative py-28 border-t border-white/[0.05]">
        <div className="max-w-[64ch]">
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
            In 2010, Matthew Muterspaugh's team at the Palomar telescope reported a Jupiter-sized planet around a nearby pair of stars called HD 176051. They got there by tracking the positions of those two stars relative to each other for years.
          </p>
          <p className="mt-6 text-[var(--paper-dim)]" style={{ fontSize: "1.05rem", lineHeight: 1.75 }}>
            This was one of the first solid finds using astrometry. Astronomers had been dreaming of pulling this off for over a century. As our instruments keep getting better, this method will probably catch planets the other tricks miss. Including, eventually, real Earth twins around the closest stars.
          </p>
          <Link
            href="/catalog/hd-176051-b"
            className="mt-12 inline-flex items-center gap-2 ember-link mono text-[0.78rem] uppercase tracking-wider"
          >
            See HD 176051 b →
          </Link>
        </div>
      </section>
     </div>
    </article>
  );
}
