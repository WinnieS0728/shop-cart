import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useFormContext } from "react-hook-form";

type level = {
  title: string;
  threshold: number;
};

export default function Level() {
  const { watch } = useFormContext();
  const consumption = watch("consumption");
  const { data: level, isSuccess } = useQuery<{
    prev: level;
    next: level;
  }>({
    queryKey: [
      "admin",
      "basicSetting",
      "GET",
      {
        action: "get level",
        key: "threshold",
        value: consumption,
      },
    ],
    queryFn: async () => {
      const res = await fetch(
        `/api/mongoDB/basicSetting/getMemberLevel?consumption=${
          consumption ?? 0
        }`,
        {
          method: "GET",
        },
      );
      return await res.json();
    },
  });
  return (
    <>
      <div className="flex items-center gap-8">
        <p className="flex items-center gap-2 whitespace-nowrap">
          目前累計消費金額 : <span className="text-2xl">{consumption}</span>
        </p>
        {isSuccess && (
          <p className="flex items-center justify-center gap-2 whitespace-nowrap">
            等級 : <span className="text-2xl">{level.prev.title}</span>
          </p>
        )}
      </div>
      {isSuccess && (
        <p className="flex items-center gap-2 whitespace-nowrap">
          <>
            再消費
            {isSuccess && (
              <span className="text-2xl">
                {level.next.threshold - consumption ?? 0}
              </span>
            )}
            元可升級為{" "}
            {isSuccess && <span className="text-2xl">{level.next.title}</span>}
          </>
        </p>
      )}
    </>
  );
}
