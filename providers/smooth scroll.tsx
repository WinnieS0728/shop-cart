"use client";
import Lenis from "@studio-freight/lenis";

import { ReactNode, useEffect, useMemo } from "react";

interface props {
  children: ReactNode;
}

export default function SmoothScrollProvider({ children }: props) {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  return children;
}
