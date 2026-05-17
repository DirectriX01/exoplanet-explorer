import type { ReactNode } from "react";

type Status = "nominal" | "warning" | "critical" | "data";

const statusColor: Record<Status, string> = {
  nominal: "#00d97e",
  warning: "#ffb000",
  critical: "#ff4d4d",
  data: "#ffffff",
};

type Props = {
  label?: string;
  status?: Status;
  meta?: string;
  children: ReactNode;
  className?: string;
  padded?: boolean;
};

/**
 * Mission-control panel frame with corner brackets and a header strip.
 * Used inside the NASA-aesthetic /labs/ pages.
 */
export default function Frame({
  label,
  status = "nominal",
  meta,
  children,
  className = "",
  padded = true,
}: Props) {
  const color = statusColor[status];
  return (
    <div className={`relative border border-white/[0.07] ${className}`}>
      {/* corner brackets */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2"
        style={{ borderColor: color }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2"
        style={{ borderColor: color }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2"
        style={{ borderColor: color }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2"
        style={{ borderColor: color }}
      />

      {(label || meta) && (
        <div
          className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2"
          style={{ fontFamily: "var(--font-plex), ui-monospace, monospace" }}
        >
          {label && (
            <span className="text-[0.65rem] uppercase tracking-[0.22em] text-white">
              {label}
            </span>
          )}
          {meta && (
            <span
              className="text-[0.62rem] uppercase tracking-[0.2em] tabular-nums"
              style={{ color }}
            >
              {meta} · {status.toUpperCase()}
            </span>
          )}
        </div>
      )}

      <div className={padded ? "p-5 sm:p-6" : ""}>{children}</div>
    </div>
  );
}
