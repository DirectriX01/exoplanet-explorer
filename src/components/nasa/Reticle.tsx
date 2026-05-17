/**
 * Low-opacity crosshair + circle reticle overlay for scenes. Sits in front of
 * a 3D canvas to suggest instrumentation framing.
 */
export default function Reticle({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <line x1="50" y1="0" x2="50" y2="100" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="0.12" />
      <line x1="0" y1="50" x2="100" y2="50" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="0.12" />
      <circle cx="50" cy="50" r="14" fill="none" stroke="#ffffff" strokeOpacity="0.10" strokeWidth="0.18" />
      <circle cx="50" cy="50" r="22" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="0.12" />
      {/* Edge tickmarks */}
      {[0, 25, 75, 100].map((p) => (
        <g key={p}>
          <line x1={p} y1={0} x2={p} y2={2} stroke="#ffffff" strokeOpacity="0.25" strokeWidth="0.2" />
          <line x1={p} y1={98} x2={p} y2={100} stroke="#ffffff" strokeOpacity="0.25" strokeWidth="0.2" />
          <line x1={0} y1={p} x2={2} y2={p} stroke="#ffffff" strokeOpacity="0.25" strokeWidth="0.2" />
          <line x1={98} y1={p} x2={100} y2={p} stroke="#ffffff" strokeOpacity="0.25" strokeWidth="0.2" />
        </g>
      ))}
    </svg>
  );
}
