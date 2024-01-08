import React, { ReactNode } from "react";

interface props {
  children: ReactNode;
  signIn: ReactNode;
  signUp: ReactNode;
  updatePassword: ReactNode;
  updateUser: ReactNode;
}

export default async function UserLayout({
  children,
}: props) {
  return (
    <div>
      {children}
    </div>
  );
}
