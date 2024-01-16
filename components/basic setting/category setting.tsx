"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { InputSubmit, InputText, Label } from "@UI/inputs";
import * as icons from "@icons";
import FormContainer from "@UI/form";
import { useBasicSettingMethods } from "@/app/api/mongoDB/basicSetting/[type]/methods";
import { toast } from "react-toastify";
import { Loading } from "../UI/loading";
import { collectionList } from "@/libs/mongoDB/connect mongo";
import { category_schema } from "@/libs/mongoDB/schemas/basic setting/category";
import { findRepeat } from "@/libs/utils/find repeat";
import { Types } from "mongoose";

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

export default function CategorySetting() {
  const {
    GET: { data: categorySettingData, isPending },
    POST: { mutateAsync: createCategory },
    PATCH: { mutateAsync: updateCategory },
    DELETE: { mutateAsync: deleteCategory },
  } = useBasicSettingMethods().category;

  const methods = useForm<z.infer<typeof category_formSchema>>({
    resolver: zodResolver(category_formSchema),
    defaultValues: categorySettingData
      ? {
          categories: categorySettingData,
        }
      : async () => {
          const res = await fetch(
            `/api/mongoDB/basicSetting/${collectionList.categories}`,
          );
          return {
            categories: await res.json(),
          };
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

  async function onSubmit(data: z.infer<typeof category_formSchema>) {
    // console.log(data);
    const shouldDelete = categorySettingData!.filter(
      (dataInDB) =>
        !data.categories.some((dataInForm) => dataInForm._id === dataInDB._id),
    );
    const shouldCreate = data.categories.filter(
      (dataInform) =>
        !categorySettingData?.some(
          (dataInDB) => dataInDB._id === dataInform._id,
        ),
    );
    const shouldUpdate = data.categories.filter(
      (dataInForm) =>
        categorySettingData?.some(
          (dataInDB) => dataInDB._id === dataInForm._id,
        ),
    );

    const request = new Promise(async (res, rej) => {
      const isDeleteSuccess = (
        await Promise.all(
          shouldDelete.map(async (data) => await deleteCategory(data._id)),
        )
      ).every((res) => res.ok);

      const isCreateSuccess = (
        await Promise.all(
          shouldCreate.map(async (data) => await createCategory(data)),
        )
      ).every((res) => res.ok);

      const isUpdateSuccess = (
        await Promise.all(
          shouldUpdate.map(async (data) => await updateCategory(data)),
        )
      ).every((res) => res.ok);

      if (!isDeleteSuccess || !isCreateSuccess || !isUpdateSuccess) {
        rej(false);
      } else {
        res(true);
      }
    });

    toast.promise(request, {
      pending: "儲存中...",
      success: "儲存成功 !",
      error: "儲存失敗 !",
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
          {isPending ? (
            <>
              <Loading.block height={16 * 10} />
            </>
          ) : (
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
          )}
        </FormContainer>
      </FormProvider>
    </section>
  );
}
