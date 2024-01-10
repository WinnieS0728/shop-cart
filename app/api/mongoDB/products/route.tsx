import { connectToMongo, modelList } from "@/libs/mongoDB/connect mongo";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    const { models: { [`${modelList.products}`]: DB_product } } = connectToMongo("products");
    await DB_product.create(data);
    
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
