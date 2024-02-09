import { cn } from "@/libs/utils/cn";
import React, { HTMLAttributes } from "react";

interface props extends HTMLAttributes<HTMLDivElement> {
  text: string;
}
export default function HrWithText({ text, className, ...props }: props) {
  return (
    <div
      className={cn("my-2 flex items-center justify-center gap-4", className)}
      {...props}
    >
      <hr className="w-full" />
      <span>{text}</span>
      <hr className="w-full" />
    </div>
  );
}
