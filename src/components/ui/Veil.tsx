type VeilProps = {
  position?: "top" | "bottom" | "both";
  strength?: number;
};

/**
 * Fixed gradient overlay that fades scene -> ink at viewport edges.
 * Ensures body text always sits on a high-contrast surface even when the
 * Backdrop is busy. Strength scales with viewport area on small screens.
 */
export default function Veil({ position = "both", strength = 0.55 }: VeilProps) {
  // Easier gradients — start full ink only at the edge and fade quickly. Stars
  // remain visible across most of the viewport; text near the very top/bottom
  // still has a contrast safety net.
  const alpha = Math.min(0.9, 0.45 * strength);
  const stop = Math.min(24, 12 + 4 * strength);

  return (
    <>
      {(position === "top" || position === "both") && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 z-[50]"
          style={{
            height: "22svh",
            background: `linear-gradient(to bottom, rgba(7,6,13,${Math.min(0.92, alpha + 0.25)}) 0%, rgba(7,6,13,${alpha}) ${stop}%, transparent 100%)`,
          }}
        />
      )}
      {(position === "bottom" || position === "both") && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[50]"
          style={{
            height: "26svh",
            background: `linear-gradient(to top, rgba(7,6,13,${Math.min(0.92, alpha + 0.25)}) 0%, rgba(7,6,13,${alpha}) ${stop}%, transparent 100%)`,
          }}
        />
      )}
    </>
  );
}
