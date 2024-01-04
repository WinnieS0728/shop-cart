import CreateProductForm from "@/components/create product/create product form";
import Link from "next/link";
import React from "react";

export default function AddNewProduct() {
  return (
    <>
      <section className="px-8">
        <h2 className="text-center text-xl uppercase">create new product</h2>
        <CreateProductForm />
      </section>
    </>
  );
}
