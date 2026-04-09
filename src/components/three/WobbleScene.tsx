"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function WobblingStar({
  amplitude = 0.3,
  speed = 0.5,
}: {
  amplitude?: number;
  speed?: number;
}) {
  const starRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    const wobble = Math.sin(t) * amplitude;
    if (starRef.current) {
      starRef.current.position.x = -wobble;
    }
    if (glowRef.current) {
      glowRef.current.position.x = -wobble;
    }
  });

  return (
    <group>
      <mesh ref={starRef}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshBasicMaterial color="#818cf8" />
      </mesh>
      <mesh ref={glowRef} scale={2}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color="#6366f1"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function OrbitingPlanet({
  amplitude = 0.3,
  speed = 0.5,
}: {
  amplitude?: number;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    if (ref.current) {
      ref.current.position.x = Math.sin(t) * 3 + amplitude * Math.sin(t);
      ref.current.position.z = Math.cos(t) * 3;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color="#4f46e5" roughness={0.6} />
    </mesh>
  );
}

function Arrows() {
  return (
    <group>
      {/* Blue-shift arrow (towards viewer) */}
      <mesh position={[-3, 0, 0]}>
        <coneGeometry args={[0.15, 0.4, 3]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.6} />
      </mesh>
      {/* Red-shift arrow (away from viewer) */}
      <mesh position={[3, 0, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.15, 0.4, 3]} />
        <meshBasicMaterial color="#f87171" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

export default function WobbleScene({
  amplitude = 0.3,
  className = "",
}: {
  amplitude?: number;
  className?: string;
}) {
  return (
    <div className={`w-full aspect-square max-w-md ${className}`}>
      <Canvas camera={{ position: [0, 3, 6], fov: 50 }}>
        <ambientLight intensity={0.15} />
        <pointLight position={[0, 5, 5]} intensity={1} />
        <WobblingStar amplitude={amplitude} speed={0.8} />
        <OrbitingPlanet amplitude={amplitude} speed={0.8} />
        <Arrows />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(Math.PI * 2) / 3}
        />
      </Canvas>
    </div>
  );
}
