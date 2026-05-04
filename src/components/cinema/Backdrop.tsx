"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

type StarLayerProps = {
  count: number;
  spread: number;
  size: number;
  speed: number;
  color?: string;
  opacity?: number;
};

function StarLayer({
  count,
  spread,
  size,
  speed,
  color = "#ffffff",
  opacity = 0.95,
}: StarLayerProps) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * spread;
      arr[i * 3 + 1] = (Math.random() - 0.5) * spread;
      arr[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }
    return arr;
  }, [count, spread]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * speed;
    ref.current.rotation.x += delta * speed * 0.4;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function useAdaptiveCounts() {
  const [counts, setCounts] = useState({ bright: 180, mid: 700, dust: 1800 });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const area = window.innerWidth * window.innerHeight;
    const scale = Math.min(1, area / (1440 * 900));
    setCounts({
      bright: Math.round(180 * scale),
      mid: Math.round(700 * scale),
      dust: Math.round(1800 * scale),
    });
  }, []);
  return counts;
}

function useEnvironmentTuning() {
  const [tuning, setTuning] = useState({
    effects: true,
    bloomIntensity: 0.32,
    dpr: [1, 1.5] as [number, number],
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smallScreen = window.innerWidth < 768;
    setTuning({
      effects: !reduced,
      bloomIntensity: smallScreen ? 0.22 : 0.32,
      dpr: [1, Math.min(window.devicePixelRatio || 1, smallScreen ? 1.25 : 1.5)],
    });
  }, []);
  return tuning;
}

export default function Backdrop() {
  const counts = useAdaptiveCounts();
  const tuning = useEnvironmentTuning();

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 18], fov: 60 }}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        dpr={tuning.dpr}
        style={{ background: "#07060d" }}
      >
        <StarLayer
          count={counts.dust}
          spread={140}
          size={0.05}
          speed={0.004}
          color="#f4ecdc"
          opacity={0.65}
        />
        <StarLayer
          count={counts.mid}
          spread={90}
          size={0.09}
          speed={0.01}
          color="#ffe6c8"
          opacity={0.85}
        />
        <StarLayer
          count={counts.bright}
          spread={55}
          size={0.18}
          speed={0.018}
          color="#ffffff"
          opacity={1}
        />

        {tuning.effects && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={tuning.bloomIntensity}
              luminanceThreshold={0.82}
              luminanceSmoothing={0.2}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.2} darkness={0.55} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
