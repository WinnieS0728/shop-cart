"use client";
import {
  Html,
  PresentationControls,
  Scroll,
  ScrollControls,
} from "@react-three/drei";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Group } from "three";
import SpiderLogo from "./spider logo";
import SpotMan from "./spot man";
import SpiderMan from "./spider man";

function CanvasLoader() {
  return (
    <Html>
      <p>loading</p>
    </Html>
  );
}

export default function Scene() {
  const groupRef = useRef<Group>(null);
  const [rotation, setRotation] = useState<number>(0);

  useEffect(() => {
    document.addEventListener("mousemove", handlePointerMove);

    return () => {
      document.removeEventListener("mousemove", handlePointerMove);
    };
  }, []);

  function handlePointerMove(e: MouseEvent) {
    const percent = ((e.x - innerWidth / 2) / innerWidth) * 100;
    // * transform [50,50] to [0.05,0.05]
    const rotation = percent / 1000;
    setRotation(rotation);
  }

  return (
    <>
      <directionalLight intensity={5} />
      <ambientLight intensity={0.1} />

      <Suspense fallback={<CanvasLoader />}>
        <PresentationControls
          polar={[0, 0]}
          azimuth={[-0.05, 0.05]}
          rotation={[0, rotation, 0]}
          cursor={false}
        >
          {/* <ScrollControls pages={5}>
            <group ref={groupRef}>
              <SpotMan />
              <SpiderLogo />
            </group>
          </ScrollControls> */}
          <SpiderMan />
        </PresentationControls>
      </Suspense>
    </>
  );
}
