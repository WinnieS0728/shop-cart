import SignInForm from "@/components/users/sign in";
import SignUp from "@/components/users/sign up";
import UpdateUserForm from "@/components/users/update user form";
import { getServerSession } from "next-auth";
import React from "react";

export default async function AdminPage() {
  const session = await getServerSession();
  console.log(session);
  return (
    <section className="px-8">
      <h2 className="text-center text-xl uppercase">Profile setting</h2>
      {/* <SignUp /> */}
      {session ? <UpdateUserForm /> : <SignInForm />}
    </section>
  );
}
