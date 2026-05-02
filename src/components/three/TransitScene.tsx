"use client";

import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function EmissiveStar({ brightness }: { brightness: number }) {
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    if (!mat.current) return;
    mat.current.emissiveIntensity = 2.2 * brightness;
  });
  return (
    <mesh>
      <sphereGeometry args={[1.5, 96, 96]} />
      <meshStandardMaterial
        ref={mat}
        color="#fff7e8"
        emissive="#ffa64d"
        emissiveIntensity={2.2}
        roughness={1}
        metalness={0}
        toneMapped={false}
      />
    </mesh>
  );
}

function Planet({
  planetRadius = 0.15,
  orbitRadius = 3,
  speed = 0.5,
  onPhase,
}: {
  planetRadius?: number;
  orbitRadius?: number;
  speed?: number;
  onPhase?: (phase: number) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const phaseRef = useRef(0);

  useFrame((_, delta) => {
    phaseRef.current += delta * speed;
    const angle = phaseRef.current;
    if (groupRef.current) {
      groupRef.current.position.x = Math.sin(angle) * orbitRadius;
      groupRef.current.position.z = Math.cos(angle) * orbitRadius;
    }
    if (onPhase) {
      const normalizedPhase =
        ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      onPhase(normalizedPhase);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh castShadow>
        <sphereGeometry args={[planetRadius, 48, 48]} />
        <meshStandardMaterial color="#1b1422" roughness={0.92} metalness={0.05} />
      </mesh>
    </group>
  );
}

function OrbitRing({ radius = 3 }: { radius?: number }) {
  const lineObj = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 192; i++) {
      const angle = (i / 192) * Math.PI * 2;
      points.push(
        new THREE.Vector3(Math.sin(angle) * radius, 0, Math.cos(angle) * radius)
      );
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: "#f4ecdc",
      transparent: true,
      opacity: 0.1,
    });
    return new THREE.Line(geometry, material);
  }, [radius]);
  return <primitive object={lineObj} />;
}

/** Drives the camera based on scrollProgress 0..1. */
function ScrollCamera({ progress }: { progress: number }) {
  const { camera } = useThree();
  useEffect(() => {
    // Act I (0..0.33): low side-on, close. Act II (0.33..0.66): tilt up to see
    // the orbital plane from above. Act III (0.66..1): pull back to lab view.
    const phaseA = Math.min(1, progress / 0.33);
    const phaseB = Math.max(0, Math.min(1, (progress - 0.33) / 0.33));
    const phaseC = Math.max(0, (progress - 0.66) / 0.34);
    const y = 1.2 + phaseB * 4.5;
    const z = 6 - phaseA * 0.5 + phaseC * 2.5;
    const x = phaseC * -1.5;
    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
  }, [progress, camera]);
  return null;
}

type SceneContentProps = {
  planetRadius: number;
  onBrightness?: (b: number) => void;
  speed?: number;
  progress?: number;
  enableControls?: boolean;
};

/** Scene-graph only. Use inside an externally-managed Canvas (e.g. CinemaShell). */
export function TransitSceneContent({
  planetRadius,
  onBrightness,
  speed = 0.8,
  progress,
  enableControls = false,
}: SceneContentProps) {
  const [brightness, setBrightness] = useState(1);

  const handlePhase = useCallback(
    (phase: number) => {
      const transitPhase = Math.abs(Math.sin(phase));
      const isTransiting =
        Math.cos(phase) > 0 && transitPhase < planetRadius / 1.5;
      const b = isTransiting ? 1 - (planetRadius * planetRadius) / (1.5 * 1.5) : 1;
      setBrightness(b);
      onBrightness?.(b);
    },
    [planetRadius, onBrightness]
  );

  return (
    <>
      <ambientLight intensity={0.18} />
      <pointLight position={[0, 0, 0]} intensity={2.4} color="#ffb070" />
      <EmissiveStar brightness={brightness} />
      <Planet
        planetRadius={planetRadius}
        orbitRadius={3}
        speed={speed}
        onPhase={handlePhase}
      />
      <OrbitRing radius={3} />
      {progress !== undefined && <ScrollCamera progress={progress} />}
      {enableControls && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(Math.PI * 2) / 3}
        />
      )}
    </>
  );
}

/** Standalone canvas wrapper. Used by TransitSimulator. */
export default function TransitScene({
  planetRadius = 0.15,
  className = "",
  onBrightness,
}: {
  planetRadius?: number;
  className?: string;
  onBrightness?: (b: number) => void;
}) {
  return (
    <div className={`w-full aspect-square max-w-md ${className}`}>
      <Canvas
        camera={{ position: [0, 2, 6], fov: 50 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.75]}
      >
        <TransitSceneContent
          planetRadius={planetRadius}
          onBrightness={onBrightness}
          enableControls
        />
      </Canvas>
    </div>
  );
}
