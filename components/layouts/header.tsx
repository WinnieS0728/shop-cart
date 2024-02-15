"use client";
import userIcon from "@images/user-icon.png";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Logo, Cart, Menu, Contact, User } from "../icons";

export const dynamic = "force-dynamic";

export default function Header() {
  const { data: session } = useSession();
  return (
    <header className="sticky top-0 z-10 w-full bg-red-500 p-2">
      <nav className="flex items-center justify-between">
        <Link href={"/admin"} className="aspect-square">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="user-avatar"
              width={48}
              height={48}
              priority
              className="overflow-hidden rounded-full"
            />
          ) : (
            <User className="text-3xl" />
          )}
        </Link>
        <div className="flex items-center justify-center gap-8">
          <Link href={"/menu"}>
            <Menu className="text-3xl" />
          </Link>
          <Link href={"/"}>
            <div className="flex h-16 w-24 items-center justify-center">
              <Logo className="text-5xl" />
            </div>
          </Link>
          <Link href={"/"}>
            <Contact className="text-3xl" />
          </Link>
        </div>
        <Link
          href={"/cart"}
          className="flex aspect-square w-12 items-center justify-center rounded-full"
        >
          <Cart className="text-3xl" />
        </Link>
      </nav>
    </header>
  );
}
