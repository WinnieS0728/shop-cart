import CategorySetting from "@/components/basic setting/category setting";
import MemberSetting from "@/components/basic setting/member setting";
import TagsSetting from "@/components/basic setting/tag setting";
import React from "react";

export default function SettingPage() {
  return (
    <section className="px-8">
      <h2 className="text-center text-xl uppercase">基本設定</h2>
      <div className="grid gap-2">
        <MemberSetting />
        <CategorySetting />
        <TagsSetting />
      </div>
    </section>
  );
}
