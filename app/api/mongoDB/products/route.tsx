import { connectToMongo, collectionList, dbList } from "@/libs/mongoDB/connect mongo";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const conn = connectToMongo(dbList.products);
  const { models: { [`${collectionList.products}`]: DB_product } } = conn

  try {
    await DB_product.create(data);
    return NextResponse.json("ok", {
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, {
      status: 500,
    });
  } finally {
    await conn.close()
  }
}
