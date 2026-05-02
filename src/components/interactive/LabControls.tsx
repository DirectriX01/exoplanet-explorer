"use client";

import { useId, type ReactNode } from "react";

type SliderProps = {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
};

/**
 * Touch-first slider. 44px hit target. No hover dependency. Works on phones.
 */
export function Slider({
  label,
  min,
  max,
  step = 0.01,
  value,
  onChange,
  format,
}: SliderProps) {
  const id = useId();
  const fill = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label
          htmlFor={id}
          className="mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--mist)]"
        >
          {label}
        </label>
        <span className="mono text-[0.82rem] tabular-nums text-[var(--paper)]">
          {format ? format(value) : value.toFixed(2)}
        </span>
      </div>
      <div
        className="relative h-11 flex items-center"
        style={{ touchAction: "pan-y" }}
      >
        <div
          aria-hidden
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] rounded-full"
          style={{
            background: `linear-gradient(to right, var(--ember) 0%, var(--ember) ${fill}%, rgba(244,236,220,0.14) ${fill}%, rgba(244,236,220,0.14) 100%)`,
          }}
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="lab-range absolute inset-0 w-full appearance-none bg-transparent cursor-grab"
        />
      </div>
      <style>{`
        .lab-range::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 22px; height: 22px; border-radius: 9999px;
          background: var(--paper); border: 2px solid var(--ember);
          box-shadow: 0 0 14px var(--ember-glow);
          cursor: grab; margin-top: 0;
        }
        .lab-range::-moz-range-thumb {
          width: 22px; height: 22px; border-radius: 9999px;
          background: var(--paper); border: 2px solid var(--ember);
          box-shadow: 0 0 14px var(--ember-glow);
          cursor: grab;
        }
        .lab-range:active::-webkit-slider-thumb { cursor: grabbing; transform: scale(1.05); }
        .lab-range:focus { outline: none; }
        .lab-range:focus::-webkit-slider-thumb { box-shadow: 0 0 0 4px var(--ember-glow); }
      `}</style>
    </div>
  );
}

export function LabPanel({
  children,
  title,
  className = "",
}: {
  children: ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.06] bg-[var(--ink-2)]/85 backdrop-blur-xl p-5 sm:p-6 space-y-5 ${className}`}
    >
      {title && (
        <h3 className="mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--mist)]">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

export function Readout({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="mono text-[0.7rem] uppercase tracking-wider text-[var(--mist)]">
        {label}
      </span>
      <span
        className={`mono tabular-nums ${
          emphasis ? "text-[var(--ember)] text-[0.95rem]" : "text-[var(--paper)] text-[0.85rem]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
