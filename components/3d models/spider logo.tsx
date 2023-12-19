"use client";
import { useGLTF, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";

export default function SpiderLogo() {
  const { scene } = useGLTF("/3d models/spider logo.glb");

  const logoRef = useRef<Mesh>(null);

  useFrame(() => {
    if (logoRef.current) {
      logoRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh
      ref={logoRef}
      scale={[0.015, 0.015, 0.015]}
      position={[0, 0.4, 0.6]}
    >
      <primitive object={scene} />
    </mesh>
  );
}
