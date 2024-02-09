import LevelSection from "@/components/users/level";
import UpdateUserForm from "@/components/users/update user form";
import { authOptions } from "@/libs/next auth";
import { JSON_serialize } from "@/libs/utils/serialize";
import { serverCaller } from "@/server/routers";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("admin/signIn");
  }

  const userData = await serverCaller.user.getUserByEmail({
    email: session.user.email || "",
  });

  return (
    <>
      <UpdateUserForm
        email={session.user?.email || ""}
        initData={JSON_serialize(userData)}
        levelSection={<LevelSection consumption={userData.consumption} />}
      />
    </>
  );
}
