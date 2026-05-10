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
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/methods/${method.slug}`}
        className="group block rounded-2xl border border-white/[0.05] bg-[var(--ink-2)]/55 backdrop-blur-sm p-6 transition-all duration-300 hover:border-[var(--ember)]/35 hover:bg-[var(--ink-2)]/85"
      >
        <div
          className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl text-xl"
          style={{ background: `${method.color}1a`, color: method.color }}
        >
          {method.icon}
        </div>
        <h3 className="display text-[1.15rem] text-[var(--paper)] mb-2 group-hover:text-[var(--ember)] transition-colors">
          {method.name}
        </h3>
        <p className="text-[0.85rem] text-[var(--mist)] leading-relaxed line-clamp-3">
          {method.description}
        </p>
        <div className="mt-5 flex items-center justify-between">
          <span className="mono text-[0.65rem] uppercase tracking-wider text-[var(--paper-dim)]">
            {method.planetsFound.toLocaleString()} planets
          </span>
          <span className="mono text-[0.65rem] uppercase tracking-wider text-[var(--mist)] group-hover:text-[var(--ember)] transition-colors">
            Explore →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
