"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

// ─── UNIFORM STAR LAYER ───────────────────────────────
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

// ─── MILKY-WAY BAND ───────────────────────────────────
// Dense star strip across a thin disc, tilted at an angle.
function MilkyWayBand({ count = 1800, tilt = 0.4 }: { count?: number; tilt?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = (Math.random() - 0.5) * 110;
      const t = (Math.random() - 0.5) * 6; // thin band
      const phi = (Math.random() - 0.5) * 14; // depth
      // Rotate the band by tilt around z
      arr[i * 3] = r * Math.cos(tilt) - t * Math.sin(tilt);
      arr[i * 3 + 1] = r * Math.sin(tilt) + t * Math.cos(tilt);
      arr[i * 3 + 2] = phi;
    }
    return arr;
  }, [count, tilt]);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.006;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        color="#fff2d6"
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── CLUSTERS ────────────────────────────────────────
// A few Gaussian-distributed bright star clusters at fixed positions.
function StarClusters() {
  const ref = useRef<THREE.Points>(null);
  const centers: [number, number, number][] = useMemo(
    () => [
      [-22, 14, -8], [28, -10, -4], [10, 22, -10],
      [-32, -18, 2], [4, -28, -6], [38, 18, -12],
    ],
    []
  );

  const positions = useMemo(() => {
    const perCluster = 28;
    const arr = new Float32Array(centers.length * perCluster * 3);
    let p = 0;
    for (const [cx, cy, cz] of centers) {
      for (let i = 0; i < perCluster; i++) {
        // Box-Muller for Gaussian distribution around the cluster center
        const u1 = Math.random(), u2 = Math.random();
        const g1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        const g2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
        const u3 = Math.random(), u4 = Math.random();
        const g3 = Math.sqrt(-2 * Math.log(u3)) * Math.cos(2 * Math.PI * u4);
        arr[p++] = cx + g1 * 2.2;
        arr[p++] = cy + g2 * 2.2;
        arr[p++] = cz + g3 * 1.5;
      }
    }
    return arr;
  }, [centers]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        color="#ffffff"
        transparent
        opacity={1}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── NEBULA PATCHES ──────────────────────────────────
// Soft colored radial gradients drifting at depth. Each one a custom-shader plane.
const nebulaFragment = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uTime;

  // hash + smooth noise
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
    float r = length(uv) * 2.0;
    float radial = smoothstep(1.0, 0.0, r);
    float n = noise(uv * 4.5 + uTime * 0.015) * 0.65 + noise(uv * 11.0 - uTime * 0.01) * 0.35;
    float intensity = radial * n;
    gl_FragColor = vec4(uColor * intensity * 1.4, intensity * 0.6);
  }
`;

const nebulaVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function NebulaPatch({
  position,
  scale,
  color,
}: {
  position: [number, number, number];
  scale: number;
  color: [number, number, number];
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color().setRGB(color[0], color[1], color[2]) },
      uTime: { value: 0 },
    }),
    [color]
  );
  useFrame((s) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = s.clock.elapsedTime;
  });
  return (
    <mesh position={position} scale={scale}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        attach="material"
        uniforms={uniforms}
        vertexShader={nebulaVertex}
        fragmentShader={nebulaFragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ─── ASTERISM LINES ──────────────────────────────────
// Hand-positioned bright "constellation" stars + faint connecting lines.
const asterisms: { stars: [number, number, number][]; edges: [number, number][] }[] = [
  {
    // pseudo-Orion belt-and-shoulders
    stars: [[-14, 8, -6], [-11, 5, -6], [-8, 6, -6], [-12, 1, -6], [-13, 11, -6], [-9, 11, -6]],
    edges: [[0, 1], [1, 2], [1, 3], [4, 0], [5, 2]],
  },
  {
    // pseudo-Cassiopeia W
    stars: [[18, 12, -8], [21, 14, -8], [23, 11, -8], [26, 14, -8], [29, 12, -8]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  {
    // pseudo-Big-Dipper
    stars: [[-26, -8, -5], [-24, -6, -5], [-22, -8, -5], [-20, -7, -5], [-18, -9, -5], [-16, -11, -5], [-15, -13, -5]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
  },
];

function AsterismGroup() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.008;
  });
  return (
    <group ref={ref}>
      {asterisms.map((ast, ai) => (
        <group key={ai}>
          {ast.stars.map(([x, y, z], i) => (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[0.13, 12, 12]} />
              <meshBasicMaterial color="#fff7e8" />
            </mesh>
          ))}
          {ast.edges.map(([a, b], i) => {
            const pa = ast.stars[a], pb = ast.stars[b];
            const geom = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(pa[0], pa[1], pa[2]),
              new THREE.Vector3(pb[0], pb[1], pb[2]),
            ]);
            const mat = new THREE.LineBasicMaterial({
              color: "#f4ecdc",
              transparent: true,
              opacity: 0.09,
            });
            return <primitive key={i} object={new THREE.Line(geom, mat)} />;
          })}
        </group>
      ))}
    </group>
  );
}

// ─── ENVIRONMENT TUNING ──────────────────────────────
function useAdaptiveCounts() {
  const [counts, setCounts] = useState({ bright: 180, mid: 700, dust: 1800, band: 1800 });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const area = window.innerWidth * window.innerHeight;
    const scale = Math.min(1, area / (1440 * 900));
    setCounts({
      bright: Math.round(180 * scale),
      mid: Math.round(700 * scale),
      dust: Math.round(1800 * scale),
      band: Math.round(1800 * scale),
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
      bloomIntensity: smallScreen ? 0.26 : 0.36,
      dpr: [1, Math.min(window.devicePixelRatio || 1, smallScreen ? 1.25 : 1.5)],
    });
  }, []);
  return tuning;
}

// ─── BACKDROP ────────────────────────────────────────
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
        {/* Nebula patches sit deepest */}
        <NebulaPatch position={[-30, 12, -22]} scale={28} color={[0.5, 0.2, 0.08]} />
        <NebulaPatch position={[24, -16, -28]} scale={26} color={[0.12, 0.18, 0.4]} />
        <NebulaPatch position={[8, 26, -30]} scale={22} color={[0.45, 0.1, 0.2]} />

        {/* Dust + mid-distance stars */}
        <StarLayer count={counts.dust} spread={140} size={0.045} speed={0.004} color="#f4ecdc" opacity={0.55} />
        <StarLayer count={counts.mid} spread={95} size={0.08} speed={0.008} color="#ffe6c8" opacity={0.78} />

        {/* Milky Way band */}
        <MilkyWayBand count={counts.band} tilt={0.35} />

        {/* Bright field stars */}
        <StarLayer count={counts.bright} spread={55} size={0.16} speed={0.016} color="#ffffff" opacity={1} />

        {/* Clusters */}
        <StarClusters />

        {/* Asterisms */}
        <AsterismGroup />

        {tuning.effects && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={tuning.bloomIntensity}
              luminanceThreshold={0.75}
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
