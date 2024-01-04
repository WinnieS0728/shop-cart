import { connectToMongo } from "@/libs/mongoDB/connect mongo";
import DB_basicSetting_member, { memberSetting_Schema } from "@/libs/mongoDB/models/basic setting/member";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type params = {
    params: {
        type: "member"
    }
}
export async function GET(req: NextRequest, { params: { type } }: params) {
    try {
        switch (type) {
            case 'member':
                const res = await DB_basicSetting_member.find()
                return NextResponse.json(res, { status: 200 })

            default:
                return NextResponse.json('type error', { status: 404 })
        }
    } catch (error) {
        return NextResponse.json(error, { status: 500 })
    }

}

export async function POST(req: NextRequest, { params: { type } }: params) {
    const requestData: z.infer<typeof memberSetting_Schema>['member'] = await req.json()

    try {
        await connectToMongo('basic-setting')

        switch (type) {
            case 'member':

                return NextResponse.json('建立成功', { status: 201 })


            default:
                NextResponse.json('不知道要建立什麼', { status: 400 })
        }
    } catch (error) {
        return NextResponse.json(error, { status: 400 })
    }
}

export async function DELETE(req: NextRequest, { params: { type } }: params) {
    const searchParams = req.nextUrl.searchParams;
    const deleteId = searchParams.get('id')

    try {
        connectToMongo('basic-setting')
        switch (type) {
            case 'member':
                await DB_basicSetting_member.findByIdAndDelete(deleteId)
                return NextResponse.json('刪除成功', {
                    status: 200
                })

            default:
                return NextResponse.json('不知道要刪什麼', {
                    status: 404
                })
        }

    } catch (error) {
        return NextResponse.json('刪除失敗', {
            status: 500
        })
    }
}