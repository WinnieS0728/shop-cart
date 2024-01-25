import { product_listSchema } from "@/app/api/mongoDB/products/methods";
import ProductForm from "@/components/products/product form";
import { JSON_serialize } from "@/libs/utils/serialize";
import { serverCaller } from "@/server/routers";
import { Types } from "mongoose";
import React from "react";
import { z } from "zod";

export default async function AddNewProduct() {
  const categoryList =
    await serverCaller.basicSetting.category.getCategoryList();
  const tagList = await serverCaller.basicSetting.tag.getTagList();

  const defaultValue = {
    _id: new Types.ObjectId(),
    title: "",
    content: "",
    price: 0,
    stock: 0,
    sold: 0,
    imageUrl: {
      normal: "",
      thumbnail: "",
    },
    categories: [],
    tags: [],
  } satisfies z.infer<typeof product_listSchema>;

  return (
    <>
      <section className="px-8">
        <h2 className="text-center text-xl uppercase">create new product</h2>
        <ProductForm
          as="create"
          initData={JSON_serialize(defaultValue)}
          initCategoryList={JSON_serialize(categoryList)}
          initTagList={JSON_serialize(tagList)}
        />
      </section>
    </>
  );
}
