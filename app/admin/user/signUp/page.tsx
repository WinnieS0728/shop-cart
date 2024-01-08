"use client";
import React from "react";
import FormContainer from "@UI/form";
import { FormProvider, useForm } from "react-hook-form";
import { Label, InputText, InputPassword, InputSubmit } from "@UI/inputs";
import { z } from "zod";
import { signUp_schema } from "@/libs/mongoDB/models/user";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUserMethods } from "@/app/api/mongoDB/users/methods";
import { toast } from "react-toastify";
import { useEdgeStore } from "@/libs/edgestore";
import AvatarDropzone from "@/components/users/avatar dropzone";
import Link from "next/link";

export default function SignUp() {
  const { edgestore } = useEdgeStore();
  const {
    POST: { mutateAsync: createUser },
  } = useUserMethods();
  const methods = useForm<z.infer<typeof signUp_schema>>({
    resolver: zodResolver(signUp_schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      avatar: "",
    },
  });
  const { handleSubmit } = methods;
  async function onSubmit(data: z.infer<typeof signUp_schema>) {
    const res = await createUser(data);
    const request = new Promise(async (resolve, reject) => {
      if (!res.ok) {
        reject(await res.json());
      } else {
        await edgestore.userAvatar.confirmUpload({
          url: data.avatar,
        });
        resolve("註冊成功 !");
      }
    });
    toast.promise(request, {
      pending: "處理中...",
      success: {
        render(props) {
          return `${props.data}`;
        },
      },
      error: {
        render(props) {
          return `${props.data}`;
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
