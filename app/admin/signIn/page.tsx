import SignInForm from "@/components/users/sign in form";
import { authOptions } from "@/libs/next auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/admin");
  }

  return (
    <>
      <SignInForm />
    </>
  );
}
