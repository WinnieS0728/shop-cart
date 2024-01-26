"use client";
import React, { useRef } from "react";
import FormContainer from "@UI/form";
import { FormProvider, useForm } from "react-hook-form";
import { Label, InputText, InputPassword, InputSubmit } from "@UI/inputs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Id, toast } from "react-toastify";
import HrWithText from "@UI/hr with text";
import OtherSignInProvider from "@/components/users/3rd party sign in";
import Link from "next/link";
import { signIn_schema } from "@/libs/mongoDB/schemas/user";
import { updateToast } from "@/libs/toast";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const methods = useForm<z.infer<typeof signIn_schema>>({
    resolver: zodResolver(signIn_schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { handleSubmit } = methods;
  const router = useRouter();

  const toastId = useRef<Id>("");
  async function onSubmit(data: z.infer<typeof signIn_schema>) {
    // console.log(data);
    toastId.current = toast.loading("登入中...");
    const res = await signIn("credentials", {
      ...data,
      redirect: false,
    });
    if (res && !res.ok) {
      updateToast(toastId.current, "error", {
        render: res.error,
      });
    } else {
      updateToast(toastId.current, "success", {
        render: "登入成功 !",
      });
      router.push("/admin");
    }
  }
  return (
    <>
      <FormProvider {...methods}>
        <FormContainer onSubmit={handleSubmit(onSubmit)} title="登入">
          <div className="flex flex-col gap-4">
            <Label label="email" htmlFor="email" required>
              <InputText name="email" id="email" />
            </Label>
            <Label label="密碼" required htmlFor="password">
              <InputPassword name="password" id="password" />
            </Label>
            <InputSubmit value={"登入"} />
          </div>
          <HrWithText text="or" />
          <OtherSignInProvider />
        </FormContainer>
      </FormProvider>
      <div className="flex items-center justify-center gap-4 p-4">
        <p>還沒有帳號嗎 ? </p>
        <Link className="button bg-yellow-500" href={"./signUp"}>
          建立帳號 !
        </Link>
      </div>
    </>
  );
}
