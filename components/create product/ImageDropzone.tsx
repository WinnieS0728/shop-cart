"use client";
import { useEdgeStore } from "@/libs/edgestore";
import { cn } from "@/libs/tailwind/cn";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function ImageDropzone() {
  const [file, setFile] = useState<File>();
  const [url, setUrl] = useState<string>("");

  const { edgestore } = useEdgeStore();

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: {
        "image/*": [".png", ".jpeg", ".webp", ".svg"],
      },
      onDrop: async (file) => {
        if (file[0]) {
          const res = await edgestore.publicImages.upload({
            file: file[0],
            onProgressChange: (progress) => {
              console.log(progress);
            },
            options: {
              temporary: true,
            },
          });
          console.log(res);
          setFile(file[0]);
          setUrl(res.url);
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
    <div className='relative'>
      <div
        className={cn(
          "border w-full min-w-40 aspect-image flex justify-center items-center p-8 cursor-pointer max-w-60",
          {
            "border-red-500": isDragReject,
            "border-green-500": isDragAccept,
            "border-blue-500": isFocused,
            "p-0": file,
          }
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {file ? (
          <Image
            src={url}
            className='w-full aspect-image object-contain'
            alt='image'
            width={300}
            height={400}
            priority
            onLoad={() => {
              URL.revokeObjectURL(url);
            }}
          />
        ) : (
          <p className='whitespace-nowrap'>{text}</p>
        )}
      </div>
      <button
        type='button'
        className='absolute -top-2 -right-2 w-8 aspect-square rounded-full bg-red-500 text-white'
        onClick={() => {
          setFile(undefined);
        }}
      >
        X
      </button>
    </div>
  );
}
