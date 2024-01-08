import { connectToMongo } from "@/libs/mongoDB/connect mongo";
import DB_USER from "@/libs/mongoDB/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import { disconnect } from "mongoose";
export async function POST(req: NextRequest) {
    const requestBody = await req.json()
    const email = requestBody.email
    const hashedPassword = await bcrypt.hash(requestBody.password, 10);

    try {
        await connectToMongo('users')
        const isUserExist = await DB_USER.exists({
            email: {
                $eq: email
            }
        })
        if (isUserExist) {
            disconnect()
            return NextResponse.json('此 email 已註冊 !', {
                status: 500
            })
        }
        await DB_USER.create({
            ...requestBody,
            password: hashedPassword
        })
        disconnect()
        return NextResponse.json('建立成功 !', { status: 201 })
    } catch (error) {
        return NextResponse.json("建立失敗 !", {
            status: 500
        })
    }
}