import { product_listSchema } from "@/app/api/mongoDB/products/methods";
import Image from "next/image";
import React from "react";
import { z } from "zod";

interface props {
  product: z.infer<typeof product_listSchema>;
}

export default function ProductCard({ product }: props) {
  function getSoldScale(soldNumber: number) {
    switch (true) {
      case soldNumber >= 10:
        return "10 +";
      case soldNumber >= 50:
        return "50 +";
      case soldNumber >= 100:
        return "100 +";
      default:
        return `${soldNumber}`;
    }
  }

  function getStockScale(stock: number) {
    if (stock >= 10) {
      return "10+";
    } else {
      return `${stock}`;
    }
  }
  return (
    <>
      <article className="flex flex-col items-center justify-center gap-4 rounded-xl border-4 p-2">
        <div className="relative w-full">
          <Image
            src={product.imageUrl.thumbnail}
            alt={`${product.title} image`}
            width={300}
            height={400}
            priority
            className="aspect-square w-full border object-contain"
          />
          <div className="absolute bottom-0 left-0 flex w-full items-center justify-end bg-gray-100/50 p-2">
            {product.tags.map((tag) => (
              <span
                className="rounded-md bg-green-500 px-2 text-white"
                key={tag._id as string}
              >
                {tag.title}
              </span>
            ))}
          </div>
        </div>
        <article className="w-full px-4">
          <div>
            <p className="mb-2 text-xl">{product.title}</p>
          </div>
          <div className="flex items-center justify-start gap-2">
            {product.categories.map((category) => (
              <span
                className="rounded-md bg-yellow-500 px-2 text-white"
                key={category._id as string}
              >
                {category.title}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl text-red-500">
              ${product.price.toLocaleString()}
            </p>
            <div>
              {<p>剩餘 {getStockScale(product.stock)}</p>}
              <small>已售出 {getSoldScale(product.sold)}</small>
            </div>
          </div>
        </article>
      </article>
    </>
  );
}
