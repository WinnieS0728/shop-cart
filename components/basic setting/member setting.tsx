"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Fragment } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { InputOnlyNumber, InputSubmit, InputText, Label } from "@UI/inputs";
import * as icons from "@icons";
import FormContainer from "@UI/form";
import { memberSetting_Schema } from "@/libs/mongoDB/models/basic setting/member";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "../UI/loading";

export default function MemberSetting() {
  const { data: memberSettingData, isPending } = useQuery<
    z.infer<typeof memberSetting_Schema>["member"]
  >({
    queryKey: ["admin", "basicSetting", "member"],
    queryFn: async () => {
      const res = await fetch("/api/mongoDB/basicSetting/member");
      return res.json();
    },
  });

  const methods = useForm<z.infer<typeof memberSetting_Schema>>({
    resolver: zodResolver(memberSetting_Schema),
    defaultValues: async () => {
      const res = await fetch("/api/mongoDB/basicSetting/member");
      return {
        member: await res.json(),
      };
    },
  });

  const { handleSubmit, control } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "member",
  });

  async function onSubmit(data: z.infer<typeof memberSetting_Schema>) {
    const shouldDelete = memberSettingData!.filter(
      (dataInDB) =>
        !data.member.some((dataInForm) => dataInForm.title === dataInDB.title),
    );
    const shouldUpdate = data.member.filter(
      (dataInform) =>
        memberSettingData!.some(
          (dataInDB) => dataInDB.title === dataInform.title,
        ),
    );
    const shouldCreate = data.member.filter(
      (dataInform) =>
        !memberSettingData!.some(
          (dataInDB) => dataInDB.title === dataInform.title,
        ),
    );

    console.log({ shouldDelete }, { shouldUpdate }, { shouldCreate });

    if (shouldDelete) {
      
    }
    await Promise.all(
      shouldDelete?.map(async (data) => {
        await fetch(`/api/mongoDB/basicSetting/member?id=${data._id}`, {
          method: "DELETE",
        });
        return true;
      }),
    );

    // const res = await fetch("/api/mongoDB/basicSetting/member", {
    //   method: "POST",
    //   headers: {
    //     "Content-type": "application/json",
    //   },
    //   body: JSON.stringify(data.member),
    // });
    // console.log(await res.json());
  }

  return (
    <section>
      <FormProvider {...methods}>
        <FormContainer
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <h3 className="mb-4 text-xl">會員階級</h3>
          {isPending ? (
            <div className="w-full">
              <Loading.block height={16 * 10} />
            </div>
          ) : (
            <>
              {fields.map((field, index) => (
                <Fragment key={field.id}>
                  <div className="flex items-end gap-2">
                    <Label label="階級名稱" htmlFor={`member.${index}.title`}>
                      <InputText
                        name={`member.${index}.title`}
                        id={`member.${index}.title`}
                      />
                    </Label>
                    <Label
                      label="階級門檻"
                      htmlFor={`member.${index}.threshold`}
                    >
                      <InputOnlyNumber
                        name={`member.${index}.threshold`}
                        id={`member.${index}.threshold`}
                      />
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
                className="add-new-btn"
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
            </>
          )}
        </FormContainer>
      </FormProvider>
    </section>
  );
}
