"use client";
import React, { useRef } from "react";
import ClipText from "./clip text";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import SpiderLogo from "../3d models/spider logo";
import { Center, ContactShadows } from "@react-three/drei";

export default function TitleSection() {
  const container = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end end"],
  });

  const translateProgress = useTransform(scrollYProgress, [0, 1], [-100, 0]);
  const translateY = useMotionTemplate`${translateProgress}%`;

  const clipProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const clipPath = useMotionTemplate`circle(${clipProgress}% at 50% 50%)`;

  return (
    <>
      <section className='bg-black h-[300dvh] overflow-clip'>
        <section className='h-screen sticky top-0'>
          <h1 className='text-white uppercase text-[15rem] h-full flex flex-col justify-center items-start gap-10'>
            <ClipText text='spider' />
            <ClipText
              text='verse'
              className='self-end'
            />
          </h1>
        </section>
        <section className='h-screen sticky top-0 flex justify-center items-center'>
          <Image
            className=''
            src={"/images/spider logo.png"}
            alt='spider logo'
            width={500}
            height={500}
            priority
          />
        </section>
        <motion.section
          ref={container}
          className='h-screen sticky top-0 origin-center'
          style={{
            y: translateY,
            clipPath: clipPath,
          }}
        >
          <div className='w-full h-screen'>
            <Canvas
              className='bg-spider-red-500'
              camera={{
                position: [0, 2.8, -5],
                rotation: [0, 3.15, 0],
                fov: 100,
                near: 0.1,
                far: 1000,
              }}
            >
              <>
                <directionalLight
                  position={[0, 1.5, -10]}
                  intensity={0.5}
                />
                <ambientLight intensity={5} />
                <group position={[0.05, 3, 0]}>
                  <Center>
                    <SpiderLogo />
                  </Center>
                </group>
                <ContactShadows
                  scale={20}
                  blur={0.5}
                />
              </>
            </Canvas>
          </div>
        </motion.section>
      </section>
      <section className='w-full h-screen bg-spider-red-500'></section>
    </>
  );
}