import { cn } from "@/libs/utils/cn";
import React, { HTMLAttributes } from "react";

export default function FormContainer({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLFormElement>) {
  return (
    <form
      {...props}
      className={cn("rounded-md border-2 border-yellow-500 p-4", className)}
    >
      {children}
    </form>
  );
}
