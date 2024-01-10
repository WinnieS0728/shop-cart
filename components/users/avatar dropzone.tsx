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
  const [objectUrl, setObjectUrl] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  const { control } = useFormContext();
  const {
    field: { onChange, value },
  } = useController({
    control,
    name: "avatar",
  });

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

  async function deleteImage(url: string) {
    if (!url) {
      return;
    }
    onChange({
      normal: "",
      thumbnail: "",
    });
  }

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: {
        "image/*": [".png", ".jpeg", ".webp", ".svg"],
      },
      maxSize: 1024 * 1024 * 5, // @ 5MB
      onDrop: async (fileList) => {
        if (fileList[0]) {
          const objectUrl = URL.createObjectURL(fileList[0]);
          setObjectUrl(objectUrl);
          const { url, thumbnailUrl } = await uploadImage(fileList[0]);
          onChange({
            normal: url,
            thumbnail: thumbnailUrl,
          });
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
            "p-0": value?.thumbnail || objectUrl,
          },
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {value?.thumbnail || objectUrl ? (
          <Image
            src={objectUrl || value.thumbnail}
            className="aspect-square w-full rounded-full object-cover"
            alt="image"
            width={300}
            height={300}
            priority
            onLoad={() => {
              URL.revokeObjectURL(objectUrl);
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
          setProgress(0);
          setObjectUrl('')
          deleteImage(value.normal);
        }}
      >
        <icons.Close className="text-xl" />
      </button>
    </div>
  );
}
