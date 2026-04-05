"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { MethodInfo } from "@/lib/types";

export default function MethodCard({ method }: { method: MethodInfo }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link
        href={`/methods/${method.slug}`}
        className="group block rounded-2xl border border-white/5 bg-[#0a0520]/60 backdrop-blur-sm p-6 transition-all duration-300 hover:border-white/10 hover:bg-[#0a0520]/80"
        style={{
          boxShadow: `0 0 0 rgba(0,0,0,0), inset 0 1px 0 rgba(255,255,255,0.03)`,
        }}
      >
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
          style={{ background: `${method.color}15`, color: method.color }}
        >
          {method.icon}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-white group-hover:text-gradient transition-colors">
          {method.name}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
          {method.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span
            className="text-xs font-mono font-medium"
            style={{ color: method.color }}
          >
            {method.planetsFound.toLocaleString()} planets found
          </span>
          <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">
            Explore &rarr;
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
