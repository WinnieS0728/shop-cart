"use client";
import { cn } from "@/libs/tailwind/cn";
import {
  MotionValue,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import React, { useEffect, useRef } from "react";

interface props {
  text: string;
  className?: string;
}
export default function ClipText({ text, className }: props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end end"],
  });
  const clipProgress = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clip = useMotionTemplate`inset(0 ${clipProgress}% 0 0)`;

  return (
    <div
      className={cn("select-none relative", className)}
      ref={containerRef}
    >
      <p className='absolute top-0 text-spider-red-500'>{text}</p>
      <motion.p style={{ clipPath: clip }}>{text}</motion.p>
    </div>
  );
}
