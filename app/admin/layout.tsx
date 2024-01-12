import Link from "next/link";
import React, { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <nav className="flex items-center justify-center gap-4 p-4">
        <Link className="rounded-xl bg-yellow-500 px-4 py-2" href={"/admin/user"}>
          會員資料
        </Link>
        <Link className="rounded-xl bg-yellow-500 px-4 py-2" href={"/admin/setting"}>
          基本設定
        </Link>
        <Link className="rounded-xl bg-yellow-500 px-4 py-2" href={"/admin/menu"}>
          產品清單
        </Link>
        <Link className="rounded-xl bg-yellow-500 px-4 py-2" href={"/admin/order"}>
          訂單管理
        </Link>
      </nav>
      {children}
    </main>
  );
}
