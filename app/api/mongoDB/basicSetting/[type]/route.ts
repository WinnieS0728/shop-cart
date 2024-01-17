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
        console.log(error);
        return NextResponse.json(error, { status: 400 })
    } finally {
        await conn.close()
    }
}

export async function DELETE(req: NextRequest, { params: { type } }: params) {
    const searchParams = req.nextUrl.searchParams;
    const deleteId = searchParams.get('id')
    const conn = connectToMongo('basicSetting')
    const { models: {
        [`${collectionList.members}`]: DB_basicSetting_member,
        [`${collectionList.categories}`]: DB_basicSetting_category,
        [`${collectionList.tags}`]: DB_basicSetting_tag,
    } } = conn
    const conn2 = connectToMongo('products')
    const { models: { [`${collectionList.products}`]: DB_product } } = conn2
    try {
        switch (type) {
            case 'members':
                await DB_basicSetting_member.findByIdAndDelete(deleteId)
                return NextResponse.json('刪除成功 !', {
                    status: 200
                })
            case 'categories':
                await DB_basicSetting_category.findByIdAndDelete(deleteId)
                await DB_product.updateMany({}, {
                    $pull: {
                        categories: {
                            $eq: deleteId
                        }
                    }
                })
                return NextResponse.json('刪除成功 !', {
                    status: 200
                })
            case 'tags':
                await DB_basicSetting_tag.findByIdAndDelete(deleteId)
                await DB_product.updateMany({}, {
                    $pull: {
                        tags: {
                            $eq: deleteId
                        }
                    }
                })
                return NextResponse.json('刪除成功 !', {
                    status: 200
                })

            default:
                return NextResponse.json('不知道要刪什麼', {
                    status: 404
                })
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json(error, {
            status: 500
        })
    } finally {
        await conn.close()
        await conn2.close()
    }
}

export async function PATCH(req: NextRequest, { params: { type } }: params) {
    const requestBody = await req.json()
    // console.log(requestBody);
    const conn = connectToMongo("basicSetting")
    const { models: {
        [`${collectionList.members}`]: DB_basicSetting_member,
        [`${collectionList.categories}`]: DB_basicSetting_category,
        [`${collectionList.tags}`]: DB_basicSetting_tag,
    } } = conn
    try {
        switch (type) {
            case 'members':
                await DB_basicSetting_member.findByIdAndUpdate(requestBody._id, {
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
            case "categories":
                await DB_basicSetting_category.findByIdAndUpdate(requestBody._id, {
                    title: requestBody.title
                }, {
                    runValidators: true
                })
                return NextResponse.json('更新成功', {
                    status: 200
                });
            case 'tags':
                await DB_basicSetting_tag.findByIdAndUpdate(requestBody._id, {
                    $set: {
                        title: requestBody.title
                    }
                })
                return NextResponse.json('更新成功', {
                    status: 200
                });
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