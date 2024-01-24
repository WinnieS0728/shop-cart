"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Fragment } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { InputOnlyNumber, InputSubmit, InputText, Label } from "@UI/inputs";
import * as icons from "@icons";
import FormContainer from "@UI/form";
import { toast } from "react-toastify";
import { member_schema } from "@/libs/mongoDB/schemas/basic setting/member";
import { findRepeat } from "@/libs/utils/find repeat";
import { Types } from "mongoose";
import { trpc } from "@/providers/trpc provider";
import { uneval } from "devalue";
import { useSession } from "next-auth/react";

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

interface props {
  initData: z.infer<typeof member_schema>[];
}

export default function MemberSetting({ initData }: props) {
  const { data: memberData, refetch } =
    trpc.basicSetting.member.getMemberList.useQuery(undefined, {
      initialData: initData,
    });
  const { mutateAsync: createMember } =
    trpc.basicSetting.member.createMember.useMutation({
      onSettled() {
        refetch();
      },
    });
  const { mutateAsync: updateMember } =
    trpc.basicSetting.member.updateMember.useMutation({
      onSettled() {
        refetch();
      },
    });
  const { mutateAsync: deleteMember } =
    trpc.basicSetting.member.deleteMember.useMutation({
      onSettled() {
        refetch();
      },
    });
  const methods = useForm<z.infer<typeof member_formSchema>>({
    resolver: zodResolver(member_formSchema),
    defaultValues: {
      member: memberData,
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
    if (!memberData) {
      return;
    }
    const shouldDelete = memberData.filter(
      (dataInDB) =>
        !data.member.some((dataInForm) => dataInForm._id === dataInDB._id),
    );
    const shouldUpdate = data.member.filter((dataInform) =>
      memberData.some((dataInDB) => dataInDB._id === dataInform._id),
    );
    const shouldCreate = data.member.filter(
      (dataInform) =>
        !memberData.some((dataInDB) => dataInDB._id === dataInform._id),
    );

    const request = new Promise(async (resolve, reject) => {
      const isDELETEsuccess = (
        await Promise.all(
          shouldDelete.map((data) =>
            deleteMember(
              {
                _id: data._id,
              },
              {
                onError() {
                  return false;
                },
                onSuccess() {
                  return true;
                },
              },
            ),
          ),
        )
      ).every((res) => res);

      const isPATCHsuccess = (
        await Promise.all(
          shouldUpdate.map((data) =>
            updateMember(data, {
              onError() {
                return false;
              },
              onSuccess() {
                return true;
              },
            }),
          ),
        )
      ).every((res) => res);

      const isPOSTsuccess = (
        await Promise.all(
          shouldCreate.map((data) =>
            createMember(data, {
              onError() {
                return false;
              },
              onSuccess() {
                return true;
              },
            }),
          ),
        )
      ).every((res) => res);

      if (!isPOSTsuccess || !isPATCHsuccess || !isDELETEsuccess) {
        reject(false);
      } else {
        resolve(true);
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
        </FormContainer>
      </FormProvider>
    </section>
  );
}
