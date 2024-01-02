"use client";
import { basicSetting_Schema } from "@/libs/mongoDB/models/basic";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { InputSubmit, InputText, Label } from "../UI/inputs";
import * as icons from "@icons";

export default function CategorySetting() {
  const methods = useForm<z.infer<typeof basicSetting_Schema>>({
    // resolver: zodResolver(basicSetting_Schema),
    defaultValues: {
      categories: [],
    },
  });

  const { handleSubmit, control } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "categories",
  });

  async function onSubmit(data: z.infer<typeof basicSetting_Schema>) {
    console.log(data);
  }
  return (
    <section className="form-container">
      <h3 className="text-xl mb-4">商品類別</h3>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          {fields.map((field, index) => (
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
          ))}
          <button
            type="button"
            className="w-full border border-dashed border-yellow-500 px-4 py-2"
            onClick={() => {
              append({
                title: "",
              });
            }}
          >
            + 新增類別
          </button>
          <InputSubmit value={"儲存"} />
        </form>
      </FormProvider>
    </section>
  );
}
