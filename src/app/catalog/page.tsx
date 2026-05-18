"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import PlanetCard from "@/components/ui/PlanetCard";
import FilterBar from "@/components/ui/FilterBar";
import catalogData from "@/data/catalog.json";
import type { Exoplanet, DiscoveryMethod } from "@/lib/types";

const planets = catalogData as Exoplanet[];

export default function CatalogPage() {
  const [activeMethod, setActiveMethod] = useState<DiscoveryMethod | "All">("All");
  const [sortBy, setSortBy] = useState("year");

  const filtered = useMemo(() => {
    let result =
      activeMethod === "All"
        ? planets
        : planets.filter((p) => p.discoveryMethod === activeMethod);
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "year":
          return b.discoveryYear - a.discoveryYear;
        case "distance":
          return (a.distanceParsecs ?? Infinity) - (b.distanceParsecs ?? Infinity);
        case "size":
          return (b.radiusEarth ?? 0) - (a.radiusEarth ?? 0);
        default:
          return 0;
      }
    });
    return result;
  }, [activeMethod, sortBy]);

  return (
    <article className="relative">
      <section className="relative min-h-[40svh] flex items-end px-5 sm:px-10 md:px-16 pt-24 pb-10">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mono text-[0.72rem] uppercase tracking-[0.3em] text-[var(--ember)] mb-6">
            § Catalog
          </p>
          <h1
            className="display-italic text-[var(--paper)] leading-[0.95] tracking-tight mb-6"
            style={{ fontSize: "var(--t-display)" }}
          >
            Discovered worlds.
          </h1>
          <p className="text-[var(--paper-dim)] leading-relaxed" style={{ fontSize: "1.05rem" }}>
            A small collection of weird and interesting worlds. Hot Jupiters
            that orbit in days. Frozen super-Earths. A handful of rocky planets
            roughly our size. Each one is real, found with a real telescope.
          </p>
        </motion.div>
      </section>

      <section className="relative px-5 sm:px-10 md:px-16 pb-24">
        <div className="max-w-6xl mx-auto">
          <FilterBar
            activeMethod={activeMethod}
            onMethodChange={setActiveMethod}
            sortBy={sortBy}
            onSortChange={setSortBy}
            count={filtered.length}
          />

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((planet, i) => (
              <PlanetCard key={planet.slug} planet={planet} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 mono text-[0.78rem] uppercase tracking-wider text-[var(--mist)]">
              No planets found for this filter.
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
