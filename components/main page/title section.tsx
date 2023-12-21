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
import { Center, OrbitControls } from "@react-three/drei";

export default function TitleSection() {
  const container = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const translateProgress = useTransform(scrollYProgress, [0, 1], [-100, 0]);
  const translateY = useMotionTemplate`${translateProgress}%`;

  return (
    <>
      <section className='bg-black h-[300dvh] overflow-clip'>
        <section className='h-screen sticky top-0'>
          <h1 className='text-white uppercase text-[16rem] h-full flex flex-col justify-center items-start gap-20'>
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
            scale: scale,
            y: translateY,
          }}
        >
          
        </motion.section>
      </section>
      {/* <section className='w-full h-screen bg-spider-red-500'></section> */}
    </>
  );
}
