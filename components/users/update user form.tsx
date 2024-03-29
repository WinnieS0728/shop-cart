"use client";
import { user_schema } from "@/libs/mongoDB/schemas/user";
import { updateToast } from "@/libs/toast";
import { trpc } from "@/providers/trpc provider";
import { CreditCard } from "@UI/credit card";
import FormContainer from "@UI/form";
import { InputSubmit, InputText, Label } from "@UI/inputs";
import { zodResolver } from "@hookform/resolvers/zod";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { ReactNode, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Id, toast } from "react-toastify";
import { z } from "zod";
import ImgDropzone from "../UI/dropzone";
import Cookies from "js-cookie";

interface props {
  email: string;
  initData: z.infer<typeof user_schema>;
  levelSection: ReactNode;
}

export default function UpdateUserForm({
  email,
  initData,
  levelSection,
}: props) {
  const { data: userData, refetch: refetchUser } =
    trpc.user.getUserByEmail.useQuery(
      {
        email,
      },
      {
        initialData: initData,
      },
    );
  const { mutate: updateUser } = trpc.user.updateUser.useMutation({
    onSettled: () => {
      refetchUser();
    },
  });

  const methods = useForm<z.infer<typeof user_schema>>({
    resolver: zodResolver(user_schema),
    defaultValues: userData,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const toastId = useRef<Id>("");
  async function onSubmit(data: z.infer<typeof user_schema>) {
    // console.log(data);
    toastId.current = toast.loading("更新中...");
    updateUser(data, {
      onError(error) {
        updateToast(toastId.current, "error", {
          render: error.message,
        });
      },
      async onSuccess() {
        updateToast(toastId.current, "success", {
          render: "修改成功 !",
        });
      },
    });
  }

  return (
    <>
      <FormProvider {...methods}>
        <FormContainer onSubmit={handleSubmit(onSubmit)} title="會員資料修改">
          <>
            <div className="flex flex-col gap-4">
              <fieldset className="flex items-center justify-center gap-8">
                <ImgDropzone imageFolder="userAvatar" />
                <div className="flex w-full flex-col gap-4">
                  <Label label="姓名" htmlFor="username" required>
                    <InputText name="username" id="username" />
                  </Label>
                  <Label label="email" htmlFor="email">
                    <InputText name="email" id="email" readOnly />
                  </Label>
                  <Label label="密碼" required>
                    <Link
                      href={"admin/updatePassword"}
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

              <Label label="會員階級">{levelSection}</Label>

              <InputSubmit value="儲存" disabled={isSubmitting} />
            </div>
          </>
        </FormContainer>
        <div className="flex items-center justify-center p-4">
          <button
            type="button"
            onClick={async () => {
              Cookies.remove("cartId");
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
