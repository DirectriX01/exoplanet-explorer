"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getMethodBySlug } from "@/data/methods";

const OrbitalSystem = dynamic(
  () => import("@/components/three/OrbitalSystem"),
  { ssr: false, loading: () => <div className="w-full aspect-square max-w-md bg-white/5 rounded-2xl animate-pulse" /> }
);

export default function DirectImagingPage() {
  const method = getMethodBySlug("direct-imaging")!;

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

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-white/5 p-5">
              <h3 className="text-sm font-semibold text-white mb-2">
                Without Coronagraph
              </h3>
              <div className="aspect-video rounded-lg bg-[#030014] flex items-center justify-center relative overflow-hidden">
                <div className="w-24 h-24 rounded-full bg-white" />
                <div className="absolute inset-0 bg-gradient-radial from-white/30 to-transparent" />
                <p className="absolute bottom-2 text-[10px] text-slate-500">
                  Star&apos;s glare overwhelms everything
                </p>
              </div>
            </div>
            <div className="rounded-xl bg-white/5 p-5">
              <h3 className="text-sm font-semibold text-white mb-2">
                With Coronagraph
              </h3>
              <div className="aspect-video rounded-lg bg-[#030014] flex items-center justify-center relative overflow-hidden">
                <div className="w-24 h-24 rounded-full bg-black border border-white/10" />
                {[45, 135, 225, 315].map((angle) => (
                  <div
                    key={angle}
                    className="absolute w-2 h-2 rounded-full animate-pulse"
                    style={{
                      background: "#ec4899",
                      boxShadow: "0 0 8px #ec4899",
                      top: `${50 + Math.sin((angle * Math.PI) / 180) * 30}%`,
                      left: `${50 + Math.cos((angle * Math.PI) / 180) * 30}%`,
                    }}
                  />
                ))}
                <p className="absolute bottom-2 text-[10px] text-slate-500">
                  Planets become visible as glowing dots
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 3D Scene */}
        <motion.section
          className="mt-12 rounded-2xl border border-white/5 bg-[#0a0520]/40 p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-semibold text-white mb-2">
            HR 8799 — Four-Planet System
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            The first multi-planet system directly photographed. Four massive
            planets orbit this young star, visible in infrared. The dark center
            represents the coronagraph mask blocking the star.
          </p>
          <div className="flex justify-center">
            <OrbitalSystem />
          </div>
        </motion.section>

        {/* Discovery Story */}
        <motion.section
          className="mt-12 rounded-2xl border border-pink-500/10 bg-pink-500/5 p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-mono uppercase tracking-wider text-pink-400 mb-3">
            Discovery Story
          </p>
          <h2 className="text-2xl font-semibold text-white mb-4">
            HR 8799 — Seeing Alien Worlds
          </h2>
          <div className="text-slate-300 space-y-3 leading-relaxed">
            <p>
              In 2008, two teams independently announced one of astronomy&apos;s
              most spectacular achievements: actual photographs of planets
              orbiting another star. Using adaptive optics at the Keck and
              Gemini observatories in Hawaii, they captured infrared images of
              four giant planets orbiting the young star HR 8799.
            </p>
            <p>
              These planets are still glowing from the heat of their
              formation, making them bright enough to photograph in infrared.
              Time-lapse images spanning years have even captured them moving
              along their orbits — a remarkable visual confirmation.
            </p>
            <p>
              In 2024, the James Webb Space Telescope turned its infrared eyes
              on this system, revealing carbon dioxide in the planets&apos;
              atmospheres for the first time.
            </p>
          </div>
          <Link
            href="/catalog/hr-8799-b"
            className="mt-6 inline-flex items-center gap-2 text-sm text-pink-400 hover:text-pink-300 transition-colors"
          >
            View HR 8799 b in catalog &rarr;
          </Link>
        </motion.section>
      </div>
    </div>
  );
}
