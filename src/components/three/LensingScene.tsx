"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function BackgroundStar() {
  return (
    <mesh position={[0, 0, -8]}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshBasicMaterial color="#fef3c7" />
    </mesh>
  );
}

function LensingStarWithPlanet() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.15;
    if (groupRef.current) {
      groupRef.current.position.x = Math.sin(t) * 4;
    }
    // Grow Einstein ring as star aligns
    if (ringRef.current) {
      const alignment = 1 - Math.abs(Math.sin(t));
      const ringScale = alignment * 1.5 + 0.1;
      ringRef.current.scale.set(ringScale, ringScale, 1);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = alignment * 0.4;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Lensing star */}
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshBasicMaterial color="#fb923c" />
      </mesh>
      {/* Planet */}
      <mesh position={[0.8, 0, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>
      {/* Einstein ring effect */}
      <mesh ref={ringRef} position={[0, 0, -0.1]}>
        <ringGeometry args={[0.8, 1.0, 64]} />
        <meshBasicMaterial
          color="#fef3c7"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function LightRays() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.children.forEach((child, i) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = 0.03 + Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.02;
      });
    }
  });

  return (
    <group ref={ref}>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 0.5,
              Math.sin(angle) * 0.5,
              -4,
            ]}
            rotation={[0, 0, angle]}
          >
            <planeGeometry args={[0.02, 8]} />
            <meshBasicMaterial
              color="#fef3c7"
              transparent
              opacity={0.03}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function LensingScene({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full aspect-square max-w-md ${className}`}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.1} />
        <BackgroundStar />
        <LensingStarWithPlanet />
        <LightRays />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
