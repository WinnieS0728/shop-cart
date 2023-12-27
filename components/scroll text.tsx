"use client";
import React, { useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "framer-motion";

export default function ScrollText() {
  //   const baseScale = useMotionValue(1);

  //   const target = useRef(null);
  //   const { scrollYProgress } = useScroll({
  //     target: target,
  //     offset: ["start 80%", "end 20%"],
  //   });

  //   const scalePercent = useTransform(scrollYProgress, [0, 1], [1, 2]);

  //   const springValue = useSpring(scalePercent, {
  //     damping: 30,
  //     stiffness: 500,
  //   });

  const speed = 0.2;
  const direction = 1;
  const baseX = useMotionValue(0);

  useAnimationFrame(() => {
    baseX.set(baseX.get() - direction * speed);
  });

  const translateX = useTransform(
    baseX,
    (v) => `${wrap(-10 - 100 / 6, -10, v)}%`
  );

  return (
    <div className='flex justify-center items-center h-[300dvh]'>
      {/* <div className='w-full h-2 bg-green-500 fixed left-0 top-[20%]'></div> */}
      {/* <div className='w-full h-2 bg-green-500 fixed left-0 top-[80%]'></div> */}
      {/* <div
        ref={target}
        className='w-full h-2 bg-blue-500'
      ></div> */}
      {/* <motion.div
        ref={target}
        style={{
          scale: springValue,
        }}
        className='w-20 h-20 bg-red-500'
      ></motion.div> */}
      <motion.h1
        style={{
          x: translateX,
        }}
        className='flex gap-8'
      >
        <span className='text-[5rem]'>123456789</span>
        <span className='text-[5rem]'>123456789</span>
        <span className='text-[5rem]'>123456789</span>
        <span className='text-[5rem]'>123456789</span>
        <span className='text-[5rem]'>123456789</span>
        <span className='text-[5rem]'>123456789</span>
      </motion.h1>
    </div>
  );
}
