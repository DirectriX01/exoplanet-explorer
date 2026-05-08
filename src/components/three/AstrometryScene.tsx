"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function WobblingPositionStar() {
  const starRef = useRef<THREE.Mesh>(null);
  const trailPoints = useRef<[number, number, number][]>([[0, 0, 0]]);
  const maxTrailLength = 220;

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.3;
    const wobbleX = Math.sin(t) * 0.4;
    const wobbleY = Math.cos(t * 1.3) * 0.25;
    const driftX = t * 0.15;
    const driftY = Math.sin(t * 0.1) * 0.5;

    const px = wobbleX + driftX - 2;
    const py = wobbleY + driftY;

    if (starRef.current) {
      starRef.current.position.x = px;
      starRef.current.position.y = py;
    }

    trailPoints.current.push([px, py, 0]);
    if (trailPoints.current.length > maxTrailLength) {
      trailPoints.current.shift();
    }
  });

  return (
    <group>
      <mesh ref={starRef}>
        <sphereGeometry args={[0.22, 48, 48]} />
        <meshStandardMaterial
          color="#fff2e0"
          emissive="#ffa64d"
          emissiveIntensity={2.6}
          toneMapped={false}
        />
      </mesh>
      <TrailLine trailRef={trailPoints} />
    </group>
  );
}

function TrailLine({
  trailRef,
}: {
  trailRef: React.RefObject<[number, number, number][]>;
}) {
  const lineRef = useRef<THREE.Line>(null);

  useFrame(() => {
    if (lineRef.current && trailRef.current && trailRef.current.length > 2) {
      const points = trailRef.current.map(
        (p) => new THREE.Vector3(p[0], p[1], p[2])
      );
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      lineRef.current.geometry.dispose();
      lineRef.current.geometry = geometry;
    }
  });

  const initialGeometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints([new THREE.Vector3()]),
    []
  );

  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#ff6b3d",
        transparent: true,
        opacity: 0.85,
      }),
    []
  );

  return (
    <primitive
      ref={lineRef}
      object={new THREE.Line(initialGeometry, material)}
    />
  );
}

function BackgroundStars() {
  const positions = useMemo(() => {
    const stars: [number, number, number][] = [];
    for (let i = 0; i < 80; i++) {
      stars.push([
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 9,
        -2 + Math.random() * -4,
      ]);
    }
    return stars;
  }, []);

  return (
    <>
      {positions.map((pos, i) => {
        const bright = Math.random() > 0.85;
        return (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[bright ? 0.05 : 0.03, 8, 8]} />
            <meshStandardMaterial
              color="#f4ecdc"
              emissive="#f4ecdc"
              emissiveIntensity={bright ? 1.8 : 0.6}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </>
  );
}

export default function AstrometryScene({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full aspect-square max-w-md ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.75]}
      >
        <ambientLight intensity={0.2} />
        <WobblingPositionStar />
        <BackgroundStars />
        <OrbitControls enableZoom={false} enablePan={false} />
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.75} luminanceThreshold={0.7} luminanceSmoothing={0.22} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
