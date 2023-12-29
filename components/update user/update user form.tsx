"use client";
import React, { useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { InputText, Label } from "../UI/inputs";
import { user_schema } from "@/libs/mongoDB/models/user";
import { z } from "zod";
import { creditCard } from "../UI/credit card";
import { ReactSelect } from "../UI/select";

export default function UpdateUserForm() {
  const methods = useForm<z.infer<typeof user_schema>>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
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
    control,
    formState: { errors, isSubmitting },
  } = methods;

  async function onSubmit(data: z.infer<typeof user_schema>) {
    console.log(data);
  }

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <Label label="姓名" required>
            <InputText name="username" />
          </Label>
          <Label label="email" required>
            <InputText name="email" />
          </Label>
          <Label label="密碼" required>
            <InputText name="password" />
          </Label>
          <Label label="電話" required>
            <InputText name="phone" />
          </Label>
          <Label label="地址" required>
            <InputText name="address" />
          </Label> */}
          {/* <creditCard.CardNumber /> */}
          <creditCard.Expiration_date />
          {/* <creditCard.SecurityCode /> */}
          <input type="submit" value="send" />
        </form>
      </FormProvider>
    </>
  );
}
