"use client";

import { cn } from "@/lib/utils";
import type { DiscoveryMethod } from "@/lib/types";

const methodFilters: { label: string; value: DiscoveryMethod | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Transit", value: "Transit" },
  { label: "Radial Velocity", value: "Radial Velocity" },
  { label: "Imaging", value: "Imaging" },
  { label: "Microlensing", value: "Microlensing" },
  { label: "Astrometry", value: "Astrometry" },
];

const sortOptions = [
  { label: "Name", value: "name" },
  { label: "Year", value: "year" },
  { label: "Distance", value: "distance" },
  { label: "Size", value: "size" },
];

const methodColors: Record<string, string> = {
  All: "#ff6b3d",
  Transit: "#f59e0b",
  "Radial Velocity": "#6366f1",
  Imaging: "#ec4899",
  Microlensing: "#10b981",
  Astrometry: "#8b5cf6",
};

interface FilterBarProps {
  activeMethod: DiscoveryMethod | "All";
  onMethodChange: (method: DiscoveryMethod | "All") => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  count: number;
}

export default function FilterBar({
  activeMethod,
  onMethodChange,
  sortBy,
  onSortChange,
  count,
}: FilterBarProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {methodFilters.map((filter) => {
          const isActive = activeMethod === filter.value;
          const color = methodColors[filter.value];
          return (
            <button
              key={filter.value}
              onClick={() => onMethodChange(filter.value)}
              className={cn(
                "mono text-[0.66rem] uppercase tracking-[0.18em] rounded-full px-4 py-2 transition-all border",
                isActive
                  ? "text-[var(--paper)]"
                  : "text-[var(--mist)] hover:text-[var(--paper)] bg-white/[0.025] hover:bg-white/[0.06] border-white/[0.05] hover:border-white/[0.12]"
              )}
              style={
                isActive
                  ? {
                      background: `${color}1f`,
                      color,
                      borderColor: `${color}55`,
                    }
                  : undefined
              }
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <span className="mono text-[0.7rem] uppercase tracking-wider text-[var(--mist)] tabular-nums">
          {count} planet{count !== 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-3">
          <span className="mono text-[0.66rem] uppercase tracking-wider text-[var(--mist)]">Sort</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-[var(--ink-2)] border border-white/[0.08] rounded-md px-3 py-1.5 mono text-[0.72rem] text-[var(--paper)] outline-none focus:border-[var(--ember)]/50 transition-colors"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
