"use client";
import { ReactNode } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";

interface props {
  children: ReactNode;
}

export default function SmoothScrollProvider({ children }: props) {
  return <ReactLenis root>{children}</ReactLenis>;
}
