"use client";
import Scene from "@/components/3d models/canvas";
import SpiderLogo from "@/components/3d models/spider logo";
import { Canvas } from "@react-three/fiber";
import { useScroll } from "framer-motion";
import { useRef } from "react";

export default function HomePage() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <main>
      <section
        ref={containerRef}
        className='h-[300dvh]'
      >
        <div className='h-screen sticky top-0'>
          <Canvas
            className='bg-black no-scrollbar'
            camera={{
              position: [0, 0.25, 5],
              zoom: 5,
              near: 0.1,
              far: 1000,
            }}
          >
            <Scene scrollYProgress={scrollYProgress} />
          </Canvas>
        </div>
      </section>
    </main>
  );
}
