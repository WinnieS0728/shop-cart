"use client";
import { useGLTF } from "@react-three/drei";

export default function SpotMan() {
  const { scene } = useGLTF("/3d models/spot man.glb");

  return (
    <mesh
      rotation={[-0.1, -0.07, 0]}
      position={[0, -1, 0]}
    >
      <primitive object={scene} />
    </mesh>
  );
}
