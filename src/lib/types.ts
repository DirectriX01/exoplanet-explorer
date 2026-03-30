export interface Exoplanet {
  slug: string;
  name: string;
  hostname: string;
  discoveryMethod: DiscoveryMethod;
  discoveryYear: number;
  discoveryFacility: string;
  orbitalPeriodDays: number | null;
  radiusEarth: number | null;
  massEarth: number | null;
  semiMajorAxisAU: number | null;
  equilibriumTempK: number | null;
  eccentricity: number | null;
  starTempK: number | null;
  starRadiusSun: number | null;
  starMassSun: number | null;
  distanceParsecs: number | null;
  description?: string;
  featured?: boolean;
}

export type DiscoveryMethod =
  | "Transit"
  | "Radial Velocity"
  | "Imaging"
  | "Microlensing"
  | "Astrometry";

export interface MethodInfo {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  howItWorks: string;
  icon: string;
  color: string;
  accentGlow: string;
  planetsFound: number;
  featuredPlanet: string;
  featuredPlanetSlug: string;
}

export interface LightCurvePoint {
  time: number;
  flux: number;
}

export interface RadialVelocityPoint {
  time: number;
  velocity: number;
}

export interface MicrolensingPoint {
  time: number;
  magnification: number;
}

export interface PositionPoint {
  time: number;
  ra: number;
  dec: number;
}
