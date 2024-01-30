import React from "react";
import ProductCard from "./product card";
import { serverCaller } from "@/server/routers";
import Link from "next/link";

interface props {
  as: "admin" | "user";
}

export default async function ProductList({ as }: props) {
  const productList = await serverCaller.product.getProductList();

  return (
    <>
      <section className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] grid-rows-[repeat(4,auto)] gap-4 p-4">
        {productList.map((product) => (
          <Link
            key={product._id.toString()}
            href={
              as === "admin"
                ? `menu/edit/${product._id}`
                : `/menu/${product._id}`
            }
          >
            <ProductCard product={product} />
          </Link>
        ))}
      </section>
    </>
  );
}
