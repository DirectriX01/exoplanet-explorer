"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function BackgroundStar() {
  return (
    <mesh position={[0, 0, -8]}>
      <sphereGeometry args={[0.32, 48, 48]} />
      <meshStandardMaterial
        color="#fff7e8"
        emissive="#ffd28a"
        emissiveIntensity={3}
        toneMapped={false}
      />
    </mesh>
  );
}

function LensingStarWithPlanet() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.15;
    if (groupRef.current) groupRef.current.position.x = Math.sin(t) * 4;
    if (ringRef.current) {
      const alignment = 1 - Math.abs(Math.sin(t));
      const ringScale = alignment * 1.5 + 0.1;
      ringRef.current.scale.set(ringScale, ringScale, 1);
      const mat = ringRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = alignment * 0.7;
      mat.emissiveIntensity = alignment * 2.4;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Lensing star — dim red dwarf */}
      <mesh>
        <sphereGeometry args={[0.4, 48, 48]} />
        <meshStandardMaterial
          color="#ffa05e"
          emissive="#ff6b3d"
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>
      {/* Planet companion */}
      <mesh position={[0.85, 0, 0]}>
        <sphereGeometry args={[0.09, 32, 32]} />
        <meshStandardMaterial color="#1b1422" roughness={0.95} />
      </mesh>
      {/* Einstein ring — appears as alignment peaks */}
      <mesh ref={ringRef} position={[0, 0, -0.1]}>
        <ringGeometry args={[0.8, 0.92, 96]} />
        <meshStandardMaterial
          color="#f4ecdc"
          emissive="#fff2d0"
          emissiveIntensity={0}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          toneMapped={false}
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
        mat.opacity = 0.05 + Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.03;
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
            position={[Math.cos(angle) * 0.5, Math.sin(angle) * 0.5, -4]}
            rotation={[0, 0, angle]}
          >
            <planeGeometry args={[0.02, 8]} />
            <meshBasicMaterial
              color="#fff2d0"
              transparent
              opacity={0.04}
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
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.75]}
      >
        <ambientLight intensity={0.15} />
        <BackgroundStar />
        <LensingStarWithPlanet />
        <LightRays />
        <OrbitControls enableZoom={false} enablePan={false} />
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.95} luminanceThreshold={0.55} luminanceSmoothing={0.22} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
