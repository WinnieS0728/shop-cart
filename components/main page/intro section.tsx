'use client'
import { Canvas } from "@react-three/fiber";
import { useScroll } from "framer-motion";
import React, { useRef } from "react";
import Scene from "../3d models/canvas";


export default function IntroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  return (
    <section
      ref={containerRef}
      className='h-[300dvh]'
    >
      <div className='h-screen sticky top-0'>
        <Canvas
          className='bg-black'
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
  );
}
