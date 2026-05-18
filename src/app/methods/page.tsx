"use client";

import { motion } from "framer-motion";
import MethodCard from "@/components/ui/MethodCard";
import { methods } from "@/data/methods";

export default function MethodsPage() {
  return (
    <article className="relative">
      <section className="relative min-h-[60svh] flex items-end px-5 sm:px-10 md:px-16 pt-24 pb-12">
        <motion.div
          className="max-w-4xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mono text-[0.72rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-6">
            § The Five Methods
          </p>
          <h1
            className="display-italic text-[var(--paper)] leading-[0.95] tracking-tight mb-8"
            style={{ fontSize: "var(--t-display)" }}
          >
            Five ways to find a planet.
          </h1>
          <p className="text-[var(--paper-dim)] max-w-2xl leading-relaxed" style={{ fontSize: "1.1rem" }}>
            We can't fly to any of these planets. Most are too far for our
            telescopes to actually see. So we got clever. Five tricks, each
            using different physics. Pick any one to start.
          </p>
        </motion.div>
      </section>

      <section className="relative px-5 sm:px-10 md:px-16 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {methods.map((method) => (
              <MethodCard key={method.slug} method={method} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 px-5 sm:px-10 md:px-16 border-t border-white/[0.05]">
        <div className="max-w-6xl">
          <p className="mono text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-8">
            § Side by side
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left py-3 mono text-[0.66rem] uppercase tracking-[0.18em] text-[var(--mist)] font-medium">Method</th>
                  <th className="text-left py-3 mono text-[0.66rem] uppercase tracking-[0.18em] text-[var(--mist)] font-medium">Measures</th>
                  <th className="text-left py-3 mono text-[0.66rem] uppercase tracking-[0.18em] text-[var(--mist)] font-medium">Best for</th>
                  <th className="text-right py-3 mono text-[0.66rem] uppercase tracking-[0.18em] text-[var(--mist)] font-medium">Planets</th>
                </tr>
              </thead>
              <tbody>
                {methods.map((m) => (
                  <tr key={m.slug} className="border-b border-white/[0.04]">
                    <td className="py-4 display text-[var(--paper)]">{m.shortName}</td>
                    <td className="py-4 text-[var(--paper-dim)]">
                      {m.slug === "transit" && "Starlight dimming"}
                      {m.slug === "radial-velocity" && "Star's velocity shift"}
                      {m.slug === "direct-imaging" && "Planet's own light"}
                      {m.slug === "microlensing" && "Gravitational lensing"}
                      {m.slug === "astrometry" && "Star's sky position"}
                    </td>
                    <td className="py-4 text-[var(--paper-dim)]">
                      {m.slug === "transit" && "Large planets, close orbits"}
                      {m.slug === "radial-velocity" && "Massive planets"}
                      {m.slug === "direct-imaging" && "Young, hot, far-out planets"}
                      {m.slug === "microlensing" && "Distant, small planets"}
                      {m.slug === "astrometry" && "Nearby stars, long orbits"}
                    </td>
                    <td
                      className="py-4 text-right mono tabular-nums"
                      style={{ color: m.color }}
                    >
                      {m.planetsFound.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </article>
  );
}
