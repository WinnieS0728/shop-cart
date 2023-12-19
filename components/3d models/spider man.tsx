"use client";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useCallback, useEffect, useRef } from "react";
import { Mesh } from "three";

const spider_animation = [
  {
    name: "punch",
    key: "Armature|Armature|hero_spiderman01_S08@atk-01|Base Layer",
    loop: false,
  },
  {
    name: "kick",
    key: "Armature|Armature|hero_spiderman01_S08@atk-02|Base Layer",
    loop: false,
  },
  {
    name: "run",
    key: "Armature|Armature|hero_spiderman01_S08@dash|Base Layer",
    loop: true,
  },
  {
    name: "die",
    key: "Armature|Armature|hero_spiderman01_S08@die|Base Layer",
    loop: false,
  },
  {
    name: "hurt",
    key: "Armature|Armature|hero_spiderman01_S08@hit|Base Layer",
    loop: false,
  },
  {
    name: "idle",
    key: "Armature|Armature|hero_spiderman01_S08@idle|Base Layer",
    loop: false,
  },
  {
    name: "flip&pull",
    key: "Armature|Armature|hero_spiderman01_S08@skill01|Base Layer",
    loop: false,
  },
  {
    name: "pull&throw",
    key: "Armature|Armature|hero_spiderman01_S08@skill02|Base Layer",
    loop: false,
  },
  {
    name: "hardPull",
    key: "Armature|Armature|hero_spiderman01_S08@skill03|Base Layer",
    loop: false,
  },
  {
    name: "bad1",
    key: "Armature|Armature|hero_spiderman01_S08@skill04|Base Layer",
    loop: false,
  },
  {
    name: "throw1",
    key: "Armature|Armature|hero_spiderman01_S08@skill05-01|Base Layer",
    loop: false,
  },
  {
    name: "throw2",
    key: "Armature|Armature|hero_spiderman01_S08@skill05-02|Base Layer",
    loop: false,
  },
  {
    name: "throw3",
    key: "Armature|Armature|hero_spiderman01_S08@skill05-03|Base Layer",
    loop: false,
  },
  {
    name: "dance1",
    key: "Armature|Armature|hero_spiderman01_S08@skill06_cam|Base Layer",
    loop: false,
  },
  {
    name: "dance2",
    key: "Armature|Armature|hero_spiderman01_S08@skill06|Base Layer",
    loop: false,
  },
  {
    name: "flip&attack",
    key: "Armature|Armature|hero_spiderman01_S08@succ_cam|Base Layer",
    loop: false,
  },
  {
    name: "wait",
    key: "Armature|Armature|hero_spiderman01_S08@wait|Base Layer",
    loop: false,
  },
  {
    name: "run2",
    key: "Armature|Armature|hero_spiderman01_S08@walk|Base Layer",
    loop: true,
  },
] as const;

export default function SpiderMan() {
  const spidermanRef = useRef<Mesh>(null);
  const { scene, animations } = useGLTF("/3d models/spider man.glb");
  const { actions } = useAnimations(animations, spidermanRef);
  const nowAction = useRef<(typeof spider_animation)[number]["key"] | null>(
    null
  );

  const spiderAnimation = useCallback(
    (animationName: (typeof spider_animation)[number]["name"]) => {
      const targetAnimation = spider_animation.find(
        (animation) => animation.name === animationName
      ) as (typeof spider_animation)[number];
      if (nowAction.current) {
        actions[nowAction.current]?.stop();
      }

      if (targetAnimation.loop) {
        actions[targetAnimation.key]?.fadeIn(0.5).play();
      } else {
        actions[targetAnimation.key]?.fadeIn(0.5).setLoop(2200, 1).play();
      }

      nowAction.current = targetAnimation.key;
    },
    [actions]
  );

  return (
    <mesh
      ref={spidermanRef}
      rotation={[-0.1, -0.07, 0]}
      position={[0, -0.5, 0]}
      scale={[0.3, 0.3, 0.3]}
    >
      <primitive object={scene} />
    </mesh>
  );
}
