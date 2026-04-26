"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type StarLayerProps = {
  count: number;
  spread: number;
  size: number;
  speed: number;
  color?: string;
};

function StarLayer({ count, spread, size, speed, color = "#ffffff" }: StarLayerProps) {
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
        opacity={0.95}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

const nebulaShader = {
  uniforms: { uTime: { value: 0 } },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    varying vec2 vUv;
    uniform float uTime;

    // cheap value-noise
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    void main() {
      vec2 uv = vUv - 0.5;
      float r = length(uv);
      float n = noise(uv * 3.0 + uTime * 0.02) * 0.6
              + noise(uv * 7.0 - uTime * 0.015) * 0.4;
      vec3 warm = vec3(0.62, 0.24, 0.08);
      vec3 cool = vec3(0.05, 0.06, 0.20);
      vec3 col = mix(cool, warm, smoothstep(0.0, 1.0, n));
      float radial = smoothstep(0.75, 0.0, r);
      gl_FragColor = vec4(col * radial * 0.45, 1.0);
    }
  `,
};

function Nebula() {
  const ref = useRef<THREE.ShaderMaterial>(null);
  useFrame((s) => {
    if (ref.current) ref.current.uniforms.uTime.value = s.clock.elapsedTime;
  });
  return (
    <mesh position={[0, 0, -50]}>
      <planeGeometry args={[160, 100]} />
      <shaderMaterial
        ref={ref}
        attach="material"
        args={[nebulaShader]}
        depthWrite={false}
        transparent
      />
    </mesh>
  );
}

function useAdaptiveCounts() {
  const [counts, setCounts] = useState({ bright: 220, mid: 700, dust: 1500 });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const area = window.innerWidth * window.innerHeight;
    const scale = Math.min(1, area / (1440 * 900));
    setCounts({
      bright: Math.round(220 * scale),
      mid: Math.round(700 * scale),
      dust: Math.round(1500 * scale),
    });
  }, []);
  return counts;
}

export default function Backdrop() {
  const counts = useAdaptiveCounts();

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 18], fov: 60 }}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        style={{ background: "#07060d" }}
      >
        <Nebula />
        <StarLayer count={counts.dust} spread={140} size={0.06} speed={0.005} color="#f4ecdc" />
        <StarLayer count={counts.mid} spread={90} size={0.11} speed={0.012} color="#ffe6c8" />
        <StarLayer count={counts.bright} spread={55} size={0.22} speed={0.02} color="#ffffff" />
      </Canvas>
    </div>
  );
}
