"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Fragment } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { InputOnlyNumber, InputSubmit, InputText, Label } from "@UI/inputs";
import * as icons from "@icons";
import FormContainer from "@UI/form";
import { Loading } from "../UI/loading";
import { useBasicSettingMethods } from "@/app/api/mongoDB/basicSetting/[type]/methods";
import { toast } from "react-toastify";
import { collectionList } from "@/libs/mongoDB/connect mongo";
import { member_schema } from "@/libs/mongoDB/schemas/basic setting/member";
import { findRepeat } from "@/libs/utils/find repeat";
import { Types } from "mongoose";

const member_formSchema = z.object({
  member: z.array(member_schema).superRefine((value, ctx) => {
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

    const isThresholdRepeat =
      value.length !== new Set(value.map((data) => data.threshold)).size;
    if (isThresholdRepeat) {
      findRepeat(value.map((data) => data.threshold)).map((index) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "門檻重複",
          path: [index!, "threshold"],
        });
      });
    }
  }),
});

export default function MemberSetting() {
  const {
    GET: { data: memberSettingData, isPending },
    POST: { mutateAsync: createMember },
    PATCH: { mutateAsync: updateMember },
    DELETE: { mutateAsync: deleteMember },
  } = useBasicSettingMethods().member;

  const methods = useForm<z.infer<typeof member_formSchema>>({
    resolver: zodResolver(member_formSchema),
    defaultValues: memberSettingData
      ? {
          member: memberSettingData,
        }
      : async () => {
          const res = await fetch(
            `/api/mongoDB/basicSetting/${collectionList.members}`,
          );
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

  async function onSubmit(data: z.infer<typeof member_formSchema>) {
    if (!memberSettingData) {
      return;
    }
    const shouldDelete = memberSettingData.filter(
      (dataInDB) =>
        !data.member.some((dataInForm) => dataInForm._id === dataInDB._id),
    );
    const shouldUpdate = data.member.filter((dataInform) =>
      memberSettingData.some((dataInDB) => dataInDB._id === dataInform._id),
    );
    const shouldCreate = data.member.filter(
      (dataInform) =>
        !memberSettingData.some((dataInDB) => dataInDB._id === dataInform._id),
    );

    const request = new Promise(async (res, rej) => {
      const isDELETEsuccess = (
        await Promise.all(shouldDelete.map((data) => deleteMember(data._id)))
      ).every((res) => res.ok);

      const isPATCHsuccess = (
        await Promise.all(shouldUpdate.map((data) => updateMember(data)))
      ).every((res) => res.ok);

      const isPOSTsuccess = (
        await Promise.all(shouldCreate.map((data) => createMember(data)))
      ).every((res) => res.ok);
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
                    _id: new Types.ObjectId(),
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
