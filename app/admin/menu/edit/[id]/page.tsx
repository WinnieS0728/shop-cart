import ProductForm from "@/components/products/product form";
import { JSON_serialize } from "@/libs/utils/serialize";
import { serverCaller } from "@/server/routers";
import React from "react";

interface props {
  params: {
    id: string;
  };
}

export default async function ProductEditPage({ params: { id } }: props) {
  const product = await serverCaller.product.getProductById({
    _id: id,
  });
  const categoryList =
    await serverCaller.basicSetting.category.getCategoryList();
  const tagList = await serverCaller.basicSetting.tag.getTagList();
  return (
    <>
      <section className="px-8">
        <h2 className="text-center text-xl uppercase">edit product</h2>
        <ProductForm
          as="update"
          initData={JSON_serialize(product)}
          initCategoryList={JSON_serialize(categoryList)}
          initTagList={JSON_serialize(tagList)}
        />
      </section>
    </>
  );
}
