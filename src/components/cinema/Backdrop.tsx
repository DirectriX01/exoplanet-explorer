"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

// Generates a soft circular radial-gradient texture used as `map` on
// PointsMaterial so point sprites render as round soft glows instead of squares.
let _softCircle: THREE.CanvasTexture | null = null;
function softCircleTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  if (_softCircle) return _softCircle;
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,255,255,0.55)");
  grad.addColorStop(0.6, "rgba(255,255,255,0.12)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  _softCircle = new THREE.CanvasTexture(c);
  return _softCircle;
}

// ─── CLUSTERS ────────────────────────────────────────
// Gaussian-distributed bright star clusters at fixed positions. Uses a
// primitive THREE.Points (not declarative <points>) so we sidestep the
// bufferAttribute child pattern that didn't render here.
function StarClusters() {
  const ref = useRef<THREE.Points>(null);

  const obj = useMemo(() => {
    const centers: [number, number, number][] = [
      [-22, 14, -8], [28, -10, -4], [10, 22, -10],
      [-32, -18, 2], [4, -28, -6], [38, 18, -12],
    ];
    const perCluster = 30;
    const arr = new Float32Array(centers.length * perCluster * 3);
    let p = 0;
    for (const [cx, cy, cz] of centers) {
      for (let i = 0; i < perCluster; i++) {
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
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    const mat = new THREE.PointsMaterial({
      color: "#ffffff",
      size: 0.55,
      sizeAttenuation: true,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      map: softCircleTexture(),
      alphaTest: 0.001,
    });
    return new THREE.Points(geom, mat);
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.008;
  });

  return <primitive ref={ref} object={obj} />;
}

// ─── NEBULA GLOW BLOBS ───────────────────────────────
// Single-vertex Points with very large size + additive — bloom turns them into
// soft colored clouds. No custom shader.
function NebulaBlob({
  position,
  size,
  color,
  opacity = 0.5,
}: {
  position: [number, number, number];
  size: number;
  color: string;
  opacity?: number;
}) {
  const obj = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));
    const mat = new THREE.PointsMaterial({
      color,
      size,
      sizeAttenuation: true,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      map: softCircleTexture(),
      alphaTest: 0.001,
    });
    return new THREE.Points(geom, mat);
  }, [color, size, opacity]);
  return <primitive object={obj} position={position} />;
}

// ─── ASTERISM LINES ──────────────────────────────────
const asterisms: { stars: [number, number, number][]; edges: [number, number][] }[] = [
  {
    stars: [[-14, 8, -6], [-11, 5, -6], [-8, 6, -6], [-12, 1, -6], [-13, 11, -6], [-9, 11, -6]],
    edges: [[0, 1], [1, 2], [1, 3], [4, 0], [5, 2]],
  },
  {
    stars: [[18, 12, -8], [21, 14, -8], [23, 11, -8], [26, 14, -8], [29, 12, -8]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  {
    stars: [[-26, -8, -5], [-24, -6, -5], [-22, -8, -5], [-20, -7, -5], [-18, -9, -5], [-16, -11, -5], [-15, -13, -5]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
  },
];

function AsterismGroup() {
  const ref = useRef<THREE.Group>(null);

  const objects = useMemo(() => {
    return asterisms.map((ast) => {
      const lines = ast.edges.map(([a, b]) => {
        const pa = ast.stars[a], pb = ast.stars[b];
        const geom = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(pa[0], pa[1], pa[2]),
          new THREE.Vector3(pb[0], pb[1], pb[2]),
        ]);
        const mat = new THREE.LineBasicMaterial({
          color: "#f4ecdc",
          transparent: true,
          opacity: 0.1,
        });
        return new THREE.Line(geom, mat);
      });
      return { stars: ast.stars, lines };
    });
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.008;
  });

  return (
    <group ref={ref}>
      {objects.map((ast, ai) => (
        <group key={ai}>
          {ast.stars.map(([x, y, z], i) => (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[0.14, 12, 12]} />
              <meshBasicMaterial color="#fff7e8" />
            </mesh>
          ))}
          {ast.lines.map((line, i) => (
            <primitive key={i} object={line} />
          ))}
        </group>
      ))}
    </group>
  );
}

// ─── ROTATING STARS WRAPPER ──────────────────────────
// Drei's <Stars> doesn't auto-rotate; wrap it so the parallax still feels alive.
function DriftingStars() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.005;
      ref.current.rotation.x += delta * 0.002;
    }
  });
  return (
    <group ref={ref}>
      <Stars
        radius={120}
        depth={60}
        count={3500}
        factor={4}
        saturation={0.1}
        fade
        speed={0.4}
      />
    </group>
  );
}

// ─── ENVIRONMENT TUNING ──────────────────────────────
function useEnvironmentTuning() {
  const [tuning, setTuning] = useState({
    effects: true,
    bloomIntensity: 0.45,
    dpr: [1, 1.5] as [number, number],
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smallScreen = window.innerWidth < 768;
    setTuning({
      effects: !reduced,
      bloomIntensity: smallScreen ? 0.32 : 0.5,
      dpr: [1, Math.min(window.devicePixelRatio || 1, smallScreen ? 1.25 : 1.5)],
    });
  }, []);
  return tuning;
}

// ─── BACKDROP ────────────────────────────────────────
export default function Backdrop() {
  const tuning = useEnvironmentTuning();

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 18], fov: 60 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        dpr={tuning.dpr}
      >
        {/* Nebula glow blobs sit deepest */}
        <NebulaBlob position={[-30, 12, -22]} size={38} color="#ff7a3d" opacity={0.45} />
        <NebulaBlob position={[24, -16, -28]} size={32} color="#3b5fbf" opacity={0.4} />
        <NebulaBlob position={[8, 26, -30]} size={28} color="#b03050" opacity={0.35} />
        <NebulaBlob position={[-18, -22, -26]} size={26} color="#ffaa55" opacity={0.3} />

        {/* The starfield itself — Drei Stars handles the heavy lifting */}
        <DriftingStars />

        {/* Bright clusters in the foreground */}
        <StarClusters />

        {/* Constellation-like patterns */}
        <AsterismGroup />

        {tuning.effects && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={tuning.bloomIntensity}
              luminanceThreshold={0.6}
              luminanceSmoothing={0.22}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.2} darkness={0.55} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
