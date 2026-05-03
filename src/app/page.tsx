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
        className="mono text-4xl md:text-5xl text-[var(--paper)] tabular-nums tracking-tight"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {inView ? end.toLocaleString() : "0"}
      </motion.div>
      <div className="mt-2 mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--mist)]">
        {label}
      </div>
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
      {/* HERO */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 sm:px-10 md:px-16 pt-20">
        <motion.div
          className="max-w-5xl text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.p
            className="mb-6 mono text-[0.7rem] uppercase tracking-[0.32em] text-[var(--ember)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            an interactive journey
          </motion.p>
          <h1
            className="display-italic text-[var(--paper)] leading-[0.92] tracking-tight"
            style={{ fontSize: "var(--t-hero)" }}
          >
            How we find
            <br />
            worlds beyond
            <br />
            our own.
          </h1>
          <motion.p
            className="mx-auto mt-10 max-w-2xl text-[var(--paper-dim)] leading-relaxed"
            style={{ fontSize: "1.1rem" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.9 }}
          >
            Five ingenious techniques. Real NASA data. A field guide to the
            methods that revealed thousands of worlds — and the discoveries
            that still feel like science fiction.
          </motion.p>
          <motion.div
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
            <Link
              href="/methods/transit"
              className="group relative inline-flex h-12 items-center justify-center rounded-full bg-[var(--ember)] px-7 mono text-[0.72rem] uppercase tracking-[0.22em] text-[var(--ink)] transition-transform hover:scale-[1.04]"
              style={{ boxShadow: "0 0 40px var(--ember-glow)" }}
            >
              Begin with Transit
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/catalog"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/[0.12] px-7 mono text-[0.72rem] uppercase tracking-[0.22em] text-[var(--paper)] hover:bg-white/[0.04] hover:border-white/[0.2] transition-colors"
            >
              Browse Catalog
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 mono text-[0.65rem] uppercase tracking-[0.3em] text-[var(--mist)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          ↓ scroll
        </motion.div>
      </section>

      {/* STATS */}
      <section className="relative py-24 px-5 sm:px-10 md:px-16">
        <div className="mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-10">
          <Counter end={5800} label="Confirmed worlds" />
          <Counter end={5} label="Methods" />
          <Counter end={4400} label="Planetary systems" />
          <Counter end={30} label="Years of discovery" />
        </div>
      </section>

      {/* METHODS PREVIEW */}
      <section className="relative py-24 px-5 sm:px-10 md:px-16">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-5">
              § The Five Methods
            </p>
            <h2
              className="display-italic text-[var(--paper)] leading-[1.05]"
              style={{ fontSize: "var(--t-display)" }}
            >
              Five ways to find a planet.
            </h2>
            <p className="mt-6 text-[var(--paper-dim)] leading-relaxed">
              Each one exploits different physics — from blocking starlight to
              bending spacetime — and reveals different kinds of worlds.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {methods.map((method, i) => (
              <motion.div
                key={method.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <Link
                  href={`/methods/${method.slug}`}
                  className="group flex items-start gap-5 rounded-2xl border border-white/[0.05] bg-[var(--ink-2)]/55 backdrop-blur-sm p-5 transition-all duration-300 hover:border-[var(--ember)]/40 hover:bg-[var(--ink-2)]/85"
                >
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl"
                    style={{
                      background: `${method.color}1a`,
                      color: method.color,
                    }}
                  >
                    {methodIcons[method.slug] || method.icon}
                  </div>
                  <div>
                    <h3 className="display text-[1.05rem] text-[var(--paper)] group-hover:text-[var(--ember)] transition-colors">
                      {method.name}
                    </h3>
                    <p className="mt-1 text-[0.82rem] text-[var(--mist)] leading-relaxed line-clamp-2">
                      {method.description}
                    </p>
                    <span className="mt-3 inline-block mono text-[0.65rem] uppercase tracking-wider text-[var(--paper-dim)]">
                      {method.planetsFound.toLocaleString()} planets →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED DISCOVERY */}
      <section className="relative py-28 px-5 sm:px-10 md:px-16 border-t border-white/[0.04]">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-5">
              § Featured Discovery
            </p>
            <h2
              className="display-italic text-[var(--paper)] leading-[1.05]"
              style={{ fontSize: "var(--t-display)" }}
            >
              The TRAPPIST-1 System.
            </h2>
            <p className="mt-8 text-[var(--paper-dim)] leading-relaxed max-w-2xl mx-auto">
              Seven Earth-sized worlds orbiting an ultra-cool red dwarf just 40
              light-years away. Three sit in the habitable zone. All found by
              watching tiny, repeating dips in starlight.
            </p>
            <Link
              href="/methods/transit"
              className="mt-10 inline-flex items-center gap-2 ember-link mono text-[0.78rem] uppercase tracking-wider"
            >
              See how transits work →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-white/[0.04] py-12 px-5 sm:px-10 md:px-16">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4 mono text-[0.7rem] uppercase tracking-wider text-[var(--mist)]">
          <p>
            Data from{" "}
            <a
              href="https://exoplanetarchive.ipac.caltech.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="ember-link"
            >
              NASA Exoplanet Archive
            </a>
          </p>
          <p>Built for wonder · Not affiliated with NASA</p>
        </div>
      </footer>
    </>
  );
}
