import { connectToMongo, modelList } from "@/libs/mongoDB/connect mongo";
import { NextRequest, NextResponse } from "next/server";

interface params {
    params: {
        email: string
    }
}

export async function GET(req: NextRequest, { params: { email } }: params) {
    try {
        const { models: { [`${modelList.users}`]: DB_user } } = connectToMongo('users')
        const user = await DB_user.findOne({ email: { $eq: email } })
        if (!user) {

            throw '該用戶不存在 !'
        }

        return NextResponse.json(user, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json(error, { status: 400 })
    }
}

export async function PATCH(req: NextRequest, { params: { email } }: params) {
    const requestBody = await req.json()

    try {
        const { models: { [`${modelList.users}`]: DB_user } } = connectToMongo('users')
        await DB_user.findOneAndUpdate({
            email: {
                $eq: email
            }
        }, {
            $set: {
                username: requestBody.username,
                avatar: requestBody.avatar,
                phone: requestBody.phone,
                address: requestBody.address,
                payment: requestBody.payment,
            }
        }, {
            runValidators: true
        })
        return NextResponse.json('修改成功 !', {
            status: 200
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json(error, { status: 400 })
    }
}
