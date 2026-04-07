"use client";

import { useRef, useState, useCallback, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Star({ brightness }: { brightness: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.15 * brightness;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshBasicMaterial color={new THREE.Color(1 * brightness, 0.85 * brightness, 0.4 * brightness)} />
      </mesh>
      {/* Glow */}
      <mesh ref={glowRef} scale={2.5}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
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
      <mesh>
        <sphereGeometry args={[planetRadius, 32, 32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
    </group>
  );
}

function OrbitRing({ radius = 3 }: { radius?: number }) {
  const lineObj = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      points.push(
        new THREE.Vector3(Math.sin(angle) * radius, 0, Math.cos(angle) * radius)
      );
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.07 });
    return new THREE.Line(geometry, material);
  }, [radius]);

  return <primitive object={lineObj} />;
}

function TransitSceneInner({
  planetRadius,
  onBrightness,
}: {
  planetRadius: number;
  onBrightness: (b: number) => void;
}) {
  const [brightness, setBrightness] = useState(1);

  const handlePhase = useCallback(
    (phase: number) => {
      const transitPhase = Math.abs(Math.sin(phase));
      const isTransiting = Math.cos(phase) > 0 && transitPhase < planetRadius / 1.5;
      const b = isTransiting ? 1 - (planetRadius * planetRadius) / (1.5 * 1.5) : 1;
      setBrightness(b);
      onBrightness(b);
    },
    [planetRadius, onBrightness]
  );

  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#f59e0b" />
      <Star brightness={brightness} />
      <Planet
        planetRadius={planetRadius}
        orbitRadius={3}
        speed={0.8}
        onPhase={handlePhase}
      />
      <OrbitRing radius={3} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(Math.PI * 2) / 3}
      />
    </>
  );
}

export default function TransitScene({
  planetRadius = 0.15,
  className = "",
}: {
  planetRadius?: number;
  className?: string;
}) {
  const [, setBrightness] = useState(1);

  return (
    <div className={`w-full aspect-square max-w-md ${className}`}>
      <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
        <TransitSceneInner
          planetRadius={planetRadius}
          onBrightness={setBrightness}
        />
      </Canvas>
    </div>
  );
}
