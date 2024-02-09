"use client";
import React, { useRef } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { product_schema } from "@/libs/mongoDB/schemas/product";
import { Label, InputText, InputOnlyNumber, InputSubmit } from "../UI/inputs";
import { ReactSelect } from "@components/UI/select";
import { Id, toast } from "react-toastify";
import FormContainer from "../UI/form";
import { product_listSchema } from "@/libs/mongoDB/schemas/product";
import { Types } from "mongoose";
import { trpc } from "@/providers/trpc provider";
import { category_schema } from "@/libs/mongoDB/schemas/basic setting/category";
import { tag_schema } from "@/libs/mongoDB/schemas/basic setting/tag";
import { updateToast } from "@/libs/toast";
import { useRouter } from "next/navigation";
import ImgDropzone from "../UI/dropzone";

interface props {
  as: "create" | "update";
  initData: z.infer<typeof product_listSchema>;
  initCategoryList: z.infer<typeof category_schema>[];
  initTagList: z.infer<typeof tag_schema>[];
}

export default function ProductForm({
  as,
  initData,
  initCategoryList,
  initTagList,
}: props) {
  const { data: product, refetch: refetchProduct } =
    trpc.product.getProductById.useQuery(
      {
        _id: initData._id.toString(),
      },
      { initialData: initData, enabled: as === "update" },
    );

  const { data: categoryList } =
    trpc.basicSetting.category.getCategoryList.useQuery(undefined, {
      initialData: initCategoryList,
    });
  const { data: tagList } = trpc.basicSetting.tag.getTagList.useQuery(
    undefined,
    {
      initialData: initTagList,
    },
  );
  const { mutate: createProduct } = trpc.product.createProduct.useMutation();
  const { mutate: updateProduct } = trpc.product.updateProduct.useMutation({
    onSettled() {
      refetchProduct();
    },
  });
  const { mutate: deleteProduct } = trpc.product.deleteProduct.useMutation();
  const router = useRouter();

  const methods = useForm<z.infer<typeof product_schema>>({
    resolver: zodResolver(product_schema),
    criteriaMode: "all",
    defaultValues:
      as === "create" || !product
        ? {
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
          }
        : {
            ...product,
            categories: product.categories.map((category) => category._id),
            tags: product.tags.map((tag) => tag._id),
          },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const isProductHasImage = !!useWatch({
    control,
    name: "imageUrl.normal",
  });

  const toastId = useRef<Id>("");
  async function onSubmit(data: z.infer<typeof product_schema>) {
    // console.log(data);
    as === "create" ? onCreate(data) : onUpdate(data);
  }

  async function onCreate(data: z.infer<typeof product_schema>) {
    // console.log(data);
    toastId.current = toast.loading("建立中...");
    createProduct(data, {
      onError(error) {
        updateToast(toastId.current, "error", {
          render: error.message,
        });
      },
      async onSuccess() {
        updateToast(toastId.current, "success", {
          render: "建立完成 !",
        });
        router.push("/admin/menu");
      },
    });
  }

  async function onUpdate(data: z.infer<typeof product_schema>) {
    // console.log(data);
    toastId.current = toast.loading("更新中...");
    updateProduct(data, {
      onError(error) {
        updateToast(toastId.current, "error", {
          render: error.message,
        });
      },
      async onSuccess() {
        updateToast(toastId.current, "success", {
          render: "更新成功 !",
        });
        router.push("/admin/menu");
      },
    });
  }

  return (
    <>
      <FormProvider {...methods}>
        <FormContainer
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <ImgDropzone imageFolder="productImage" />
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
                      // isLoading={isGetCategoryLoading}
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
                        return categoryList.find(
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
                      // isLoading={isGetTagsLoading}
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
                        tagList.find((tag) => tag._id === tagId),
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
        <div className="flex items-center justify-center p-4">
          <button
            type="button"
            className="button bg-red-500"
            onClick={() => {
              toastId.current = toast.loading("刪除中...");
              deleteProduct(
                {
                  _id: product._id,
                },
                {
                  onError(error) {
                    updateToast(toastId.current, "error", {
                      render: error.message,
                    });
                  },
                  async onSuccess() {
                    updateToast(toastId.current, "success", {
                      render: "刪除成功 !",
                    });
                    router.push("/admin/menu");
                  },
                },
              );
            }}
          >
            刪除此商品
          </button>
        </div>
      </FormProvider>
    </>
  );
}
