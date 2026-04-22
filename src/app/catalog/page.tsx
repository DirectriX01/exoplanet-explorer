"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import PlanetCard from "@/components/ui/PlanetCard";
import FilterBar from "@/components/ui/FilterBar";
import catalogData from "@/data/catalog.json";
import type { Exoplanet, DiscoveryMethod } from "@/lib/types";

const planets = catalogData as Exoplanet[];

export default function CatalogPage() {
  const [activeMethod, setActiveMethod] = useState<DiscoveryMethod | "All">(
    "All"
  );
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
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-mono uppercase tracking-[0.3em] text-slate-400 mb-4">
            Exoplanet Catalog
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Discovered Worlds
          </h1>
          <p className="text-slate-400 max-w-2xl leading-relaxed">
            Browse a curated selection of remarkable exoplanets, from scorching
            hot Jupiters to frozen super-Earths. Each one was found using real
            observational data.
          </p>
        </motion.div>

        <FilterBar
          activeMethod={activeMethod}
          onMethodChange={setActiveMethod}
          sortBy={sortBy}
          onSortChange={setSortBy}
          count={filtered.length}
        />

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((planet, i) => (
            <PlanetCard key={planet.slug} planet={planet} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No planets found for this filter.
          </div>
        )}
      </div>
    </div>
  );
}
