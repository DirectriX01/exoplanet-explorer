"use client";

import { motion } from "framer-motion";
import MethodCard from "@/components/ui/MethodCard";
import { methods } from "@/data/methods";

export default function MethodsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-mono uppercase tracking-[0.3em] text-slate-400 mb-4">
            Discovery Methods
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Five Ways to Find a Planet
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Scientists have developed multiple ingenious techniques to detect
            worlds orbiting distant stars. Each method exploits different
            physics and reveals different kinds of planets.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {methods.map((method) => (
            <MethodCard key={method.slug} method={method} />
          ))}
        </div>

        {/* Method comparison */}
        <motion.div
          className="mt-20 rounded-2xl border border-white/5 bg-[#0a0520]/40 p-8 overflow-x-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl font-semibold text-white mb-6">
            Method Comparison
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-2 text-slate-400 font-medium">
                  Method
                </th>
                <th className="text-left py-3 px-2 text-slate-400 font-medium">
                  Measures
                </th>
                <th className="text-left py-3 px-2 text-slate-400 font-medium">
                  Best For
                </th>
                <th className="text-right py-3 px-2 text-slate-400 font-medium">
                  Planets Found
                </th>
              </tr>
            </thead>
            <tbody>
              {methods.map((m) => (
                <tr key={m.slug} className="border-b border-white/5">
                  <td className="py-3 px-2">
                    <span className="font-medium text-white">{m.shortName}</span>
                  </td>
                  <td className="py-3 px-2 text-slate-400">
                    {m.slug === "transit" && "Starlight dimming"}
                    {m.slug === "radial-velocity" && "Star's velocity shift"}
                    {m.slug === "direct-imaging" && "Planet's own light"}
                    {m.slug === "microlensing" && "Gravitational lensing"}
                    {m.slug === "astrometry" && "Star's sky position"}
                  </td>
                  <td className="py-3 px-2 text-slate-400">
                    {m.slug === "transit" && "Large planets, close orbits"}
                    {m.slug === "radial-velocity" && "Massive planets"}
                    {m.slug === "direct-imaging" && "Young, hot, far-out planets"}
                    {m.slug === "microlensing" && "Distant, small planets"}
                    {m.slug === "astrometry" && "Nearby stars, long orbits"}
                  </td>
                  <td
                    className="py-3 px-2 text-right font-mono"
                    style={{ color: m.color }}
                  >
                    {m.planetsFound.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}
