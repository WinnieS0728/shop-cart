import ProductDetail from "@/components/products/product detail";
import { JSON_serialize } from "@/libs/utils/serialize";
import { serverCaller } from "@/server/routers";
import React from "react";

interface props {
  params: {
    id: string;
  };
}

export default async function productDetailPage({ params: { id } }: props) {
  const product = await serverCaller.product.getProductById({
    _id: id,
  });
  return (
    <>
      <ProductDetail initData={JSON_serialize(product)} />
    </>
  );
}
