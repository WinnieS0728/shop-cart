"use client";
import {
  Cloud,
  Clouds,
  Html,
  OrbitControls,
  Scroll,
  ScrollControls,
  SpotLight,
  useHelper,
} from "@react-three/drei";
import React, { Suspense, useRef } from "react";
import { Group, Mesh, SpotLightHelper } from "three";
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
import { GroupProps, MeshProps, useFrame } from "@react-three/fiber";

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

  const spotmanRef = useRef<GroupProps>(null);

  const pointerPosition = {
    x: useSpring(0, options),
    y: useSpring(0, options),
  };

  const zoom = useTransform(scrollYProgress, [0, 1], [5, 10]);

  useFrame((state) => {
    const {
      camera,
      pointer: { x, y },
    } = state;
    camera.zoom = zoom.get();
    camera.updateProjectionMatrix();

    pointerPosition.x.set(x);
    pointerPosition.y.set(y);
  });

  const rx = useTransform(pointerPosition.y, [-1, 1], [0.05, -0.05]);
  const ry = useTransform(pointerPosition.x, [-1, 1], [-0.1, 0.1]);

  const rotationX = useTransform(() => rx.get() * (1 - scrollYProgress.get()));
  const rotationY = useTransform(() => ry.get() * (1 - scrollYProgress.get()));

  return (
    <>
      <directionalLight intensity={5} />

      <Suspense fallback={<CanvasLoader />}>
        <motion.group
          position={[0, positionY, positionZ]}
          rotation={[rotationX, rotationY, 0]}
          ref={spotmanRef}
        >
          <SpotMan />
        </motion.group>
      </Suspense>
    </>
  );
}
