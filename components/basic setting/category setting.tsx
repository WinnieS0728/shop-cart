"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { InputSubmit, InputText, Label } from "@UI/inputs";
import * as icons from "@icons";
import FormContainer from "@UI/form";
import {
  categoriesSetting_Schema,
  categoryModel,
} from "@/libs/mongoDB/models/basic setting/category";
import { useQuery } from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/app/api/mongoDB/basicSetting/[type]/methods";
import { toast } from "react-toastify";
import { Loading } from "../UI/loading";

export default function CategorySetting() {
  const { data: categorySettingData, isPending } = useQuery<categoryModel[]>({
    queryKey: ["admin", "basicSetting", "category"],
    queryFn: async () => {
      const res = await fetch("/api/mongoDB/basicSetting/category");
      return res.json();
    },
  });
  const methods = useForm<z.infer<typeof categoriesSetting_Schema>>({
    resolver: zodResolver(categoriesSetting_Schema),
    shouldUnregister: true,
    defaultValues: categorySettingData ? {
      categories: categorySettingData
    } :async () => {
      const res = await fetch("/api/mongoDB/basicSetting/category");
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

  async function onSubmit(data: z.infer<typeof categoriesSetting_Schema>) {
    const shouldDelete = categorySettingData!.filter(
      (dataInDB) =>
        !data.categories.some(
          (dataInForm) => dataInForm.title === dataInDB.title,
        ),
    );
    const shouldUpdate = data.categories.filter((dataInform) =>
      categorySettingData!.some(
        (dataInDB) => dataInDB.title === dataInform.title,
      ),
    );
    const shouldCreate = data.categories.filter(
      (dataInform) =>
        !categorySettingData!.some(
          (dataInDB) => dataInDB.title === dataInform.title,
        ),
    );

    const res_d = await Promise.all(
      shouldDelete.map(async (data) => {
        return await deleteCategory(data._id);
      }),
    );

    const res_u = await Promise.all(
      shouldUpdate.map(async (data) => {
        return await updateCategory(data);
      }),
    );

    const res_c = await Promise.all(
      shouldCreate.map(async (data) => {
        return await createCategory(data);
      }),
    );

    const request = new Promise((res, rej) => {
      const isDeleteSuccess = res_d.every((res) => res.ok);
      const isUpdateSuccess = res_u.every((res) => res.ok);
      const isCreateSuccess = res_c.every((res) => res.ok);
      if (!isDeleteSuccess || !isUpdateSuccess || !isCreateSuccess) {
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
        >
          <h3 className="mb-4 text-xl">商品類別</h3>
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
