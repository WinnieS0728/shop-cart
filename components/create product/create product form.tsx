// "use client";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
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
    defaultValues: {
      title: "",
      content: "",
      category: [],
      price: 0,
      stock: 0,
      imageUrl: "",
      tags: [],
    },
  });

  const { handleSubmit, setValue, watch, control } = methods;

  function getIsImageUploadDone() {
    return !!watch("imageUrl");
  }

  async function onSubmit(data: z.infer<typeof product_schema>) {
    const request = new Promise(async (resolve, reject) => {
      const res = await fetch("/api/mongoDB/products", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      await confirmImageUpload(data.imageUrl);
      if (res.ok) {
        resolve(true);
      } else {
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
    await edgestore.publicImages.confirmUpload({
      url: url,
    });
  }

  const categoryOptions = ["a", "b", "c"].map((category) => ({
    label: category,
    value: category,
  }));

  const asyncOptions = async (inputValue: string) => {
    return new Promise<{ label: string; value: string }[]>((resolve) => {
      setTimeout(() => {
        resolve(
          ["a", "b", "c"].map((category) => ({
            label: category,
            value: category,
          })),
        );
      }, 3000);
    });
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
          <ImageDropzone setImageUrl={setValue} />
          <div className="flex w-full flex-col">
            <Label label="產品名稱">
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
                    options={categoryOptions}
                    onChange={(options) => {
                      onChange(
                        (options as typeof categoryOptions).map(
                          (option) => option.value,
                        ),
                      );
                    }}
                    isMulti
                  />
                )}
              />
            </Label>
            <Label label="價格">
              <InputOnlyNumber name="price" />
            </Label>
            <Label label="庫存">
              <InputOnlyNumber name="stock" />
            </Label>
            <Label label="標籤">
              <Controller
                control={control}
                name="tags"
                render={({ field: { onChange } }) => (
                  <ReactAsyncSelect
                    loadOptions={asyncOptions}
                    onChange={(options) => {
                      onChange(
                        (
                          options as Awaited<ReturnType<typeof asyncOptions>>
                        ).map((option) => option.value),
                      );
                    }}
                    isMulti
                  />
                )}
              />
            </Label>
            <input
              type="submit"
              value="send"
              disabled={!getIsImageUploadDone()}
            />
          </div>
        </form>
      </FormProvider>
    </>
  );
}
