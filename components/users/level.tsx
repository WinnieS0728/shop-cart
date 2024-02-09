import { serverCaller } from "@/server/routers";
import React from "react";

interface props {
  consumption: number;
}

export default async function LevelSection({ consumption = 0 }: props) {
  const level = await serverCaller.basicSetting.member.getLevel({
    consumption,
  });

  return (
    <>
      <div className="flex items-center gap-8">
        <>
          <p className="flex items-center gap-2 whitespace-nowrap">
            目前累計消費金額 : <span className="text-2xl">{consumption}</span>
          </p>
          <p className="flex items-center justify-center gap-2 whitespace-nowrap">
            等級 : <span className="text-2xl">{level?.nowLevel.title}</span>
          </p>
        </>
      </div>
      {!level.nextLevel ? (
        <p>已達最高級</p>
      ) : (
        <p className="flex items-center gap-2 whitespace-nowrap">
          <>
            再消費
            <span className="text-2xl">
              {(level?.nextLevel?.threshold || 0) - consumption}
            </span>
            元可升級為 <span className="text-2xl">{level.nextLevel.title}</span>
          </>
        </p>
      )}
    </>
  );
}
