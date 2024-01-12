"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Fragment } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { InputOnlyNumber, InputSubmit, InputText, Label } from "@UI/inputs";
import * as icons from "@icons";
import FormContainer from "@UI/form";
import { memberSetting_Schema } from "@/libs/mongoDB/schemas/basic setting/member";
import { Loading } from "../UI/loading";
import { useBasicSettingMethods } from "@/app/api/mongoDB/basicSetting/[type]/methods";
import { toast } from "react-toastify";
import { collectionList } from "@/libs/mongoDB/connect mongo";

export default function MemberSetting() {
  const {
    GET: { data: memberSettingData, isPending },
    POST: { mutateAsync: createMember },
    PATCH: { mutateAsync: updateMember },
    DELETE: { mutateAsync: deleteMember },
  } = useBasicSettingMethods().member;

  const methods = useForm<z.infer<typeof memberSetting_Schema>>({
    resolver: zodResolver(memberSetting_Schema),
    reValidateMode: "onChange",
    defaultValues: memberSettingData
      ? {
          member: memberSettingData,
        }
      : async () => {
          const res = await fetch(`/api/mongoDB/basicSetting/${collectionList.members}`);
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
    if (!memberSettingData) {
      return 
    }
    const shouldDelete = memberSettingData.filter(
      (dataInDB) =>
        !data.member.some((dataInForm) => dataInForm.title === dataInDB.title),
    );
    const shouldUpdate = data.member.filter((dataInform) =>
      memberSettingData.some(
        (dataInDB) => dataInDB.title === dataInform.title,
      ),
    );
    const shouldCreate = data.member.filter(
      (dataInform) =>
        !memberSettingData.some(
          (dataInDB) => dataInDB.title === dataInform.title,
        ),
    );

    const isDELETEsuccess = (
      await Promise.all(
        shouldDelete.map(async (data) => deleteMember(data.title)),
      )
    ).every((res) => res.ok);

    const isPATCHsuccess = (
      await Promise.all(shouldUpdate.map(async (data) => updateMember(data)))
    ).every((res) => res.ok);
    console.log(isPATCHsuccess);

    const isPOSTsuccess = (
      await Promise.all(shouldCreate.map(async (data) => createMember(data)))
    ).every((res) => res.ok);

    const request = new Promise((res, rej) => {
      if (!isPOSTsuccess || !isPATCHsuccess || !isDELETEsuccess) {
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
