"use client";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { InputPassword, InputSubmit, InputText, Label } from "../UI/inputs";
import { user_schema } from "@/libs/mongoDB/models/user";
import { z } from "zod";
import { CreditCard } from "../UI/credit card";
import { zodResolver } from "@hookform/resolvers/zod";
import FormContainer from "../UI/form";

export default function UpdateUserForm() {
  const methods = useForm<z.infer<typeof user_schema>>({
    resolver: zodResolver(user_schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      avatar: "",
      phone: "",
      address: "",
      payment: {
        cardNumber: ["", "", "", ""],
        expiration_date: ["", ""],
        security_code: "",
      },
    },
  });
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  console.log(errors);

  async function onSubmit(data: z.infer<typeof user_schema>) {
    console.log(data);
  }

  return (
    <>
      <FormProvider {...methods}>
        <FormContainer
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <fieldset className="flex items-center justify-center gap-8">
            <div className="circle-icon w-1/3 bg-red-500">avatar</div>
            <div className="flex w-full flex-col gap-4">
              <Label label="姓名" htmlFor="username" required>
                <InputText
                  name="username"
                  id="username"
                  error={errors.username?.message}
                />
              </Label>
              <Label label="email" htmlFor="email" required>
                <InputText
                  name="email"
                  id="email"
                  error={errors.email?.message}
                />
              </Label>
              <Label label="密碼" required htmlFor="password">
                <InputPassword
                  name="password"
                  id="password"
                  error={errors.password?.message}
                />
              </Label>
            </div>
          </fieldset>

          <Label label="電話(選填)" htmlFor="phone">
            <InputText name="phone" id="phone" />
          </Label>
          <Label label="地址(選填)" htmlFor="address">
            <InputText name="address" id="address" />
          </Label>
          <Label label="付款方式(選填)" htmlFor="creditCard">
            <div className="flex justify-center">
              <CreditCard />
            </div>
          </Label>
          <InputSubmit value="儲存" disabled={isSubmitting} />
        </FormContainer>
      </FormProvider>
    </>
  );
}
