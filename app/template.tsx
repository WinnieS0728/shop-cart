import Header from "@/components/layouts/header";
import React, { ReactNode } from "react";

interface props {
  children: ReactNode;
}

export default function Template({ children }: props) {
  return (
    <main>
      <Header />
      {children}
    </main>
  );
}
