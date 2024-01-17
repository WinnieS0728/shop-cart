import ProductForm from "@/components/products/product form";
import React from "react";

export default function AddNewProduct() {
  return (
    <>
      <section className="px-8">
        <h2 className="text-center text-xl uppercase">create new product</h2>
        <ProductForm as="create" />
      </section>
    </>
  );
}
