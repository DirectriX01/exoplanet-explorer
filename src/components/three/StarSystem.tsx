"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Sun({
  temp = 5778,
  radius = 1,
}: {
  temp?: number;
  radius?: number;
}) {
  const color = temp > 7000 ? "#dbeafe" : temp > 5500 ? "#fef3c7" : temp > 4000 ? "#fed7aa" : "#fecaca";

  return (
    <group>
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh scale={2}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function Planet({
  orbitRadius = 3,
  planetRadius = 0.15,
  speed = 0.4,
  color = "#64748b",
}: {
  orbitRadius?: number;
  planetRadius?: number;
  speed?: number;
  color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    if (ref.current) {
      ref.current.position.x = Math.cos(t) * orbitRadius;
      ref.current.position.z = Math.sin(t) * orbitRadius;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[planetRadius, 32, 32]} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  );
}

function OrbitRing({ radius }: { radius: number }) {
  const lineObj = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      points.push(
        new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
      );
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.06 });
    return new THREE.Line(geometry, material);
  }, [radius]);

  return <primitive object={lineObj} />;
}

export default function StarSystem({
  starTemp = 5778,
  starRadius = 1,
  planetOrbit = 3,
  planetSize = 0.15,
  className = "",
}: {
  starTemp?: number;
  starRadius?: number;
  planetOrbit?: number;
  planetSize?: number;
  className?: string;
}) {
  return (
    <div className={`w-full aspect-square max-w-md ${className}`}>
      <Canvas camera={{ position: [0, 3, 7], fov: 50 }}>
        <ambientLight intensity={0.15} />
        <pointLight position={[0, 0, 0]} intensity={1.5} />
        <Sun temp={starTemp} radius={starRadius} />
        <Planet
          orbitRadius={planetOrbit}
          planetRadius={planetSize}
          color="#6366f1"
        />
        <OrbitRing radius={planetOrbit} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={0.5}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
