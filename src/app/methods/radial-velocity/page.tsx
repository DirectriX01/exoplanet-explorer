"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import VelocityCurve from "@/components/charts/VelocityCurve";
import { getMethodBySlug } from "@/data/methods";
import rvData from "@/data/51pegb-rv.json";

const WobbleScene = dynamic(
  () => import("@/components/three/WobbleScene"),
  { ssr: false, loading: () => <div className="w-full aspect-square max-w-md bg-white/5 rounded-2xl animate-pulse" /> }
);

export default function RadialVelocityPage() {
  const method = getMethodBySlug("radial-velocity")!;

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/methods"
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-white transition-colors mb-8"
          >
            &larr; All Methods
          </Link>

          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium mb-4"
            style={{
              background: `${method.color}15`,
              color: method.color,
              border: `1px solid ${method.color}30`,
            }}
          >
            {method.icon} {method.planetsFound.toLocaleString()} planets found
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {method.name}
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
            {method.description}
          </p>
        </motion.div>

        {/* How it works */}
        <motion.section
          className="mt-16 rounded-2xl border border-white/5 bg-[#0a0520]/40 p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-semibold text-white mb-4">
            How It Works
          </h2>
          <p className="text-slate-400 leading-relaxed max-w-3xl">
            {method.howItWorks}
          </p>
        </motion.section>

        {/* 3D + Chart */}
        <motion.section
          className="mt-12 rounded-2xl border border-white/5 bg-[#0a0520]/40 p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center">
              <WobbleScene amplitude={0.3} />
              <p className="text-xs text-slate-500 mt-2">
                Watch the star wobble as the planet orbits.
                <span className="ml-1 text-blue-400">Blue</span> = approaching,{" "}
                <span className="text-red-400">Red</span> = receding
              </p>
            </div>
            <div>
              <VelocityCurve
                fitData={rvData.data}
                observedData={rvData.observed_points}
                label="51 Pegasi b — Radial Velocity"
                color="#6366f1"
              />
              <p className="text-xs text-slate-500 mt-3">
                The smooth curve is the orbital fit. Dots with error bars are
                the actual measurements from the ELODIE spectrograph at
                Haute-Provence Observatory.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Discovery Story */}
        <motion.section
          className="mt-12 rounded-2xl border border-indigo-500/10 bg-indigo-500/5 p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-3">
            Discovery Story
          </p>
          <h2 className="text-2xl font-semibold text-white mb-4">
            51 Pegasi b — The Planet That Changed Everything
          </h2>
          <div className="text-slate-300 space-y-3 leading-relaxed">
            <p>
              In October 1995, Michel Mayor and Didier Queloz announced they
              had found a planet orbiting the sun-like star 51 Pegasi — the
              first confirmed exoplanet around a main-sequence star. The
              discovery was met with both excitement and disbelief.
            </p>
            <p>
              The planet was a shock: a gas giant half the mass of Jupiter,
              but orbiting its star every 4.2 days — far closer than Mercury
              is to our Sun. Dubbed a &ldquo;hot Jupiter,&rdquo; it defied all
              existing theories of planet formation and opened an entirely new
              field of astronomy.
            </p>
            <p>
              Mayor and Queloz were awarded the 2019 Nobel Prize in Physics
              for this discovery. The radial velocity technique they
              pioneered has since found over 1,000 exoplanets.
            </p>
          </div>
          <Link
            href="/catalog/51-peg-b"
            className="mt-6 inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View 51 Pegasi b in catalog &rarr;
          </Link>
        </motion.section>
      </div>
    </div>
  );
}
