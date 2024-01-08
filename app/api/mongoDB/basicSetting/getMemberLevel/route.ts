import { connectToMongo } from "@/libs/mongoDB/connect mongo";
import DB_basicSetting_member from "@/libs/mongoDB/models/basic setting/member";
import { disconnect } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const consumption = Number(req.nextUrl.searchParams.get('consumption')) ?? 0
    // console.log(consumption);

    try {
        await connectToMongo('basic-setting')
        const res = await DB_basicSetting_member.findOne({
            threshold: {
                $lt: consumption
            }
        })
        disconnect()
        return NextResponse.json(res, { status: 200 })
    } catch (error) {
        return NextResponse.json(error, { status: 400 })
    }
}