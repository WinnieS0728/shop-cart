"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { InputSubmit, InputText, Label } from "@UI/inputs";
import * as icons from "@icons";
import FormContainer from "@UI/form";
import { tagSetting_Schema } from "@/libs/mongoDB/schemas/basic setting/tag";
import { useBasicSettingMethods } from "@/app/api/mongoDB/basicSetting/[type]/methods";
import { toast } from "react-toastify";
import { Loading } from "../UI/loading";
import { collectionList } from "@/libs/mongoDB/connect mongo";

export default function TagsSetting() {
  const {
    GET: { data: tagSettingData, isPending },
    POST: { mutateAsync: createTag },
    DELETE: { mutateAsync: deleteTag },
  } = useBasicSettingMethods().tag;

  const methods = useForm<z.infer<typeof tagSetting_Schema>>({
    resolver: zodResolver(tagSetting_Schema),
    defaultValues: tagSettingData
      ? {
          tags: tagSettingData,
        }
      : async () => {
          const res = await fetch(
            `/api/mongoDB/basicSetting/${collectionList.tags}`,
          );
          return {
            tags: await res.json(),
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
    name: "tags",
  });

  async function onSubmit(data: z.infer<typeof tagSetting_Schema>) {
    const shouldDelete = tagSettingData!.filter(
      (dataInDB) =>
        !data.tags.some((dataInForm) => dataInForm.title === dataInDB.title),
    );
    const shouldCreate = data.tags.filter(
      (dataInform) =>
        !tagSettingData!.some(
          (dataInDB) => dataInDB.title === dataInform.title,
        ),
    );

    const isDeleteSuccess = (
      await Promise.all(shouldDelete.map(async (data) => deleteTag(data.title)))
    ).every((res) => res.ok);

    const isCreateSuccess = (
      await Promise.all(shouldCreate.map(async (data) => createTag(data)))
    ).every((res) => res.ok);

    const request = new Promise((res, rej) => {
      if (!isDeleteSuccess || !isCreateSuccess) {
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
          title="商品標籤"
        >
          {isPending ? (
            <>
              <Loading.block height={16 * 10} />
            </>
          ) : (
            <>
              {!fields.length ? (
                <p className="text-center">尚未建立商品標籤</p>
              ) : (
                fields.map((field, index) => (
                  <div className="flex items-end gap-2" key={field.id}>
                    <Label label="標籤名稱" htmlFor={`tags.${index}.title`}>
                      <InputText
                        name={`tags.${index}.title`}
                        id={`tags.${index}.title`}
                      />
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
                + 新增標籤
              </button>
              <InputSubmit value={"儲存"} disabled={isSubmitting} />
            </>
          )}
        </FormContainer>
      </FormProvider>
    </section>
  );
}
