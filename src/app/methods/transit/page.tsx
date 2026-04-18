"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import LightCurve from "@/components/charts/LightCurve";
import { getMethodBySlug } from "@/data/methods";
import trappist1Data from "@/data/trappist1-lightcurve.json";

const TransitSimulator = dynamic(
  () => import("@/components/interactive/TransitSimulator"),
  { ssr: false }
);

export default function TransitPage() {
  const method = getMethodBySlug("transit")!;

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Hero */}
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

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                title: "Planet orbits its star",
                desc: "Every exoplanet traces an orbit around its host star. If the orbit is aligned with our line of sight, the planet will periodically pass between us and the star.",
              },
              {
                step: "2",
                title: "Starlight dims during transit",
                desc: "As the planet crosses the star's face, it blocks a fraction of the starlight. The amount blocked depends on the planet's size relative to the star.",
              },
              {
                step: "3",
                title: "Pattern repeats each orbit",
                desc: "By detecting repeating dips at regular intervals, scientists confirm the planet's existence and measure its orbital period and size.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl bg-white/5 p-5"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mb-3"
                  style={{
                    background: `${method.color}20`,
                    color: method.color,
                  }}
                >
                  {item.step}
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Real Data */}
        <motion.section
          className="mt-12 rounded-2xl border border-white/5 bg-[#0a0520]/40 p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-semibold text-white mb-2">
            Real Data: TRAPPIST-1 System
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            Light curves from the TRAPPIST-1 system showing transits of three
            of its seven Earth-sized planets. Each planet creates a different
            depth of dip based on its size.
          </p>

          <div className="space-y-6">
            {(["b", "d", "e"] as const).map((planet) => {
              const pData = trappist1Data.planets[planet];
              return (
                <div key={planet}>
                  <LightCurve
                    data={pData.data}
                    label={`TRAPPIST-1 ${planet} (depth: ${pData.depth_ppm} ppm, period: ${pData.period_days} days)`}
                    color={
                      planet === "b"
                        ? "#f59e0b"
                        : planet === "d"
                          ? "#fb923c"
                          : "#f97316"
                    }
                  />
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Interactive */}
        <motion.section
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <TransitSimulator />
        </motion.section>

        {/* Discovery Story */}
        <motion.section
          className="mt-12 rounded-2xl border border-amber-500/10 bg-amber-500/5 p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-mono uppercase tracking-wider text-amber-500 mb-3">
            Discovery Story
          </p>
          <h2 className="text-2xl font-semibold text-white mb-4">
            The TRAPPIST-1 System
          </h2>
          <div className="text-slate-300 space-y-3 leading-relaxed">
            <p>
              In 2016, astronomers using the TRAPPIST telescope in Chile
              discovered three Earth-sized planets orbiting an ultra-cool red
              dwarf star just 40 light-years away. Follow-up observations
              with NASA&apos;s Spitzer Space Telescope revealed four more — making
              it the largest system of Earth-sized worlds ever found.
            </p>
            <p>
              Three of the seven planets orbit in the habitable zone, where
              liquid water could exist. The system has become a prime target
              for the James Webb Space Telescope, which is now characterizing
              their atmospheres for signs of habitability.
            </p>
          </div>
          <Link
            href="/catalog/trappist-1-b"
            className="mt-6 inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors"
          >
            View TRAPPIST-1 b in catalog &rarr;
          </Link>
        </motion.section>
      </div>
    </div>
  );
}
