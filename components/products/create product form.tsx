"use client";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageDropzone from "./product img dropzone";
import { z } from "zod";
import { product_schema } from "@/libs/mongoDB/schemas/product";
import { Label, InputText, InputOnlyNumber, InputSubmit } from "../UI/inputs";
import { useEdgeStore } from "@/libs/edgestore";
import { ReactAsyncSelect, ReactSelect } from "@components/UI/select";
import { toast } from "react-toastify";
import FormContainer from "../UI/form";
import ProductImgDropzone from "./product img dropzone";
import { useProductMethods } from "@/app/api/mongoDB/products/methods";
import { useBasicSettingMethods } from "@/app/api/mongoDB/basicSetting/[type]/methods";
export default function CreateProductForm() {
  const { edgestore } = useEdgeStore();
  const {
    POST: { mutateAsync: createNewProduct },
  } = useProductMethods();
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
      title: "",
      content: "",
      category: [],
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
  } = methods;

  function getIsImageUploadDone() {
    return !!watch("imageUrl");
  }

  async function onSubmit(data: z.infer<typeof product_schema>) {
    console.log(data);
    const request = new Promise(async (resolve, reject) => {
      const res = await createNewProduct(data);

      if (!res.ok) {
        reject(false);
      }

      try {
        await confirmImageUpload(data.imageUrl.normal);
        resolve(true);
      } catch (error) {
        console.log(error);
        reject(false);
      }
    });

    toast.promise(request, {
      pending: "建立中...",
      success: "建立完成",
      error: "建立失敗",
    });
  }

  async function confirmImageUpload(url: string) {
    await edgestore.productImage.confirmUpload({
      url: url,
    });
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
                  name="category"
                  render={({ field: { onChange } }) => (
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
                          .title
                      }
                      onChange={(selectList) => {
                        onChange(
                          (selectList as NonNullable<typeof categoryList>).map(
                            (option) => option.title,
                          ),
                        );
                      }}
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
                  render={({ field: { onChange } }) => (
                    <ReactSelect
                      options={tagList}
                      isLoading={isGetTagsLoading}
                      placeholder="選擇標籤..."
                      getOptionLabel={(option) =>
                        (option as NonNullable<typeof tagList>[number]).title
                      }
                      getOptionValue={(option) =>
                        (option as NonNullable<typeof tagList>[number]).title
                      }
                      onChange={(selectList) => {
                        onChange(
                          (selectList as NonNullable<typeof tagList>).map(
                            (option) => option.title,
                          ),
                        );
                      }}
                      isMulti
                    />
                  )}
                />
              </Label>
            </div>
          </div>
          <InputSubmit value={"儲存"} />
        </FormContainer>
      </FormProvider>
    </>
  );
}
