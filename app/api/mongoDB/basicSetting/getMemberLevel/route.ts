import { connectToMongo, modelList } from "@/libs/mongoDB/connect mongo";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const consumption = Number(req.nextUrl.searchParams.get('consumption')) ?? 0
    // console.log(consumption);

    try {
        const { models: {
            [`${modelList.members}`]: DB_basicSetting_member
        } } = connectToMongo('basic-setting')
        const prevLevel = await DB_basicSetting_member.findOne({
            threshold: {
                $lte: consumption
            }
        }).sort({ threshold: -1 }).limit(1).select(['title', 'threshold']).lean()
        const nextLevel = await DB_basicSetting_member.findOne({
            threshold: {
                $gt: consumption
            }
        }).sort({threshold: 1}).limit(1).select(['title', 'threshold']).lean()

        return NextResponse.json({
            prev: prevLevel,
            next: nextLevel
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json(error, { status: 400 })
    }
}