"use client";
import React from "react";
import { useForm } from "react-hook-form";

export default function CreateProductForm() {
  const { handleSubmit, register } = useForm({
    defaultValues: {
      title: "",
      content: "",
      category: "",
      price: 0,
      stock: 0,
      imageUrl: "",
      tags: [],
    },
  });

  function onSubmit() {}
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}></form>
    </>
  );
}
