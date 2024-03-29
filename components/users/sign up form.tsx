"use client";
import { signUp_schema } from "@/libs/mongoDB/schemas/user";
import { updateToast } from "@/libs/toast";
import { trpc } from "@/providers/trpc provider";
import FormContainer from "@UI/form";
import { InputPassword, InputSubmit, InputText, Label } from "@UI/inputs";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Id, toast } from "react-toastify";
import { z } from "zod";
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
        const signInReq = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        if (signInReq && !signInReq.ok) {
          updateToast(toastId.current, "error", {
            render: `登入失敗 請重新登入 !`,
          });
          router.push("/admin/signIn");
        } else {
          updateToast(toastId.current, "success", {
            render: `歡迎加入 ${data.username}`,
          });
          router.push("/admin");
        }
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
