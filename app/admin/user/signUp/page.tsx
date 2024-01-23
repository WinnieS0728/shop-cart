"use client";
import React from "react";
import FormContainer from "@UI/form";
import { FormProvider, useForm } from "react-hook-form";
import { Label, InputText, InputPassword, InputSubmit } from "@UI/inputs";
import { z } from "zod";
import { signUp_schema } from "@/libs/mongoDB/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import AvatarDropzone from "@/components/users/avatar dropzone";
import Link from "next/link";
import { trpc } from "@/providers/trpc provider";
import { TRPCClientError } from "@trpc/client";
import { AppRouter } from "@/server/routers";
import { useImageMethods } from "@/hooks/useImage";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const { mutateAsync: createUser } = trpc.user.createUser.useMutation();
  const { confirmImage } = useImageMethods('userAvatar')
  const router = useRouter()
  const methods = useForm<z.infer<typeof signUp_schema>>({
    resolver: zodResolver(signUp_schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      avatar: {
        normal: "",
        thumbnail: "",
      },
    },
  });
  const { handleSubmit } = methods;
  async function onSubmit(data: z.infer<typeof signUp_schema>) {
    // console.log(data);
    const request = new Promise(async (resolve, reject) => {
      await createUser(data, {
        onError(error) {
          reject(error);
        },
        async onSuccess(res) {
          console.log({res});
          if (data.avatar.normal) {
            await confirmImage(data.avatar.normal);
          }
          router.replace('./')
          resolve(res);
        },
      });
    });
    toast.promise(request, {
      pending: "處理中...",
      success: {
        render({ data }) {
          const username = (data as Awaited<ReturnType<typeof createUser>>)
            .username;
          return `歡迎加入 ${username}`;
        },
      },
      error: {
        render({ data }) {
          const message = (data as TRPCClientError<AppRouter>).message;
          return `${message}`;
        },
      },
    });
  }
  return (
    <section className="px-8">
      <FormProvider {...methods}>
        <FormContainer onSubmit={handleSubmit(onSubmit)} title="建立帳號">
          <div className="flex flex-col gap-4">
            <fieldset className="flex items-center justify-center gap-8">
              <AvatarDropzone />
              <div className="flex w-full flex-col gap-4">
                <Label label="姓名" htmlFor="username" required>
                  <InputText name="username" id="username" />
                </Label>
                <Label label="email" htmlFor="email" required>
                  <InputText name="email" id="email" />
                </Label>
                <Label label="密碼" required htmlFor="password">
                  <InputPassword name="password" id="password" />
                </Label>
              </div>
            </fieldset>
            <InputSubmit value={"建立帳號"} />
          </div>
        </FormContainer>
      </FormProvider>
      <div className="flex items-center justify-center gap-4 p-4">
        <p>已經有帳號了嗎 ?</p>
        <Link href={"../user"} className="button bg-yellow-500">
          登入 !
        </Link>
      </div>
    </section>
  );
}
