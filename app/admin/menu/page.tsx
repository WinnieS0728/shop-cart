"use client";
import { ReactSelect } from "@/components/UI/select";
import Link from "next/link";
import React from "react";
import Select, { components } from "react-select";

export default function MenuPage() {
  return (
    <section className="px-8">
      <h2 className="text-center text-xl uppercase">menu setting</h2>
      <Link href={"menu/add"} className="add-new-btn block text-center">
        + add new product
      </Link>
    </section>
  );
}
