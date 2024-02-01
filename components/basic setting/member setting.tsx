"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Fragment, useRef } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { InputOnlyNumber, InputSubmit, InputText, Label } from "@UI/inputs";
import * as icons from "@/components/icons";
import FormContainer from "@UI/form";
import { Id, toast } from "react-toastify";
import { member_schema } from "@/libs/mongoDB/schemas/basic setting/member";
import { findRepeat } from "@/libs/utils/find repeat";
import { Types } from "mongoose";
import { trpc } from "@/providers/trpc provider";
import { uneval } from "devalue";
import { useSession } from "next-auth/react";
import { updateToast } from "@/libs/toast";

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
  const { mutate: updateMember } =
    trpc.basicSetting.member.updateMember.useMutation({
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

  const toastId = useRef<Id>("");
  async function onSubmit(data: z.infer<typeof member_formSchema>) {
    console.log(data);
    toastId.current = toast.loading("儲存中...");
    updateMember(data.member, {
      onError(error) {
        updateToast(toastId.current, "error", {
          render: error.message,
        });
      },
      onSuccess() {
        updateToast(toastId.current, "success", {
          render: "儲存成功 !",
        });
      },
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
