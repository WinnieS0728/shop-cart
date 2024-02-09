import { Schema, Types } from "mongoose";
import { z } from "zod";
import { category_schema } from "./basic setting/category";
import { tag_schema } from "./basic setting/tag";

export const product_schema = z.object({
    _id: z.union([z.string(), z.instanceof(Types.ObjectId)]),
    title: z.string().min(1, '請填入商品名字'),
    content: z.string(),
    categories: z.array(z.union([z.string(), z.instanceof(Types.ObjectId)])),
    price: z.number().min(0, '請填入商品價格').max(9999, '別賣這麼貴'),
    stock: z.number().min(0, '請填入庫存數量'),
    sold: z.number(),
    imageUrl: z.object({
        normal: z.string(),
        thumbnail: z.string()
    }),
    tags: z.array(z.union([z.string(), z.instanceof(Types.ObjectId)]))
})

const populated_schema = z.object({
    categories: z.array(category_schema),
    tags: z.array(tag_schema)
})
export const product_listSchema = product_schema.merge(populated_schema)

const DB_product_schema = new Schema<z.infer<typeof product_schema>>({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ""
    },
    categories: {
        type: [Schema.Types.ObjectId],
        default: [],
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    sold: {
        type: Number,
        default: 0
    },
    imageUrl: {
        normal: {
            type: String,
            default: ""
        },
        thumbnail: {
            type: String,
            default: ""
        }
    },
    tags: {
        type: [Schema.Types.ObjectId],
        default: [],
    }
}, {
    timestamps: true,
})

export default DB_product_schema