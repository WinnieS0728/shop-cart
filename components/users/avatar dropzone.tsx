"use client";
import { useEdgeStore } from "@/libs/edgestore";
import { cn } from "@/libs/utils/cn";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useController, useFormContext } from "react-hook-form";
import { ProgressBar } from "../UI/progress bar";
import * as icons from "@icons";

export default function AvatarDropzone() {
  const { control } = useFormContext();
  const {
    field: { onChange },
  } = useController({
    control,
    name: "avatar",
  });
  const [file, setFile] = useState<File>();
  const [url, setUrl] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  const { edgestore } = useEdgeStore();

  async function uploadImage(file: File) {
    const res = await edgestore.userAvatar.upload({
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
          const { thumbnailUrl } = await uploadImage(file[0]);
          onChange(thumbnailUrl);
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
          "flex aspect-square w-60 cursor-pointer items-center justify-center gap-2 rounded-full border p-8",
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
            className="aspect-square w-full rounded-full object-cover"
            alt="image"
            width={300}
            height={300}
            priority
            onLoad={() => {
              URL.revokeObjectURL(url);
            }}
          />
        ) : (
          <p className="whitespace-nowrap">{text}</p>
        )}
      </div>
      {progress ? (
        <ProgressBar progress={progress} />
      ) : (
        <ul className="text-center text-sm">
          <li>格式 png, jpeg, webp, svg</li>
          <li>大小 5MB</li>
        </ul>
      )}
      <button
        type="button"
        className="absolute -right-2 -top-2 flex aspect-square w-8 items-center justify-center rounded-full bg-red-500 text-white"
        onClick={() => {
          setFile(undefined);
          setProgress(0);
        }}
      >
        <icons.Close className="text-xl" />
      </button>
    </div>
  );
}
