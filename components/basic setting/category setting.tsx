"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { InputSubmit, InputText, Label } from "@UI/inputs";
import * as icons from "@icons";
import FormContainer from "@UI/form";
import { Id, toast } from "react-toastify";
import { Loading } from "../UI/loading";
import { category_schema } from "@/libs/mongoDB/schemas/basic setting/category";
import { findRepeat } from "@/libs/utils/find repeat";
import { Types } from "mongoose";
import { trpc } from "@/providers/trpc provider";
import { toastOptions } from "@/libs/toast";

const category_formSchema = z.object({
  categories: z.array(category_schema).superRefine((value, ctx) => {
    const isTitleRepeat =
      value.length !== new Set(value.map((data) => data.title)).size;

    if (isTitleRepeat) {
      findRepeat(value.map((data) => data.title)).map((index) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "名稱重複",
          path: [index!, "title"],
        });
      });
    }
  }),
});

interface props {
  initData: z.infer<typeof category_schema>[];
}

export default function CategorySetting({ initData }: props) {
  const { data: categoryData, refetch } =
    trpc.basicSetting.category.getCategoryList.useQuery(undefined, {
      initialData: initData,
    });
  const { mutateAsync: updateCategory } =
    trpc.basicSetting.category.updateCategory.useMutation({
      onSettled() {
        refetch();
      },
    });

  const methods = useForm<z.infer<typeof category_formSchema>>({
    resolver: zodResolver(category_formSchema),
    defaultValues: {
      categories: categoryData,
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "categories",
  });

  const toastId = useRef<Id>("");
  async function onSubmit(data: z.infer<typeof category_formSchema>) {
    // console.log(data);
    toastId.current = toast.loading("儲存中...");
    await updateCategory(data.categories, {
      onError(error) {
        toast.update(toastId.current, {
          ...toastOptions("error"),
          render: error.message,
        });
      },
      onSuccess() {
        toast.update(toastId.current, {
          ...toastOptions("success"),
          render: "儲存成功 !",
        });
      },
    });
  }
  return (
    <section className="form-container">
      <FormProvider {...methods}>
        <FormContainer
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
          title="商品類別"
        >
          <>
            {!fields.length ? (
              <p className="text-center">尚未建立商品類別</p>
            ) : (
              fields.map((field, index) => (
                <div className="flex items-end gap-2" key={field.id}>
                  <Label label="類別名稱">
                    <InputText name={`categories.${index}.title`} />
                  </Label>
                  <button
                    type="button"
                    className="circle-icon min-w-10  bg-red-500"
                    onClick={() => {
                      remove(index);
                    }}
                  >
                    <icons.Trash className="text-2xl text-white" />
                  </button>
                </div>
              ))
            )}
            <button
              type="button"
              className="add-new-btn"
              onClick={() => {
                append({
                  _id: new Types.ObjectId(),
                  title: "",
                });
              }}
            >
              + 新增類別
            </button>
            <InputSubmit value={"儲存"} disabled={isSubmitting} />
          </>
        </FormContainer>
      </FormProvider>
    </section>
  );
}
