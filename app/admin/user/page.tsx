import { getServerSession } from "next-auth";
import React from "react";
import UpdateUserForm from "./updateUser/page";
import SignInForm from "./signIn/page";

export default async function Page() {
  const session = await getServerSession();
  return (
    <section className="px-8">
      {session ? <UpdateUserForm session={session} /> : <SignInForm />}
    </section>
  );
}
