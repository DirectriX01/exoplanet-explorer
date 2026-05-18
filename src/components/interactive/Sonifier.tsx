"use client";

import { useRef, useState, useCallback, useEffect } from "react";

type Props = {
  /** Array of values to sonify. Each value maps to a pitch. */
  values: number[];
  /** Min expected value (maps to lowest pitch). */
  vmin: number;
  /** Max expected value (maps to highest pitch). */
  vmax: number;
  /** Total playback duration in seconds. */
  duration?: number;
  /** Label shown next to the play button. */
  label?: string;
  /** Sub-label shown below. */
  hint?: string;
};

/**
 * Plays an array of numeric values as a sweep of audio frequencies using
 * the Web Audio API. Lower values map to lower pitches. The classic
 * sonification you've heard from Kepler folks. No samples, no assets,
 * just an oscillator.
 */
export default function Sonifier({
  values,
  vmin,
  vmax,
  duration = 6,
  label = "Hear the signal",
  hint = "Tap to play",
}: Props) {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const stopTimeoutRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
      } catch {
        // already stopped
      }
      oscRef.current.disconnect();
      oscRef.current = null;
    }
    if (gainRef.current) {
      gainRef.current.disconnect();
      gainRef.current = null;
    }
    if (stopTimeoutRef.current !== null) {
      window.clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
    setPlaying(false);
  }, []);

  useEffect(() => stop, [stop]);

  const play = useCallback(() => {
    if (playing) {
      stop();
      return;
    }
    if (!values.length) return;

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = ctxRef.current ?? new AudioCtx();
    ctxRef.current = ctx;
    // Some browsers start in "suspended" state until a user gesture
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    gain.gain.value = 0;
    osc.connect(gain).connect(ctx.destination);

    const dt = duration / values.length;
    const t0 = ctx.currentTime + 0.05;
    const range = Math.max(1e-6, vmax - vmin);

    // Fade in
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(0.18, t0 + 0.15);

    values.forEach((v, i) => {
      const norm = Math.max(0, Math.min(1, (v - vmin) / range));
      // Map normalized value to musical pitch. Low value = low pitch.
      const freq = 180 + norm * 720;
      osc.frequency.setValueAtTime(freq, t0 + i * dt);
    });

    // Fade out
    gain.gain.setValueAtTime(0.18, t0 + duration - 0.25);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    osc.start(t0);
    osc.stop(t0 + duration + 0.05);

    oscRef.current = osc;
    gainRef.current = gain;
    setPlaying(true);

    stopTimeoutRef.current = window.setTimeout(() => {
      stop();
    }, (duration + 0.2) * 1000);
  }, [playing, stop, values, vmin, vmax, duration]);

  return (
    <button
      onClick={play}
      className="group inline-flex items-center gap-3 rounded-full border border-[var(--ember)]/40 bg-[var(--ember)]/10 hover:bg-[var(--ember)]/20 px-4 py-2.5 transition-colors"
      aria-label={label}
    >
      <span
        className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--ember)] text-[var(--ink)]"
        aria-hidden
      >
        {playing ? (
          <svg width="10" height="10" viewBox="0 0 10 10">
            <rect x="2" y="2" width="2.5" height="6" fill="currentColor" />
            <rect x="5.5" y="2" width="2.5" height="6" fill="currentColor" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M2 1.5 L8.5 5 L2 8.5 Z" fill="currentColor" />
          </svg>
        )}
      </span>
      <span className="text-left">
        <span className="block mono text-[0.72rem] uppercase tracking-[0.2em] text-[var(--paper)]">
          {playing ? "Stop" : label}
        </span>
        <span className="block mono text-[0.62rem] uppercase tracking-wider text-[var(--mist)]">
          {hint}
        </span>
      </span>
    </button>
  );
}
