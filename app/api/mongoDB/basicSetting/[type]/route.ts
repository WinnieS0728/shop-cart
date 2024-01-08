import { connectToMongo } from "@/libs/mongoDB/connect mongo";
import DB_basicSetting_category from "@/libs/mongoDB/models/basic setting/category";
import DB_basicSetting_member from "@/libs/mongoDB/models/basic setting/member";
import DB_basicSetting_tag from "@/libs/mongoDB/models/basic setting/tag";
import { disconnect } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export type basicSettingType = "member" | 'category' | 'tag'
type params = {
    params: {
        type: basicSettingType
    }
}
export async function GET(req: NextRequest, { params: { type } }: params) {
    try {
        await connectToMongo('basic-setting')

        switch (type) {
            case 'member':
                const member_res = await DB_basicSetting_member.find().lean()
                disconnect()
                return NextResponse.json(member_res, { status: 200 })
            case "category":
                const categories_res = await DB_basicSetting_category.find().lean()
                disconnect()
                return NextResponse.json(categories_res, { status: 200 })
            case 'tag':
                const tag_res = await DB_basicSetting_tag.find().lean()
                disconnect()
                return NextResponse.json(tag_res, { status: 200 })
            default:
                disconnect()
                return NextResponse.json('type error', { status: 404 })
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json(error, { status: 500 })
    }

}

export async function POST(req: NextRequest, { params: { type } }: params) {
    const requestBody = await req.json()

    try {
        await connectToMongo('basic-setting')

        switch (type) {
            case 'member':
                await DB_basicSetting_member.create(requestBody)
                disconnect()
                return NextResponse.json('建立成功', { status: 201 })
            case 'category':
                await DB_basicSetting_category.create(requestBody)
                disconnect()
                return NextResponse.json('建立成功', { status: 201 })
            case 'tag':
                await DB_basicSetting_tag.create(requestBody)
                disconnect()
                return NextResponse.json('建立成功', { status: 201 })
            default:
                disconnect()
                NextResponse.json('不知道要建立什麼', { status: 400 })
        }
    } catch (error) {
        return NextResponse.json(error, { status: 400 })
    }
}

export async function DELETE(req: NextRequest, { params: { type } }: params) {
    const searchParams = req.nextUrl.searchParams;
    const deleteTitle = searchParams.get('title')

    try {
        connectToMongo('basic-setting')
        switch (type) {
            case 'member':
                await DB_basicSetting_member.findOneAndDelete({
                    title: {
                        $eq: deleteTitle
                    }
                })
                disconnect()
                return NextResponse.json('刪除成功', {
                    status: 200
                })
            case 'category':
                await DB_basicSetting_category.findOneAndDelete({
                    title: {
                        $eq: deleteTitle
                    }
                })
                disconnect()
                return NextResponse.json('刪除成功', {
                    status: 200
                })
            case 'tag':
                await DB_basicSetting_tag.findOneAndDelete({
                    title: {
                        $eq: deleteTitle
                    }
                })
                disconnect()
                return NextResponse.json('刪除成功', {
                    status: 200
                })

            default:
                disconnect()
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

export async function PATCH(req: NextRequest, { params: { type } }: params) {
    const requestBody = await req.json()
    console.log(requestBody);
    try {
        await connectToMongo('basic-setting')

        switch (type) {
            case 'member':
                await DB_basicSetting_member.findOneAndUpdate({
                    title: {
                        $eq: requestBody.title
                    }
                }, {
                    $set: {
                        title: requestBody.title,
                        threshold: requestBody.threshold
                    }
                })
                disconnect()
                return NextResponse.json('更新成功', {
                    status: 200
                })


            default:
                disconnect()
                return NextResponse.json('不知道要更新什麼', {
                    status: 404
                })
        }


    } catch (error) {
        console.log(error);
        return NextResponse.json('更新失敗', {
            status: 400
        })
    }
}