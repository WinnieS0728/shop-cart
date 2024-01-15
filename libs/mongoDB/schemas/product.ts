import { Schema, Types } from "mongoose";
import { z } from "zod";
import { collectionList, connectToMongo } from "../connect mongo";

export const product_schema = z.object({
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
        ref: () => {
            const { models: { [`${collectionList.categories}`]: DB_categories } } = connectToMongo('basicSetting')
            return DB_categories
        },
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
        ref: () => {
            const { models: { [`${collectionList.tags}`]: DB_tags } } = connectToMongo('basicSetting')
            return DB_tags
        },
        default: [],
    }
}, {
    timestamps: true,
})

export default DB_product_schema