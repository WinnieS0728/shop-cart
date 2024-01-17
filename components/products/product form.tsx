"use client";
import React, { useEffect, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { product_schema } from "@/libs/mongoDB/schemas/product";
import { Label, InputText, InputOnlyNumber, InputSubmit } from "../UI/inputs";
import { ReactSelect } from "@components/UI/select";
import { toast } from "react-toastify";
import FormContainer from "../UI/form";
import ProductImgDropzone from "./product img dropzone";
import { useProductMethods } from "@/app/api/mongoDB/products/methods";
import { useBasicSettingMethods } from "@/app/api/mongoDB/basicSetting/[type]/methods";
import { useImageMethods } from "@/hooks/useImage";
import { useSearchParams } from "next/navigation";
import { Types } from "mongoose";
import { Loading } from "../UI/loading";

interface props {
  as: "create" | "update";
}

export default function ProductForm({ as }: props) {
  const search = useSearchParams();
  const productId = search.get("id");
  const {
    GETbyId,
    POST: { mutateAsync: createNewProduct },
    PATCH: { mutateAsync: updateProduct },
  } = useProductMethods();
  const { data: product } = GETbyId(productId || "");
  const {
    GET: { data: categoryList, isPending: isGetCategoryLoading },
  } = useBasicSettingMethods().category;
  const {
    GET: { data: tagList, isPending: isGetTagsLoading },
  } = useBasicSettingMethods().tag;

  const methods = useForm<z.infer<typeof product_schema>>({
    resolver: zodResolver(product_schema),
    criteriaMode: "all",
    defaultValues: {
      _id: new Types.ObjectId(),
      title: "",
      content: "",
      categories: [],
      price: 0,
      stock: 0,
      sold: 0,
      imageUrl: {
        normal: "",
        thumbnail: "",
      },
      tags: [],
    },
  });

  const {
    handleSubmit,
    watch,
    control,
    formState: { isSubmitting },
    reset,
  } = methods;
  const prevImage = useRef<string>("");
  useEffect(() => {
    if (as === "update" && product) {
      reset({
        _id: product._id,
        title: product.title,
        content: product.content,
        categories: product.categories.map((category) => category._id),
        price: product.price,
        stock: product.stock,
        sold: product.sold,
        imageUrl: product.imageUrl,
        tags: product.tags.map((tag) => tag._id),
      });
      prevImage.current = product.imageUrl.normal;
    }
  }, [as, product, reset]);

  const isProductHasImage = !!watch("imageUrl.normal");

  const { confirmImage, imageProcess } = useImageMethods("productImage");

  async function onSubmit(data: z.infer<typeof product_schema>) {
    // console.log(data);
    as === "create" ? onCreate(data) : onUpdate(data);
  }

  function onCreate(data: z.infer<typeof product_schema>) {
    const request = new Promise(async (resolve, reject) => {
      const res = await createNewProduct(data);

      if (!res.ok) {
        reject(false);
      }

      try {
        await confirmImage(data.imageUrl.normal);
        resolve(await res.json());
      } catch (error) {
        console.log(error);
        reject(await res.json());
      }
    });

    toast.promise(request, {
      pending: "建立中...",
      success: {
        render({ data }) {
          return `${data}`;
        },
      },
      error: {
        render({ data }) {
          return `建立失敗, ${data}`;
        },
      },
    });
  }

  function onUpdate(data: z.infer<typeof product_schema>) {
    // console.log(data);
    const request = new Promise(async (resolve, reject) => {
      const res = await updateProduct(data);

      if (!res.ok) {
        reject(false);
      }

      try {
        await imageProcess(prevImage.current, data.imageUrl.normal);
        resolve(await res.json());
      } catch (error) {
        console.log(error);
        reject(await res.json());
      }
    });

    toast.promise(request, {
      pending: "更新中...",
      success: {
        render({ data }) {
          return `${data}`;
        },
      },
      error: {
        render({ data }) {
          return `${data}`;
        },
      },
    });
  }

  if (!product || isGetCategoryLoading || isGetTagsLoading) {
    return (
      <>
        <Loading.block height={16 * 30} />
      </>
    );
  }

  return (
    <>
      <FormProvider {...methods}>
        <FormContainer
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-8">
            <ProductImgDropzone />
            <div className="flex w-full flex-col gap-2">
              <Label label="產品名稱" required>
                <InputText name="title" />
              </Label>
              <Label label="產品內容">
                <InputText name="content" />
              </Label>
              <Label label="產品分類">
                <Controller
                  control={control}
                  name="categories"
                  render={({ field: { onChange, value } }) => (
                    <ReactSelect
                      name="categoryList"
                      options={categoryList}
                      isLoading={isGetCategoryLoading}
                      placeholder="選擇分類..."
                      getOptionLabel={(option) =>
                        (option as NonNullable<typeof categoryList>[number])
                          .title
                      }
                      getOptionValue={(option) =>
                        (option as NonNullable<typeof categoryList>[number])
                          ._id as string
                      }
                      onChange={(selectList) => {
                        onChange(
                          (selectList as NonNullable<typeof categoryList>).map(
                            (option) => option._id,
                          ),
                        );
                      }}
                      value={value.map((categoryId) => {
                        return categoryList!.find(
                          (category) => category._id === categoryId,
                        );
                      })}
                      isMulti
                    />
                  )}
                />
              </Label>
              <Label label="價格" required>
                <InputOnlyNumber name="price" />
              </Label>
              <Label label="庫存" required>
                <InputOnlyNumber name="stock" />
              </Label>
              <Label label="標籤">
                <Controller
                  control={control}
                  name="tags"
                  render={({ field: { onChange, value } }) => (
                    <ReactSelect
                      options={tagList}
                      isLoading={isGetTagsLoading}
                      placeholder="選擇標籤..."
                      getOptionLabel={(option) =>
                        (option as NonNullable<typeof tagList>[number]).title
                      }
                      getOptionValue={(option) =>
                        (option as NonNullable<typeof tagList>[number])
                          ._id as string
                      }
                      onChange={(selectList) => {
                        onChange(
                          (selectList as NonNullable<typeof tagList>).map(
                            (option) => option._id,
                          ),
                        );
                      }}
                      value={value.map((tagId) =>
                        tagList!.find((tag) => tag._id === tagId),
                      )}
                      isMulti
                    />
                  )}
                />
              </Label>
            </div>
          </div>
          <InputSubmit
            value={"儲存"}
            disabled={isSubmitting || !isProductHasImage}
          />
        </FormContainer>
      </FormProvider>
    </>
  );
}
