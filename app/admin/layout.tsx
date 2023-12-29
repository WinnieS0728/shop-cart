import Link from "next/link";
import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <main>
      <nav className="flex items-center justify-center gap-4 p-4">
        <Link className="rounded-xl bg-yellow-500 px-4 py-2" href={"/admin/"}>
          profile
        </Link>
        <Link className="rounded-xl bg-yellow-500 px-4 py-2" href={"/admin/"}>
          setting
        </Link>
        <Link className="rounded-xl bg-yellow-500 px-4 py-2" href={"/admin/"}>
          menu
        </Link>
        <Link className="rounded-xl bg-yellow-500 px-4 py-2" href={"/admin/"}>
          order
        </Link>
      </nav>
      {children}
    </main>
  );
}
