import { z } from "zod";
import DB_basicSetting_category_schema from "./basic setting/category";
import DB_basicSetting_member_schema from "./basic setting/member";
import DB_basicSetting_tag_schema from "./basic setting/tag";
import DB_product_schema from "./product";
import DB_user_schema from "./user";
import { Types } from "mongoose";

export const mongoDB_id = z.custom(
    (val) => val instanceof Types.ObjectId
);

export const DB_schemaList = {
    users: DB_user_schema,
    products: DB_product_schema,
    basicSetting: {
        members: DB_basicSetting_member_schema,
        categories: DB_basicSetting_category_schema,
        tags: DB_basicSetting_tag_schema
    } 
} as const