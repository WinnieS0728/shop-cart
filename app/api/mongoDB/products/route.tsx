import {
  connectToMongo,
  collectionList,
} from "@/libs/mongoDB/connect mongo";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const conn = connectToMongo("products");
  const {
    models: { [`${collectionList.products}`]: DB_product },
  } = conn;

  try {
    const res = await DB_product.find().populate('categories','title').populate('tags','title').lean();
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 400 });
  } finally {
    conn.close();
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const conn = connectToMongo("products");
  const {
    models: { [`${collectionList.products}`]: DB_product },
  } = conn;

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
    await conn.close();
  }
}
