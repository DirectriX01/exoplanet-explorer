import { MethodInfo } from "@/lib/types";

export const methods: MethodInfo[] = [
  {
    slug: "transit",
    name: "Transit Method",
    shortName: "Transit",
    description:
      "Watch a star long enough and sometimes it blinks. Just a tiny dip in brightness, repeating like clockwork. That's a planet passing in front of it, blocking a sliver of the light.",
    howItWorks:
      "Think about watching a far away lighthouse. If a bug flies across the lamp, the light dims for a second. Same idea here. The planet crosses in front of its star and the brightness drops by a fraction of a percent. The bigger the planet, the deeper the dip. Wait one orbit and it happens again. So we just stare at stars and look for the pattern.",
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
      "Planets don't just orbit stars. They tug on them too. The star wobbles back and forth, and if you look at its light carefully you can hear it (kind of).",
    howItWorks:
      "Two ice skaters holding hands and spinning. Both move around a shared point in the middle. Stars and planets do the same. When the star comes toward us its light shifts blue, and when it moves away it shifts red. We don't see the planet at all. We just watch the star rocking. The size of the wobble tells us the planet's mass.",
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
      "Sometimes we actually take a picture. Block out the star with a mask and the planet next to it shows up as a faint dot. Yes, those are real photons from another world.",
    howItWorks:
      "Try to spot a firefly sitting next to a stadium floodlight. That's the problem. The fix is a coronagraph, basically a tiny disc inside the telescope that covers up the star. Once the glare is gone you can see what was hiding next to it. This works best for big young planets that are still hot from forming, because they glow on their own in infrared.",
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
      "Gravity bends light. So when one star drifts in front of a much farther star, it acts like a lens. If there's a planet involved, the lens gets a tiny extra kick. Catch the kick, find the planet.",
    howItWorks:
      "Einstein figured out that gravity bends light. Two stars are very far apart, and over months one drifts in front of the other from our point of view. The closer star bends the light from the farther one, making it look briefly brighter. If the closer star has a planet, the planet's own gravity adds a tiny spike on top of the smooth brightness curve. The event lasts hours to days and never repeats. You either catch it or you don't.",
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
      "Same wobble as the radial velocity method, but seen sideways. The star drifts a tiny bit on the sky instead of toward and away from us. Hard to spot. Worth it when you do.",
    howItWorks:
      "Picture someone slow dancing with an invisible partner. They sway a tiny bit. That's what a star with a planet does, except the sway is microscopic. We measure where the star sits among the background stars over years and look for it tracing a small circle. The precision needed is wild, basically spotting a coin on the moon from earth. ESA's Gaia mission has been doing exactly this since 2013 and will probably unlock thousands of new planets this way.",
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
