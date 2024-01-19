"use client";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { InputSubmit, InputText, Label } from "@UI/inputs";
import { user_schema } from "@/libs/mongoDB/schemas/user";
import { z } from "zod";
import { CreditCard } from "@UI/credit card";
import { zodResolver } from "@hookform/resolvers/zod";
import FormContainer from "@UI/form";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "@UI/loading";
import Link from "next/link";
import { useUserMethods } from "@/app/api/mongoDB/users/methods";
import { toast } from "react-toastify";
import AvatarDropzone from "@/components/users/avatar dropzone";
import LevelSection from "@/components/users/level";
import { useImageMethods } from "@/hooks/useImage";
import { trpc } from "@/providers/trpc provider";

interface props {
  session: Session;
}

export default function UpdateUserForm({ session }: props) {
  // console.log(trpc.user.getUserByEmail.useQuery({
  //   email: 'user1@aa.aa'
  // }).data);
  const {
    UPDATE_USER: { mutateAsync: updateUser },
  } = useUserMethods();
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
    formState: { isSubmitting, defaultValues },
  } = methods;

  const { imageProcess } = useImageMethods("userAvatar");

  async function onSubmit(data: z.infer<typeof user_schema>) {
    console.log(data);
    const request = new Promise(async (resolve, reject) => {
      const res = await updateUser(data);
      if (!res.ok) {
        reject(await res.json());
      } else {
        imageProcess(defaultValues?.avatar?.normal, data.avatar.normal);
        resolve(await res.json());
      }
    });

    toast.promise(request, {
      pending: "更新中...",
      error: {
        render({ data }) {
          return `${data}`;
        },
      },
      success: {
        render({ data }) {
          return `${data}`;
        },
      },
    });
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
                <AvatarDropzone />
                <div className="flex w-full flex-col gap-4">
                  <Label label="姓名" htmlFor="username" required>
                    <InputText name="username" id="username" />
                  </Label>
                  <Label label="email" htmlFor="email">
                    <InputText name="email" id="email" readOnly />
                  </Label>
                  <Label label="密碼" required>
                    <Link
                      href={"user/updatePassword"}
                      className="button inline-block bg-yellow-500"
                    >
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
              <Label label="付款方式(選填)" htmlFor="cardNumber">
                <div className="flex justify-center">
                  <CreditCard />
                </div>
              </Label>

              <Label label="階級">
                <LevelSection />
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
