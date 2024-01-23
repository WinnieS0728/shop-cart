"use client";
import FormContainer from "@/components/UI/form";
import {
  InputPassword,
  InputSubmit,
  InputText,
  Label,
} from "@/components/UI/inputs";
import { password_schema } from "@/libs/mongoDB/schemas/user";
import { trpc } from "@/providers/trpc provider";
import { AppRouter } from "@/server/routers";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

export default function UpdatePassword() {
  const { data: session } = useSession({
    required: true,
  });
  const router = useRouter();
  const { mutateAsync: updatePassword } =
    trpc.user.updatePassword.useMutation();
  const methods = useForm<z.infer<typeof password_schema>>({
    resolver: zodResolver(password_schema),
    defaultValues: {
      _id: session?.token.sub ?? "",
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
      await updatePassword(data, {
        onError(error) {
          reject(error);
        },
        onSuccess(res) {
          router.push("./");
          resolve(res);
        },
      });
    });
    toast.promise(request, {
      pending: "處理中...",
      error: {
        render({ data }) {
          const message = (data as TRPCClientError<AppRouter>).message;
          return `${message}`;
        },
      },
      success: "修改成功 !",
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
