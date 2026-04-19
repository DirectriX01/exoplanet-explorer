"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import MicrolensingCurve from "@/components/charts/MicrolensingCurve";
import { getMethodBySlug } from "@/data/methods";

const LensingScene = dynamic(
  () => import("@/components/three/LensingScene"),
  { ssr: false, loading: () => <div className="w-full aspect-square max-w-md bg-white/5 rounded-2xl animate-pulse" /> }
);

export default function MicrolensingPage() {
  const method = getMethodBySlug("microlensing")!;

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
              <LensingScene />
              <p className="text-xs text-slate-500 mt-2">
                Watch the foreground star (with planet) pass in front of the
                background star. The Einstein ring appears during alignment.
              </p>
            </div>
            <div>
              <MicrolensingCurve />
              <p className="text-xs text-slate-500 mt-3">
                The smooth hump is the star&apos;s lensing effect. The sharp spike
                (highlighted in green) is the planet&apos;s signature — a brief,
                extra magnification caused by the planet&apos;s own gravity.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Discovery Story */}
        <motion.section
          className="mt-12 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-3">
            Discovery Story
          </p>
          <h2 className="text-2xl font-semibold text-white mb-4">
            OGLE-2005-BLG-390L b — A Frozen Super-Earth
          </h2>
          <div className="text-slate-300 space-y-3 leading-relaxed">
            <p>
              In 2006, an international team reported the discovery of one of
              the most distant and coldest exoplanets known — a frigid
              super-Earth orbiting a red dwarf star 21,000 light-years away.
              At just 50 Kelvin (&minus;223&deg;C), it&apos;s a frozen world far
              colder than Pluto.
            </p>
            <p>
              The discovery demonstrated microlensing&apos;s unique power: it can
              find planets that are impossible to detect by other methods —
              small worlds in wide orbits around faint, distant stars.
              Unlike transit or radial velocity, microlensing doesn&apos;t require
              the planet&apos;s star to be bright or nearby.
            </p>
          </div>
          <Link
            href="/catalog/ogle-2005-blg-390l-b"
            className="mt-6 inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View in catalog &rarr;
          </Link>
        </motion.section>
      </div>
    </div>
  );
}
