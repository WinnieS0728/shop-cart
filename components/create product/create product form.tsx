// "use client";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageDropzone from "./ImageDropzone";
import { z } from "zod";
import { product_schema } from "@/libs/mongoDB/models/product";
import { Label, InputText, InputOnlyNumber } from "../UI/inputs";
import { useEdgeStore } from "@/libs/edgestore";
import { ReactAsyncSelect, ReactSelect } from "@components/UI/select";
import { toast } from "react-toastify";
export default function CreateProductForm() {
  const { edgestore } = useEdgeStore();

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
      imageUrl: "",
      tags: [],
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = methods;

  function getIsImageUploadDone() {
    return !!watch("imageUrl");
  }

  async function onSubmit(data: z.infer<typeof product_schema>) {
    console.log(data);
    // const request = new Promise(async (resolve, reject) => {
    //   const res = await fetch("/api/mongoDB/products", {
    //     method: "POST",
    //     headers: {
    //       "Content-type": "application/json",
    //     },
    //     body: JSON.stringify(data),
    //   });

    //   await confirmImageUpload(data.imageUrl);
    //   if (res.ok) {
    //     resolve(true);
    //   } else {
    //     reject(false);
    //   }
    // });

    // toast.promise(request, {
    //   pending: "建立中...",
    //   success: "建立完成",
    //   error: "建立失敗",
    // });
  }

  async function confirmImageUpload(url: string) {
    await edgestore.publicImages.confirmUpload({
      url: url,
    });
  }

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center justify-center gap-4 w-full"
        >
          <ImageDropzone setImageUrl={setValue} />
          <div className="flex w-full flex-col gap-2">
            <Label label="產品名稱" required>
              <InputText name="title" error={errors.title?.message} />
            </Label>
            <Label label="產品內容">
              <InputText name="content" error={errors.content?.message} />
            </Label>
            <Label label="產品分類">
              <Controller
                control={control}
                name="category"
                render={({ field: { onChange } }) => <ReactSelect isMulti />}
              />
            </Label>
            <Label label="價格" required>
              <InputOnlyNumber name="price" error={errors.price?.message} />
            </Label>
            <Label label="庫存" required>
              <InputOnlyNumber name="stock" error={errors.stock?.message} />
            </Label>
            <Label label="標籤">
              <Controller
                control={control}
                name="tags"
                render={({ field: { onChange } }) => (
                  <ReactAsyncSelect isMulti />
                )}
              />
            </Label>
            <input
              type="submit"
              value="send"
              // disabled={isSubmitting || !getIsImageUploadDone()}
            />
          </div>
        </form>
      </FormProvider>
    </>
  );
}
