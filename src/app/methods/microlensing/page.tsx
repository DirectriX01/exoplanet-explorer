"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import MicrolensingCurve from "@/components/charts/MicrolensingCurve";
import { getMethodBySlug } from "@/data/methods";

const LensingScene = dynamic(() => import("@/components/three/LensingScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square max-w-md bg-[var(--ink-2)] rounded-lg animate-pulse" />
  ),
});

export default function MicrolensingPage() {
  const method = getMethodBySlug("microlensing")!;
  const phaseRef = useRef(0);

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
            § Method 04 — Microlensing · {method.planetsFound.toLocaleString()} planets
          </motion.p>
          <motion.h1
            className="display-italic text-[var(--paper)] leading-[0.95] tracking-tight mb-8"
            style={{ fontSize: "var(--t-hero)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            Stars passing
            <br />
            in front of stars.
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
            § The Signal — OGLE-2005-BLG-390L b
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center">
              <LensingScene onPhase={(p) => { phaseRef.current = p; }} />
              <p className="mt-4 mono text-[0.66rem] uppercase tracking-[0.18em] text-[var(--mist)] text-center max-w-xs">
                The foreground star and its planet sweep across our line of sight to a background star. Brightness peaks as they align.
              </p>
            </div>
            <div>
              <MicrolensingCurve phaseRef={phaseRef} />
              <p className="mt-4 text-[var(--paper-dim)] text-sm leading-relaxed">
                The smooth hump is the lensing star's signature; the sharp spike riding on top of it — over in hours — is the planet's own gravitational signature. One-shot, never repeats.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-28 px-5 sm:px-10 md:px-16 border-t border-white/[0.05]">
        <div className="max-w-[64ch] mx-auto">
          <p className="mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-8">
            § Discovery Story · 2006-01-26
          </p>
          <h2
            className="display-italic text-[var(--paper)] leading-[1.05] mb-10"
            style={{ fontSize: "var(--t-display)" }}
          >
            A frozen super-Earth, basically across the galaxy.
          </h2>
          <p
            className="drop-cap text-[var(--paper)]"
            style={{ fontSize: "1.15rem", lineHeight: 1.75 }}
          >
            In 2006 an international team caught one of the strangest planets we know about. A world five times the mass of Earth, orbiting a small red dwarf 21,000 light years away. The temperature out there is about 50 Kelvin, which is minus 223 Celsius. Colder than Pluto.
          </p>
          <p className="mt-6 text-[var(--paper-dim)]" style={{ fontSize: "1.05rem", lineHeight: 1.75 }}>
            The really cool part is that no other method could have caught it. The host star is way too faint and far for our other tricks. Microlensing is the only way we even know it exists. We never actually saw the star. We just saw the brief brightening it caused, and the tiny extra spike from its planet.
          </p>
          <Link
            href="/catalog/ogle-2005-blg-390l-b"
            className="mt-12 inline-flex items-center gap-2 ember-link mono text-[0.78rem] uppercase tracking-wider"
          >
            See OGLE-2005-BLG-390L b →
          </Link>
        </div>
      </section>
    </article>
  );
}
