"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

interface PlanetConfig {
  name: string;
  radius: number;
  orbitRadius: number;
  speed: number;
  color: string;
  emissive: string;
}

function CentralStar() {
  return (
    <group>
      {/* Bright emissive core */}
      <mesh>
        <sphereGeometry args={[1, 96, 96]} />
        <meshStandardMaterial
          color="#fff7e8"
          emissive="#ffa64d"
          emissiveIntensity={2.6}
          roughness={1}
          metalness={0}
          toneMapped={false}
        />
      </mesh>
      {/* Coronagraph occulter — small, just suggesting it's been masked */}
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[1.35, 64]} />
        <meshBasicMaterial color="#07060d" transparent opacity={0.6} />
      </mesh>
      {/* Soft ember halo where the star spills past the coronagraph */}
      <mesh scale={2.6}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#ff8a63"
          transparent
          opacity={0.06}
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
        <meshStandardMaterial
          color={config.color}
          emissive={config.emissive}
          emissiveIntensity={1.4}
          roughness={0.6}
          toneMapped={false}
        />
      </mesh>
      <OrbitRing radius={config.orbitRadius} />
    </group>
  );
}

function OrbitRing({ radius }: { radius: number }) {
  const lineObj = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 192; i++) {
      const angle = (i / 192) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        )
      );
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: "#f4ecdc",
      transparent: true,
      opacity: 0.12,
    });
    return new THREE.Line(geometry, material);
  }, [radius]);
  return <primitive object={lineObj} />;
}

// HR 8799 planets — warm hot-glowing young giants. Ember/amber palette
// matches the cinematic accent instead of the old pink-purple stack.
const hr8799Planets: PlanetConfig[] = [
  { name: "HR 8799 e", radius: 0.18, orbitRadius: 2.5, speed: 0.25, color: "#ffb070", emissive: "#ff6b3d" },
  { name: "HR 8799 d", radius: 0.2,  orbitRadius: 3.5, speed: 0.15, color: "#ffa05e", emissive: "#ff7a4d" },
  { name: "HR 8799 c", radius: 0.22, orbitRadius: 4.8, speed: 0.1,  color: "#ff8a63", emissive: "#e85a30" },
  { name: "HR 8799 b", radius: 0.2,  orbitRadius: 6.2, speed: 0.06, color: "#ff7a55", emissive: "#cc4920" },
];

export default function OrbitalSystem({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full aspect-square max-w-md ${className}`}>
      <Canvas
        camera={{ position: [0, 5, 10], fov: 50 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.75]}
      >
        <ambientLight intensity={0.22} />
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
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.85} luminanceThreshold={0.6} luminanceSmoothing={0.22} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
