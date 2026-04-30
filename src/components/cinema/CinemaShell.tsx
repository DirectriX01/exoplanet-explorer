"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas } from "@react-three/fiber";

const ProgressContext = createContext(0);

/** Returns this CinemaShell's scroll progress 0..1. */
export const useCinemaProgress = () => useContext(ProgressContext);

type Props = {
  /** Total scroll height of the cinema. Use multiples of svh for parity across devices. */
  height?: string;
  /** R3F scene rendered inside the sticky Canvas. */
  scene: ReactNode;
  /** Overlay layer — typically Act components. */
  children?: ReactNode;
  cameraPosition?: [number, number, number];
  cameraFov?: number;
};

export default function CinemaShell({
  height = "320svh",
  scene,
  children,
  cameraPosition = [0, 0, 8],
  cameraFov = 55,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let ticking = false;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollableSpan = rect.height - vh;
      const passed = -rect.top;
      const p = scrollableSpan > 0 ? passed / scrollableSpan : 0;
      setProgress(Math.max(0, Math.min(1, p)));
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <ProgressContext.Provider value={progress}>
      <section
        ref={sectionRef}
        style={{ height }}
        className="relative"
        // overscroll-contain prevents iOS rubber-banding from breaking sticky
        // touch-action: pan-y keeps vertical swipes flowing to Lenis
      >
        <div
          className="sticky top-0 h-[100svh] w-full overflow-hidden"
          style={{ touchAction: "pan-y", overscrollBehavior: "contain" }}
        >
          <Canvas
            camera={{ position: cameraPosition, fov: cameraFov }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            dpr={[1, 1.75]}
            style={{ position: "absolute", inset: 0 }}
          >
            {scene}
          </Canvas>
          <div className="absolute inset-0 pointer-events-none">{children}</div>
        </div>
      </section>
    </ProgressContext.Provider>
  );
}
