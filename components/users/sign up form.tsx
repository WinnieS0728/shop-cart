"use client";
import React, { useRef } from "react";
import FormContainer from "@UI/form";
import { FormProvider, useForm } from "react-hook-form";
import { Label, InputText, InputPassword, InputSubmit } from "@UI/inputs";
import { z } from "zod";
import { signUp_schema } from "@/libs/mongoDB/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Id, toast } from "react-toastify";
import Link from "next/link";
import { trpc } from "@/providers/trpc provider";
import { useImageMethods } from "@/hooks/useImage";
import { useRouter } from "next/navigation";
import { updateToast } from "@/libs/toast";
import ImgDropzone from "../UI/dropzone";

export default function SignUpForm() {
  const { mutate: createUser } = trpc.user.createUser.useMutation();
  const router = useRouter();
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
  const toastId = useRef<Id>("");
  async function onSubmit(data: z.infer<typeof signUp_schema>) {
    // console.log(data);
    toastId.current = toast.loading("處理中...");
    createUser(data, {
      onError(error) {
        updateToast(toastId.current, "error", {
          render: error.message,
        });
      },
      async onSuccess() {
        updateToast(toastId.current, "success", {
          render: `歡迎加入 ${data.username}`,
        });
        router.push("/admin");
      },
    });
  }
  return (
    <>
      <FormProvider {...methods}>
        <FormContainer onSubmit={handleSubmit(onSubmit)} title="建立帳號">
          <div className="flex flex-col gap-4">
            <fieldset className="flex items-center justify-center gap-8">
              <ImgDropzone imageFolder="userAvatar" />
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
        <Link href={"./signIn"} className="button bg-yellow-500">
          登入 !
        </Link>
      </div>
    </>
  );
}
