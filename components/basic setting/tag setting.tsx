"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { InputSubmit, InputText, Label } from "@UI/inputs";
import * as icons from "@icons";
import FormContainer from "@UI/form";
import { tag_schema } from "@/libs/mongoDB/schemas/basic setting/tag";
import { Id, toast } from "react-toastify";
import { findRepeat } from "@/libs/utils/find repeat";
import { Types } from "mongoose";
import { trpc } from "@/providers/trpc provider";
import { updateToast } from "@/libs/toast";

const tag_formSchema = z.object({
  tags: z.array(tag_schema).superRefine((value, ctx) => {
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
  }),
});
interface props {
  initData: z.infer<typeof tag_schema>[];
}
export default function TagsSetting({ initData }: props) {
  const { data: tagData, refetch } = trpc.basicSetting.tag.getTagList.useQuery(
    undefined,
    {
      initialData: initData,
    },
  );
  const { mutate: updateTag } = trpc.basicSetting.tag.updateTag.useMutation({
    onSettled() {
      refetch();
    },
  });

  const methods = useForm<z.infer<typeof tag_formSchema>>({
    resolver: zodResolver(tag_formSchema),
    defaultValues: {
      tags: tagData,
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

  const toastId = useRef<Id>("");
  async function onSubmit(data: z.infer<typeof tag_formSchema>) {
    // console.log(data);
    toastId.current = toast.loading("儲存中...");
    updateTag(data.tags, {
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
    <section className="form-container">
      <FormProvider {...methods}>
        <FormContainer
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
          title="商品標籤"
        >
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
                  _id: new Types.ObjectId(),
                  title: "",
                });
              }}
            >
              + 新增標籤
            </button>
            <InputSubmit value={"儲存"} disabled={isSubmitting} />
          </>
        </FormContainer>
      </FormProvider>
    </section>
  );
}
