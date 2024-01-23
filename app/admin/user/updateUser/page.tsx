"use client";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { InputSubmit, InputText, Label } from "@UI/inputs";
import { user_schema } from "@/libs/mongoDB/schemas/user";
import { z } from "zod";
import { CreditCard } from "@UI/credit card";
import { zodResolver } from "@hookform/resolvers/zod";
import FormContainer from "@UI/form";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { Loading } from "@UI/loading";
import Link from "next/link";
import { toast } from "react-toastify";
import AvatarDropzone from "@/components/users/avatar dropzone";
import LevelSection from "@/components/users/level";
import { useImageMethods } from "@/hooks/useImage";
import { trpc } from "@/providers/trpc provider";
import { TRPCClientError } from "@trpc/client";
import { AppRouter } from "@/server/routers";

interface props {
  session: Session;
}

export default function UpdateUserForm({ session }: props) {
  const {
    data: userData,
    isPending,
    refetch: refetchUser,
  } = trpc.user.getUserByEmail.useQuery({
    email: session.user?.email || "",
  });
  const { mutateAsync: updateUser } = trpc.user.updateUser.useMutation({
    onSettled: () => {
      refetchUser();
    },
  });

  const methods = useForm<z.infer<typeof user_schema>>({
    resolver: zodResolver(user_schema),
    defaultValues: {
      _id: "",
      username: "",
      email: "",
      password: "",
      avatar: {
        normal: "",
        thumbnail: "",
      },
      phone: "",
      address: "",
      payment: {
        cardNumber: "",
        expiration_date: ["", ""],
        security_code: "",
      },
      consumption: 0,
      role: "user",
    },
  });
  const {
    handleSubmit,
    formState: { isSubmitting, defaultValues },
    reset,
  } = methods;

  useEffect(() => {
    if (userData) {
      reset(userData);
    }
  }, [reset, userData]);

  const { imageProcess } = useImageMethods("userAvatar");

  async function onSubmit(data: z.infer<typeof user_schema>) {
    // console.log(data);
    const request = new Promise(async (resolve, reject) => {
      await updateUser(data, {
        onError(error) {
          reject(error);
        },
        async onSuccess(res, variables) {
          await imageProcess(defaultValues?.avatar?.normal, variables.avatar.normal);
          resolve(res);
        },
      });
    });

    toast.promise(request, {
      pending: "更新中...",
      error: {
        render({data}) {
            const message = (data as TRPCClientError<AppRouter>).message
            return message
        },
      },
      success: `修改成功 !`,
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
