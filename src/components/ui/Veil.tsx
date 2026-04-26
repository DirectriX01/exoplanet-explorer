type VeilProps = {
  position?: "top" | "bottom" | "both";
  strength?: number;
};

/**
 * Fixed gradient overlay that fades scene -> ink at viewport edges.
 * Ensures body text always sits on a high-contrast surface even when the
 * Backdrop is busy. Strength scales with viewport area on small screens.
 */
export default function Veil({ position = "both", strength = 1 }: VeilProps) {
  const alpha = Math.min(0.95, 0.55 * strength);
  const stop = Math.min(36, 18 + 6 * strength);

  return (
    <>
      {(position === "top" || position === "both") && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 z-[50]"
          style={{
            height: "32svh",
            background: `linear-gradient(to bottom, var(--ink) 0%, rgba(7,6,13,${alpha}) ${stop}%, transparent 100%)`,
          }}
        />
      )}
      {(position === "bottom" || position === "both") && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[50]"
          style={{
            height: "36svh",
            background: `linear-gradient(to top, var(--ink) 0%, rgba(7,6,13,${alpha}) ${stop}%, transparent 100%)`,
          }}
        />
      )}
    </>
  );
}
