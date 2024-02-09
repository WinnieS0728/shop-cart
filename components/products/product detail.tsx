"use client";
import { product_listSchema } from "@/libs/mongoDB/schemas/product";
import { cn } from "@/libs/utils/cn";
import { trpc } from "@/providers/trpc provider";
import React, { ReactNode, useState } from "react";
import { z } from "zod";

interface props {
  initData: z.infer<typeof product_listSchema>;
}

type tabType = "content" | "detail";

export default function ProductDetail({ initData }: props) {
  const [nowTab, setTab] = useState<tabType>("content");
  const { data: product } = trpc.product.getProductById.useQuery(
    {
      _id: initData._id,
    },
    {
      initialData: initData,
    },
  );
  return (
    <>
      <article className="grid gap-4">
        <div className="grid grid-cols-2">
          <button
            type="button"
            className={cn("border py-1 text-center text-lg", {
              "border-b-2 border-b-red-500": nowTab === "content",
            })}
            onClick={() => {
              setTab("content");
            }}
          >
            商品內容
          </button>
          <button
            type="button"
            className={cn("border py-1 text-center text-lg", {
              "border-b-2 border-b-red-500": nowTab === "detail",
            })}
            onClick={() => {
              setTab("detail");
            }}
          >
            商品資訊
          </button>
        </div>
        {nowTab === "content" ? (
          <p>{product.content}</p>
        ) : (
          <article className="grid grid-cols-[auto_1fr]">
            <DetailBlock label="商品名稱" value={product.title} />
            <DetailBlock
              label="建議售價"
              value={`$NTD ${product.price.toLocaleString()}`}
            />
            <DetailBlock
              label="商品分類"
              value={product.categories.map((category) => (
                <span
                  key={category._id.toString()}
                  className="rounded-md bg-yellow-500 px-2 py-1"
                >
                  {category.title}
                </span>
              ))}
            />
            <DetailBlock
              label="商品標籤"
              value={product.tags.map((tag) => (
                <span
                  key={tag._id.toString()}
                  className="rounded-md bg-green-500 px-2 py-1"
                >
                  {tag.title}
                </span>
              ))}
            />
            <DetailBlock label="已售出" value={product.sold.toLocaleString()} />
            <DetailBlock label="庫存" value={product.stock.toLocaleString()} />
          </article>
        )}
      </article>
    </>
  );
}

interface blockProps {
  label: string;
  value: ReactNode;
}

function DetailBlock({ label, value }: blockProps) {
  return (
    <>
      <div className="col-span-2 grid grid-cols-subgrid">
        <p className="flex items-center px-2 py-1">{label}</p>
        <p className="flex flex-wrap items-center gap-2 px-2 py-1">{value}</p>
      </div>
    </>
  );
}
