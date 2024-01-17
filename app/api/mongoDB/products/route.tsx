import { connectToMongo, collectionList } from "@/libs/mongoDB/connect mongo";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams;
  const productId = search.get("id");

  const conn = connectToMongo("products");
  const {
    models: { [`${collectionList.products}`]: DB_product },
  } = conn;
  const conn2 = connectToMongo("basicSetting");
  const {
    models: {
      [`${collectionList.tags}`]: DB_tag,
      [`${collectionList.categories}`]: DB_category,
    },
  } = conn2;

  try {
    if (!productId) {
      const res = await DB_product.find()
        .populate("categories", "title", DB_category)
        .populate("tags", "title", DB_tag)
        .lean();
      return NextResponse.json(res, { status: 200 });
    }
    const res = await DB_product.findById(productId)
      .populate("categories", "title", DB_category)
      .populate("tags", "title", DB_tag)
      .lean();
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 400 });
  } finally {
    await conn.close();
    await conn2.close();
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
    return NextResponse.json("建立成功 !", {
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

export async function PATCH(req: NextRequest) {
  const requestBody = await req.json();

  const conn = connectToMongo("products");
  const {
    models: { [`${collectionList.products}`]: DB_product },
  } = conn;

  try {
    if (!requestBody._id) {
      throw "id 錯誤";
    }
    await DB_product.findByIdAndUpdate(requestBody._id, requestBody);
    return NextResponse.json("更新成功 !", { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, {
      status: 400,
    });
  } finally {
    await conn.close();
  }
}
