import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number | null, decimals = 2): string {
  if (n === null) return "Unknown";
  if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return n.toFixed(decimals);
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function kelvinToCelsius(k: number | null): string {
  if (k === null) return "Unknown";
  return `${Math.round(k - 273.15)}`;
}

export function parsecsToLightYears(pc: number | null): string {
  if (pc === null) return "Unknown";
  return formatNumber(pc * 3.26156, 1);
}

export function radiusCategory(radiusEarth: number | null): string {
  if (radiusEarth === null) return "Unknown";
  if (radiusEarth < 1.25) return "Earth-sized";
  if (radiusEarth < 2) return "Super-Earth";
  if (radiusEarth < 4) return "Mini-Neptune";
  if (radiusEarth < 10) return "Neptune-sized";
  return "Gas Giant";
}
