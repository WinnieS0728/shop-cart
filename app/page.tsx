"use client";
import Scene from "@/components/3d models/canvas";
import { Canvas } from "@react-three/fiber";

export default function HomePage() {
  return (
    <main className='h-screen'>
      <Canvas
        // className='bg-black'
        camera={{
          position: [0, 0.25, 5],
          zoom: 5,
          near: 0.1,
          far: 1000,
        }}
      >
        <Scene />
      </Canvas>
    </main>
  );
}
