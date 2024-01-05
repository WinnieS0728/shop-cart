"use client";
import React from "react";
import FormContainer from "../UI/form";
import { FormProvider, useForm } from "react-hook-form";
import { Label, InputText, InputPassword } from "../UI/inputs";
import { z } from "zod";
import { signUp_schema } from "@/libs/mongoDB/models/user";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignUp() {
  const methods = useForm<z.infer<typeof signUp_schema>>({
    resolver: zodResolver(signUp_schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      avatar: "",
    },
  });
  const { handleSubmit, control } = methods;

  async function onSubmit() {}
  return (
    <>
      <FormProvider {...methods}>
        <FormContainer onSubmit={handleSubmit(onSubmit)}>
          <h3 className="text-xl">建立帳號</h3>
          <fieldset className="flex items-center justify-center gap-8">
            <div className="circle-icon w-1/3 bg-red-500">avatar</div>
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
        </FormContainer>
      </FormProvider>
    </>
  );
}
