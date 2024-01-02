import UpdateUserForm from "@/components/update user/update user form";
import React from "react";

export default function AdminPage() {
  return (
    <section className="px-8">
      <h2 className="text-center text-xl uppercase">Profile setting</h2>
      <UpdateUserForm />
    </section>
  );
}
