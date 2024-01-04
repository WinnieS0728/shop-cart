import React, { ReactNode } from "react";

export default function Modal({ children }: { children: ReactNode }) {
  return (
    <article className="h-10/12 fixed left-1/2 top-1/2 w-10/12 -translate-x-1/2 -translate-y-1/2 rounded-xl p-8">
      {children}
    </article>
  );
}
