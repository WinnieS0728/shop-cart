import Product from "@/components/products/product";
import React from "react";

interface props {
  params: {
    id: string;
  };
}

export default async function productDetailPage({ params: { id } }: props) {
  return (
    <>
      <section className="p-4">
        <Product productId={id} />
      </section>
    </>
  );
}
