"use client";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { InputSubmit, InputText, Label } from "@UI/inputs";
import { user_schema } from "@/libs/mongoDB/models/user";
import { z } from "zod";
import { CreditCard } from "@UI/credit card";
import { zodResolver } from "@hookform/resolvers/zod";
import FormContainer from "@UI/form";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "@UI/loading";
import Link from "next/link";

interface props {
  session: Session;
}

export default function UpdateUserForm({ session }: props) {
  const { data: userData, isPending } = useQuery<z.infer<typeof user_schema>>({
    queryKey: ["admin", "user", { key: "email", value: session.user!.email }],
    queryFn: async () => {
      const res = await fetch(`/api/mongoDB/users/${session.user!.email}`);
      return await res.json();
    },
  });
  const methods = useForm<z.infer<typeof user_schema>>({
    resolver: zodResolver(user_schema),
    defaultValues: userData
      ? userData
      : async () => {
          const res = await fetch(`/api/mongoDB/users/${session.user!.email}`);
          return await res.json();
        },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  async function onSubmit(data: z.infer<typeof user_schema>) {
    console.log(data);
  }

  return (
    <>
      <FormProvider {...methods}>
        <FormContainer onSubmit={handleSubmit(onSubmit)} title="會員資料修改">
          {isPending ? (
            <Loading.block height={16 * 20} />
          ) : (
            <div className="flex flex-col gap-4">
              <fieldset className="flex items-center justify-center gap-8">
                <div className="circle-icon w-1/3 bg-red-500">avatar</div>
                <div className="flex w-full flex-col gap-4">
                  <Label label="姓名" htmlFor="username" required>
                    <InputText name="username" id="username" />
                  </Label>
                  <Label label="email" htmlFor="email">
                    <InputText name="email" id="email" readOnly />
                  </Label>
                  <Label label="密碼" required>
                    <Link href={'user/updatePassword'} className="button bg-yellow-500 inline-block">
                      修改密碼
                    </Link>
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
            </div>
          )}
        </FormContainer>
        <div className="flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => {
              signOut();
            }}
            className="button bg-red-500"
          >
            登出
          </button>
        </div>
      </FormProvider>
    </>
  );
}
