"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { methods } from "@/data/methods";

function Counter({ end, label }: { end: number; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="text-center">
      <motion.div
        className="text-4xl md:text-5xl font-bold text-white font-mono"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        {inView ? (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {end.toLocaleString()}+
          </motion.span>
        ) : (
          "0"
        )}
      </motion.div>
      <div className="mt-2 text-sm text-slate-400">{label}</div>
    </div>
  );
}

const methodIcons: Record<string, string> = {
  transit: "◐",
  "radial-velocity": "〰",
  "direct-imaging": "◉",
  microlensing: "◎",
  astrometry: "✦",
};

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-16">
        <motion.div
          className="max-w-4xl text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.p
            className="mb-4 text-sm font-mono uppercase tracking-[0.3em] text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            An Interactive Journey
          </motion.p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight">
            <span className="text-white">How We Find </span>
            <span className="text-gradient">Worlds</span>
            <br />
            <span className="text-white">Beyond Our Own</span>
          </h1>
          <motion.p
            className="mx-auto mt-8 max-w-2xl text-lg md:text-xl text-slate-400 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Explore the ingenious methods scientists use to detect planets
            orbiting distant stars — featuring real data from NASA&apos;s
            greatest discoveries.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Link
              href="/methods"
              className="group relative inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-[#030014] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              Explore Methods
              <span className="ml-2 transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
            <Link
              href="/catalog"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 px-8 text-sm font-medium text-white transition-all hover:bg-white/5 hover:border-white/20"
            >
              Browse Catalog
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-slate-500 text-xs"
          >
            <span>Scroll to explore</span>
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
              <rect
                x="1"
                y="1"
                width="14"
                height="22"
                rx="7"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <motion.circle
                cx="8"
                cy="8"
                r="2"
                fill="currentColor"
                animate={{ cy: [8, 14, 8] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative py-20 px-6">
        <div className="mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-8">
          <Counter end={5800} label="Confirmed Exoplanets" />
          <Counter end={5} label="Detection Methods" />
          <Counter end={4400} label="Planetary Systems" />
          <Counter end={30} label="Years of Discovery" />
        </div>
      </section>

      {/* Methods Preview */}
      <section className="relative py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Five Ways to Find a Planet
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Each method reveals different types of worlds using different
              physics — from blocking starlight to bending spacetime.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {methods.map((method, i) => (
              <motion.div
                key={method.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  href={`/methods/${method.slug}`}
                  className="group flex items-start gap-4 rounded-2xl border border-white/5 bg-[#0a0520]/40 backdrop-blur-sm p-5 transition-all duration-300 hover:border-white/10 hover:bg-[#0a0520]/60"
                >
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xl"
                    style={{
                      background: `${method.color}15`,
                      color: method.color,
                    }}
                  >
                    {methodIcons[method.slug] || method.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm group-hover:text-gradient transition-colors">
                      {method.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {method.description}
                    </p>
                    <span
                      className="mt-2 inline-block text-[10px] font-mono"
                      style={{ color: method.color }}
                    >
                      {method.planetsFound.toLocaleString()} planets &rarr;
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured discovery */}
      <section className="relative py-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-mono uppercase tracking-[0.2em] text-amber-500 mb-4">
              Featured Discovery
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The TRAPPIST-1 System
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Seven Earth-sized worlds orbiting an ultra-cool red dwarf star
              just 40 light-years away. Three of them sit in the habitable
              zone where liquid water could exist. Discovered using the
              transit method — by watching tiny dips in starlight as each
              planet crosses in front of its star.
            </p>
            <Link
              href="/methods/transit"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-6 py-3 text-sm font-medium text-amber-400 transition-all hover:bg-amber-500/10 hover:border-amber-500/30"
            >
              See how transits work
              <span>&rarr;</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-12 px-6">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            Data sourced from{" "}
            <a
              href="https://exoplanetarchive.ipac.caltech.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              NASA Exoplanet Archive
            </a>
          </p>
          <p>
            Built for education and wonder. Not affiliated with NASA.
          </p>
        </div>
      </footer>
    </>
  );
}
