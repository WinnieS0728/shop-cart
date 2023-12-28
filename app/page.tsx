"use client";
import CreateProductForm from "@/components/create product/create product form";
import React from "react";

export default function Page() {
  return (
    <main className='flex gap-4'>
      <section className='border-4 p-4'>
        <h3>create</h3>
        <div className='flex gap-4'>
          <CreateProductForm />
        </div>
      </section>
    </main>
  );
}
