"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getMethodBySlug } from "@/data/methods";

const OrbitalSystem = dynamic(() => import("@/components/three/OrbitalSystem"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square max-w-md bg-[var(--ink-2)] rounded-lg animate-pulse" />
  ),
});

export default function DirectImagingPage() {
  const method = getMethodBySlug("direct-imaging")!;

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
            § Method 03 — Direct Imaging · {method.planetsFound.toLocaleString()} planets
          </motion.p>
          <motion.h1
            className="display-italic text-[var(--paper)] leading-[0.95] tracking-tight mb-8"
            style={{ fontSize: "var(--t-hero)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            We just
            <br />
            take a picture.
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

      {/* GLARE vs CORONAGRAPH COMPARISON */}
      <section className="relative py-16 px-5 sm:px-10 md:px-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="mono text-[0.66rem] uppercase tracking-[0.2em] text-[var(--mist)] mb-3">
              Without coronagraph
            </p>
            <div className="aspect-video rounded-lg bg-[var(--ink)] flex items-center justify-center relative overflow-hidden border border-white/[0.04]">
              <div className="w-28 h-28 rounded-full bg-[#fff7e8]" style={{ boxShadow: "0 0 80px 30px rgba(255, 230, 200, 0.5)" }} />
              <p className="absolute bottom-3 mono text-[0.62rem] uppercase tracking-wider text-[var(--mist)]">
                The star's glare drowns everything
              </p>
            </div>
          </div>
          <div>
            <p className="mono text-[0.66rem] uppercase tracking-[0.2em] text-[var(--ember)] mb-3">
              With coronagraph
            </p>
            <div className="aspect-video rounded-lg bg-[var(--ink)] flex items-center justify-center relative overflow-hidden border border-white/[0.04]">
              <div className="w-28 h-28 rounded-full bg-[var(--ink)] border border-[var(--ember)]/40" />
              {[45, 135, 225, 315].map((angle) => (
                <div
                  key={angle}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: "var(--ember)",
                    boxShadow: "0 0 12px var(--ember-glow)",
                    top: `${50 + Math.sin((angle * Math.PI) / 180) * 30}%`,
                    left: `${50 + Math.cos((angle * Math.PI) / 180) * 30}%`,
                  }}
                />
              ))}
              <p className="absolute bottom-3 mono text-[0.62rem] uppercase tracking-wider text-[var(--mist)]">
                The planets emerge as faint dots
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SCENE */}
      <section className="relative py-20 sm:py-28 px-5 sm:px-10 md:px-16 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <p className="mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-3">
            § The Signal — HR 8799
          </p>
          <h2
            className="display-italic text-[var(--paper)] leading-[1.05] mb-4"
            style={{ fontSize: "var(--t-section)" }}
          >
            Four worlds, photographed.
          </h2>
          <p className="text-[var(--paper-dim)] mb-12 max-w-2xl leading-relaxed">
            The first multi-planet system directly photographed. Four young, hot giants
            still glowing from formation, visible in infrared as faint embers around their
            young A-type star. The dark center is the coronagraph mask blocking the
            star's glare.
          </p>
          <div className="flex justify-center">
            <OrbitalSystem />
          </div>
        </div>
      </section>

      {/* DISCOVERY STORY */}
      <section className="relative py-28 px-5 sm:px-10 md:px-16 border-t border-white/[0.05]">
        <div className="max-w-[64ch] mx-auto">
          <p className="mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-8">
            § Discovery Story · 2008-11-13
          </p>
          <h2
            className="display-italic text-[var(--paper)] leading-[1.05] mb-10"
            style={{ fontSize: "var(--t-display)" }}
          >
            We literally took the photo.
          </h2>
          <p
            className="drop-cap text-[var(--paper)]"
            style={{ fontSize: "1.15rem", lineHeight: 1.75 }}
          >
            November 2008. Two separate teams using telescopes in Hawaii dropped infrared images that actually showed planets orbiting another star. Christian Marois and his crew at Keck and Gemini caught three of them around a young star called HR 8799. They found a fourth two years later.
          </p>
          <p className="mt-6 text-[var(--paper-dim)]" style={{ fontSize: "1.05rem", lineHeight: 1.75 }}>
            These planets are young enough that they're still glowing from the heat of being formed. So they show up in infrared even with the star nearby. People have since taken photos of them over multiple years and you can actually see the planets moving along their orbits. Time lapse video of an alien solar system.
          </p>
          <p className="mt-6 text-[var(--paper-dim)]" style={{ fontSize: "1.05rem", lineHeight: 1.75 }}>
            In 2024 the James Webb Space Telescope looked at all four planets and split their light into a spectrum. It found water, carbon dioxide, and clouds in their atmospheres. We're reading the chemistry of worlds 130 light years away.
          </p>
          <Link
            href="/catalog/hr-8799-b"
            className="mt-12 inline-flex items-center gap-2 ember-link mono text-[0.78rem] uppercase tracking-wider"
          >
            See HR 8799 b →
          </Link>
        </div>
      </section>
    </article>
  );
}
