import { serverCaller } from "@/server/routers";
import React from "react";
import ProductCard from "../products/product card";

export default async function BestThree() {
  const top3 = await serverCaller.product.getTop3();
  return (
    <>
      <section className="p-8">
        <h3 className="text-3xl">熱銷前三</h3>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-4 p-4">
          {top3.map((product) => (
            <ProductCard key={product._id.toString()} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
