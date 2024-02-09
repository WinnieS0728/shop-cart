import { authOptions } from "@/libs/next auth";
import { serverCaller } from "@/server/routers";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React, { Fragment } from "react";
import CartItemCard from "./cart item card";
import { JSON_serialize } from "@/libs/utils/serialize";

export default async function CartList() {
  const session = await getServerSession(authOptions);
  const userId = session?.token.sub || "";

  const cartList = await serverCaller.cart.getCart({
    _id: userId,
  });

  return (
    <section className="grid gap-4">
      {cartList.map((cartItem) => (
        <article key={cartItem.product._id.toString()}>
          <Link href={""}>
            <CartItemCard itemData={JSON_serialize(cartItem)} />
          </Link>
        </article>
      ))}
    </section>
  );
}
