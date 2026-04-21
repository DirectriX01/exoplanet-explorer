"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import PositionTrace from "@/components/charts/PositionTrace";
import { getMethodBySlug } from "@/data/methods";

const AstrometryScene = dynamic(
  () => import("@/components/three/AstrometryScene"),
  { ssr: false, loading: () => <div className="w-full aspect-square max-w-md bg-white/5 rounded-2xl animate-pulse" /> }
);

export default function AstrometryPage() {
  const method = getMethodBySlug("astrometry")!;

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
              <AstrometryScene />
              <p className="text-xs text-slate-500 mt-2">
                The bright star traces a wobbly path across the sky. The wobble
                is caused by an unseen planet pulling it in a tiny circle.
              </p>
            </div>
            <div>
              <PositionTrace />
              <p className="text-xs text-slate-500 mt-3">
                This chart plots the star&apos;s position on the sky over time.
                The overall drift is proper motion; the oscillation around that
                path is the planet&apos;s gravitational signature.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Why so rare */}
        <motion.section
          className="mt-12 rounded-2xl border border-white/5 bg-[#0a0520]/40 p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-semibold text-white mb-4">
            Why So Few Discoveries?
          </h2>
          <div className="text-slate-400 space-y-3 leading-relaxed">
            <p>
              Only a handful of planets have been confirmed via astrometry.
              The reason is precision: detecting the wobble requires measuring
              star positions to within millionths of an arcsecond — like
              spotting a coin on the Moon from Earth.
            </p>
            <p>
              The ESA&apos;s Gaia mission, launched in 2013, is changing this. By
              mapping the precise positions and motions of over a billion
              stars, Gaia is expected to reveal thousands of planets through
              astrometric wobbles — a revolution in this oldest but most
              technically demanding detection method.
            </p>
          </div>
        </motion.section>

        {/* Discovery Story */}
        <motion.section
          className="mt-12 rounded-2xl border border-violet-500/10 bg-violet-500/5 p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-mono uppercase tracking-wider text-violet-400 mb-3">
            Discovery Story
          </p>
          <h2 className="text-2xl font-semibold text-white mb-4">
            HD 176051 b — Wobble on the Sky
          </h2>
          <div className="text-slate-300 space-y-3 leading-relaxed">
            <p>
              In 2010, astronomers at the Palomar Observatory reported
              detecting a Jupiter-mass planet orbiting the nearby star
              HD 176051, using years of precise position measurements.
              The star&apos;s tiny wobble — invisible to the naked eye but
              measurable with cutting-edge instruments — revealed a planet
              in a 600-day orbit.
            </p>
            <p>
              This was one of the first reliable astrometric detections,
              validating a technique that astronomers had dreamed about for
              over a century. As precision improves, astrometry promises to
              find planets that other methods miss — including true Earth
              analogs around the nearest stars.
            </p>
          </div>
          <Link
            href="/catalog/hd-176051-b"
            className="mt-6 inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
          >
            View HD 176051 b in catalog &rarr;
          </Link>
        </motion.section>
      </div>
    </div>
  );
}
