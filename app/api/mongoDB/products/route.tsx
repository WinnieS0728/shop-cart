import { connectToMongo } from "@/libs/mongoDB/connect mongo";
import DB_PRODUCT from "@/libs/mongoDB/models/product";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    await connectToMongo("products");
    await DB_PRODUCT.create(data);

    return NextResponse.json("ok", {
      status: 201,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json("mongo error", {
      status: 500,
    });
  }
}
