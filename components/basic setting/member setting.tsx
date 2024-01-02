"use client";
import { basicSetting_Schema } from "@/libs/mongoDB/models/basic";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Fragment } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { InputOnlyNumber, InputSubmit, InputText, Label } from "../UI/inputs";
import * as icons from "@icons";

export default function MemberSetting() {
  const methods = useForm<z.infer<typeof basicSetting_Schema>>({
    // resolver: zodResolver(basicSetting_Schema),
    defaultValues: {
      member: [],
    },
  });

  const { handleSubmit, control } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "member",
  });

  async function onSubmit(data: z.infer<typeof basicSetting_Schema>) {
    console.log(data);
  }
  return (
    <section className="form-container">
      <h3 className="text-xl mb-4">會員階級</h3>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          {fields.map((field, index) => (
            <Fragment key={field.id}>
              <div className="flex items-end gap-2">
                <Label label="階級名稱">
                  <InputText name={`member.${index}.title`} />
                </Label>
                <Label label="階級門檻">
                  <InputOnlyNumber name={`member.${index}.threshold`} />
                </Label>
                <button
                  type="button"
                  onClick={() => {
                    remove(index);
                  }}
                  className="circle-icon min-w-10  bg-red-500"
                >
                  <icons.Trash className="text-2xl text-white" />
                </button>
              </div>
            </Fragment>
          ))}
          <button
            type="button"
            className="w-full border border-dashed border-yellow-500 px-4 py-2"
            onClick={() => {
              append({
                title: "",
                threshold: 0,
              });
            }}
          >
            + 新增會員階級
          </button>
          <InputSubmit value={"儲存"} />
        </form>
      </FormProvider>
    </section>
  );
}
