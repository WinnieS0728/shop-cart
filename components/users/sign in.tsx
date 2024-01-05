"use client";
import React from "react";
import FormContainer from "../UI/form";
import { FormProvider, useForm } from "react-hook-form";
import { Label, InputText, InputPassword, InputSubmit } from "../UI/inputs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signOut } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const signIn_schema = z.object({
  email: z.string().min(1, "請填寫  email").email("請填入正確 email 格式"),
  password: z.string().min(1, "請填寫密碼"),
});
export default function SignInForm() {
  const router = useRouter();
  const methods = useForm<z.infer<typeof signIn_schema>>({
    resolver: zodResolver(signIn_schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { handleSubmit } = methods;

  async function onSubmit(data: z.infer<typeof signIn_schema>) {
    console.log(data);
    const res = await signIn("credentials", {
      ...data,
      redirect: false,
    });
    if (res && !res.ok) {
      toast.error(res.error);
    } else {
      router.refresh();
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
        </FormContainer>
      </FormProvider>
    </>
  );
}
