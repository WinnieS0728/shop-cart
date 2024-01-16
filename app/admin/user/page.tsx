import React from "react";
import UpdateUserForm from "./updateUser/page";
import SignInForm from "./signIn/page";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession();
  return (
    <section className="px-8">
      {session ? <UpdateUserForm session={session} /> : <SignInForm />}
    </section>
  );
}
