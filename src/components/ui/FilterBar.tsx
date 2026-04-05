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
  All: "#e2e8f0",
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
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {methodFilters.map((filter) => {
          const isActive = activeMethod === filter.value;
          const color = methodColors[filter.value];
          return (
            <button
              key={filter.value}
              onClick={() => onMethodChange(filter.value)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
                isActive
                  ? "text-white"
                  : "text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5"
              )}
              style={
                isActive
                  ? {
                      background: `${color}20`,
                      color: color,
                      border: `1px solid ${color}40`,
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
        <span className="text-xs text-slate-500">
          {count} planet{count !== 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-300 outline-none focus:border-white/20"
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
