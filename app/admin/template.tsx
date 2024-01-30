"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { ReactNode } from "react";

export default function AminTemplate({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  return (
    <>
      <nav className="flex items-center justify-center gap-4 p-4">
        <Link className="rounded-xl bg-yellow-500 px-4 py-2" href={"/admin"}>
          會員資料
        </Link>
        {session?.token.role === "admin" && (
          <>
            <Link
              className="rounded-xl bg-yellow-500 px-4 py-2"
              href={"/admin/setting"}
            >
              基本設定
            </Link>
            <Link
              className="rounded-xl bg-yellow-500 px-4 py-2"
              href={"/admin/menu"}
            >
              產品清單
            </Link>
            <Link
              className="rounded-xl bg-yellow-500 px-4 py-2"
              href={"/admin/order"}
            >
              訂單管理
            </Link>
          </>
        )}
      </nav>
      <section className="px-8">{children}</section>
    </>
  );
}
