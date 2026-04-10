"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface PlanetConfig {
  name: string;
  radius: number;
  orbitRadius: number;
  speed: number;
  color: string;
}

function CentralStar() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="#f0f0ff" />
      </mesh>
      {/* Coronagraph mask */}
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[1.8, 64]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.92} />
      </mesh>
      <mesh scale={3}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#ec4899"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function ImagingPlanet({
  config,
  index,
}: {
  config: PlanetConfig;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const startAngle = (index * Math.PI * 2) / 4 + 0.5;

  useFrame((state) => {
    const t = state.clock.elapsedTime * config.speed + startAngle;
    if (ref.current) {
      ref.current.position.x = Math.cos(t) * config.orbitRadius;
      ref.current.position.z = Math.sin(t) * config.orbitRadius;
    }
  });

  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[config.radius, 32, 32]} />
        <meshBasicMaterial color={config.color} />
      </mesh>
      {/* Orbit ring */}
      <OrbitRing radius={config.orbitRadius} />
    </group>
  );
}

function OrbitRing({ radius }: { radius: number }) {
  const lineObj = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        )
      );
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.06 });
    return new THREE.Line(geometry, material);
  }, [radius]);

  return <primitive object={lineObj} />;
}

const hr8799Planets: PlanetConfig[] = [
  { name: "HR 8799 e", radius: 0.18, orbitRadius: 2.5, speed: 0.25, color: "#f472b6" },
  { name: "HR 8799 d", radius: 0.2, orbitRadius: 3.5, speed: 0.15, color: "#e879f9" },
  { name: "HR 8799 c", radius: 0.22, orbitRadius: 4.8, speed: 0.1, color: "#c084fc" },
  { name: "HR 8799 b", radius: 0.2, orbitRadius: 6.2, speed: 0.06, color: "#a78bfa" },
];

export default function OrbitalSystem({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full aspect-square max-w-md ${className}`}>
      <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
        <ambientLight intensity={0.2} />
        <CentralStar />
        {hr8799Planets.map((planet, i) => (
          <ImagingPlanet key={planet.name} config={planet} index={i} />
        ))}
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
