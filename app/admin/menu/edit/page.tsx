import ProductForm from "@/components/products/product form";
import React from "react";

export default function ProductEditPage() {
  return (
    <>
      <section className="px-8">
        <h2 className="text-center text-xl uppercase">edit product</h2>
        <ProductForm as="update" />
      </section>
    </>
  );
}
