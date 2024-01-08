"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import React from "react";

export default function OtherSignInProvider() {
  return (
    <>
      <div className="flex flex-col gap-2 px-24">
        <button
          type="button"
          onClick={() => {
            signIn("google");
          }}
          className="flex items-center justify-center gap-2 rounded-md border-2 p-2"
        >
          <Image
            src={"/images/google-icon.png"}
            alt="google icon"
            width={16 * 1.5}
            height={16 * 1.5}
            priority
          />
          google
        </button>
      </div>
    </>
  );
}
