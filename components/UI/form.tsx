import { cn } from "@/libs/utils/cn";
import React, { HTMLAttributes } from "react";

export default function FormContainer({
  className,
  children,
  title,
  ...props
}: HTMLAttributes<HTMLFormElement>) {
  return (
    <form
      {...props}
      className={cn(
        "rounded-md border-2 border-yellow-500 px-4 py-8",
        className,
      )}
    >
      {title && <h3 className="mb-4 text-xl">{title}</h3>}
      {children}
    </form>
  );
}
