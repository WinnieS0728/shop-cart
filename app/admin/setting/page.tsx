import CategorySetting from "@/components/basic setting/category setting";
import MemberSetting from "@/components/basic setting/member setting";
import TagsSetting from "@/components/basic setting/tag setting";
import { JSON_serialize } from "@/libs/utils/serialize";
import { serverCaller } from "@/server/routers";
import React from "react";

export default async function SettingPage() {
  const memberData = await serverCaller.basicSetting.member.getMemberList();
  const categoryData =
    await serverCaller.basicSetting.category.getCategoryList();
  const tagData = await serverCaller.basicSetting.tag.getTagList();
  return (
    <>
      <h2 className="text-center text-xl uppercase">基本設定</h2>
      <div className="grid gap-2">
        <MemberSetting initData={JSON_serialize(memberData)} />
        <CategorySetting initData={JSON_serialize(categoryData)} />
        <TagsSetting initData={JSON_serialize(tagData)} />
      </div>
    </>
  );
}
