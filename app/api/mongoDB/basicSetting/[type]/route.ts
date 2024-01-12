import { dbList, collectionList, connectToMongo } from "@/libs/mongoDB/connect mongo";
import { NextRequest, NextResponse } from "next/server";

type params = {
    params: {
        type: Extract<typeof collectionList[keyof typeof collectionList], "members" | 'categories' | 'tags'>
    }
}

export async function GET(req: NextRequest, { params: { type } }: params) {
    const conn = connectToMongo('basicSetting')
    const { models: {
        [`${collectionList.members}`]: DB_basicSetting_member,
        [`${collectionList.categories}`]: DB_basicSetting_category,
        [`${collectionList.tags}`]: DB_basicSetting_tag,
    } } = conn

    try {
        switch (type) {
            case 'members':
                const member_res = await DB_basicSetting_member.find().sort({ threshold: 1 }).lean()
                return NextResponse.json(member_res, { status: 200 })
            case "categories":
                const categories_res = await DB_basicSetting_category.find().lean()
                return NextResponse.json(categories_res, { status: 200 })
            case 'tags':
                const tag_res = await DB_basicSetting_tag.find().lean()
                return NextResponse.json(tag_res, { status: 200 })
            default:
                return NextResponse.json('type error', { status: 404 })
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json(error, { status: 500 })
    } finally {
        await conn.close()
    }
}

export async function GET2(req: NextRequest, { params: { type } }: params) {
    // const conn = connectDB('basic-setting')
    // const DB_basicSetting_member = conn.models.members
    // const DB_basicSetting_category = conn.models.categories
    // const DB_basicSetting_tag = conn.models.tags
    // const disconnect = conn.close

    const { models: {
        members: DB_basicSetting_member,
        categories: DB_basicSetting_category,
        tags: DB_basicSetting_tag
    }, ...other } = connectToMongo('basicSetting')
    // console.log(other.close);

    try {
        switch (type) {
            case 'members':
                const member_res = await DB_basicSetting_member.find().sort({ threshold: 1 }).lean()
                return NextResponse.json(member_res, { status: 200 })
            case "categories":
                const categories_res = await DB_basicSetting_category.find().lean()
                return NextResponse.json(categories_res, { status: 200 })
            case 'tags':
                const tag_res = await DB_basicSetting_tag.find().lean()
                return NextResponse.json(tag_res, { status: 200 })
            default:
                return NextResponse.json('type error', { status: 404 })
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json(error, { status: 500 })
    } finally {

    }
}

export async function POST(req: NextRequest, { params: { type } }: params) {
    const requestBody = await req.json()
    const conn = connectToMongo('basicSetting')
    const { models: {
        [`${collectionList.members}`]: DB_basicSetting_member,
        [`${collectionList.categories}`]: DB_basicSetting_category,
        [`${collectionList.tags}`]: DB_basicSetting_tag,
    } } = conn
    try {
        switch (type) {
            case 'members':
                await DB_basicSetting_member.create(requestBody)
                return NextResponse.json('建立成功', { status: 201 })
            case 'categories':
                await DB_basicSetting_category.create(requestBody)
                return NextResponse.json('建立成功', { status: 201 })
            case 'tags':
                await DB_basicSetting_tag.create(requestBody)
                return NextResponse.json('建立成功', { status: 201 })
            default:
                NextResponse.json('不知道要建立什麼', { status: 400 })
        }
    } catch (error) {
        return NextResponse.json(error, { status: 400 })
    } finally {
        await conn.close()
    }
}

export async function DELETE(req: NextRequest, { params: { type } }: params) {
    const searchParams = req.nextUrl.searchParams;
    const deleteTitle = searchParams.get('title')
    const conn = connectToMongo('basicSetting')
    const { models: {
        [`${collectionList.members}`]: DB_basicSetting_member,
        [`${collectionList.categories}`]: DB_basicSetting_category,
        [`${collectionList.tags}`]: DB_basicSetting_tag,
    } } = conn
    try {
        switch (type) {
            case 'members':
                await DB_basicSetting_member.findOneAndDelete({
                    title: {
                        $eq: deleteTitle
                    }
                })
                return NextResponse.json('刪除成功', {
                    status: 200
                })
            case 'categories':
                await DB_basicSetting_category.findOneAndDelete({
                    title: {
                        $eq: deleteTitle
                    }
                })
                return NextResponse.json('刪除成功', {
                    status: 200
                })
            case 'tags':
                await DB_basicSetting_tag.findOneAndDelete({
                    title: {
                        $eq: deleteTitle
                    }
                })
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
    } finally {
        await conn.close()
    }
}

export async function PATCH(req: NextRequest, { params: { type } }: params) {
    const requestBody = await req.json()
    // console.log(requestBody);
    const conn = connectToMongo("basicSetting")
    const { models: {
        [`${collectionList.members}`]: DB_basicSetting_member,
    } } = conn
    try {
        switch (type) {
            case 'members':
                await DB_basicSetting_member.findOneAndUpdate({
                    title: {
                        $eq: requestBody.title
                    }
                }, {
                    $set: {
                        title: requestBody.title,
                        threshold: requestBody.threshold
                    }
                }, {
                    runValidators: true
                })
                return NextResponse.json('更新成功', {
                    status: 200
                })
            default:
                return NextResponse.json('不知道要更新什麼', {
                    status: 404
                })
        }


    } catch (error) {
        console.log(error);
        return NextResponse.json('更新失敗', {
            status: 400
        })
    } finally {
        await conn.close()
    }
}