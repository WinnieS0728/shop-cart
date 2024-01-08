import { connectToMongo } from "@/libs/mongoDB/connect mongo";
import DB_USER from "@/libs/mongoDB/models/user";
import { disconnect } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface params {
    params: {
        email: string
    }
}

export async function GET(req: NextRequest, { params: { email } }: params) {
    try {
        await connectToMongo('users')
        const user = await DB_USER.findOne({ email: { $eq: email } })
        if (!user) {
            disconnect()
            throw '該用戶不存在 !'
        }
        disconnect()
        return NextResponse.json(user, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json(error, { status: 400 })
    }
}
