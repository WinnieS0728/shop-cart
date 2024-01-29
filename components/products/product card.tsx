import { product_listSchema } from "@/libs/mongoDB/schemas/product";
import Image from "next/image";
import Link from "next/link";
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
      <article className="row-span-4 grid grid-rows-subgrid gap-2 rounded-xl border-4 p-4">
        <Link href={`menu/edit/${product._id}`}>
          <div className="relative w-full">
            <Image
              src={product.imageUrl.thumbnail}
              alt={`${product.title} image`}
              width={300}
              height={400}
              priority
              className="aspect-square w-full border object-contain"
            />
            {!!product.tags.length && (
              <div className="absolute bottom-0 left-0 flex w-full flex-wrap-reverse items-center justify-end gap-1 bg-gray-100/50 p-2">
                {product.tags.map((tag) => (
                  <span
                    className="whitespace-nowrap rounded-md bg-green-500 px-2 text-white"
                    key={tag._id as string}
                  >
                    {tag.title}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
        <div>
          <p className="text-2xl">{product.title}</p>
        </div>
        <div className="mb-4 flex flex-wrap items-start justify-start gap-2">
          {product.categories.map((category) => (
            <span
              className="whitespace-nowrap rounded-md bg-yellow-500 px-2 text-white"
              key={category._id as string}
            >
              {category.title}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-3xl text-red-500">
            ${product.price.toLocaleString()}
          </p>
          <div>
            {<p>剩餘 {getStockScale(product.stock)}</p>}
            <small>已售出 {getSoldScale(product.sold)}</small>
          </div>
        </div>
      </article>
    </>
  );
}
