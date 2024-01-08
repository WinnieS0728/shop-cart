"use client";
import { useUserMethods } from "@/app/api/mongoDB/users/methods";
import FormContainer from "@/components/UI/form";
import {
  InputPassword,
  InputSubmit,
  InputText,
  Label,
} from "@/components/UI/inputs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

export const password_schema = z
  .object({
    email: z.string().email(),
    origin_password: z.string().min(1, "請填入舊密碼 !"),
    new_password: z.string().min(1, "請填入新密碼 !"),
    confirm_password: z.string().min(1, "請填入新密碼 !"),
  })
  .refine(
    ({ new_password, confirm_password }) => {
      if (new_password !== confirm_password) {
        return false;
      } else {
        return true;
      }
    },
    {
      message: "確認密碼與新密碼不同 !",
      path: ["confirm_password"],
    },
  );

export default function UpdatePassword() {
  const { data: session } = useSession();
  const {
    UPDATE_PASSWORD: { mutateAsync: updatePassword },
  } = useUserMethods();
  const methods = useForm<z.infer<typeof password_schema>>({
    resolver: zodResolver(password_schema),
    defaultValues: {
      email: session?.user?.email ?? "",
      origin_password: "",
      new_password: "",
      confirm_password: "",
    },
  });
  const {
    handleSubmit,
    formState: { defaultValues },
  } = methods;
  async function onSubmit(data: z.infer<typeof password_schema>) {
    // console.log(data);
    const request = new Promise(async (resolve, reject) => {
      const res = await updatePassword(data);
      if (res.ok) {
        resolve(await res.json());
      } else {
        reject(await res.json());
      }
    });
    toast.promise(request, {
      pending: "處理中...",
      error: {
        render({ data }) {
          return `${data}`;
        },
      },
      success: {
        render({ data }) {
          return `${data}`;
        },
      },
    });
  }
  return (
    <section className="px-8">
      <FormProvider {...methods}>
        <FormContainer onSubmit={handleSubmit(onSubmit)} title="修改密碼">
          <div className="flex flex-col gap-4">
            <Label label="email">
              <InputText
                name="email"
                readOnly
                defaultValue={defaultValues?.email}
              />
            </Label>
            <Label label="舊密碼" required htmlFor="origin_password">
              <InputPassword name="origin_password" id="origin_password" />
            </Label>
            <Label label="新密碼" required htmlFor="new_password">
              <InputPassword name="new_password" id="new_password" />
            </Label>
            <Label label="確認密碼" required htmlFor="confirm_password">
              <InputPassword name="confirm_password" id="confirm_password" />
            </Label>
            <InputSubmit value={"儲存"} />
          </div>
        </FormContainer>
      </FormProvider>
    </section>
  );
}
