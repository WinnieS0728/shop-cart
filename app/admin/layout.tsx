import Link from "next/link";
import React, { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <nav className="flex items-center justify-center gap-4 p-4">
        <Link className="rounded-xl bg-yellow-500 px-4 py-2" href={"/admin/user"}>
          profile
        </Link>
        <Link className="rounded-xl bg-yellow-500 px-4 py-2" href={"/admin/setting"}>
          setting
        </Link>
        <Link className="rounded-xl bg-yellow-500 px-4 py-2" href={"/admin/menu"}>
          menu
        </Link>
        <Link className="rounded-xl bg-yellow-500 px-4 py-2" href={"/admin/order"}>
          order
        </Link>
      </nav>
      {children}
    </main>
  );
}
