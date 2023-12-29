import Link from "next/link";
import React from "react";

export default function Banner() {
  return (
    <>
      <section className="flex aspect-video w-full items-center bg-slate-100">
        <div className="ms-8 flex w-2/3 flex-col items-start">
          <h1 className="text-[3rem] leading-snug">還不知道要賣什麼</h1>
          <h2>
            做了一個購物車練習網站，但我還不知道要賣什麼，反正就先隨便打一些字當作說明，然後把
            hame page 填滿哈哈
          </h2>
          <Link href={"/"} className="rounded-xl bg-yellow-500 px-4 py-4 mt-4">
            馬上買
          </Link>
        </div>
      </section>
    </>
  );
}
