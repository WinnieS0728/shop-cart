"use client";
import userIcon from "@images/user-icon.png";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function Header() {
  const { data: session } = useSession();
  return (
    <header className="sticky top-0 z-10 w-full bg-red-500 p-2">
      <nav className="flex items-center justify-between">
        <Link
          href={"/admin"}
          className="aspect-square overflow-hidden rounded-full"
        >
          <Image
            src={session?.user?.image || userIcon}
            alt="user-avatar"
            width={48}
            height={48}
            priority
          />
        </Link>
        <div className="flex items-center justify-center gap-12">
          <Link href={"/menu"}>menu</Link>
          <Link href={"/"}>
            <div className="h-16 w-24 bg-yellow-500">logo</div>
          </Link>
          <Link href={"/contact"}>contact</Link>
        </div>
        <Link
          href={"/cart"}
          className="aspect-square w-12 rounded-full bg-yellow-500"
        >
          shop cart
        </Link>
      </nav>
    </header>
  );
}
