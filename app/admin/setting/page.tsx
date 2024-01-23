import CategorySetting from "@/components/basic setting/category setting";
import MemberSetting from "@/components/basic setting/member setting";
import TagsSetting from "@/components/basic setting/tag setting";
import { serverCaller } from "@/server/routers";
import React from "react";

export default async function SettingPage() {
  const memberData = await serverCaller.basicSetting.member.getMemberList();
  const categoryData =
    await serverCaller.basicSetting.category.getCategoryList();
  return (
    <section className="px-8">
      <h2 className="text-center text-xl uppercase">基本設定</h2>
      <div className="grid gap-2">
        <MemberSetting initData={memberData} />
        <CategorySetting initData={categoryData} />
        <TagsSetting />
      </div>
    </section>
  );
}
