import Link from "next/link";
import React from "react";

export default function Banner() {
  return (
    <>
      <section className="flex aspect-video w-full items-center bg-slate-100">
        <div className="ms-8 flex w-2/3 flex-col items-start">
          <h1 className="text-[3rem] leading-snug">有點甜點店</h1>
          <h2>有點甜點, 有點幸福。</h2>
          <Link
            href={"/menu"}
            className="mt-4 rounded-xl bg-yellow-500 px-4 py-4"
          >
            馬上買
          </Link>
        </div>
      </section>
    </>
  );
}
