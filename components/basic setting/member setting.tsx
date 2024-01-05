"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Fragment } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { InputOnlyNumber, InputSubmit, InputText, Label } from "@UI/inputs";
import * as icons from "@icons";
import FormContainer from "@UI/form";
import {
  memberModel,
  memberSetting_Schema,
} from "@/libs/mongoDB/models/basic setting/member";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "../UI/loading";
import {
  createMember,
  deleteMember,
  updateMember,
} from "@/app/api/mongoDB/basicSetting/[type]/methods";
import { toast } from "react-toastify";

export default function MemberSetting() {
  const { data: memberSettingData, isPending } = useQuery<memberModel[]>({
    queryKey: ["admin", "basicSetting", "member"],
    queryFn: async () => {
      const res = await fetch("/api/mongoDB/basicSetting/member");
      return res.json();
    },
  });

  const methods = useForm<z.infer<typeof memberSetting_Schema>>({
    resolver: zodResolver(memberSetting_Schema),
    reValidateMode: "onChange",
    defaultValues: memberSettingData
      ? {
          member: memberSettingData,
        }
      : async () => {
          const res = await fetch("/api/mongoDB/basicSetting/member");
          return {
            member: await res.json(),
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
    name: "member",
  });

  async function onSubmit(data: z.infer<typeof memberSetting_Schema>) {
    const shouldDelete = memberSettingData!.filter(
      (dataInDB) =>
        !data.member.some((dataInForm) => dataInForm.title === dataInDB.title),
    );
    const shouldUpdate = data.member.filter((dataInform) =>
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

    const res_d = await Promise.all(
      shouldDelete.map(async (data) => {
        return await deleteMember(data._id);
      }),
    );

    const res_u = await Promise.all(
      shouldUpdate.map(async (data) => {
        return await updateMember(data);
      }),
    );

    const res_c = await Promise.all(
      shouldCreate.map(async (data) => {
        return await createMember(data);
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
    <section>
      <FormProvider {...methods}>
        <FormContainer
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
          title="會員階級"
        >
          {isPending ? (
            <>
              <Loading.block height={16 * 10} />
            </>
          ) : (
            <>
              {!fields.length ? (
                <p className="text-center">尚未建立會員階級</p>
              ) : (
                fields.map((field, index) => (
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
                ))
              )}
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
              <InputSubmit value={"儲存"} disabled={isSubmitting} />
            </>
          )}
        </FormContainer>
      </FormProvider>
    </section>
  );
}
