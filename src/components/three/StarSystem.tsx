"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// Physical-ish color mapping for stellar effective temperature.
// Cool M-dwarfs glow deep red-orange; sun-likes warm yellow; hot O/B-types pale blue.
function colorForTemp(temp: number): { surface: string; emissive: string; intensity: number } {
  if (temp >= 10000) return { surface: "#cde0ff", emissive: "#7eb0ff", intensity: 3.2 };
  if (temp >= 7500)  return { surface: "#eaf0ff", emissive: "#bcd0ff", intensity: 3.0 };
  if (temp >= 6000)  return { surface: "#fff8ec", emissive: "#fff3d6", intensity: 2.8 };
  if (temp >= 5200)  return { surface: "#fff2d6", emissive: "#ffd28a", intensity: 2.6 };
  if (temp >= 4000)  return { surface: "#ffd3a0", emissive: "#ff9248", intensity: 2.4 };
  if (temp >= 3000)  return { surface: "#ffb37a", emissive: "#ff6428", intensity: 2.3 };
  return { surface: "#ff8a55", emissive: "#ff4910", intensity: 2.2 };
}

function Sun({ temp = 5778, radius = 1 }: { temp?: number; radius?: number }) {
  const { surface, emissive, intensity } = colorForTemp(temp);
  return (
    <group>
      <mesh>
        <sphereGeometry args={[radius, 96, 96]} />
        <meshStandardMaterial
          color={surface}
          emissive={emissive}
          emissiveIntensity={intensity}
          roughness={1}
          metalness={0}
          toneMapped={false}
        />
      </mesh>
      {/* Soft chromatic glow halo — additive blend for bloom catch */}
      <mesh scale={1.6}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial
          color={emissive}
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Planet({
  orbitRadius = 3,
  planetRadius = 0.15,
  speed = 0.4,
  color = "#d4a574",
  starColor = "#ffd28a",
}: {
  orbitRadius?: number;
  planetRadius?: number;
  speed?: number;
  color?: string;
  starColor?: string;
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
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[planetRadius, 48, 48]} />
        <meshStandardMaterial
          color={color}
          roughness={0.78}
          metalness={0.05}
          emissive={starColor}
          emissiveIntensity={0.08}
        />
      </mesh>
    </group>
  );
}

function OrbitRing({ radius }: { radius: number }) {
  const lineObj = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 192; i++) {
      const angle = (i / 192) * Math.PI * 2;
      points.push(
        new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
      );
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: "#f4ecdc",
      transparent: true,
      opacity: 0.22,
    });
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
  // Ensure the planet is always visible — bump tiny radii so they read on screen
  const renderPlanetSize = Math.max(planetSize, 0.18);
  const { emissive } = colorForTemp(starTemp);

  return (
    <div className={`w-full aspect-square max-w-md ${className}`}>
      <Canvas
        camera={{ position: [0, 2.5, 7], fov: 50 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.75]}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={2.4} color={emissive} distance={20} />
        <Sun temp={starTemp} radius={starRadius} />
        <Planet
          orbitRadius={planetOrbit}
          planetRadius={renderPlanetSize}
          color="#e8d6b8"
          starColor={emissive}
        />
        <OrbitRing radius={planetOrbit} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={0.5}
          maxPolarAngle={Math.PI / 2}
        />
        <EffectComposer multisampling={0}>
          <Bloom intensity={1.0} luminanceThreshold={0.55} luminanceSmoothing={0.22} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
