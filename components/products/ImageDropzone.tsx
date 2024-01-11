"use client";
import { useEdgeStore } from "@/libs/edgestore";
import { cn } from "@/libs/utils/cn";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UseFormSetValue } from "react-hook-form";
import { product_schema } from "@/libs/mongoDB/schemas/product";
import { z } from "zod";
import { ProgressBar } from "../UI/progress bar";


interface props {
  setImageUrl: UseFormSetValue<z.infer<typeof product_schema>>;
}
export default function ImageDropzone({
  setImageUrl,
}: props) {
  const [file, setFile] = useState<File>();
  const [url, setUrl] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  const { edgestore } = useEdgeStore();

  async function uploadImage(file: File) {
    const res = await edgestore.publicImages.upload({
      file,
      onProgressChange: (progress) => {
        setProgress(progress);
      },
      options: {
        temporary: true,
      },
    });
    return res;
  }

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: {
        "image/*": [".png", ".jpeg", ".webp", ".svg"],
      },
      maxSize: 1024 * 1024 * 5, // @ 5MB
      onDrop: async (file) => {
        if (file[0]) {
          const objectUrl = URL.createObjectURL(file[0]);
          setUrl(objectUrl);
          setFile(file[0]);
          const { url } = await uploadImage(file[0]);
          setImageUrl("imageUrl", url);
        }
      },
    });

  const text = useMemo(() => {
    switch (true) {
      case isDragAccept:
        return "drop";
      case isDragReject:
        return "not valid";
      default:
        return "drop or click";
    }
  }, [isDragAccept, isDragReject]);

  return (
    <div className="relative">
      <div
        className={cn(
          "flex aspect-image w-60 cursor-pointer items-center justify-center  gap-2 border p-8",
          {
            "border-red-500": isDragReject,
            "border-green-500": isDragAccept,
            "border-blue-500": isFocused,
            "p-0": file,
          },
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {file ? (
          <Image
            src={url}
            className="aspect-image w-full object-contain"
            alt="image"
            width={300}
            height={400}
            priority
            onLoad={() => {
              URL.revokeObjectURL(url);
            }}
          />
        ) : (
          <p className="whitespace-nowrap">{text}</p>
        )}
      </div>
      <ProgressBar progress={progress} />
      <button
        type="button"
        className="absolute -right-2 -top-2 aspect-square w-8 rounded-full bg-red-500 text-white"
        onClick={() => {
          setFile(undefined);
          setProgress(0);
        }}
      >
        X
      </button>
    </div>
  );
}