import { MethodInfo } from "@/lib/types";

export const methods: MethodInfo[] = [
  {
    slug: "transit",
    name: "Transit Method",
    shortName: "Transit",
    description:
      "When a planet passes in front of its star, it blocks a tiny fraction of the starlight. By measuring this periodic dimming, we can detect the planet and determine its size.",
    howItWorks:
      "Imagine watching a distant lighthouse. If a bird flies in front of it, the light dims slightly. The transit method works the same way — a planet crossing between us and its star causes a tiny, repeating dip in brightness. The bigger the planet, the deeper the dip. The pattern repeats every orbit.",
    icon: "◐",
    color: "#f59e0b",
    accentGlow: "rgba(245, 158, 11, 0.3)",
    planetsFound: 4218,
    featuredPlanet: "TRAPPIST-1 System",
    featuredPlanetSlug: "trappist-1-b",
  },
  {
    slug: "radial-velocity",
    name: "Radial Velocity Method",
    shortName: "Radial Velocity",
    description:
      "A planet's gravity tugs on its star, causing it to wobble. By measuring the star's back-and-forth motion through shifts in its light spectrum, we can detect invisible planets.",
    howItWorks:
      "Picture two ice skaters holding hands and spinning — they both orbit around a shared center. A planet and its star do the same thing. The star's wobble shifts its light: bluer when moving toward us, redder when moving away. This Doppler shift reveals the planet's presence and mass.",
    icon: "〰",
    color: "#6366f1",
    accentGlow: "rgba(99, 102, 241, 0.3)",
    planetsFound: 1089,
    featuredPlanet: "51 Pegasi b",
    featuredPlanetSlug: "51-peg-b",
  },
  {
    slug: "direct-imaging",
    name: "Direct Imaging",
    shortName: "Imaging",
    description:
      "By blocking out a star's blinding light with special instruments, astronomers can photograph planets orbiting it — capturing actual light from alien worlds.",
    howItWorks:
      "Imagine trying to see a firefly next to a searchlight. Direct imaging uses a coronagraph to block the star's glare, revealing faint planets nearby. It works best for young, hot, massive planets far from their stars — they glow brightly in infrared from the heat of their formation.",
    icon: "◉",
    color: "#ec4899",
    accentGlow: "rgba(236, 72, 153, 0.3)",
    planetsFound: 73,
    featuredPlanet: "HR 8799 System",
    featuredPlanetSlug: "hr-8799-b",
  },
  {
    slug: "microlensing",
    name: "Gravitational Microlensing",
    shortName: "Microlensing",
    description:
      "When a star with a planet passes in front of a distant background star, gravity bends and magnifies the background star's light — revealing the planet's presence.",
    howItWorks:
      "Einstein predicted that gravity bends light. When a foreground star crosses in front of a distant star, it acts like a cosmic magnifying glass, briefly brightening the distant star. If the foreground star has a planet, it creates an extra bump or spike in the brightness — a telltale signature.",
    icon: "◎",
    color: "#10b981",
    accentGlow: "rgba(16, 185, 129, 0.3)",
    planetsFound: 214,
    featuredPlanet: "OGLE-2005-BLG-390L b",
    featuredPlanetSlug: "ogle-2005-blg-390l-b",
  },
  {
    slug: "astrometry",
    name: "Astrometry",
    shortName: "Astrometry",
    description:
      "By precisely tracking a star's position over time, tiny wobbles caused by an orbiting planet can be detected — measuring the star's motion on the sky.",
    howItWorks:
      "While radial velocity measures a star's back-and-forth speed, astrometry watches its actual position shift on the sky. It's like watching someone sway slightly while dancing with an invisible partner. The technique requires extraordinary precision — measuring movements smaller than the width of a human hair seen from miles away.",
    icon: "✦",
    color: "#8b5cf6",
    accentGlow: "rgba(139, 92, 246, 0.3)",
    planetsFound: 3,
    featuredPlanet: "HD 176051 b",
    featuredPlanetSlug: "hd-176051-b",
  },
];

export function getMethodBySlug(slug: string): MethodInfo | undefined {
  return methods.find((m) => m.slug === slug);
}
