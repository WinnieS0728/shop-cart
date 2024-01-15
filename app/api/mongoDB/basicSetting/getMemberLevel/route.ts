import { connectToMongo, collectionList } from "@/libs/mongoDB/connect mongo";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const consumption = Number(req.nextUrl.searchParams.get('consumption')) ?? 0
    // console.log(consumption);
    const conn = connectToMongo("basicSetting")
    const { models: {
        [`${collectionList.members}`]: DB_basicSetting_member
    } } = conn
    try {
        const prevLevel = await DB_basicSetting_member.findOne({
            threshold: {
                $lte: consumption
            }
        }).sort({ threshold: -1 }).limit(1).select(['title', 'threshold']).lean()

        const nextLevel = await DB_basicSetting_member.findOne({
            threshold: {
                $gt: consumption
            }
        }).sort({ threshold: 1 }).limit(1).select(['title', 'threshold']).lean()

        return NextResponse.json({
            prev: prevLevel,
            next: nextLevel
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json(error, { status: 400 })
    } finally {
        await conn.close()
    }
}