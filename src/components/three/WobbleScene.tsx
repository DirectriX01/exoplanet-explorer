"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function WobblingStar({
  amplitude = 0.3,
  speed = 0.5,
}: {
  amplitude?: number;
  speed?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const blueShiftRef = useRef<THREE.PointLight>(null);
  const redShiftRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    const wobble = Math.sin(t) * amplitude;
    const velocity = Math.cos(t); // -1 to +1, sign indicates direction toward/away
    if (groupRef.current) groupRef.current.position.x = -wobble;
    // Light up the appropriate shift indicator
    if (blueShiftRef.current) blueShiftRef.current.intensity = Math.max(0, velocity) * 2.5;
    if (redShiftRef.current) redShiftRef.current.intensity = Math.max(0, -velocity) * 2.5;
  });

  return (
    <>
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[1.2, 96, 96]} />
          <meshStandardMaterial
            color="#fff2e0"
            emissive="#ffa64d"
            emissiveIntensity={2.4}
            roughness={1}
            toneMapped={false}
          />
        </mesh>
        <mesh scale={2.2}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshBasicMaterial
            color="#ff8a63"
            transparent
            opacity={0.05}
            side={THREE.BackSide}
          />
        </mesh>
      </group>
      <pointLight ref={blueShiftRef} position={[-4, 0, 2]} color="#7eb6ff" distance={6} />
      <pointLight ref={redShiftRef} position={[4, 0, 2]} color="#ff7e7e" distance={6} />
    </>
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
      <sphereGeometry args={[0.22, 48, 48]} />
      <meshStandardMaterial color="#1b1422" roughness={0.92} metalness={0.05} />
    </mesh>
  );
}

function ShiftCones() {
  // Blue cone on the left (approaching us), red cone on the right (receding).
  // These are conceptual labels — the lights inside WobblingStar do the
  // shifting on the star itself.
  return (
    <group>
      <mesh position={[-3.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.18, 0.5, 16]} />
        <meshStandardMaterial
          color="#7eb6ff"
          emissive="#7eb6ff"
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[3.2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.18, 0.5, 16]} />
        <meshStandardMaterial
          color="#ff7e7e"
          emissive="#ff7e7e"
          emissiveIntensity={1.6}
          toneMapped={false}
        />
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
      <Canvas
        camera={{ position: [0, 3, 6], fov: 50 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.75]}
      >
        <ambientLight intensity={0.18} />
        <WobblingStar amplitude={amplitude} speed={0.8} />
        <OrbitingPlanet amplitude={amplitude} speed={0.8} />
        <ShiftCones />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(Math.PI * 2) / 3}
        />
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.85} luminanceThreshold={0.6} luminanceSmoothing={0.22} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
