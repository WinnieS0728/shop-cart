"use client";
import { useProductMethods } from "@/app/api/mongoDB/products/methods";
import React, { Fragment } from "react";
import ProductCard from "./product card";
import { Loading } from "../UI/loading";

export default function ProductList() {
  const {
    GET: { data: productList, isPending },
  } = useProductMethods();

  console.log(productList);

  return (
    <>
      <section className="grid grid-cols-2 gap-4 p-4">
        {isPending
          ? Array(4)
              .fill(0)
              .map((_, index) => (
                <Fragment key={index}>
                  <Loading.block height={16 * 15} />
                </Fragment>
              ))
          : productList?.map((product) => (
              <ProductCard key={product._id as string} product={product} />
            ))}
      </section>
    </>
  );
}
