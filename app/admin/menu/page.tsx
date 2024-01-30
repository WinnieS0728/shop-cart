import ProductList from "@/components/products/product list";
import Link from "next/link";
import React from "react";

export default function MenuPage() {
  return (
    <>
      <h2 className="text-center text-xl uppercase">menu setting</h2>
      <Link href={"menu/add"} className="add-new-btn block text-center">
        + add new product
      </Link>
      <section>
        <ProductList as="admin" />
      </section>
    </>
  );
}
