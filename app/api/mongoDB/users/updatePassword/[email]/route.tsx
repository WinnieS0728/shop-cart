import { connectToMongo, modelList } from "@/libs/mongoDB/connect mongo";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

interface params {
  params: {
    email: string;
  };
}

export async function PATCH(req: NextRequest, { params: { email } }: params) {
  const requestBody = await req.json();
  try {
    const { models: {[`${modelList.users}`]: DB_user} } = connectToMongo("users");

    const userData = await DB_user.findOne({ email: { $eq: email } }).select(
      "password",
    );
    if (!userData) {
      
      return NextResponse.json("查無使用者", { status: 400 });
    }

    if (
      !(await bcrypt.compare(requestBody.origin_password, userData.password))
    ) {
      
      return NextResponse.json("舊密碼輸入錯誤", { status: 400 });
    }
    const newPassword = await bcrypt.hash(requestBody.confirm_password, 10);
    await DB_user.findOneAndUpdate(
      {
        email: { $eq: email },
      },
      {
        $set: {
          password: newPassword
        }
      },
      {
        runValidators: true
      }
    );
    
    return NextResponse.json("修改成功", { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
