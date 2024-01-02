import CategorySetting from "@/components/basic setting/category setting";
import MemberSetting from "@/components/basic setting/member setting";
import React from "react";

export default function SettingPage() {
  return (
    <section className="px-8">
      <h2 className="text-center text-xl uppercase">basic setting</h2>
      <div className="grid gap-2">
        <CategorySetting />
        <MemberSetting />
      </div>
    </section>
  );
}
