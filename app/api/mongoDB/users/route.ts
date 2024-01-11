import { connectToMongo, collectionList, dbList } from "@/libs/mongoDB/connect mongo";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
export async function POST(req: NextRequest) {
    const requestBody = await req.json()
    const email = requestBody.email
    const hashedPassword = await bcrypt.hash(requestBody.password, 10);
    const conn = connectToMongo(dbList.users)
    const { models: { [`${collectionList.users}`]: DB_user } } = conn

    try {
        const isUserExist = await DB_user.exists({
            email: {
                $eq: email
            }
        })
        if (isUserExist) {
            return NextResponse.json('此 email 已註冊 !', {
                status: 500
            })
        }
        await DB_user.create({
            ...requestBody,
            password: hashedPassword
        })

        return NextResponse.json('建立成功 !', { status: 201 })
    } catch (error) {
        return NextResponse.json("建立失敗 !", {
            status: 500
        })
    } finally {
        await conn.close()
    }
}