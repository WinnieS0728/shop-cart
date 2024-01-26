"use client";
import { useEdgeStore } from "@/libs/edgestore/client";
import { cn } from "@/libs/utils/cn";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useController, useFormContext } from "react-hook-form";
import { ProgressBar } from "../UI/progress bar";
import * as icons from "@icons";
import { useImageMethods } from "@/hooks/useImage";

export default function ProductImgDropzone() {
  const [objectUrl, setObjectUrl] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  const { control } = useFormContext();
  const {
    field: { onChange, value },
  } = useController({
    control,
    name: "imageUrl",
  });

  const { edgestore } = useEdgeStore();
  const { deleteImage } = useImageMethods("productImage");

  async function uploadImage(file: File) {
    const res = await edgestore.productImage.upload({
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

  async function cancelImage() {
    onChange({
      normal: "",
      thumbnail: "",
    });
    await deleteImage(value.normal);
  }

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: {
        "image/*": [".png", ".jpeg", ".webp", ".svg"],
      },
      maxSize: 1024 * 1024 * 10, // @ 10MB
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
          "flex aspect-square w-80 cursor-pointer items-center justify-center gap-2 rounded-md border p-8",
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
        {objectUrl || value?.thumbnail ? (
          <Image
            src={objectUrl || value.thumbnail}
            className="aspect-square w-full object-contain"
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
      {progress || !!objectUrl ? (
        <ProgressBar progress={progress} />
      ) : (
        <ul className="text-center text-sm">
          <li>格式 png, jpeg, webp, svg</li>
          <li>大小 10MB</li>
        </ul>
      )}
      <button
        type="button"
        className="absolute -right-4 -top-4 flex aspect-square w-8 items-center justify-center rounded-full bg-red-500 text-white"
        onClick={() => {
          setProgress(0);
          setObjectUrl("");
          cancelImage();
        }}
      >
        <icons.Close className="text-xl" />
      </button>
    </div>
  );
}
