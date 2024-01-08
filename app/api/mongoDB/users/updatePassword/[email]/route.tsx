import { connectToMongo } from "@/libs/mongoDB/connect mongo";
import DB_USER from "@/libs/mongoDB/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { disconnect } from "mongoose";

interface params {
  params: {
    email: string;
  };
}

export async function PATCH(req: NextRequest, { params: { email } }: params) {
  const requestBody = await req.json();
  try {
    await connectToMongo("users");

    const userData = await DB_USER.findOne({ email: { $eq: email } }).select(
      "password",
    );
    if (!userData) {
      disconnect()
      return NextResponse.json("查無使用者", { status: 400 });
    }

    if (
      !(await bcrypt.compare(requestBody.origin_password, userData.password))
    ) {
      disconnect()
      return NextResponse.json("舊密碼輸入錯誤", { status: 400 });
    }
    const newPassword = await bcrypt.hash(requestBody.confirm_password, 10);
    await DB_USER.findOneAndUpdate(
      {
        email: { $eq: email },
      },
      {
        $set: {
          password: newPassword
        }
      },
    );
    disconnect()
    return NextResponse.json("修改成功", { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
