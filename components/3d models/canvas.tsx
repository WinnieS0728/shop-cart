"use client";
import { Html, Scroll, ScrollControls } from "@react-three/drei";
import React, { Suspense, useRef } from "react";
import { Group, Mesh } from "three";
import SpiderLogo from "./spider logo";
import SpotMan from "./spot man";
import gsap from "gsap";
import {
  MotionValue,
  SpringOptions,
  motionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { motion } from "framer-motion-3d";
import { MeshProps, useFrame } from "@react-three/fiber";

function CanvasLoader() {
  return (
    <Html>
      <p>loading</p>
    </Html>
  );
}
interface props {
  scrollYProgress: MotionValue<number>;
}

export default function Scene({ scrollYProgress }: props) {
  const options: SpringOptions = {
    damping: 25,
  };
  const positionY = useTransform(scrollYProgress, [0, 1], [-1, -1.15]);
  const positionZ = useTransform(scrollYProgress, [0, 1], [0, 4.25]);

  const spotmanRef = useRef<MeshProps>(null);

  const pointerPosition = {
    x: useSpring(motionValue(0), options),
    y: useSpring(motionValue(0), options),
  };

  useFrame((state) => {
    const {
      pointer: { x, y },
    } = state;

    pointerPosition.x.set(x);
    pointerPosition.y.set(y);
  });

  const rx = useTransform(pointerPosition.y, [-1, 1], [0.05, -0.05]);
  const ry = useTransform(pointerPosition.x, [-1, 1], [-0.1, 0.1]);

  const rotationX = 
    useTransform(() => rx.get() * (1 - scrollYProgress.get()))
  const rotationY =
    useTransform(() => ry.get() * (1 - scrollYProgress.get()))

  return (
    <>
      <directionalLight intensity={5} />

      <Suspense fallback={<CanvasLoader />}>
        <motion.mesh
          position={[0, positionY, positionZ]}
          rotation={[rotationX, rotationY, 0]}
          ref={spotmanRef}
        >
          <SpotMan />
        </motion.mesh>
      </Suspense>
    </>
  );
}
