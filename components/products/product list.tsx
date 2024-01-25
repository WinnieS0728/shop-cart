import React from "react";
import ProductCard from "./product card";
import { serverCaller } from "@/server/routers";

export default async function ProductList() {
  const productList = await serverCaller.product.getProductList();

  return (
    <>
      <section className="grid grid-cols-2 grid-rows-[repeat(4,auto)] gap-4 p-4">
        {productList.map((product) => (
          <ProductCard key={product._id.toString()} product={product} />
        ))}
      </section>
    </>
  );
}
